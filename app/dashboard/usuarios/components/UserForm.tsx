"use client";

import { useState, useEffect } from "react";
import type { UsuarioConPerfil } from "../actions";
import type { Database } from "@/types/database.types";

type RolInstitucion = Database["public"]["Enums"]["tipo_rol_institucion"];

const ROLES: { value: RolInstitucion; label: string }[] = [
  { value: "administrador", label: "Administrador" },
];

interface Props {
  editing: UsuarioConPerfil | null;
  saving: boolean;
  error: string | null;
  onSave: (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    rol: RolInstitucion;
  }) => void;
  onCancel: () => void;
}

export function UserForm({ editing, saving, error, onSave, onCancel }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone]       = useState("");
  const [rol, setRol]           = useState<RolInstitucion>("usuario");

  useEffect(() => {
    if (editing) {
      setFullName(editing.profiles?.full_name ?? "");
      setEmail(editing.profiles?.email ?? "");
      setPhone(editing.profiles?.phone ?? "");
      setRol(editing.rol_institucion ?? "usuario");
      setPassword("");
    } else {
      setFullName(""); setEmail(""); setPassword(""); setPhone(""); setRol("usuario");
    }
  }, [editing]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ email, password, fullName, phone, rol });
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary";

  return (
    <div className="mb-6 rounded-2xl border border-incolmedica-primary/20 bg-linear-to-br from-blue-50/60 to-indigo-50/40 overflow-hidden">
      {/* Header panel */}
      <div className="px-5 py-3 border-b border-incolmedica-primary/10 flex items-center gap-2">
        <svg className="w-4 h-4 text-incolmedica-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-sm font-bold text-incolmedica-dark">
          {editing ? "Editar usuario" : "Nuevo usuario"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre completo */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Nombre completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="ej. Juan Pérez"
            className={inputCls}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!editing}
            placeholder="usuario@empresa.com"
            className={`${inputCls} ${editing ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Teléfono{" "}
            <span className="normal-case font-normal text-gray-400">(opcional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+57 300 000 0000"
            className={inputCls}
          />
        </div>

        {/* Contraseña — solo en creación */}
        {!editing && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!editing}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              className={inputCls}
            />
          </div>
        )}

        {/* Rol */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Rol
          </label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value as RolInstitucion)}
            className={inputCls}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="sm:col-span-2">
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          </div>
        )}

        {/* Botones */}
        <div className="sm:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50"
          >
            {saving ? (editing ? "Guardando…" : "Creando…") : editing ? "Guardar cambios" : "Crear usuario"}
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
