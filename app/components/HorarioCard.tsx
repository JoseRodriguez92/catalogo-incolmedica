"use client";

import { Tables } from "@/types/database.types";

type Horario = Tables<"horarios_atencion">;

interface HorarioCardProps {
  horarios: Horario[];
}

const DIAS_SEMANA = [
  "Domingos",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábados",
  "Festivos",
];

function formatearHora(hora: string): string {
  // Convierte "08:00:00" a "8:00 am" o "13:00:00" a "1:00 pm"
  const [horas, minutos] = hora.split(":");
  const horaNum = parseInt(horas, 10);
  const periodo = horaNum >= 12 ? "pm" : "am";
  const hora12 = horaNum > 12 ? horaNum - 12 : horaNum === 0 ? 12 : horaNum;
  return `${hora12}:${minutos} ${periodo}`;
}

function agruparHorarios(horarios: Horario[]) {
  const grupos: { dias: string; horario: string }[] = [];
  const horariosActivos = horarios.filter((h) => h.activo);

  // Agrupar días consecutivos con el mismo horario
  let grupoActual: number[] = [];
  let horarioActual = "";

  for (let dia = 1; dia <= 6; dia++) {
    const horarioDia = horariosActivos.find((h) => h.dia_semana === dia);

    if (horarioDia) {
      const horarioStr = `${formatearHora(horarioDia.hora_apertura)} – ${formatearHora(horarioDia.hora_cierre)}`;

      if (horarioStr === horarioActual) {
        grupoActual.push(dia);
      } else {
        if (grupoActual.length > 0) {
          grupos.push({
            dias: formatearGrupoDias(grupoActual),
            horario: horarioActual,
          });
        }
        grupoActual = [dia];
        horarioActual = horarioStr;
      }
    } else {
      if (grupoActual.length > 0) {
        grupos.push({
          dias: formatearGrupoDias(grupoActual),
          horario: horarioActual,
        });
        grupoActual = [];
        horarioActual = "";
      }
    }
  }

  if (grupoActual.length > 0) {
    grupos.push({
      dias: formatearGrupoDias(grupoActual),
      horario: horarioActual,
    });
  }

  // Domingos separado
  const domingo = horariosActivos.find((h) => h.dia_semana === 0);
  if (domingo) {
    grupos.push({
      dias: "Domingos",
      horario: `${formatearHora(domingo.hora_apertura)} – ${formatearHora(domingo.hora_cierre)}`,
    });
  } else {
    grupos.push({
      dias: "Domingos",
      horario: "Cerrado",
    });
  }

  // Festivos separado
  const festivo = horariosActivos.find((h) => h.dia_semana === 7);
  if (festivo) {
    grupos.push({
      dias: "Festivos",
      horario: `${formatearHora(festivo.hora_apertura)} – ${formatearHora(festivo.hora_cierre)}`,
    });
  }

  return grupos;
}

function formatearGrupoDias(dias: number[]): string {
  if (dias.length === 0) return "";
  if (dias.length === 1) return DIAS_SEMANA[dias[0]];

  const consecutivos = dias.every((d, i) => i === 0 || d === dias[i - 1] + 1);

  if (consecutivos && dias.length > 1) {
    return `${DIAS_SEMANA[dias[0]]} – ${DIAS_SEMANA[dias[dias.length - 1]]}`;
  }

  return dias.map((d) => DIAS_SEMANA[d]).join(", ");
}

export default function HorarioCard({ horarios }: HorarioCardProps) {
  const gruposHorarios = agruparHorarios(horarios);

  return (
    <div className="bg-gradient-to-br from-incolmedica-primary to-incolmedica-blue rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-90">
        Horario de Atención
      </h3>

      <div className="space-y-3">
        {gruposHorarios.map((grupo, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-base"
          >
            <span className="font-medium">{grupo.dias}</span>
            <span
              className={grupo.horario === "Cerrado" ? "opacity-60 italic" : ""}
            >
              {grupo.horario}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
