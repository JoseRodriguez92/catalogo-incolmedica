"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Marca       = Database["public"]["Tables"]["marcas"]["Row"];
type MarcaInsert = Database["public"]["Tables"]["marcas"]["Insert"];
type MarcaUpdate = Database["public"]["Tables"]["marcas"]["Update"];

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function getMarcas(): Promise<{ data?: Marca[]; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("marcas")
    .select("*")
    .eq("institucion_id", INSTITUCION_ID)
    .order("nombre", { ascending: true });
  if (error) return { error: error.message };
  return { data: data ?? [] };
}

export async function createMarca(
  payload: Omit<MarcaInsert, "id" | "created_at" | "updated_at">,
): Promise<{ data?: Marca; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("marcas")
    .insert({ ...payload, activo: payload.activo ?? true, institucion_id: INSTITUCION_ID })
    .select()
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function updateMarca(
  id: string,
  payload: MarcaUpdate,
): Promise<{ data?: Marca; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("marcas")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function toggleMarcaActivo(
  id: string,
  activo: boolean,
): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("marcas")
    .update({ activo, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function deleteMarca(id: string): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("marcas").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}
