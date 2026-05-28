"use client";

import { useEffect, useCallback } from "react";
import {
  useInstitucionStore,
  HORARIO_FORM_EMPTY,
} from "@/lib/store/instituciones-store";
import {
  getLogos,
  uploadLogo,
  updateLogo,
  deleteLogo,
  getHorarios,
  createHorario,
  updateHorario,
  deleteHorario,
} from "./actions";
import type { Database } from "@/types/database.types";
import { INSTITUCION_ID } from "./constants";
import { HeroCard } from "./components/HeroCard";
import { InfoAndMapSection } from "./components/InfoAndMapSection";
import { LogosSection } from "./components/LogosSection";
import { HorariosSection } from "./components/HorariosSection";
import { EditModal } from "./components/EditModal";

type Institucion = Database["public"]["Tables"]["instituciones"]["Row"];
type Logo = Database["public"]["Tables"]["instituciones_logos"]["Row"];
type Horario = Database["public"]["Tables"]["horarios_atencion"]["Row"];

export default function CompaniaClient({
  institucion: initial,
}: {
  institucion: Institucion;
}) {
  const {
    institucion,
    setInstitucion,
    logos,
    setLogos,
    setLogosLoading,
    isModalOpen,
    openModal,
    closeModal,
    openUpload,
    closeUpload,
    uploadFile,
    setUploadFile,
    setUploadPreview,
    uploadTipo,
    uploadCategoria,
    uploadNombre,
    setUploading,
    setUploadError,
    setDeletingId,
    setEditingLogo,
    editingLogo,
    resetUploadForm,
    horarios,
    setHorarios,
    setHorariosLoading,
    editingHorario,
    setEditingHorario,
    horarioForm,
    setHorarioForm,
    setHorarioError,
    openHorarioForm,
    closeHorarioForm,
    setSavingHorario,
    setDeletingHorarioId,
  } = useInstitucionStore();

  useEffect(() => {
    setInstitucion(initial);
  }, [initial, setInstitucion]);

  // ── Carga de datos ─────────────────────────────────────────────────────────

  const loadLogos = useCallback(async () => {
    // Si ya hay logos cacheados, no mostramos el skeleton (solo refrescamos en background)
    if (logos.length === 0) setLogosLoading(true);
    const { data } = await getLogos(INSTITUCION_ID);
    if (data) setLogos(data);
    setLogosLoading(false);
  }, [logos.length, setLogos, setLogosLoading]);

  const loadHorarios = useCallback(async () => {
    // Igual que logos: si ya hay datos cacheados, refrescamos sin spinner
    if (horarios.length === 0) setHorariosLoading(true);
    const { data } = await getHorarios(INSTITUCION_ID);
    if (data) setHorarios(data);
    setHorariosLoading(false);
  }, [horarios.length, setHorarios, setHorariosLoading]);

  useEffect(() => { loadLogos(); }, [loadLogos]);
  useEffect(() => { loadHorarios(); }, [loadHorarios]);

  // ── Handlers de logos ──────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setUploadFile(file);
    setUploadError(null);
    setUploadPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpload = async () => {
    if (!uploadFile && !editingLogo) return;
    setUploading(true);
    setUploadError(null);

    if (editingLogo && !uploadFile) {
      const { data: logo, error } = await updateLogo(
        editingLogo.id,
        uploadTipo,
        uploadCategoria,
        uploadNombre || null,
      );
      setUploading(false);
      if (error) { setUploadError(error); return; }
      if (logo) setLogos(logos.map((l) => (l.id === logo.id ? logo : l)));
      resetUploadForm();
      closeUpload();
      return;
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(uploadFile!);
    });

    const { data: logo, error } = await uploadLogo(
      INSTITUCION_ID,
      base64,
      uploadFile!.name,
      uploadFile!.type,
      uploadTipo,
      uploadCategoria,
      uploadNombre || null,
    );
    setUploading(false);
    if (error) { setUploadError(error); return; }
    if (logo) setLogos([...logos, logo]);
    resetUploadForm();
    closeUpload();
  };

  const handleDeleteLogo = async (logo: Logo) => {
    setDeletingId(logo.id);
    const { error } = await deleteLogo(logo.id, logo.url);
    if (!error) setLogos(logos.filter((l) => l.id !== logo.id));
    setDeletingId(null);
  };

  const handleEditLogo = (logo: Logo) => {
    setEditingLogo(logo);
    setUploadPreview(logo.url);
    setUploadFile(null);
    setUploadError(null);
    openUpload();
  };

  // ── Handlers de horarios ───────────────────────────────────────────────────

  const handleOpenHorarioForm = (h: Horario | null) => {
    setEditingHorario(h);
    setHorarioForm(
      h
        ? {
            dia_semana_inicio: h.dia_semana,
            dia_semana_fin: null,
            hora_apertura: h.hora_apertura,
            hora_cierre: h.hora_cierre,
            numero_contacto: h.numero_contacto ?? "",
            notas: h.notas ?? "",
            activo: h.activo ?? true,
          }
        : HORARIO_FORM_EMPTY,
    );
    setHorarioError(null);
    openHorarioForm();
  };

  const handleCloseHorarioForm = () => {
    closeHorarioForm();
    setEditingHorario(null);
  };

  const handleSaveHorario = async () => {
    setSavingHorario(true);
    setHorarioError(null);

    const inicio = horarioForm.dia_semana_inicio;
    const fin = horarioForm.dia_semana_fin ?? inicio;
    const diasArray: number[] = [];
    if (fin >= inicio) {
      for (let d = inicio; d <= fin; d++) diasArray.push(d);
    } else {
      for (let d = inicio; d <= 6; d++) diasArray.push(d);
      for (let d = 0; d <= fin; d++) diasArray.push(d);
    }

    const payload = {
      hora_apertura: horarioForm.hora_apertura,
      hora_cierre: horarioForm.hora_cierre,
      numero_contacto: horarioForm.numero_contacto || null,
      notas: horarioForm.notas || null,
      activo: horarioForm.activo,
    };

    if (editingHorario) {
      const { data, error } = await updateHorario(editingHorario.id, {
        ...payload,
        dia_semana: editingHorario.dia_semana,
      });
      if (error) { setHorarioError(error); setSavingHorario(false); return; }
      if (data)
        setHorarios(
          horarios
            .map((h) => (h.id === data.id ? data : h))
            .sort(
              (a, b) =>
                a.dia_semana - b.dia_semana ||
                a.hora_apertura.localeCompare(b.hora_apertura),
            ),
        );
    } else {
      const created: Horario[] = [];
      for (const dia of diasArray) {
        const { data, error } = await createHorario({
          ...payload,
          dia_semana: dia,
          institucion_id: INSTITUCION_ID,
        });
        if (error) { setHorarioError(error); setSavingHorario(false); return; }
        if (data) created.push(data);
      }
      if (created.length > 0)
        setHorarios(
          [...horarios, ...created].sort(
            (a, b) =>
              a.dia_semana - b.dia_semana ||
              a.hora_apertura.localeCompare(b.hora_apertura),
          ),
        );
    }

    setSavingHorario(false);
    handleCloseHorarioForm();
  };

  const handleDeleteHorario = async (id: string) => {
    setDeletingHorarioId(id);
    const { error } = await deleteHorario(id);
    if (!error) setHorarios(horarios.filter((h) => h.id !== id));
    setDeletingHorarioId(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!institucion) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">Cargando institución...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <HeroCard institucion={institucion} onEdit={openModal} />
      <InfoAndMapSection institucion={institucion} />
      <LogosSection
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        onDeleteLogo={handleDeleteLogo}
        onEditLogo={handleEditLogo}
      />
      <HorariosSection
        onOpenForm={handleOpenHorarioForm}
        onCloseForm={handleCloseHorarioForm}
        onSave={handleSaveHorario}
        onDelete={handleDeleteHorario}
      />
      {isModalOpen && <EditModal onClose={closeModal} />}
    </div>
  );
}
