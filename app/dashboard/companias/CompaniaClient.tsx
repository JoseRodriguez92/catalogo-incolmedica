"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import Map, { Marker, type MapRef, type MapLayerMouseEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { updateInstitucion, getLogos, uploadLogo, deleteLogo, getHorarios, createHorario, updateHorario, deleteHorario } from "./actions";
import type { Database } from "@/types/database.types";

type Institucion = Database["public"]["Tables"]["instituciones"]["Row"];
type Logo = Database["public"]["Tables"]["instituciones_logos"]["Row"];
type TipoLogo = Database["public"]["Enums"]["tipo_logo"];
type Horario = Database["public"]["Tables"]["horarios_atencion"]["Row"];
type HorarioForm = { dia_semana: number; hora_apertura: string; hora_cierre: string; numero_contacto: string; notas: string; activo: boolean };

const INSTITUCION_ID = "d90e53d2-9383-45f2-a46a-992e407a1772";
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const DIAS: Record<number, string> = { 0: "Domingo", 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado" };
const DIAS_SHORT: Record<number, string> = { 0: "Dom", 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb" };
const DIA_COLOR: Record<number, string> = {
  0: "bg-rose-100 text-rose-700",
  1: "bg-blue-100 text-blue-700",
  2: "bg-indigo-100 text-indigo-700",
  3: "bg-violet-100 text-violet-700",
  4: "bg-purple-100 text-purple-700",
  5: "bg-pink-100 text-pink-700",
  6: "bg-orange-100 text-orange-700",
};

const HORARIO_FORM_EMPTY: HorarioForm = { dia_semana: 1, hora_apertura: "08:00", hora_cierre: "17:00", numero_contacto: "", notas: "", activo: true };

const TIPO_META: Record<TipoLogo, { label: string; dot: string; badge: string; darkBg: boolean }> = {
  logotipo:      { label: "Logotipo",       dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700",      darkBg: false },
  isotipo:       { label: "Isotipo",         dot: "bg-violet-500",  badge: "bg-violet-50 text-violet-700",  darkBg: false },
  version_oscura:{ label: "Versión Oscura",  dot: "bg-gray-700",    badge: "bg-gray-800 text-gray-100",     darkBg: true  },
  version_clara: { label: "Versión Clara",   dot: "bg-sky-300",     badge: "bg-sky-50 text-sky-700",        darkBg: false },
  favicon:       { label: "Favicon",         dot: "bg-orange-500",  badge: "bg-orange-50 text-orange-700",  darkBg: false },
  banner:        { label: "Banner",          dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700",darkBg: false },
  otro:          { label: "Otro",            dot: "bg-gray-400",    badge: "bg-gray-100 text-gray-600",     darkBg: false },
};

export default function CompaniaClient({ institucion: initial }: { institucion: Institucion }) {
  const [institucion, setInstitucion] = useState<Institucion>(initial);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Institucion>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [logos, setLogos] = useState<Logo[]>([]);
  const [logosLoading, setLogosLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTipo, setUploadTipo] = useState<TipoLogo>("logotipo");
  const [uploadNombre, setUploadNombre] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Horarios
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [horariosLoading, setHorariosLoading] = useState(true);
  const [isHorarioFormOpen, setIsHorarioFormOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null);
  const [horarioForm, setHorarioForm] = useState<HorarioForm>(HORARIO_FORM_EMPTY);
  const [savingHorario, setSavingHorario] = useState(false);
  const [horarioError, setHorarioError] = useState<string | null>(null);
  const [deletingHorarioId, setDeletingHorarioId] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<MapRef>(null);

  const hasCoords = institucion.latitude != null && institucion.longitude != null;

  const loadLogos = useCallback(async () => {
    setLogosLoading(true);
    const { data } = await getLogos(INSTITUCION_ID);
    if (data) setLogos(data);
    setLogosLoading(false);
  }, []);

  useEffect(() => {
    loadLogos();
  }, [loadLogos]);

  useEffect(() => {
    if (isModalOpen && overlayRef.current && modalRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
      );
      const fields = modalRef.current.querySelectorAll(".form-field");
      gsap.fromTo(fields, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power2.out" });
    }
  }, [isModalOpen]);

  const handleEdit = () => {
    setFormData(institucion);
    setSaveError(null);
    setIsModalOpen(true);
    setTimeout(() => {
      if (modalMapRef.current && institucion.latitude && institucion.longitude) {
        modalMapRef.current.flyTo({
          center: [institucion.longitude, institucion.latitude],
          zoom: 14,
          duration: 800,
        });
      }
    }, 300);
  };

  const handleModalMapClick = (e: MapLayerMouseEvent) => {
    setFormData((prev) => ({
      ...prev,
      latitude: parseFloat(e.lngLat.lat.toFixed(6)),
      longitude: parseFloat(e.lngLat.lng.toFixed(6)),
    }));
  };

  const handleCloseModal = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, { opacity: 0, y: -30, scale: 0.9, duration: 0.3, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => setIsModalOpen(false) });
    } else {
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "latitude" || name === "longitude"
            ? parseFloat(value) || null
            : value,
    }));
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
    handleCloseModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setUploadFile(file);
    setUploadError(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    } else {
      setUploadPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(uploadFile);
    });

    const { data: logo, error } = await uploadLogo(
      INSTITUCION_ID,
      base64,
      uploadFile.name,
      uploadFile.type,
      uploadTipo,
      uploadNombre || null,
    );

    setUploading(false);
    if (error) { setUploadError(error); return; }
    if (logo) setLogos((prev) => [...prev, logo]);

    setUploadFile(null);
    setUploadPreview(null);
    setUploadNombre("");
    setUploadTipo("logotipo");
    setIsUploadOpen(false);
  };

  const handleDeleteLogo = async (logo: Logo) => {
    setDeletingId(logo.id);
    const { error } = await deleteLogo(logo.id, logo.url);
    if (!error) setLogos((prev) => prev.filter((l) => l.id !== logo.id));
    setDeletingId(null);
  };

  // ── Horarios handlers ──────────────────────────────────────────────────────
  const loadHorarios = useCallback(async () => {
    setHorariosLoading(true);
    const { data } = await getHorarios(INSTITUCION_ID);
    if (data) setHorarios(data);
    setHorariosLoading(false);
  }, []);

  useEffect(() => { loadHorarios(); }, [loadHorarios]);

  const openHorarioForm = (h: Horario | null) => {
    setEditingHorario(h);
    setHorarioForm(h ? { dia_semana: h.dia_semana, hora_apertura: h.hora_apertura, hora_cierre: h.hora_cierre, numero_contacto: h.numero_contacto ?? "", notas: h.notas ?? "", activo: h.activo ?? true } : HORARIO_FORM_EMPTY);
    setHorarioError(null);
    setIsHorarioFormOpen(true);
  };

  const closeHorarioForm = () => { setIsHorarioFormOpen(false); setEditingHorario(null); };

  const handleSaveHorario = async () => {
    setSavingHorario(true);
    setHorarioError(null);
    const payload = { dia_semana: horarioForm.dia_semana, hora_apertura: horarioForm.hora_apertura, hora_cierre: horarioForm.hora_cierre, numero_contacto: horarioForm.numero_contacto || null, notas: horarioForm.notas || null, activo: horarioForm.activo };

    if (editingHorario) {
      const { data, error } = await updateHorario(editingHorario.id, payload);
      if (error) { setHorarioError(error); setSavingHorario(false); return; }
      if (data) setHorarios((prev) => prev.map((h) => h.id === data.id ? data : h).sort((a, b) => a.dia_semana - b.dia_semana || a.hora_apertura.localeCompare(b.hora_apertura)));
    } else {
      const { data, error } = await createHorario({ ...payload, institucion_id: INSTITUCION_ID });
      if (error) { setHorarioError(error); setSavingHorario(false); return; }
      if (data) setHorarios((prev) => [...prev, data].sort((a, b) => a.dia_semana - b.dia_semana || a.hora_apertura.localeCompare(b.hora_apertura)));
    }
    setSavingHorario(false);
    closeHorarioForm();
  };

  const handleDeleteHorario = async (id: string) => {
    setDeletingHorarioId(id);
    const { error } = await deleteHorario(id);
    if (!error) setHorarios((prev) => prev.filter((h) => h.id !== id));
    setDeletingHorarioId(null);
  };

  return (
    <div className="space-y-5">

      {/* ── Hero card ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-incolmedica-dark via-incolmedica-primary to-incolmedica-blue shadow-xl shadow-blue-200/50 p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white" />
          <div className="absolute -bottom-12 -left-8 w-64 h-64 rounded-full bg-white" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">{institucion.nombre}</h1>
              {institucion.ubicacion && (
                <p className="text-blue-100 text-sm mt-0.5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {institucion.ubicacion}
                </p>
              )}
              <span className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1 rounded-full ${institucion.activo ? "bg-green-400/20 text-green-100 border border-green-300/30" : "bg-white/10 text-white/60 border border-white/20"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${institucion.activo ? "bg-green-400" : "bg-white/50"}`} />
                {institucion.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar información
          </button>
        </div>
      </div>

      {/* ── Info + Mapa ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Info cards */}
        <div className="flex flex-col gap-4">
          <InfoRow
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            label="Correo de contacto"
            value={institucion.correo_contacto || "—"}
          />
          <InfoRow
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            label="Teléfono"
            value={institucion.telefono || "—"}
          />
          <InfoRow
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Ubicación"
            value={institucion.ubicacion || "—"}
          />
          <InfoRow
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>}
            label="Coordenadas"
            value={hasCoords ? `${institucion.latitude}, ${institucion.longitude}` : "—"}
          />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Descripción</p>
            <p className="text-sm text-gray-700 leading-relaxed">{institucion.descripcion || "Sin descripción."}</p>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[320px] lg:min-h-0">
          {hasCoords ? (
            <Map
              initialViewState={{
                longitude: institucion.longitude!,
                latitude: institucion.latitude!,
                zoom: 14,
              }}
              style={{ width: "100%", height: "100%", minHeight: 320 }}
              mapStyle={MAP_STYLE}
              attributionControl={false}
            >
              <Marker longitude={institucion.longitude!} latitude={institucion.latitude!} anchor="bottom">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-incolmedica-primary border-4 border-white shadow-lg shadow-blue-300/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="w-2 h-2 bg-incolmedica-primary rounded-full mt-0.5 shadow" />
                </div>
              </Marker>

              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-incolmedica-dark">{institucion.nombre}</p>
                {institucion.ubicacion && <p className="text-xs text-gray-500">{institucion.ubicacion}</p>}
              </div>
            </Map>
          ) : (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center gap-3 text-gray-400">
              <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm font-medium">Sin coordenadas</p>
              <p className="text-xs text-center px-8">Agrega latitud y longitud en "Editar información" para ver el mapa.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Logos & Marca ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-black text-gray-800">Logos & Marca</h2>
            <p className="text-xs text-gray-400 mt-0.5">{logos.length} logo{logos.length !== 1 ? "s" : ""} registrado{logos.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => { setIsUploadOpen((v) => !v); setUploadError(null); }}
            className="flex items-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Subir logo
          </button>
        </div>

        {/* ── Panel de subida ── */}
        {isUploadOpen && (
          <div className="mb-6 rounded-2xl border border-incolmedica-primary/20 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-incolmedica-primary/10 flex items-center gap-2">
              <svg className="w-4 h-4 text-incolmedica-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm font-bold text-incolmedica-dark">Subir nuevo logo</span>
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
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleFileChange} className="sr-only" />
                </label>
                {uploadFile && (
                  <p className="text-xs text-gray-400 mt-1.5 text-center truncate px-1">{uploadFile.name}</p>
                )}
              </div>

              {/* Controles */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tipo de logo</label>
                  <select
                    value={uploadTipo}
                    onChange={(e) => setUploadTipo(e.target.value as TipoLogo)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
                  >
                    {(Object.keys(TIPO_META) as TipoLogo[]).map((t) => (
                      <option key={t} value={t}>{TIPO_META[t].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nombre <span className="normal-case font-normal text-gray-400">(opcional)</span></label>
                  <input
                    type="text"
                    value={uploadNombre}
                    onChange={(e) => setUploadNombre(e.target.value)}
                    placeholder="ej. Logo horizontal 2024"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{uploadError}</p>
                )}

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile || uploading}
                    className="flex-1 py-2 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50"
                  >
                    {uploading ? "Subiendo…" : "Subir"}
                  </button>
                  <button
                    onClick={() => { setIsUploadOpen(false); setUploadFile(null); setUploadPreview(null); setUploadError(null); }}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-white/80 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Grid de logos ── */}
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
            <p className="text-xs text-gray-400 mt-1">Usa el botón "Subir logo" para agregar el primero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {logos.map((logo) => {
              const meta = TIPO_META[logo.tipo];
              return (
                <div key={logo.id} className="group relative rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Imagen con fondo adaptado */}
                  <div
                    className={`flex items-center justify-center h-40 p-5 ${meta.darkBg ? "bg-gray-900" : ""}`}
                    style={!meta.darkBg ? { backgroundImage: "repeating-conic-gradient(#f3f4f6 0% 25%, #ffffff 0% 50%)", backgroundSize: "16px 16px" } : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.url}
                      alt={logo.nombre || meta.label}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                    />
                  </div>

                  {/* Info */}
                  <div className="px-3 py-2.5 bg-white border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot}`} />
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>
                    {logo.nombre && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{logo.nombre}</p>
                    )}
                  </div>

                  {/* Botón eliminar (aparece en hover) */}
                  <button
                    onClick={() => handleDeleteLogo(logo)}
                    disabled={deletingId === logo.id}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 shadow-sm scale-90 group-hover:scale-100"
                  >
                    {deletingId === logo.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
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

      {/* ── Horarios de Atención ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-incolmedica-primary/10 flex items-center justify-center text-incolmedica-primary flex-shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-800">Horarios de Atención</h2>
              <p className="text-xs text-gray-400 mt-0.5">{horarios.length} horario{horarios.length !== 1 ? "s" : ""} configurado{horarios.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={() => openHorarioForm(null)}
            className="flex items-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </div>

        {/* Formulario inline de creación/edición */}
        {isHorarioFormOpen && (
          <div className="px-6 py-5 border-b border-blue-100/60 bg-gradient-to-br from-blue-50/60 to-indigo-50/40">
            <p className="text-sm font-bold text-incolmedica-dark mb-4">{editingHorario ? "Editar horario" : "Nuevo horario"}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Día</label>
                <select
                  value={horarioForm.dia_semana}
                  onChange={(e) => setHorarioForm((p) => ({ ...p, dia_semana: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
                >
                  {[1,2,3,4,5,6,0].map((d) => (
                    <option key={d} value={d}>{DIAS[d]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Apertura</label>
                <input type="time" value={horarioForm.hora_apertura}
                  onChange={(e) => setHorarioForm((p) => ({ ...p, hora_apertura: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cierre</label>
                <input type="time" value={horarioForm.hora_cierre}
                  onChange={(e) => setHorarioForm((p) => ({ ...p, hora_cierre: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tel. contacto</label>
                <input type="text" value={horarioForm.numero_contacto} placeholder="+57 …"
                  onChange={(e) => setHorarioForm((p) => ({ ...p, numero_contacto: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary" />
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notas</label>
                <input type="text" value={horarioForm.notas} placeholder="ej. Solo urgencias"
                  onChange={(e) => setHorarioForm((p) => ({ ...p, notas: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary" />
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={horarioForm.activo} onChange={(e) => setHorarioForm((p) => ({ ...p, activo: e.target.checked }))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-checked:bg-incolmedica-primary rounded-full transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">Activo</span>
                </label>
              </div>
            </div>
            {horarioError && <p className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{horarioError}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveHorario} disabled={savingHorario}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50 flex items-center gap-2">
                {savingHorario && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                {savingHorario ? "Guardando…" : "Guardar"}
              </button>
              <button onClick={closeHorarioForm} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-white/80 transition-colors">Cancelar</button>
            </div>
          </div>
        )}

        {/* Lista de horarios */}
        <div className="divide-y divide-gray-50">
          {horariosLoading ? (
            <div className="px-6 py-4 space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : horarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600">Sin horarios configurados</p>
              <p className="text-xs text-gray-400 mt-1">Usa "Agregar" para registrar los horarios de atención.</p>
            </div>
          ) : (
            horarios.map((h) => (
              <div key={h.id} className="group flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                {/* Día chip */}
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0 w-11 text-center ${DIA_COLOR[h.dia_semana]}`}>
                  {DIAS_SHORT[h.dia_semana]}
                </span>

                {/* Horas */}
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 min-w-[130px]">
                  <span>{h.hora_apertura.slice(0,5)}</span>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  <span>{h.hora_cierre.slice(0,5)}</span>
                </div>

                {/* Estado */}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${h.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {h.activo ? "Activo" : "Inactivo"}
                </span>

                {/* Info extra */}
                <div className="flex-1 min-w-0 hidden sm:flex items-center gap-3">
                  {h.numero_contacto && (
                    <span className="text-xs text-gray-400 truncate flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      {h.numero_contacto}
                    </span>
                  )}
                  {h.notas && <span className="text-xs text-gray-400 truncate italic">{h.notas}</span>}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => openHorarioForm(h)} className="w-7 h-7 rounded-lg hover:bg-incolmedica-primary/10 flex items-center justify-center text-gray-400 hover:text-incolmedica-primary transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button onClick={() => handleDeleteHorario(h.id)} disabled={deletingHorarioId === h.id} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                    {deletingHorarioId === h.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Modal de edición ── */}
      {isModalOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">

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
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">

              {/* ── Sección: General ── */}
              <div className="form-field">
                <SectionLabel>General</SectionLabel>
                <div className="flex flex-col gap-4 mt-3">
                  <Field label="Nombre de la institución">
                    <input type="text" name="nombre" value={formData.nombre || ""} onChange={handleInputChange}
                      className={INPUT_CLS} placeholder="INCOLMEDICA S.A." />
                  </Field>
                  <Field label="Descripción">
                    <textarea name="descripcion" value={formData.descripcion || ""} onChange={handleInputChange} rows={3}
                      className={`${INPUT_CLS} resize-none`} placeholder="Breve descripción de la institución…" />
                  </Field>
                  <label className="flex items-center gap-3 cursor-pointer px-1">
                    <div className="relative">
                      <input type="checkbox" name="activo" checked={formData.activo ?? true} onChange={handleInputChange} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 peer-checked:bg-incolmedica-primary rounded-full transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Institución activa</span>
                  </label>
                </div>
              </div>

              {/* ── Sección: Contacto ── */}
              <div className="form-field">
                <SectionLabel>Contacto</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <Field label="Correo de contacto">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </span>
                      <input type="email" name="correo_contacto" value={formData.correo_contacto || ""} onChange={handleInputChange}
                        className={`${INPUT_CLS} pl-9`} placeholder="correo@ejemplo.com" />
                    </div>
                  </Field>
                  <Field label="Teléfono">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </span>
                      <input type="text" name="telefono" value={formData.telefono || ""} onChange={handleInputChange}
                        className={`${INPUT_CLS} pl-9`} placeholder="+57 1 234 5678" />
                    </div>
                  </Field>
                </div>
              </div>

              {/* ── Sección: Ubicación ── */}
              <div className="form-field">
                <SectionLabel>Ubicación</SectionLabel>
                <div className="flex flex-col gap-4 mt-3">
                  <Field label="Ciudad / Dirección">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </span>
                      <input type="text" name="ubicacion" value={formData.ubicacion || ""} onChange={handleInputChange}
                        className={`${INPUT_CLS} pl-9`} placeholder="Bogotá, Colombia" />
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Latitud">
                      <input type="number" name="latitude" value={formData.latitude ?? ""} onChange={handleInputChange} step="0.0001"
                        className={INPUT_CLS} placeholder="4.7110" />
                    </Field>
                    <Field label="Longitud">
                      <input type="number" name="longitude" value={formData.longitude ?? ""} onChange={handleInputChange} step="0.0001"
                        className={INPUT_CLS} placeholder="-74.0721" />
                    </Field>
                  </div>

                  {/* Mapa interactivo */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" /></svg>
                      Clic en el mapa para ajustar el pin
                    </p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 h-56 cursor-crosshair shadow-inner">
                      {formData.latitude && formData.longitude ? (
                        <Map
                          ref={modalMapRef}
                          initialViewState={{ longitude: formData.longitude, latitude: formData.latitude, zoom: 14 }}
                          style={{ width: "100%", height: "100%" }}
                          mapStyle={MAP_STYLE}
                          attributionControl={false}
                          onClick={handleModalMapClick}
                        >
                          <Marker longitude={formData.longitude} latitude={formData.latitude} anchor="bottom">
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
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {saveError}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-lg shadow-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                {saving && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT_CLS = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary/50 focus:border-incolmedica-primary transition-colors";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl bg-incolmedica-primary/10 flex items-center justify-center flex-shrink-0 text-incolmedica-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}
