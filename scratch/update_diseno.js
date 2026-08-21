const fs = require('fs');
const path = 'C:\\Users\\Lenovo\\Downloads\\Mini-CRM y reportes en React (1)\\src\\pages\\DashboardDiseno.tsx';

const content = `import { useState } from "react";
import { useApp } from "../context/AppContext";
import { EntregableDiseno, Brand, TipoPiezaDiseno, RedSocialDiseno } from "../data/mockData";

export default function DashboardDiseno() {
  const { entregablesDiseno, addEntregableDiseno, updateEntregableDiseno, currentUser } = useApp();

  const [filtroBrand, setFiltroBrand] = useState<"Todas" | Brand>("Todas");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalDetalle, setModalDetalle] = useState<EntregableDiseno | null>(null);

  // Formulario nuevo entregable
  const [nombre, setNombre] = useState("");
  const [brand, setBrand] = useState<Brand>("CocoNut");
  const [tipoPieza, setTipoPieza] = useState<TipoPiezaDiseno>("Flyer / Banner");
  const [cantidad, setCantidad] = useState(1);
  const [redSocial, setRedSocial] = useState<RedSocialDiseno>("Instagram");
  const [fechaLimite, setFechaLimite] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Formulario avance/muestra
  const [urlMuestra, setUrlMuestra] = useState("");
  const [notaAvance, setNotaAvance] = useState("");

  const listaEntregables = entregablesDiseno || [];

  const entregablesFiltrados = listaEntregables.filter((item) => {
    if (filtroBrand !== "Todas" && item.brand !== filtroBrand) return false;
    if (filtroEstado !== "Todos" && item.estado !== filtroEstado) return false;
    return true;
  });

  const handleCrearEntregable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevo: EntregableDiseno = {
      id: \`D_\${Date.now()}\`,
      nombre,
      brand,
      tipoPieza,
      cantidad: Number(cantidad) || 1,
      redSocial,
      fechaLimite: fechaLimite || new Date().toISOString().split("T")[0],
      estado: "Pendiente",
      observaciones,
      avances: [],
    };

    addEntregableDiseno(nuevo);
    setNombre("");
    setObservaciones("");
    setModalNuevo(false);
  };

  const handleAgregarAvance = (item: EntregableDiseno) => {
    if (!urlMuestra.trim() && !notaAvance.trim()) return;

    const nuevoAvance = {
      id: \`AV_\${Date.now()}\`,
      version: \`v\${(item.avances?.length || 0) + 1}.0\`,
      urlPreview: urlMuestra,
      nota: notaAvance,
      fecha: new Date().toLocaleString("es-PE"),
      autor: currentUser?.name || "Diseñadora",
    };

    const actualizadosAvances = [...(item.avances || []), nuevoAvance];

    updateEntregableDiseno(item.id, {
      urlMuestra: urlMuestra || item.urlMuestra,
      estado: "En Revisión",
      avances: actualizadosAvances,
    });

    setUrlMuestra("");
    setNotaAvance("");
    setModalDetalle(null);
  };

  const handleCambiarEstado = (id: string, nuevoEstado: EntregableDiseno["estado"]) => {
    updateEntregableDiseno(id, { estado: nuevoEstado });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>🎨</span> Área de Diseño Gráfico & Piezas Visuales
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de solicitudes, banners, piezas de redes y muestras para CocoNut & Alquimia
          </p>
        </div>
        <button
          onClick={() => setModalNuevo(true)}
          className="px-4 py-2.5 rounded-xl bg-[#137b6b] text-white font-bold text-xs hover:bg-[#0f6356] transition-all shadow-xs"
        >
          + Nueva Solicitud de Diseño
        </button>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Solicitudes</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{listaEntregables.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-amber-500">En Proceso / Revisión</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {listaEntregables.filter((i) => i.estado === "En Proceso" || i.estado === "En Revisión").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-emerald-500">Entregados / Aprobados</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {listaEntregables.filter((i) => i.estado === "Entregado" || i.estado === "Aprobado").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Pendientes</p>
          <p className="text-2xl font-extrabold text-slate-600 mt-1">
            {listaEntregables.filter((i) => i.estado === "Pendiente").length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
        <span className="text-xs font-bold text-slate-500">Filtros:</span>
        <select
          value={filtroBrand}
          onChange={(e) => setFiltroBrand(e.target.value as any)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
        >
          <option value="Todas">Todas las marcas</option>
          <option value="CocoNut">CocoNut</option>
          <option value="Alquimia">Alquimia</option>
        </select>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="En Revisión">En Revisión</option>
          <option value="Entregado">Entregado</option>
          <option value="Aprobado">Aprobado</option>
        </select>
      </div>

      {/* Tabla de Entregables */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        {entregablesFiltrados.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-3xl">🎨</span>
            <h3 className="text-sm font-bold text-slate-700 mt-2">No hay trabajos de diseño registrados</h3>
            <p className="text-xs text-slate-400 mt-1">Haz clic en "+ Nueva Solicitud de Diseño" para agregar uno.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Pieza / Solicitud</th>
                  <th className="p-3.5">Marca</th>
                  <th className="p-3.5">Tipo & Red</th>
                  <th className="p-3.5">Fecha Límite</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {entregablesFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{item.nombre}</p>
                      {item.observaciones && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{item.observaciones}</p>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold border \${
                        item.brand === "CocoNut" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-violet-50 text-violet-700 border-violet-100"
                      }\`}>
                        {item.brand || "CocoNut"}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800">{item.tipoPieza || "Diseño"}</p>
                      <p className="text-[10px] text-slate-400">{item.redSocial} (x{item.cantidad || 1})</p>
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono">{item.fechaLimite}</td>
                    <td className="p-3.5">
                      <select
                        value={item.estado}
                        onChange={(e) => handleCambiarEstado(item.id, e.target.value as any)}
                        className={\`text-[11px] font-bold px-2 py-1 rounded-lg border bg-white \${
                          item.estado === "Aprobado" ? "text-emerald-700 border-emerald-200" :
                          item.estado === "Entregado" ? "text-blue-700 border-blue-200" :
                          item.estado === "En Revisión" ? "text-purple-700 border-purple-200" :
                          item.estado === "En Proceso" ? "text-amber-700 border-amber-200" : "text-slate-600 border-slate-200"
                        }\`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="En Revisión">En Revisión</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Aprobado">Aprobado</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setModalDetalle(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold"
                      >
                        Muestras / Avances ({item.avances?.length || 0})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nueva Solicitud */}
      {modalNuevo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Nueva Solicitud de Diseño</h3>
            <form onSubmit={handleCrearEntregable} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Título de la Pieza</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Banner regalo día de la madre"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Marca</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="CocoNut">CocoNut</option>
                    <option value="Alquimia">Alquimia</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tipo de Pieza</label>
                  <select
                    value={tipoPieza}
                    onChange={(e) => setTipoPieza(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Logo / Branding">Logo / Branding</option>
                    <option value="Flyer / Banner">Flyer / Banner</option>
                    <option value="Reel / Video">Reel / Video</option>
                    <option value="Post / Imagen HD">Post / Imagen HD</option>
                    <option value="Catálogo / Packaging">Catálogo / Packaging</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Red / Destino</label>
                  <select
                    value={redSocial}
                    onChange={(e) => setRedSocial(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Web / E-commerce">Web / E-commerce</option>
                    <option value="Todas / Multi-red">Todas / Multi-red</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Observaciones / Especificaciones</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles de tamaño, colores, texto a incluir..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNuevo(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#137b6b] hover:bg-[#0f6356] rounded-xl shadow-xs"
                >
                  Guardar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Muestras & Avances */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{modalDetalle.nombre}</h3>
                <p className="text-xs text-slate-400">{modalDetalle.brand} - {modalDetalle.tipoPieza}</p>
              </div>
              <button
                onClick={() => setModalDetalle(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Subir nuevo avance */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700">Subir Muestra / Avance de Diseño</p>
              <input
                type="url"
                placeholder="URL de la muestra (Canva, Drive, Figma, Imagen...)"
                value={urlMuestra}
                onChange={(e) => setUrlMuestra(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                placeholder="Nota / Comentario de la versión..."
                value={notaAvance}
                onChange={(e) => setNotaAvance(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              />
              <button
                onClick={() => handleAgregarAvance(modalDetalle)}
                className="w-full py-2 bg-[#137b6b] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Registrar Avance & Enviar a Revisión
              </button>
            </div>

            {/* Historial de Avances */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <p className="text-xs font-bold text-slate-700">Historial de Muestras</p>
              {(!modalDetalle.avances || modalDetalle.avances.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No hay muestras subidas aún.</p>
              ) : (
                modalDetalle.avances.map((av) => (
                  <div key={av.id} className="p-2.5 rounded-xl border border-slate-100 bg-white space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#137b6b]">{av.version}</span>
                      <span className="text-[10px] text-slate-400">{av.fecha}</span>
                    </div>
                    {av.nota && <p className="text-xs text-slate-600">{av.nota}</p>}
                    {av.urlPreview && (
                      <a
                        href={av.urlPreview}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 font-bold underline inline-block"
                      >
                        Ver Muestra ↗
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path, content, 'utf8');
console.log('UPDATE_COMPLETE_SUCCESSFULLY');
