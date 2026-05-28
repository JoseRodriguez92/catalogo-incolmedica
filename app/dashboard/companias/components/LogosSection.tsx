"use client";

import type { Database } from "@/types/database.types";
import { useInstitucionStore } from "@/lib/store/instituciones-store";
import { TIPO_META, CATEGORIA_META } from "../constants";
import { Spinner } from "../shared";

type Logo = Database["public"]["Tables"]["instituciones_logos"]["Row"];
type TipoLogo = Database["public"]["Enums"]["tipo_logo"];

interface Props {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => Promise<void>;
  onDeleteLogo: (logo: Logo) => Promise<void>;
  onEditLogo: (logo: Logo) => void;
}

export function LogosSection({
  onFileChange,
  onUpload,
  onDeleteLogo,
  onEditLogo,
}: Props) {
  const {
    logos,
    logosLoading,
    isUploadOpen,
    openUpload,
    closeUpload,
    uploadFile,
    uploadPreview,
    uploadTipo,
    setUploadTipo,
    uploadCategoria,
    setUploadCategoria,
    uploadNombre,
    setUploadNombre,
    uploading,
    uploadError,
    deletingId,
    editingLogo,
    resetUploadForm,
  } = useInstitucionStore();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-black text-gray-800">Logos & Marca</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {logos.length} logo{logos.length !== 1 ? "s" : ""} registrado
            {logos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => (isUploadOpen ? closeUpload() : openUpload())}
          className="flex items-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Subir logo
        </button>
      </div>

      {/* Panel de subida */}
      {isUploadOpen && (
        <div className="mb-6 rounded-2xl border border-incolmedica-primary/20 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-incolmedica-primary/10 flex items-center gap-2">
            <svg className="w-4 h-4 text-incolmedica-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm font-bold text-incolmedica-dark">
              {editingLogo ? "Editar logo" : "Subir nuevo logo"}
            </span>
          </div>
          <div className="p-5 flex gap-5">
            {/* Zona de archivo */}
            <div className="flex-shrink-0 w-36">
              <label className="flex flex-col items-center justify-center w-full h-36 rounded-2xl border-2 border-dashed border-incolmedica-primary/30 bg-white cursor-pointer hover:border-incolmedica-primary/60 hover:bg-blue-50/50 transition-all overflow-hidden group/drop">
                {uploadPreview ? (
                  <img src={uploadPreview} alt="preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 group-hover/drop:text-incolmedica-primary transition-colors px-2 text-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="text-xs leading-tight">PNG, JPG, SVG, WebP</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={onFileChange}
                  className="sr-only"
                />
              </label>
              {uploadFile && (
                <p className="text-xs text-gray-400 mt-1.5 text-center truncate px-1">
                  {uploadFile.name}
                </p>
              )}
              {editingLogo && !uploadFile && (
                <p className="text-xs text-blue-600 mt-1.5 text-center px-1 leading-tight">
                  Imagen actual. Sube nueva para reemplazar (opcional)
                </p>
              )}
            </div>

            {/* Controles */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Tipo de logo
                </label>
                <select
                  value={uploadTipo}
                  onChange={(e) => setUploadTipo(e.target.value as TipoLogo)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
                >
                  {(Object.keys(TIPO_META) as TipoLogo[]).map((t) => (
                    <option key={t} value={t}>
                      {TIPO_META[t].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Categoría
                </label>
                <select
                  value={uploadCategoria}
                  onChange={(e) =>
                    setUploadCategoria(
                      e.target.value as "principal" | "secundario" | "normal",
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
                >
                  <option value="principal">Principal - Branding principal</option>
                  <option value="secundario">Secundario - Usos alternativos</option>
                  <option value="normal">Normal - Archivo general</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Nombre{" "}
                  <span className="normal-case font-normal text-gray-400">
                    (opcional)
                  </span>
                </label>
                <input
                  type="text"
                  value={uploadNombre}
                  onChange={(e) => setUploadNombre(e.target.value)}
                  placeholder="ej. Logo horizontal 2024"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
                />
              </div>
              {uploadError && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                  {uploadError}
                </p>
              )}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={onUpload}
                  disabled={(!uploadFile && !editingLogo) || uploading}
                  className="flex-1 py-2 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50"
                >
                  {uploading
                    ? editingLogo
                      ? "Actualizando…"
                      : "Subiendo…"
                    : editingLogo
                      ? "Actualizar"
                      : "Subir"}
                </button>
                <button
                  onClick={() => {
                    resetUploadForm();
                    closeUpload();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-white/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de logos */}
      {logosLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-44" />
          ))}
        </div>
      ) : logos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-600">Sin logos registrados</p>
          <p className="text-xs text-gray-400 mt-1">
            Usa el botón "Subir logo" para agregar el primero.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {logos.map((logo) => {
            const meta = TIPO_META[logo.tipo];
            const catMeta = logo.categoria
              ? CATEGORIA_META[logo.categoria as "principal" | "secundario" | "normal"]
              : null;
            return (
              <div
                key={logo.id}
                className="group relative rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`flex items-center justify-center h-40 p-5 ${meta.darkBg ? "bg-gray-900" : ""}`}
                  style={
                    !meta.darkBg
                      ? {
                          backgroundImage:
                            "repeating-conic-gradient(#f3f4f6 0% 25%, #ffffff 0% 50%)",
                          backgroundSize: "16px 16px",
                        }
                      : undefined
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.url}
                    alt={logo.nombre || meta.label}
                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                  />
                </div>

                <div className="px-3 py-2.5 bg-white border-t border-gray-50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot}`} />
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                  {catMeta && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${catMeta.badge}`}>
                        {catMeta.label}
                      </span>
                    </div>
                  )}
                  {logo.nombre && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{logo.nombre}</p>
                  )}
                </div>

                <button
                  onClick={() => onEditLogo(logo)}
                  className="absolute top-2 right-11 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 hover:border-blue-200 text-gray-400 hover:text-incolmedica-primary shadow-sm scale-90 group-hover:scale-100"
                  title="Editar logo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => onDeleteLogo(logo)}
                  disabled={deletingId === logo.id}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 shadow-sm scale-90 group-hover:scale-100"
                  title="Eliminar logo"
                >
                  {deletingId === logo.id ? (
                    <Spinner className="w-3.5 h-3.5" />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
