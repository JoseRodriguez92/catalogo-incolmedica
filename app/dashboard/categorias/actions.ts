"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Categoria       = Database["public"]["Tables"]["categorias"]["Row"];
type CategoriaInsert = Database["public"]["Tables"]["categorias"]["Insert"];
type CategoriaUpdate = Database["public"]["Tables"]["categorias"]["Update"];

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

export async function getCategorias(): Promise<{ data?: Categoria[]; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("institucion_id", INSTITUCION_ID)
    .order("nombre", { ascending: true });
  if (error) return { error: error.message };
  return { data: data ?? [] };
}

export async function createCategoria(
  payload: Omit<CategoriaInsert, "id" | "created_at" | "updated_at">,
): Promise<{ data?: Categoria; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("categorias")
    .insert({ ...payload, activo: payload.activo ?? true, institucion_id: INSTITUCION_ID })
    .select()
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function updateCategoria(
  id: string,
  payload: CategoriaUpdate,
): Promise<{ data?: Categoria; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("categorias")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function toggleActivo(
  id: string,
  activo: boolean,
): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("categorias")
    .update({ activo, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function deleteCategoria(id: string): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}
