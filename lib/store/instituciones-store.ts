import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Database } from "@/types/database.types";

type Institucion = Database["public"]["Tables"]["instituciones"]["Row"];
type Logo = Database["public"]["Tables"]["instituciones_logos"]["Row"];
type TipoLogo = Database["public"]["Enums"]["tipo_logo"];
type Horario = Database["public"]["Tables"]["horarios_atencion"]["Row"];

export type HorarioForm = {
  dia_semana_inicio: number;
  dia_semana_fin: number | null;
  hora_apertura: string;
  hora_cierre: string;
  numero_contacto: string;
  notas: string;
  activo: boolean;
};

export const HORARIO_FORM_EMPTY: HorarioForm = {
  dia_semana_inicio: 1,
  dia_semana_fin: null,
  hora_apertura: "08:00",
  hora_cierre: "17:00",
  numero_contacto: "",
  notas: "",
  activo: true,
};

type InstitucionState = {
  // Institución
  institucion: Institucion | null;
  formData: Partial<Institucion>;
  saving: boolean;
  saveError: string | null;

  // Modales
  isModalOpen: boolean;
  isUploadOpen: boolean;
  isHorarioFormOpen: boolean;

  // Logos
  logos: Logo[];
  logosLoading: boolean;
  uploadFile: File | null;
  uploadPreview: string | null;
  uploadTipo: TipoLogo;
  uploadCategoria: "principal" | "secundario" | "normal";
  uploadNombre: string;
  uploading: boolean;
  uploadError: string | null;
  deletingId: string | null;
  editingLogo: Logo | null;

  // Horarios
  horarios: Horario[];
  horariosLoading: boolean;
  editingHorario: Horario | null;
  horarioForm: HorarioForm;
  savingHorario: boolean;
  horarioError: string | null;
  deletingHorarioId: string | null;
  horarioViewMode: "grouped" | "calendar";

  // Actions - Institución
  setInstitucion: (institucion: Institucion) => void;
  setFormData: (formData: Partial<Institucion>) => void;
  updateFormData: (field: string, value: string | number | boolean | null) => void;
  setSaving: (saving: boolean) => void;
  setSaveError: (error: string | null) => void;

  // Actions - Modales
  openModal: () => void;
  closeModal: () => void;
  openUpload: () => void;
  closeUpload: () => void;
  openHorarioForm: () => void;
  closeHorarioForm: () => void;

  // Actions - Logos
  setLogos: (logos: Logo[]) => void;
  setLogosLoading: (loading: boolean) => void;
  setUploadFile: (file: File | null) => void;
  setUploadPreview: (preview: string | null) => void;
  setUploadTipo: (tipo: TipoLogo) => void;
  setUploadCategoria: (categoria: "principal" | "secundario" | "normal") => void;
  setUploadNombre: (nombre: string) => void;
  setUploading: (uploading: boolean) => void;
  setUploadError: (error: string | null) => void;
  setDeletingId: (id: string | null) => void;
  setEditingLogo: (logo: Logo | null) => void;
  resetUploadForm: () => void;

  // Actions - Horarios
  setHorarios: (horarios: Horario[]) => void;
  setHorariosLoading: (loading: boolean) => void;
  setEditingHorario: (horario: Horario | null) => void;
  setHorarioForm: (form: HorarioForm | ((prev: HorarioForm) => HorarioForm)) => void;
  updateHorarioForm: (field: keyof HorarioForm, value: string | number | boolean | null) => void;
  setSavingHorario: (saving: boolean) => void;
  setHorarioError: (error: string | null) => void;
  setDeletingHorarioId: (id: string | null) => void;
  setHorarioViewMode: (mode: "grouped" | "calendar") => void;
  resetHorarioForm: () => void;
};

