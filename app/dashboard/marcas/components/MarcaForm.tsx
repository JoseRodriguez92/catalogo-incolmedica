"use client";

import { useState, useEffect } from "react";
import type { Database } from "@/types/database.types";

type Marca = Database["public"]["Tables"]["marcas"]["Row"];

interface Props {
  editing: Marca | null;
  saving: boolean;
  error: string | null;
  onSave: (data: {
    nombre: string;
    descripcion: string;
    sitio_web: string;
    logo_url: string;
    activo: boolean;
  }) => void;
  onCancel: () => void;
}

export function MarcaForm({ editing, saving, error, onSave, onCancel }: Props) {
  const [nombre,      setNombre]      = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo,      setActivo]      = useState(true);

  useEffect(() => {
    if (editing) {
      setNombre(editing.nombre);
      setDescripcion(editing.descripcion ?? "");
      setActivo(editing.activo ?? true);
    } else {
      setNombre(""); setDescripcion(""); setActivo(true);
    }
  }, [editing]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ nombre, descripcion, sitio_web: "", logo_url: "", activo });
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary";

  return (
    <div className="mb-6 rounded-2xl border border-incolmedica-primary/20 bg-linear-to-br from-blue-50/60 to-indigo-50/40 overflow-hidden">
      <div className="px-5 py-3 border-b border-incolmedica-primary/10 flex items-center gap-2">
        <svg className="w-4 h-4 text-incolmedica-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span className="text-sm font-bold text-incolmedica-dark">
          {editing ? "Editar marca" : "Nueva marca"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nombre</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="ej. Siemens Healthineers" className={inputCls} />
        </div>

        {/* Descripción */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Descripción <span className="normal-case font-normal text-gray-400">(opcional)</span>
          </label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} placeholder="Breve descripción de la marca" className={`${inputCls} resize-none`} />
        </div>

        {/* Toggle activo */}
        <div className="sm:col-span-2 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActivo(!activo)}
            className="flex items-center gap-2.5"
          >
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${activo ? "bg-incolmedica-primary" : "bg-gray-200"}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${activo ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <span className={`text-sm font-semibold ${activo ? "text-incolmedica-primary" : "text-gray-400"}`}>
              {activo ? "Activa" : "Inactiva"}
            </span>
          </button>
        </div>

        {error && (
          <div className="sm:col-span-2">
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          </div>
        )}

        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50">
            {saving ? (editing ? "Guardando…" : "Creando…") : editing ? "Guardar cambios" : "Crear marca"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-white/80 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
