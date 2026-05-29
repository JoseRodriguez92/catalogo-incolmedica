"use client";

import type { Database } from "@/types/database.types";
import {
  useInstitucionStore,
  selectLogoOscuro,
} from "@/lib/store/instituciones-store";

type Institucion = Database["public"]["Tables"]["instituciones"]["Row"];

export function HeroCard({
  institucion,
  onEdit,
}: {
  institucion: Institucion;
  onEdit: () => void;
}) {
  const logoUrl = useInstitucionStore(selectLogoOscuro);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-brand-gradient shadow-xl shadow-blue-200/50 p-6">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white" />
        <div className="absolute -bottom-12 -left-8 w-64 h-64 rounded-full bg-white" />
      </div>

      <div className="relative flex flex-col gap-4">
        {/* Fila 1: logo + botón editar */}
        <div className="flex items-center justify-between gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-12 sm:h-20 object-contain shrink-0"
              style={{
                filter:
                  "drop-shadow(0 0 16px rgba(255,255,255,0.5)) drop-shadow(0 0 6px rgba(255,255,255,0.3))",
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}

          <button
            onClick={onEdit}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold px-4 py-2 rounded-xl transition-all text-sm shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="hidden sm:inline">Editar información</span>
            <span className="sm:hidden">Editar</span>
          </button>
        </div>

        {/* Fila 2: ubicación + estado */}
        <div className="flex flex-wrap items-center gap-3">
          {institucion.ubicacion && (
            <p className="text-blue-100 text-sm flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {institucion.ubicacion}
            </p>
          )}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
              institucion.activo
                ? "bg-green-400/20 text-green-100 border border-green-300/30"
                : "bg-white/10 text-white/60 border border-white/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${institucion.activo ? "bg-green-400" : "bg-white/50"}`}
            />
            {institucion.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>
    </div>
  );
}
