"use client";

import type { UsuarioConPerfil } from "../actions";

const ROL_META: Record<string, { label: string; badge: string }> = {
  administrador: { label: "Administrador", badge: "bg-purple-100 text-purple-700" },
  supervisor:    { label: "Supervisor",    badge: "bg-blue-100 text-blue-700" },
  vendedor:      { label: "Vendedor",      badge: "bg-green-100 text-green-700" },
  tecnico:       { label: "Técnico",       badge: "bg-yellow-100 text-yellow-700" },
  usuario:       { label: "Usuario",       badge: "bg-gray-100 text-gray-600" },
};

function Initials({ name }: { name: string | null }) {
  const letters = (name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-12 h-12 rounded-2xl bg-incolmedica-primary flex items-center justify-center text-white font-black text-base shrink-0">
      {letters}
    </div>
  );
}

interface Props {
  usuario: UsuarioConPerfil;
  onEdit: (u: UsuarioConPerfil) => void;
  onDesvincular: (u: UsuarioConPerfil) => void;
  onEmail: (u: UsuarioConPerfil) => void;
  desvinculating: boolean;
}

export function UserCard({ usuario, onEdit, onDesvincular, onEmail, desvinculating }: Props) {
  const p = usuario.profiles;
  const rolMeta = ROL_META[usuario.rol_institucion ?? "usuario"] ?? ROL_META.usuario;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Initials name={p?.full_name ?? null} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-800 truncate">
            {p?.full_name ?? "Sin nombre"}
          </p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{p?.email}</p>
          {p?.phone && (
            <p className="text-xs text-gray-400 truncate">{p.phone}</p>
          )}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${rolMeta.badge}`}>
          {rolMeta.label}
        </span>
      </div>

      {/* Fecha asignación */}
      {usuario.fecha_asignacion && (
        <p className="text-xs text-gray-300">
          Desde{" "}
          {new Date(usuario.fecha_asignacion).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <button
          onClick={() => onEmail(usuario)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-incolmedica-primary hover:bg-blue-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Correo
        </button>
        <button
          onClick={() => onEdit(usuario)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          onClick={() => onDesvincular(usuario)}
          disabled={desvinculating}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6h18a6 6 0 00-6-6H9z" />
          </svg>
          Desvincular
        </button>
      </div>
    </div>
  );
}
