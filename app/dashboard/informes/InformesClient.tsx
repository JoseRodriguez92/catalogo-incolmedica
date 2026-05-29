"use client";

import { useEffect, useState } from "react";
import { getRegistros, updateEstado, updateNotas } from "./actions";
import type { Database } from "@/types/database.types";

type Registro =
  Database["public"]["Tables"]["instituciones_registros_formulario"]["Row"];
type Estado = Database["public"]["Enums"]["tipo_estado_registro"];

const STATUS_COLORS: Record<Estado, string> = {
  pendiente: "bg-amber-100 text-amber-700 border-amber-200",
  en_proceso: "bg-blue-100 text-blue-700 border-blue-200",
  respondido: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cerrado: "bg-gray-100 text-gray-500 border-gray-200",
  spam: "bg-red-100 text-red-600 border-red-200",
};

const STATUS_BG_ACTIVE: Record<Estado, string> = {
  pendiente: "bg-amber-500",
  en_proceso: "bg-blue-600",
  respondido: "bg-emerald-500",
  cerrado: "bg-gray-400",
  spam: "bg-red-500",
};

const STATUS_LABELS: Record<Estado, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  respondido: "Respondido",
  cerrado: "Cerrado",
  spam: "Spam",
};

const STATUS_DOT: Record<Estado, string> = {
  pendiente: "bg-amber-400",
  en_proceso: "bg-blue-500",
  respondido: "bg-emerald-400",
  cerrado: "bg-gray-300",
  spam: "bg-red-400",
};

const AVATAR_PALETTE = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
];

const ESTADOS: Estado[] = [
  "pendiente",
  "en_proceso",
  "respondido",
  "cerrado",
  "spam",
];

