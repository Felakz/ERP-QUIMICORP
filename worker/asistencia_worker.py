#!/usr/bin/env python3
"""
QUIMICORP - Worker de Biometría (huellero ZKTeco -> ERP)

Lee las marcaciones del huellero (protocolo ZK TCP, puerto 4370) y las publica
en tiempo real al backend del ERP a través del webhook:

    POST {API_URL}/asistencia/marcaciones      (ServiceTokenGuard)

Diseño para 2 sucursales:
  - Cada sucursal corre SU PROPIO worker en un mini-PC local (misma LAN que el
    huellero), de modo que el dispositivo NUNCA queda expuesto a internet.
  - El worker identifica el dispositivo por su SERIAL (autodetectado la primera
    vez) y lo envía como `dispositivoId`, que el backend vincula a una Sucursal.

Configuración (variables de entorno):
  ZK_IP          IP fija del huellero (obligatoria), ej: 192.168.18.50
  ZK_PORT        puerto del dispositivo (por defecto 4370)
  ZK_PASSWORD    password de comunicación del dispositivo (por defecto 0)
  API_URL        base del ERP, ej: https://erp.quimicorp.pe/api/v1
  SERVICE_TOKEN  token de servicio (debe coincidir con ASISTENCIA_SERVICE_TOKEN)
  POLL_INTERVAL  segundos entre lecturas completas de respaldo (por defecto 300)
  DEVICE_ID      (opcional) forzar serial; si no, se autodetecta.
  SEEN_FILE      (opcional) archivo JSON para deduplicar entre reinicios.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timedelta

from zkteco import ZK


def log(msg):
    print(f"[{datetime.now().isoformat()}] {msg}", flush=True)


def getenv_int(name, default):
    try:
        return int(os.environ.get(name, default))
    except ValueError:
        return default


ZK_IP = os.environ.get("ZK_IP", "")
ZK_PORT = getenv_int("ZK_PORT", 4370)
ZK_PASSWORD = getenv_int("ZK_PASSWORD", 0)
API_URL = os.environ.get("API_URL", "").rstrip("/")
SERVICE_TOKEN = os.environ.get("SERVICE_TOKEN", "")
POLL_INTERVAL = getenv_int("POLL_INTERVAL", 300)
DEVICE_ID = os.environ.get("DEVICE_ID", "") or None
SEEN_FILE = os.environ.get("SEEN_FILE", "/data/seen.json")

# Mapeo del campo "punch" del dispositivo a tipo de marcacion del ERP.
# 0 = entrada, 1 = salida, 255 = pausa/almuerzo (comun en ZKTeco).
# Si tu modelo usa otros valores, ajusta este mapa.
PUNCH_MAP = {
    0: "ENTRADA",
    1: "SALIDA",
    255: "SALIDA_ALMUERZO",
    2: "SALIDA_ALMUERZO",
}
DEFAULT_PUNCH = "ENTRADA"


class StateStore:
    """Persiste las claves (user_id, timestamp) ya enviadas para deduplicar."""

    def __init__(self, path):
        self.path = path
        self.data = set()
        self._load()

    def _load(self):
        try:
            with open(self.path, "r") as f:
                self.data = set(json.load(f))
        except Exception:
            self.data = set()

    def _save(self):
        try:
            os.makedirs(os.path.dirname(self.path) or ".", exist_ok=True)
            with open(self.path, "w") as f:
                json.dump(sorted(self.data), f)
        except Exception as e:
            log(f"[warn] no se pudo guardar estado: {e}")

    def has(self, key):
        return key in self.data

    def add(self, key):
        self.data.add(key)

    def flush(self):
        self._save()


def normalize_dt(value):
    if isinstance(value, datetime):
        return value
    # Algunas versiones devuelven float/timestamp
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value)
    return datetime.now()


def do_post(marcacion):
    """Envía una marcacion al ERP. Devuelve True si el backend la aceptó."""
    url = f"{API_URL}/asistencia/marcaciones"
    body = json.dumps(marcacion).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Service-Token": SERVICE_TOKEN,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            code = resp.status
            resp.read()
        return 200 <= code < 300
    except urllib.error.HTTPError as e:
        log(f"[error] HTTP {e.code} al enviar marca de {marcacion.get('codigoBiometrico')}: {e.read()[:300]}")
        return False
    except Exception as e:
        log(f"[error] conexión al ERP falló: {e}")
        return False


def build_marcacion(dispositivo_id, user_id, timestamp, punch):
    tipo = PUNCH_MAP.get(punch, DEFAULT_PUNCH)
    return {
        "dispositivoId": dispositivo_id,
        "codigoBiometrico": str(user_id),
        "tipoMarcacion": tipo,
        "timestamp": timestamp.strftime("%Y-%m-%dT%H:%M:%S"),
    }


def process_marks(conn, dispositivo_id, store):
    """Lee TODAS las marcaciones pendientes del buffer del dispositivo."""
    try:
        conn.disable_device()
        marks = conn.get_attendance()
        enviadas = 0
        for m in marks:
            ts = normalize_dt(getattr(m, "timestamp", None)) or datetime.now()
            uid = str(getattr(m, "user_id", ""))
            punch = int(getattr(m, "punch", 0))
            key = f"{uid}|{ts.strftime('%Y-%m-%d %H:%M:%S')}"
            if not uid or store.has(key):
                continue
            mac = build_marcacion(dispositivo_id, uid, ts, punch)
            if do_post(mac):
                store.add(key)
                enviadas += 1
        store.flush()
        log(f"Lectura completa: {enviadas} marca(s) nueva(s) enviada(s).")
        return enviadas
    finally:
        try:
            conn.enable_device()
        except Exception:
            pass


def live_loop(conn, dispositivo_id, store):
    """Captura en tiempo real (eventos) mientras la conexión siga viva."""
    log("Iniciando captura en tiempo real (live_capture)...")
    try:
        conn.disable_device()
        gen = conn.live_capture()
        for m in gen:
            if m is None:
                continue
            ts = normalize_dt(getattr(m, "timestamp", None)) or datetime.now()
            uid = str(getattr(m, "user_id", ""))
            punch = int(getattr(m, "punch", 0))
            key = f"{uid}|{ts.strftime('%Y-%m-%d %H:%M:%S')}"
            if not uid or store.has(key):
                continue
            mac = build_marcacion(dispositivo_id, uid, ts, punch)
            ok = do_post(mac)
            if ok:
                store.add(key)
                log(f"> Marca en vivo: {mac['tipoMarcacion']} usuario={uid} {ts.isoformat()}")
            else:
                log(f"[warn] marca en vivo NO aceptada: {uid} {ts.isoformat()}")
    finally:
        try:
            conn.enable_device()
        except Exception:
            pass


def get_serial(conn):
    for attr in ("serial_number",):
        try:
            v = getattr(conn, attr, None)
            if v:
                return str(v)
        except Exception:
            pass
    try:
        return str(conn.get_serial_number())
    except Exception:
        return None


def main():
    if not ZK_IP:
        log("Falta ZK_IP. Configura el archivo .env")
        sys.exit(1)
    if not API_URL:
        log("Falta API_URL. Configura el archivo .env")
        sys.exit(1)
    if not SERVICE_TOKEN:
        log("Falta SERVICE_TOKEN. Configura el archivo .env")
        sys.exit(1)

    store = StateStore(SEEN_FILE)
    log(f"Worker de biometría arrancando -> huellero {ZK_IP}:{ZK_PORT}")
    log(f"ERP API: {API_URL}")

    while True:
        zk = ZK(ZK_IP, port=ZK_PORT, password=ZK_PASSWORD, timeout=8, ommit_ping=False)
        conn = None
        try:
            log(f"Conectando a {ZK_IP}:{ZK_PORT}...")
            conn = zk.connect()
            log("Conexión establecida.")

            serial = DEVICE_ID or get_serial(conn)
            if not serial:
                log("[warn] no se pudo autodetectar el serial; usando ZK_IP como dispositivoId")
                serial = ZK_IP
            log(f"dispositivoId = {serial}")

            # Respaldar cualquier marca acumulada en el buffer
            process_marks(conn, serial, store)

            last_poll = time.time()
            live_conn = conn
            # Bucle: captura en tiempo real + respaldo periódico
            while True:
                live_loop(live_conn, serial, store)
                # live_loop terminó (desconexión o error): relanzar la lectura y reconectar
                log("Conexión en vivo cerrada; reintentando...")
                break
        except KeyboardInterrupt:
            log("Detenido por el usuario.")
            break
        except Exception as e:
            log(f"[error] {e}")
        finally:
            try:
                if conn:
                    conn.disconnect()
            except Exception:
                pass
        log(f"Reconectando en {POLL_INTERVAL}s...")
        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
