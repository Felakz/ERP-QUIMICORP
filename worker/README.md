# QUIMICORP — Worker de Biometría (huellero ZKTeco → ERP)

Ideado para correr **una instancia por sucursal** en un mini-PC de la misma LAN
que el huellero. Así el dispositivo ZKTeco **nunca se expone a internet**: solo
sale el worker, autenticado con un token de servicio, hacia el webhook del ERP.

## Flujo

```
ZKTeco (LAN 192.168.x.x:4370)                    ERP (nube/VPS)
   └── TCP ZK ──► worker/asistencia_worker.py ──HTTPS──► POST /api/v1/asistencia/marcaciones
```

El worker identifica el dispositivo por su **serial** (autodetección) → lo envía
como `dispositivoId`. En el backend, ese serial se asocia a una **Sucursal**
(tabla `sucursales.dispositivo_id`).

## Cómo correr local (desarrollo)

```bash
cd worker
cp .env.example .env          # completa ZK_IP, API_URL, SERVICE_TOKEN
pip install -r requirements.txt
python asistencia_worker.py
```

## Cómo correr con Docker

```bash
docker build -t quimicorp-worker-asistencia worker/
docker run -d --name worker-asistencia \
  --env-file worker/.env \
  -v quimicorp_worker_state:/data \
  --restart unless-stopped \
  quimicorp-worker-asistencia
```

> `--restart unless-stopped` + el volumen `/data` hacen que el worker se
> reconecte solo y **deduplique** marcas entre reinicios (el dispositivo no
> vuelve a disparar las mismas marcas).

## Enlazar huella ↔ empleado

1. El trabajador marca su huella en el dispositivo.
2. El worker la publica. Si el `codigoBiometrico` (id de usuario del dispositivo)
   **no** está vinculado a ningún empleado en el ERP, cae en la **cola de
   pendientes** (`GET /api/v1/asistencia/cola`).
3. En el panel de Administración → Asistencia, gerencia vincula ese código a un
   empleado existente (nunca se inventa un trabajador).

## Regla de almuerzo (tope 14:00)

El `Turno` tiene `almuerzoTope` (por defecto `14:00`). Si a las 14:00 el empleado
todavía no se marcó salida a almuerzo, el backend pone su estado en
`OBLIGADO_ALMORZAR` y su inscripción queda sellada (inmutable). La regla vive en
el backend central, no en el dispositivo.

## Notas sobre el campo "punch"

`PUNCH_MAP` en `asistencia_worker.py` traduce el campo `punch` del dispositivo a
tipo de marcación:
- `0` → ENTRADA, `1` → SALIDA, `255`/`2` → SALIDA_ALMUERZO.

Si tu modelo usa otros valores, ajusta ese mapa en el worker (no requiere cambiar
el backend).