function getInitials(name: string) {
  return (name ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function avatarColor(name: string) {
  const code = (name ?? "").charCodeAt(0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[code];
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(dateString))
    .toLowerCase();
}

function formatDateShort(dateString: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(dateString))
    .toLowerCase();
}

export default function InformesClient() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<"" | Estado>("");
  const [selected, setSelected] = useState<Registro | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [notas, setNotas] = useState("");
  const [savingNotas, setSavingNotas] = useState(false);
  const [notasSaved, setNotasSaved] = useState(false);
  const [savingEstado, setSavingEstado] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await getRegistros();
    setRegistros(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openPanel(r: Registro) {
    setSelected(r);
    setNotas(r.notas_internas ?? "");
    setNotasSaved(false);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setTimeout(() => setSelected(null), 300);
  }

  async function handleEstado(estado: Estado) {
    if (!selected || savingEstado) return;
    setSavingEstado(true);
    await updateEstado(selected.id, estado);
    const updated = { ...selected, estado };
    setSelected(updated);
    setRegistros((prev) =>
      prev.map((r) => (r.id === selected.id ? updated : r)),
    );
    setSavingEstado(false);
  }

  async function handleSaveNotas() {
    if (!selected) return;
    setSavingNotas(true);
    await updateNotas(selected.id, notas);
    const updated = { ...selected, notas_internas: notas };
    setSelected(updated);
    setRegistros((prev) =>
      prev.map((r) => (r.id === selected.id ? updated : r)),
    );
    setSavingNotas(false);
    setNotasSaved(true);
    setTimeout(() => setNotasSaved(false), 2000);
  }

  const filtered = registros.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.nombre_completo?.toLowerCase().includes(q) ||
      r.correo_electronico?.toLowerCase().includes(q) ||
      r.telefono?.toLowerCase().includes(q);
    const matchEstado = !filterEstado || r.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const pendientes = registros.filter((r) => r.estado === "pendiente").length;
  const respondidos = registros.filter((r) => r.estado === "respondido").length;

  function exportCSV() {
    const rows = [
      ["Nombre", "Correo", "Teléfono", "Mensaje", "Estado", "Fecha"],
      ...registros.map((r) => [
        r.nombre_completo,
        r.correo_electronico,
        r.telefono,
        `"${(r.mensaje ?? "").replace(/"/g, '""')}"`,
        r.estado,
        r.created_at,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "solicitudes.csv";
    a.click();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-800">Solicitudes</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Formularios desde el catálogo.</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-colors text-xs sm:text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Exportar</span> CSV
        </button>
      </div>

      {/* Stats — compact on mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5">
        {[
          { label: "Total",       value: registros.length, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", ic: "text-blue-500",  ib: "bg-blue-50" },
          { label: "Pendientes",  value: pendientes,        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                                                                                             ic: "text-amber-500", ib: "bg-amber-50" },
          { label: "Respondidos", value: respondidos,       icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",                                                                                          ic: "text-emerald-500",ib: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${s.ib} rounded-xl flex items-center justify-center shrink-0`}>
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${s.ic}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
              </svg>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-black text-gray-800 leading-none">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 sm:gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value as "" | Estado)}
          className="text-sm border border-gray-200 rounded-xl px-2.5 sm:px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 max-w-36 sm:max-w-none"
        >
          <option value="">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{STATUS_LABELS[e]}</option>
          ))}
        </select>
      </div>

      {/* List container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* ── Mobile: card list ── */}
        <div className="sm:hidden divide-y divide-gray-50">
          {loading ? (
            <div className="py-14 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              Cargando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center text-sm text-gray-400">No hay solicitudes.</div>
          ) : (
            filtered.map((s) => {
              const estado = (s.estado as Estado) ?? "pendiente";
              const isActive = selected?.id === s.id && panelOpen;
              return (
                <button
                  key={s.id}
                  onClick={() => openPanel(s)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-gray-50 ${isActive ? "bg-blue-50/50" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-black ${avatarColor(s.nombre_completo ?? "")}`}>
                    {getInitials(s.nombre_completo ?? "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-semibold text-gray-800 text-sm truncate">{s.nombre_completo}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[estado]}`}>
                        <span className={`w-1 h-1 rounded-full ${STATUS_DOT[estado]}`} />
                        {STATUS_LABELS[estado]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{s.correo_electronico}</p>
                    {s.mensaje && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.mensaje}</p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })
          )}
        </div>

        {/* ── Desktop: table ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Cliente</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Mensaje</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell">Fecha</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                      Cargando solicitudes...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-sm text-gray-400">
                    No se encontraron solicitudes.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const estado = (s.estado as Estado) ?? "pendiente";
                  const isSelected = selected?.id === s.id && panelOpen;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => openPanel(s)}
                      className={`border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${isSelected ? "bg-blue-50/60" : "hover:bg-gray-50/80"}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-black ${avatarColor(s.nombre_completo ?? "")}`}>
                            {getInitials(s.nombre_completo ?? "")}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{s.nombre_completo}</p>
                            <p className="text-xs text-gray-400">{s.correo_electronico}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <p className="text-gray-400 text-xs max-w-55 line-clamp-2 leading-relaxed">{s.mensaje}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell whitespace-nowrap">
                        <p className="text-xs text-gray-400">{s.created_at && formatDateShort(s.created_at)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[estado]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[estado]}`} />
                          {STATUS_LABELS[estado]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-xs font-semibold text-blue-600 hover:underline">Ver detalle</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">{filtered.length} de {registros.length} solicitudes</p>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${panelOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closePanel}
      />

      {/* Panel — bottom sheet on mobile, right panel on sm+ */}
      <div
        className={`
          fixed z-50 bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out
          bottom-0 left-0 right-0 max-h-[92dvh] rounded-t-3xl
          sm:bottom-auto sm:left-auto sm:top-0 sm:right-0 sm:h-full sm:max-h-none sm:w-full sm:max-w-120 sm:rounded-none
          ${panelOpen
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          }
        `}
      >
        {selected && (() => {
          const estado = (selected.estado as Estado) ?? "pendiente";
          return (
            <>
              {/* Drag handle (mobile only) */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-9 h-1 bg-gray-200 rounded-full" />
              </div>

              {/* Color accent bar (desktop only) */}
              <div className={`hidden sm:block h-1 w-full shrink-0 ${STATUS_BG_ACTIVE[estado]} transition-colors duration-300`} />

              {/* Header */}
              <div className="px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 text-white font-black text-sm shadow-sm ${avatarColor(selected.nombre_completo ?? "")}`}>
                      {getInitials(selected.nombre_completo ?? "")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 text-base truncate">{selected.nombre_completo}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${STATUS_COLORS[estado]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[estado]}`} />
                        {STATUS_LABELS[estado]}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closePanel}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Contact */}
                <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-2.5 border-b border-gray-100">
                  <a href={`mailto:${selected.correo_electronico}`} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors shrink-0">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors truncate">{selected.correo_electronico}</span>
                  </a>
                  <a href={`tel:${selected.telefono}`} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors shrink-0">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{selected.telefono}</span>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">{selected.created_at && formatDate(selected.created_at)}</span>
                  </div>
                </div>

                {/* Mensaje */}
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Mensaje</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selected.mensaje || "Sin mensaje."}
                  </p>
                </div>

                {/* Estado */}
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Cambiar estado</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {ESTADOS.map((e) => {
                      const isCurrent = selected.estado === e;
                      return (
                        <button
                          key={e}
                          disabled={savingEstado || isCurrent}
                          onClick={() => handleEstado(e)}
                          className={`relative flex flex-col items-center justify-center gap-1.5 py-2.5 sm:py-3 px-1 rounded-xl border-2 text-[10px] sm:text-xs font-bold transition-all duration-150
                            ${isCurrent
                              ? `${STATUS_COLORS[e]} border-current shadow-sm`
                              : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            } disabled:cursor-not-allowed`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isCurrent ? STATUS_DOT[e] : "bg-gray-300"}`} />
                          {STATUS_LABELS[e]}
                          {savingEstado && isCurrent && (
                            <span className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notas */}
                <div className="px-5 sm:px-6 py-4 sm:py-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Notas internas</p>
                  <textarea
                    rows={4}
                    value={notas}
                    onChange={(e) => { setNotas(e.target.value); setNotasSaved(false); }}
                    placeholder="Agrega notas de seguimiento interno..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-400">Visible solo para el equipo.</p>
                    <div className="flex items-center gap-2">
                      {notasSaved && (
                        <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Guardado
                        </span>
                      )}
                      <button
                        onClick={handleSaveNotas}
                        disabled={savingNotas || notas === (selected.notas_internas ?? "")}
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {savingNotas ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Origen: {(selected.origen ?? "formulario_web").replace(/_/g, " ")}</span>
                  <span className="font-mono text-[10px]">{selected.id.slice(0, 8)}…</span>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
