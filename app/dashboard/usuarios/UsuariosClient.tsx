"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  desvincularUsuario,
  type UsuarioConPerfil,
} from "./actions";
import { UserCard } from "./components/UserCard";
import { UserForm } from "./components/UserForm";
import { EmailModal } from "./components/EmailModal";
import type { Database } from "@/types/database.types";

type RolInstitucion = Database["public"]["Enums"]["tipo_rol_institucion"];

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

export default function UsuariosClient() {
  const [usuarios, setUsuarios]         = useState<UsuarioConPerfil[]>([]);
  const [loading, setLoading]           = useState(true);
  const [formOpen, setFormOpen]         = useState(false);
  const [editing, setEditing]           = useState<UsuarioConPerfil | null>(null);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);
  const [desvincId, setDesvincId]       = useState<string | null>(null);
  const [emailTarget, setEmailTarget]   = useState<UsuarioConPerfil | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getUsuarios(INSTITUCION_ID);
    setUsuarios(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setFormError(null); setFormOpen(true); };
  const openEdit   = (u: UsuarioConPerfil) => { setEditing(u); setFormError(null); setFormOpen(true); };
  const closeForm  = () => { setFormOpen(false); setEditing(null); setFormError(null); };

  const handleSave = async (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    rol: RolInstitucion;
  }) => {
    setSaving(true);
    setFormError(null);

    if (editing) {
      const { error } = await updateUsuario(
        editing.user_id!,
        INSTITUCION_ID,
        data.fullName,
        data.phone || null,
        data.rol,
      );
      if (error) { setFormError(error); setSaving(false); return; }
    } else {
      const { error } = await createUsuario(
        INSTITUCION_ID,
        data.email,
        data.password,
        data.fullName,
        data.phone || null,
        data.rol,
      );
      if (error) { setFormError(error); setSaving(false); return; }
    }

    setSaving(false);
    closeForm();
    load();
  };

  const handleDesvincular = async (u: UsuarioConPerfil) => {
    if (!confirm(`¿Desvincular a ${u.profiles?.full_name ?? u.profiles?.email} de esta institución?`)) return;
    setDesvincId(u.user_id!);
    await desvincularUsuario(u.user_id!, INSTITUCION_ID);
    setDesvincId(null);
    load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Usuarios</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} activo{usuarios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nuevo usuario</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Formulario inline */}
      {formOpen && (
        <UserForm
          editing={editing}
          saving={saving}
          error={formError}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : usuarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m6 0v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10-10a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-600">Sin usuarios vinculados</p>
          <p className="text-xs text-gray-400 mt-1">Usa "Nuevo usuario" para agregar el primero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((u) => (
            <UserCard
              key={u.id}
              usuario={u}
              onEdit={openEdit}
              onDesvincular={handleDesvincular}
              onEmail={setEmailTarget}
              desvinculating={desvincId === u.user_id}
            />
          ))}
        </div>
      )}

      {/* Modal de correo */}
      {emailTarget && (
        <EmailModal
          to={emailTarget.profiles?.email ?? ""}
          name={emailTarget.profiles?.full_name ?? null}
          onClose={() => setEmailTarget(null)}
        />
      )}
    </div>
  );
}
