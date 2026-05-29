"use client";

import { useState, useEffect } from "react";
import type { Database } from "@/types/database.types";

type Categoria = Database["public"]["Tables"]["categorias"]["Row"];

interface Props {
  editing: Categoria | null;
  parents: Categoria[];
  saving: boolean;
  error: string | null;
  onSave: (data: {
    nombre: string;
    descripcion: string;
    icono: string | null;
    orden: number | null;
    parent_id: string | null;
    activo: boolean;
  }) => void;
  onCancel: () => void;
}

export function CategoriaForm({ editing, parents, saving, error, onSave, onCancel }: Props) {
  const [nombre,      setNombre]      = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [parentId,    setParentId]    = useState<string>("");
  const [activo,      setActivo]      = useState(true);

  useEffect(() => {
    if (editing) {
      setNombre(editing.nombre);
      setDescripcion(editing.descripcion ?? "");
      setParentId(editing.parent_id ?? "");
      setActivo(editing.activo ?? true);
    } else {
      setNombre(""); setDescripcion(""); setParentId(""); setActivo(true);
    }
  }, [editing]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      nombre,
      descripcion,
      icono: null,
      orden: null,
      parent_id: parentId || null,
      activo,
    });
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary";

  return (
    <div className="mb-6 rounded-2xl border border-incolmedica-primary/20 bg-linear-to-br from-blue-50/60 to-indigo-50/40 overflow-hidden">
      <div className="px-5 py-3 border-b border-incolmedica-primary/10 flex items-center gap-2">
        <svg className="w-4 h-4 text-incolmedica-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span className="text-sm font-bold text-incolmedica-dark">
          {editing ? "Editar categoría" : "Nueva categoría"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="ej. Equipos de diagnóstico"
            className={inputCls}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Descripción{" "}
            <span className="normal-case font-normal text-gray-400">(opcional)</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Breve descripción de la categoría"
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Categoría padre + toggle en fila */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Subcategoría de{" "}
              <span className="normal-case font-normal text-gray-400">(opcional)</span>
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className={inputCls}
            >
              <option value="">— Categoría raíz —</option>
              {parents
                .filter((p) => p.id !== editing?.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* Toggle activo */}
          <button
            type="button"
            onClick={() => setActivo(!activo)}
            className="flex items-center gap-2.5 pb-2 shrink-0"
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
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50"
          >
            {saving
              ? editing ? "Guardando…" : "Creando…"
              : editing ? "Guardar cambios" : "Crear categoría"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-white/80 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
