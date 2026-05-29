import type { Database } from "@/types/database.types";

type TipoLogo = Database["public"]["Enums"]["tipo_logo"];

export const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;
export const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const DIAS: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Festivo",
};

export const DIAS_SHORT: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
  7: "Fest",
};

export const DIA_COLOR: Record<number, string> = {
  0: "bg-rose-100 text-rose-700",
  1: "bg-blue-100 text-blue-700",
  2: "bg-indigo-100 text-indigo-700",
  3: "bg-violet-100 text-violet-700",
  4: "bg-purple-100 text-purple-700",
  5: "bg-pink-100 text-pink-700",
  6: "bg-orange-100 text-orange-700",
  7: "bg-amber-100 text-amber-700",
};

export const TIPO_META: Record<
  TipoLogo,
  { label: string; dot: string; badge: string; darkBg: boolean }
> = {
  logotipo: {
    label: "Logotipo",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700",
    darkBg: false,
  },
  isotipo: {
    label: "Isotipo",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700",
    darkBg: false,
  },
  version_oscura: {
    label: "Versión Oscura",
    dot: "bg-gray-700",
    badge: "bg-gray-800 text-gray-100",
    darkBg: true,
  },
  version_clara: {
    label: "Versión Clara",
    dot: "bg-sky-300",
    badge: "bg-sky-50 text-sky-700",
    darkBg: false,
  },
  favicon: {
    label: "Favicon",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700",
    darkBg: false,
  },
  banner: {
    label: "Banner",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
    darkBg: false,
  },
  otro: {
    label: "Otro",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600",
    darkBg: false,
  },
};

export const CATEGORIA_META: Record<
  "principal" | "secundario" | "normal",
  { label: string; badge: string }
> = {
  principal: {
    label: "Principal",
    badge: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  secundario: {
    label: "Secundario",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  normal: {
    label: "Normal",
    badge: "bg-gray-50 text-gray-600 border border-gray-200",
  },
};
