"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Map, { Marker, type MapRef, type MapLayerMouseEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useInstitucionStore } from "@/lib/store/instituciones-store";
import { updateInstitucion } from "../actions";
import { MAP_STYLE, INSTITUCION_ID } from "../constants";
import { INPUT_CLS, SectionLabel, Field, Spinner } from "../shared";

export function EditModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<MapRef>(null);

  const {
    formData,
    updateFormData,
    saving,
    setSaving,
    saveError,
    setSaveError,
    setInstitucion,
  } = useInstitucionStore();

  // Animación de apertura
  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
    );
    const fields = modalRef.current.querySelectorAll(".form-field");
    gsap.fromTo(
      fields,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power2.out" },
    );

    // Volar al pin del mapa al abrir
    const timer = setTimeout(() => {
      if (modalMapRef.current && formData.latitude && formData.longitude) {
        modalMapRef.current.flyTo({
          center: [formData.longitude, formData.latitude],
          zoom: 14,
          duration: 800,
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    if (!overlayRef.current || !modalRef.current) { onClose(); return; }
    gsap.to(modalRef.current, { opacity: 0, y: -30, scale: 0.9, duration: 0.3, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: onClose });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "latitude" || name === "longitude"
          ? parseFloat(value) || null
          : value;
    updateFormData(name, newValue);
  };

  const handleMapClick = (e: MapLayerMouseEvent) => {
    updateFormData("latitude", parseFloat(e.lngLat.lat.toFixed(6)));
    updateFormData("longitude", parseFloat(e.lngLat.lng.toFixed(6)));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const { error, data } = await updateInstitucion(INSTITUCION_ID, {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      correo_contacto: formData.correo_contacto,
      telefono: formData.telefono,
      ubicacion: formData.ubicacion,
      latitude: formData.latitude,
      longitude: formData.longitude,
      activo: formData.activo,
    });
    setSaving(false);
    if (error) { setSaveError(error); return; }
    if (data) setInstitucion(data);
    handleClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-incolmedica-primary/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-incolmedica-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-base font-black text-gray-800">Editar Compañía</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {/* General */}
          <div className="form-field">
            <SectionLabel>General</SectionLabel>
            <div className="flex flex-col gap-4 mt-3">
              <Field label="Nombre de la institución">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleInputChange}
                  className={INPUT_CLS}
                  placeholder="INCOLMEDICA S.A."
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className={`${INPUT_CLS} resize-none`}
                  placeholder="Breve descripción de la institución…"
                />
              </Field>
              <label className="flex items-center gap-3 cursor-pointer px-1">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo ?? true}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-checked:bg-incolmedica-primary rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Institución activa</span>
              </label>
            </div>
          </div>

          {/* Contacto */}
          <div className="form-field">
            <SectionLabel>Contacto</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <Field label="Correo de contacto">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="correo_contacto"
                    value={formData.correo_contacto || ""}
                    onChange={handleInputChange}
                    className={`${INPUT_CLS} pl-9`}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </Field>
              <Field label="Teléfono">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono || ""}
                    onChange={handleInputChange}
                    className={`${INPUT_CLS} pl-9`}
                    placeholder="+57 1 234 5678"
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Ubicación */}
          <div className="form-field">
            <SectionLabel>Ubicación</SectionLabel>
            <div className="flex flex-col gap-4 mt-3">
              <Field label="Ciudad / Dirección">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion || ""}
                    onChange={handleInputChange}
                    className={`${INPUT_CLS} pl-9`}
                    placeholder="Bogotá, Colombia"
                  />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitud">
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude ?? ""}
                    onChange={handleInputChange}
                    step="0.0001"
                    className={INPUT_CLS}
                    placeholder="4.7110"
                  />
                </Field>
                <Field label="Longitud">
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude ?? ""}
                    onChange={handleInputChange}
                    step="0.0001"
                    className={INPUT_CLS}
                    placeholder="-74.0721"
                  />
                </Field>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                  Clic en el mapa para ajustar el pin
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-200 h-56 cursor-crosshair shadow-inner">
                  {formData.latitude && formData.longitude ? (
                    <Map
                      ref={modalMapRef}
                      initialViewState={{
                        longitude: formData.longitude,
                        latitude: formData.latitude,
                        zoom: 14,
                      }}
                      style={{ width: "100%", height: "100%" }}
                      mapStyle={MAP_STYLE}
                      attributionControl={false}
                      onClick={handleMapClick}
                    >
                      <Marker
                        longitude={formData.longitude}
                        latitude={formData.latitude}
                        anchor="bottom"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 rounded-full bg-incolmedica-primary border-4 border-white shadow-lg shadow-blue-300/60 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="w-1.5 h-1.5 bg-incolmedica-primary rounded-full mt-0.5 shadow" />
                        </div>
                      </Marker>
                    </Map>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2.5 bg-gray-50 text-gray-400">
                      <svg className="w-9 h-9 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="text-xs font-medium">Ingresa coordenadas para ver el mapa</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {saveError && (
            <div className="flex items-center gap-2.5 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {saveError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-lg shadow-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Spinner className="w-4 h-4" />}
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
