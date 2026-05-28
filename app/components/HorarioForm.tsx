"use client";

import { useState } from "react";
import { Tables, TablesInsert } from "@/types/database.types";

type HorarioInsert = TablesInsert<"horarios_atencion">;
type Horario = Tables<"horarios_atencion">;

interface HorarioFormProps {
  institucionId: string;
  horariosExistentes?: Horario[];
  onGuardar?: (horarios: HorarioInsert[]) => Promise<void>;
}

const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábados" },
  { value: 0, label: "Domingos" },
];

interface FormHorario {
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  numero_contacto: string;
  activo: boolean;
  notas: string;
}

export default function HorarioForm({
  institucionId,
  horariosExistentes = [],
  onGuardar,
}: HorarioFormProps) {
  const [horarios, setHorarios] = useState<FormHorario[]>(() => {
    // Inicializar con horarios existentes o uno vacío
    if (horariosExistentes.length > 0) {
      return horariosExistentes.map((h) => ({
        dia_semana: h.dia_semana,
        hora_apertura: h.hora_apertura.substring(0, 5), // "HH:MM"
        hora_cierre: h.hora_cierre.substring(0, 5),
        numero_contacto: h.numero_contacto || "",
        activo: h.activo ?? true,
        notas: h.notas || "",
      }));
    }
    return [
      {
        dia_semana: 1,
        hora_apertura: "08:00",
        hora_cierre: "17:00",
        numero_contacto: "",
        activo: true,
        notas: "",
      },
    ];
  });

  const [guardando, setGuardando] = useState(false);

  const agregarHorario = () => {
    setHorarios([
      ...horarios,
      {
        dia_semana: 1,
        hora_apertura: "08:00",
        hora_cierre: "17:00",
        numero_contacto: "",
        activo: true,
        notas: "",
      },
    ]);
  };

  const actualizarHorario = (
    index: number,
    campo: keyof FormHorario,
    valor: any,
  ) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = { ...nuevosHorarios[index], [campo]: valor };
    setHorarios(nuevosHorarios);
  };

  const eliminarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onGuardar) return;

    setGuardando(true);
    try {
      const horariosParaGuardar: HorarioInsert[] = horarios.map((h) => ({
        institucion_id: institucionId,
        dia_semana: h.dia_semana,
        hora_apertura: `${h.hora_apertura}:00`,
        hora_cierre: `${h.hora_cierre}:00`,
        numero_contacto: h.numero_contacto || null,
        activo: h.activo,
        notas: h.notas || null,
      }));

      await onGuardar(horariosParaGuardar);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-incolmedica-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">
            Horarios de Atención
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          {horarios.length} horario{horarios.length !== 1 ? "s" : ""}{" "}
          configurado{horarios.length !== 1 ? "s" : ""}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {horarios.map((horario, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Nuevo horario
                </h3>
                <button
                  type="button"
                  onClick={() => eliminarHorario(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={horarios.length === 1}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
                    Día
                  </label>
                  <select
                    value={horario.dia_semana}
                    onChange={(e) =>
                      actualizarHorario(
                        index,
                        "dia_semana",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-incolmedica-primary focus:border-transparent"
                  >
                    {DIAS_SEMANA.map((dia) => (
                      <option key={dia.value} value={dia.value}>
                        {dia.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
                    Apertura
                  </label>
                  <input
                    type="time"
                    value={horario.hora_apertura}
                    onChange={(e) =>
                      actualizarHorario(index, "hora_apertura", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-incolmedica-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
                    Cierre
                  </label>
                  <input
                    type="time"
                    value={horario.hora_cierre}
                    onChange={(e) =>
                      actualizarHorario(index, "hora_cierre", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-incolmedica-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
                    Tel. Contacto
                  </label>
                  <input
                    type="tel"
                    value={horario.numero_contacto}
                    onChange={(e) =>
                      actualizarHorario(
                        index,
                        "numero_contacto",
                        e.target.value,
                      )
                    }
                    placeholder="+57..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-incolmedica-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
                  Notas
                </label>
                <input
                  type="text"
                  value={horario.notas}
                  onChange={(e) =>
                    actualizarHorario(index, "notas", e.target.value)
                  }
                  placeholder="ej. Solo urgencias"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-incolmedica-primary focus:border-transparent"
                />
              </div>

              <div className="mt-4 flex items-center justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-gray-700">Activo</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={horario.activo}
                      onChange={(e) =>
                        actualizarHorario(index, "activo", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-incolmedica-primary transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        {horarios.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">Sin horarios configurados</p>
            <p className="text-xs mt-1">
              Usa "Agregar" para registrar los horarios de atención.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={agregarHorario}
            className="inline-flex items-center gap-2 px-4 py-2 bg-incolmedica-primary text-white rounded-lg hover:bg-incolmedica-dark transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Agregar
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || horarios.length === 0}
              className="px-6 py-2 bg-incolmedica-primary text-white rounded-lg hover:bg-incolmedica-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