export const useInstitucionStore = create<InstitucionState>()(
  persist(
    (set) => ({
      // ── Estado inicial ────────────────────────────────────────────────────────
      institucion: null,
      formData: {},
      saving: false,
      saveError: null,

      isModalOpen: false,
      isUploadOpen: false,
      isHorarioFormOpen: false,

      logos: [],
      logosLoading: true,
      uploadFile: null,
      uploadPreview: null,
      uploadTipo: "logotipo",
      uploadCategoria: "normal",
      uploadNombre: "",
      uploading: false,
      uploadError: null,
      deletingId: null,
      editingLogo: null,

      horarios: [],
      horariosLoading: true,
      editingHorario: null,
      horarioForm: HORARIO_FORM_EMPTY,
      savingHorario: false,
      horarioError: null,
      deletingHorarioId: null,
      horarioViewMode: "grouped",

      // ── Institución ───────────────────────────────────────────────────────────
      setInstitucion: (institucion) => set({ institucion }),
      setFormData: (formData) => set({ formData }),
      updateFormData: (field, value) =>
        set((state) => ({ formData: { ...state.formData, [field]: value } })),
      setSaving: (saving) => set({ saving }),
      setSaveError: (saveError) => set({ saveError }),

      // ── Modales ───────────────────────────────────────────────────────────────
      openModal: () =>
        set((state) => ({
          isModalOpen: true,
          formData: state.institucion || {},
          saveError: null,
        })),
      closeModal: () => set({ isModalOpen: false }),
      openUpload: () =>
        set({
          isUploadOpen: true,
          uploadError: null,
          editingLogo: null,
          uploadFile: null,
          uploadPreview: null,
          uploadTipo: "logotipo",
          uploadCategoria: "normal",
          uploadNombre: "",
        }),
      closeUpload: () =>
        set({
          isUploadOpen: false,
          uploadFile: null,
          uploadPreview: null,
          uploadError: null,
          editingLogo: null,
        }),
      openHorarioForm: () =>
        set({
          isHorarioFormOpen: true,
          horarioForm: HORARIO_FORM_EMPTY,
          editingHorario: null,
          horarioError: null,
        }),
      closeHorarioForm: () =>
        set({
          isHorarioFormOpen: false,
          editingHorario: null,
          horarioForm: HORARIO_FORM_EMPTY,
        }),

      // ── Logos ─────────────────────────────────────────────────────────────────
      setLogos: (logos) => set({ logos }),
      setLogosLoading: (logosLoading) => set({ logosLoading }),
      setUploadFile: (uploadFile) => set({ uploadFile }),
      setUploadPreview: (uploadPreview) => set({ uploadPreview }),
      setUploadTipo: (uploadTipo) => set({ uploadTipo }),
      setUploadCategoria: (uploadCategoria) => set({ uploadCategoria }),
      setUploadNombre: (uploadNombre) => set({ uploadNombre }),
      setUploading: (uploading) => set({ uploading }),
      setUploadError: (uploadError) => set({ uploadError }),
      setDeletingId: (deletingId) => set({ deletingId }),
      setEditingLogo: (editingLogo) =>
        set({
          editingLogo,
          uploadTipo: editingLogo?.tipo || "logotipo",
          uploadCategoria:
            (editingLogo?.categoria as "principal" | "secundario" | "normal") ||
            "normal",
          uploadNombre: editingLogo?.nombre || "",
        }),
      resetUploadForm: () =>
        set({
          uploadFile: null,
          uploadPreview: null,
          uploadTipo: "logotipo",
          uploadCategoria: "normal",
          uploadNombre: "",
          uploadError: null,
          editingLogo: null,
        }),

      // ── Horarios ──────────────────────────────────────────────────────────────
      setHorarios: (horarios) => set({ horarios }),
      setHorariosLoading: (horariosLoading) => set({ horariosLoading }),
      setEditingHorario: (editingHorario) =>
        set({
          editingHorario,
          horarioForm: editingHorario
            ? {
                dia_semana_inicio: editingHorario.dia_semana,
                dia_semana_fin: null,
                hora_apertura: editingHorario.hora_apertura.substring(0, 5),
                hora_cierre: editingHorario.hora_cierre.substring(0, 5),
                numero_contacto: editingHorario.numero_contacto || "",
                notas: editingHorario.notas || "",
                activo: editingHorario.activo ?? true,
              }
            : HORARIO_FORM_EMPTY,
        }),
      setHorarioForm: (form) =>
        set((state) => ({
          horarioForm:
            typeof form === "function" ? form(state.horarioForm) : form,
        })),
      updateHorarioForm: (field, value) =>
        set((state) => ({
          horarioForm: { ...state.horarioForm, [field]: value },
        })),
      setSavingHorario: (savingHorario) => set({ savingHorario }),
      setHorarioError: (horarioError) => set({ horarioError }),
      setDeletingHorarioId: (deletingHorarioId) => set({ deletingHorarioId }),
      setHorarioViewMode: (horarioViewMode) => set({ horarioViewMode }),
      resetHorarioForm: () => set({ horarioForm: HORARIO_FORM_EMPTY }),
    }),
    {
      name: "incolmedica-institucion",
      storage: createJSONStorage(() => sessionStorage),
      // Persiste datos de servidor; el resto (formularios, modales, uploads)
      // se reinicia con cada sesión para evitar estado colgado.
      partialize: (state) => ({
        institucion: state.institucion,
        logos: state.logos,
        horarios: state.horarios,
      }),
    },
  ),
);
