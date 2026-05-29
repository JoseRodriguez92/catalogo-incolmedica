import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Database } from "@/types/database.types";

type Marca = Database["public"]["Tables"]["marcas"]["Row"];

// ── Selectors ────────────────────────────────────────────────────────────────

export const selectMarcasActivas = (state: { marcas: Marca[] }) =>
  state.marcas.filter((m) => m.activo);

// ─────────────────────────────────────────────────────────────────────────────

type MarcasState = {
  marcas: Marca[];
  loading: boolean;
  loaded: boolean;

  setMarcas: (marcas: Marca[]) => void;
  setLoading: (loading: boolean) => void;
  invalidate: () => void;
};

export const useMarcasStore = create<MarcasState>()(
  persist(
    (set) => ({
      marcas: [],
      loading: false,
      loaded: false,

      setMarcas: (marcas) => set({ marcas, loaded: true }),
      setLoading: (loading) => set({ loading }),
      invalidate: () => set({ loaded: false }),
    }),
    {
      name: "incolmedica-marcas",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ marcas: state.marcas }),
    },
  ),
);
