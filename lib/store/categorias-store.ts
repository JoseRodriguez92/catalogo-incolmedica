import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Database } from "@/types/database.types";

type Categoria = Database["public"]["Tables"]["categorias"]["Row"];

// ── Selectors ────────────────────────────────────────────────────────────────

export const selectRaices = (state: { categorias: Categoria[] }) =>
  state.categorias.filter((c) => c.parent_id === null);

export const selectHijos = (parentId: string) => (state: { categorias: Categoria[] }) =>
  state.categorias.filter((c) => c.parent_id === parentId);

export const selectActivas = (state: { categorias: Categoria[] }) =>
  state.categorias.filter((c) => c.activo);

// ─────────────────────────────────────────────────────────────────────────────

type CategoriasState = {
  categorias: Categoria[];
  loading: boolean;
  loaded: boolean;

  setCategorias: (categorias: Categoria[]) => void;
  setLoading: (loading: boolean) => void;
  invalidate: () => void;
};

export const useCategoriasStore = create<CategoriasState>()(
  persist(
    (set) => ({
      categorias: [],
      loading: false,
      loaded: false,

      setCategorias: (categorias) => set({ categorias, loaded: true }),
      setLoading: (loading) => set({ loading }),
      invalidate: () => set({ loaded: false }),
    }),
    {
      name: "incolmedica-categorias",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ categorias: state.categorias }),
    },
  ),
);
