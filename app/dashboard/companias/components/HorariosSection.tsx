"use client";

import type { Database } from "@/types/database.types";
import { useInstitucionStore } from "@/lib/store/instituciones-store";
import { DIAS } from "../constants";
import { Spinner } from "../shared";

type Horario = Database["public"]["Tables"]["horarios_atencion"]["Row"];

interface Props {
  onOpenForm: (h: Horario | null) => void;
  onCloseForm: () => void;
  onSave: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatearGrupoDias(dias: number[]): string {
  if (dias.length === 0) return "";
  if (dias.length === 1) return DIAS[dias[0]];

  const tieneFinDeSemana = dias.includes(6) && dias.includes(0);
  if (tieneFinDeSemana) {
    if (dias.length === 2 && dias[0] === 6 && dias[1] === 0)
      return `${DIAS[6]} - ${DIAS[0]}`;
    const diasSinDomingo = dias.filter((d) => d !== 0);
    const consecutivos = diasSinDomingo.every(
      (d, i) => i === 0 || d === diasSinDomingo[i - 1] + 1,
    );
    if (consecutivos && diasSinDomingo[diasSinDomingo.length - 1] === 6)
      return `${DIAS[diasSinDomingo[0]]} - ${DIAS[0]}`;
  }

  const consecutivos = dias.every((d, i) => i === 0 || d === dias[i - 1] + 1);
  if (consecutivos && dias.length > 1)
    return `${DIAS[dias[0]]} - ${DIAS[dias[dias.length - 1]]}`;

  return dias.map((d) => DIAS[d]).join(", ");
}

function agruparHorarios(horarios: Horario[]) {
  const grupos: { dias: number[]; horario: Horario; label: string }[] = [];
  const activos = horarios
    .filter((h) => h.activo)
    .sort((a, b) => a.dia_semana - b.dia_semana);

  const festivo = horarios.find((h) => h.dia_semana === 7);
  const domingo = activos.find((h) => h.dia_semana === 0);
  const semana = activos.filter((h) => h.dia_semana >= 1 && h.dia_semana <= 6);

  let grupoActual: number[] = [];
  let horarioActual: Horario | null = null;

  for (let dia = 1; dia <= 6; dia++) {
    const hd = semana.find((h) => h.dia_semana === dia);
    if (
      hd &&
      horarioActual &&
      hd.hora_apertura === horarioActual.hora_apertura &&
      hd.hora_cierre === horarioActual.hora_cierre
    ) {
      grupoActual.push(dia);
    } else {
      if (grupoActual.length > 0 && horarioActual)
        grupos.push({ dias: [...grupoActual], horario: horarioActual, label: formatearGrupoDias(grupoActual) });
      grupoActual = hd ? [dia] : [];
      horarioActual = hd || null;
    }
  }

  if (
    grupoActual.length > 0 &&
    horarioActual &&
    domingo &&
    horarioActual.hora_apertura === domingo.hora_apertura &&
    horarioActual.hora_cierre === domingo.hora_cierre
  ) {
    grupoActual.push(0);
    grupos.push({ dias: [...grupoActual], horario: horarioActual, label: formatearGrupoDias(grupoActual) });
  } else {
    if (grupoActual.length > 0 && horarioActual)
      grupos.push({ dias: [...grupoActual], horario: horarioActual, label: formatearGrupoDias(grupoActual) });
    if (domingo)
      grupos.push({ dias: [0], horario: domingo, label: "Domingos" });
  }

  if (festivo)
    grupos.push({ dias: [7], horario: festivo, label: "Festivos" });

  return grupos;
}

export function HorariosSection({ onOpenForm, onCloseForm, onSave, onDelete }: Props) {
  const {
    horarios,
    horariosLoading,
    isHorarioFormOpen,
    editingHorario,
    horarioForm,
    setHorarioForm,
    savingHorario,
    horarioError,
    deletingHorarioId,
    horarioViewMode,
    setHorarioViewMode,
    closeHorarioForm,
  } = useInstitucionStore();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-incolmedica-primary/10 flex items-center justify-center text-incolmedica-primary shrink-0">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-gray-800">Horarios de Atención</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {horarios.length} horario{horarios.length !== 1 ? "s" : ""} configurado{horarios.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {horarios.length > 0 && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setHorarioViewMode("grouped")}
                className={`px-2.5 py-1.5 rounded-md transition-all ${horarioViewMode === "grouped" ? "bg-white text-incolmedica-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="Vista agrupada"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setHorarioViewMode("calendar")}
                className={`px-2.5 py-1.5 rounded-md transition-all ${horarioViewMode === "calendar" ? "bg-white text-incolmedica-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="Vista calendario"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          )}
          <button
            onClick={() => onOpenForm(null)}
            className="flex items-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white text-sm font-bold px-3 py-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>

      {/* Formulario inline */}
      {isHorarioFormOpen && (
        <div className="px-6 py-5 border-b border-blue-100/60 bg-gradient-to-br from-blue-50/60 to-indigo-50/40">
          <p className="text-sm font-bold text-incolmedica-dark mb-4">
            {editingHorario ? "Editar horario" : "Nuevo horario"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {editingHorario ? "Día" : "Desde"}
              </label>
              <select
                value={horarioForm.dia_semana_inicio}
                onChange={(e) =>
                  setHorarioForm((p) => ({
                    ...p,
                    dia_semana_inicio: parseInt(e.target.value),
                    dia_semana_fin:
                      parseInt(e.target.value) === 7 ? null : p.dia_semana_fin,
                  }))
                }
                disabled={!!editingHorario}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary disabled:bg-gray-50 disabled:text-gray-500"
              >
                {[1, 2, 3, 4, 5, 6, 0, 7].map((d) => (
                  <option key={d} value={d}>{DIAS[d]}</option>
                ))}
              </select>
            </div>

            {!editingHorario && horarioForm.dia_semana_inicio !== 7 && (
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Hasta{" "}
                  <span className="normal-case font-normal text-gray-400">(opcional)</span>
                </label>
                <select
                  value={horarioForm.dia_semana_fin ?? ""}
                  onChange={(e) =>
                    setHorarioForm((p) => ({
                      ...p,
                      dia_semana_fin: e.target.value ? parseInt(e.target.value) : null,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
                >
                  <option value="">— mismo día —</option>
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                    <option key={d} value={d}>{DIAS[d]}</option>
                  ))}
                </select>
              </div>
            )}

            <div className={editingHorario ? "sm:col-span-1" : ""}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Apertura
              </label>
              <input
                type="time"
                value={horarioForm.hora_apertura}
                onChange={(e) =>
                  setHorarioForm((p) => ({ ...p, hora_apertura: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
              />
            </div>

            <div className={editingHorario ? "sm:col-span-1" : ""}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Cierre
              </label>
              <input
                type="time"
                value={horarioForm.hora_cierre}
                onChange={(e) =>
                  setHorarioForm((p) => ({ ...p, hora_cierre: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
              />
            </div>

            <div className={editingHorario ? "sm:col-span-2" : "sm:col-span-2 lg:col-span-1"}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Tel. contacto
              </label>
              <input
                type="text"
                value={horarioForm.numero_contacto}
                placeholder="+57 …"
                onChange={(e) =>
                  setHorarioForm((p) => ({ ...p, numero_contacto: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Notas
              </label>
              <input
                type="text"
                value={horarioForm.notas}
                placeholder="ej. Solo urgencias"
                onChange={(e) =>
                  setHorarioForm((p) => ({ ...p, notas: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
              />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={horarioForm.activo}
                    onChange={(e) =>
                      setHorarioForm((p) => ({ ...p, activo: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-checked:bg-incolmedica-primary rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-xs font-semibold text-gray-600">Activo</span>
              </label>
            </div>
          </div>

          {!editingHorario &&
            horarioForm.dia_semana_fin !== null &&
            horarioForm.dia_semana_fin !== horarioForm.dia_semana_inicio && (
              <div className="mt-3 flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-xl">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Se crearán{" "}
                  {(() => {
                    const i = horarioForm.dia_semana_inicio;
                    const f = horarioForm.dia_semana_fin!;
                    return f >= i ? f - i + 1 : 7 - i + f + 1;
                  })()}{" "}
                  horarios (de <strong>{DIAS[horarioForm.dia_semana_inicio]}</strong> a{" "}
                  <strong>{DIAS[horarioForm.dia_semana_fin!]}</strong>)
                </span>
              </div>
            )}

          {horarioError && (
            <p className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
              {horarioError}
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={onSave}
              disabled={savingHorario}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {savingHorario && <Spinner className="w-3.5 h-3.5" />}
              {savingHorario ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={() => { closeHorarioForm(); onCloseForm(); }}
              className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-white/80 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de horarios */}
      <div className="divide-y divide-gray-50">
        {horariosLoading ? (
          <div className="px-6 py-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : horarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Sin horarios configurados</p>
            <p className="text-xs text-gray-400 mt-1">
              Usa "Agregar" para registrar los horarios de atención.
            </p>
          </div>
        ) : horarioViewMode === "grouped" ? (
          <GroupedView
            horarios={horarios}
            deletingHorarioId={deletingHorarioId}
            onOpenForm={onOpenForm}
            onDelete={onDelete}
          />
        ) : (
          <CalendarView
            horarios={horarios}
            deletingHorarioId={deletingHorarioId}
            onOpenForm={onOpenForm}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}

function GroupedView({
  horarios,
  deletingHorarioId,
  onOpenForm,
  onDelete,
}: {
  horarios: Horario[];
  deletingHorarioId: string | null;
  onOpenForm: (h: Horario | null) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const grupos = agruparHorarios(horarios);

  return (
    <div className="p-6 space-y-4">
      {grupos.map((grupo, idx) => (
        <div
          key={idx}
          className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-base font-black text-gray-800">{grupo.label}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${grupo.horario.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {grupo.horario.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg font-bold text-incolmedica-primary mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {grupo.horario.hora_apertura.slice(0, 5)} –{" "}
                  {grupo.horario.hora_cierre.slice(0, 5)}
                </span>
              </div>
              <div className="space-y-2">
                {grupo.horario.numero_contacto && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{grupo.horario.numero_contacto}</span>
                  </div>
                )}
                {grupo.horario.notas && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 italic">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>{grupo.horario.notas}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {grupo.dias.length === 1 && (
                <>
                  <button
                    onClick={() => onOpenForm(grupo.horario)}
                    className="w-8 h-8 rounded-lg hover:bg-incolmedica-primary/10 flex items-center justify-center text-gray-400 hover:text-incolmedica-primary transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(grupo.horario.id)}
                    disabled={deletingHorarioId === grupo.horario.id}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    {deletingHorarioId === grupo.horario.id ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {grupo.dias.length > 1 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                Este horario aplica a {grupo.dias.length} días. Edita individualmente:
              </p>
              <div className="flex flex-wrap gap-1">
                {grupo.dias.map((dia) => {
                  const hd = horarios.find((h) => h.dia_semana === dia);
                  return hd ? (
                    <button
                      key={dia}
                      onClick={() => onOpenForm(hd)}
                      className="text-xs font-semibold px-2 py-1 rounded-md bg-white border border-gray-200 hover:border-incolmedica-primary hover:text-incolmedica-primary transition-colors"
                    >
                      {DIAS[dia]}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CalendarView({
  horarios,
  deletingHorarioId,
  onOpenForm,
  onDelete,
}: {
  horarios: Horario[];
  deletingHorarioId: string | null;
  onOpenForm: (h: Horario | null) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-3">
        {[1, 2, 3, 4, 5, 6, 0, 7].map((dia) => {
          const hd = horarios.find((h) => h.dia_semana === dia);
          return (
            <div
              key={dia}
              className={`group relative rounded-xl p-4 border-2 transition-all ${
                hd
                  ? hd.activo
                    ? "border-incolmedica-primary/30 bg-gradient-to-br from-incolmedica-primary/5 to-incolmedica-blue/5 hover:shadow-md"
                    : "border-gray-200 bg-gray-50"
                  : "border-dashed border-gray-200 bg-gray-50/50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-black ${hd?.activo ? "text-gray-800" : "text-gray-400"}`}>
                    {DIAS[dia]}
                  </span>

                  {hd ? (
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${hd.activo ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                        <svg className={`w-3.5 h-3.5 shrink-0 ${hd.activo ? "text-incolmedica-primary" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-sm font-bold ${hd.activo ? "text-gray-800" : "text-gray-500"}`}>
                          {hd.hora_apertura.slice(0, 5)} – {hd.hora_cierre.slice(0, 5)}
                        </span>
                      </div>
                      {hd.numero_contacto && (
                        <span className="text-xs text-gray-500 truncate">{hd.numero_contacto}</span>
                      )}
                      {hd.notas && (
                        <span className="text-xs text-gray-500 truncate italic">{hd.notas}</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-1">Sin horario</p>
                  )}
                </div>

                {hd && (
                  <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onOpenForm(hd)}
                      className="w-7 h-7 rounded-lg hover:bg-incolmedica-primary/10 flex items-center justify-center text-gray-400 hover:text-incolmedica-primary transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(hd.id)}
                      disabled={deletingHorarioId === hd.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {deletingHorarioId === hd.id ? (
                        <Spinner className="w-3.5 h-3.5" />
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
