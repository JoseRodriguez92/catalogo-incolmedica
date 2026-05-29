"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  toggleActivo,
  deleteCategoria,
} from "./actions";
import type { Database } from "@/types/database.types";
import { useCategoriasStore } from "@/lib/store/categorias-store";

type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
import { CategoriaForm } from "./components/CategoriaForm";

export default function CategoriasClient() {
  const { categorias, loading, loaded, setCategorias, setLoading } = useCategoriasStore();
  const [formOpen,   setFormOpen]   = useState(false);
  const [editing,    setEditing]    = useState<Categoria | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState<string | null>(null);
  const [expanded,   setExpanded]   = useState<Set<string>>(new Set());
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getCategorias();
    setCategorias(data ?? []);
    setLoading(false);
  }, [setCategorias, setLoading]);

  useEffect(() => { if (!loaded) load(); }, [loaded, load]);

  const openCreate = () => { setEditing(null); setFormError(null); setFormOpen(true); };
  const openEdit   = (c: Categoria) => { setEditing(c); setFormError(null); setFormOpen(true); };
  const closeForm  = () => { setFormOpen(false); setEditing(null); setFormError(null); };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async (data: Parameters<typeof createCategoria>[0]) => {
    setSaving(true);
    setFormError(null);
    if (editing) {
      const { error } = await updateCategoria(editing.id, data);
      if (error) { setFormError(error); setSaving(false); return; }
    } else {
      const { error } = await createCategoria(data);
      if (error) { setFormError(error); setSaving(false); return; }
    }
    setSaving(false);
    closeForm();
    load();
  };

  const handleToggle = async (c: Categoria) => {
    setTogglingId(c.id);
    await toggleActivo(c.id, !c.activo);
    setTogglingId(null);
    load();
  };

  const handleDelete = async (c: Categoria) => {
    const tieneHijos = categorias.some((x) => x.parent_id === c.id);
    if (tieneHijos) {
      alert("Esta categoría tiene subcategorías. Elimínalas primero.");
      return;
    }
    if (!confirm(`¿Eliminar "${c.nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(c.id);
    await deleteCategoria(c.id);
    setDeletingId(null);
    load();
  };

  // Árbol
  const roots    = categorias.filter((c) => !c.parent_id);
  const children = (parentId: string) => categorias.filter((c) => c.parent_id === parentId);
  const parents  = categorias.filter((c) => !c.parent_id);

  const totalActivas = categorias.filter((c) => c.activo).length;

  const RowActions = ({ c }: { c: Categoria }) => (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => handleToggle(c)}
        disabled={togglingId === c.id}
        title={c.activo ? "Desactivar" : "Activar"}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${c.activo ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${c.activo ? "bg-green-400" : "bg-gray-300"}`} />
      </button>
      <button
        onClick={() => openEdit(c)}
        title="Editar"
        className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-incolmedica-primary hover:bg-blue-50 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={() => handleDelete(c)}
        disabled={deletingId === c.id}
        title="Eliminar"
        className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Categorías</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {categorias.length} total · {totalActivas} activa{totalActivas !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nueva categoría</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {/* Formulario inline */}
      {formOpen && (
        <CategoriaForm
          editing={editing}
          parents={parents}
          saving={saving}
          error={formError}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : categorias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Sin categorías</p>
            <p className="text-xs text-gray-400 mt-1">Usa "Nueva categoría" para agregar la primera.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {roots.map((root) => {
              const subs    = children(root.id);
              const isOpen  = expanded.has(root.id);

              return (
                <div key={root.id}>
                  {/* Fila raíz */}
                  <div className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors ${!root.activo ? "opacity-50" : ""}`}>
                    {/* Chevron */}
                    <button
                      onClick={() => subs.length > 0 && toggleExpand(root.id)}
                      className={`w-5 h-5 flex items-center justify-center text-gray-300 transition-transform ${subs.length > 0 ? "hover:text-gray-500 cursor-pointer" : "cursor-default"} ${isOpen ? "rotate-90" : ""}`}
                    >
                      {subs.length > 0 && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>

                    {/* Ícono */}
                    <span className="text-lg w-6 text-center shrink-0">{root.icono || "📁"}</span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-800">{root.nombre}</span>
                        {subs.length > 0 && (
                          <span className="text-xs bg-incolmedica-primary/10 text-incolmedica-primary font-semibold px-2 py-0.5 rounded-full">
                            {subs.length} sub{subs.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {root.orden != null && (
                          <span className="text-xs text-gray-300">#{root.orden}</span>
                        )}
                      </div>
                      {root.descripcion && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{root.descripcion}</p>
                      )}
                    </div>

                    <RowActions c={root} />
                  </div>

                  {/* Subcategorías */}
                  {isOpen && subs.map((sub) => (
                    <div
                      key={sub.id}
                      className={`flex items-center gap-3 pl-12 pr-5 py-3 bg-gray-50/60 border-t border-gray-100 hover:bg-gray-50 transition-colors ${!sub.activo ? "opacity-50" : ""}`}
                    >
                      <span className="text-base w-5 text-center shrink-0">{sub.icono || "📄"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700">{sub.nombre}</span>
                          {sub.orden != null && (
                            <span className="text-xs text-gray-300">#{sub.orden}</span>
                          )}
                        </div>
                        {sub.descripcion && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">{sub.descripcion}</p>
                        )}
                      </div>
                      <RowActions c={sub} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
