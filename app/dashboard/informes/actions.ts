"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Registro = Database["public"]["Tables"]["instituciones_registros_formulario"]["Row"];
type Estado   = Database["public"]["Enums"]["tipo_estado_registro"];

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function getRegistros(): Promise<{ data: Registro[] }> {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("instituciones_registros_formulario")
    .select("*")
    .eq("institucion_id", INSTITUCION_ID)
    .order("created_at", { ascending: false });
  return { data: data ?? [] };
}

export async function updateEstado(
  id: string,
  estado: Estado,
): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("instituciones_registros_formulario")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function updateNotas(
  id: string,
  notas_internas: string,
): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("instituciones_registros_formulario")
    .update({ notas_internas, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  return {};
}
