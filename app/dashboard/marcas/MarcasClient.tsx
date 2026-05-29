"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMarcas,
  createMarca,
  updateMarca,
  toggleMarcaActivo,
  deleteMarca,
} from "./actions";
import { MarcaForm } from "./components/MarcaForm";
import type { Database } from "@/types/database.types";
import { useMarcasStore } from "@/lib/store/marcas-store";

type Marca = Database["public"]["Tables"]["marcas"]["Row"];

export default function MarcasClient() {
  const { marcas, loading, loaded, setMarcas, setLoading } = useMarcasStore();
  const [formOpen,   setFormOpen]   = useState(false);
  const [editing,    setEditing]    = useState<Marca | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getMarcas();
    setMarcas(data ?? []);
    setLoading(false);
  }, [setMarcas, setLoading]);

  useEffect(() => { if (!loaded) load(); }, [loaded, load]);

  const openCreate = () => { setEditing(null); setFormError(null); setFormOpen(true); };
  const openEdit   = (m: Marca) => { setEditing(m); setFormError(null); setFormOpen(true); };
  const closeForm  = () => { setFormOpen(false); setEditing(null); setFormError(null); };

  const handleSave = async (data: {
    nombre: string; descripcion: string; sitio_web: string; logo_url: string; activo: boolean;
  }) => {
    setSaving(true);
    setFormError(null);
    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      sitio_web: data.sitio_web || null,
      logo_url: data.logo_url || null,
      activo: data.activo,
    };
    const { error } = editing
      ? await updateMarca(editing.id, payload)
      : await createMarca(payload);
    if (error) { setFormError(error); setSaving(false); return; }
    setSaving(false);
    closeForm();
    load();
  };

  const handleToggle = async (m: Marca) => {
    setTogglingId(m.id);
    await toggleMarcaActivo(m.id, !m.activo);
    setTogglingId(null);
    load();
  };

  const handleDelete = async (m: Marca) => {
    if (!confirm(`¿Eliminar "${m.nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(m.id);
    await deleteMarca(m.id);
    setDeletingId(null);
    load();
  };

  const totalActivas = marcas.filter((m) => m.activo).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Marcas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {marcas.length} total · {totalActivas} activa{totalActivas !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nueva marca</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {/* Formulario inline */}
      {formOpen && (
        <MarcaForm
          editing={editing}
          saving={saving}
          error={formError}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : marcas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-600">Sin marcas registradas</p>
          <p className="text-xs text-gray-400 mt-1">Usa "Nueva marca" para agregar la primera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marcas.map((m) => (
            <div
              key={m.id}
              className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3 ${!m.activo ? "opacity-60" : ""}`}
            >
              {/* Logo + nombre */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {m.logo_url ? (
                    <img src={m.logo_url} alt={m.nombre} className="max-h-full max-w-full object-contain p-1" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-800 truncate">{m.nombre}</p>
                  {m.sitio_web && (
                    <a
                      href={m.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-incolmedica-primary hover:underline truncate block"
                    >
                      {m.sitio_web.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                <span className={`w-2 h-2 rounded-full shrink-0 ${m.activo ? "bg-green-400" : "bg-gray-300"}`} />
              </div>

              {/* Descripción */}
              {m.descripcion && (
                <p className="text-xs text-gray-400 line-clamp-2">{m.descripcion}</p>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-1 border-t border-gray-50">
                <button
                  onClick={() => handleToggle(m)}
                  disabled={togglingId === m.id}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {m.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => openEdit(m)}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-incolmedica-primary hover:bg-blue-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  disabled={deletingId === m.id}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
