"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Producto      = Database["public"]["Tables"]["productos"]["Row"];
type ProductoImg   = Database["public"]["Tables"]["productos_imagenes"]["Row"];

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function getProductos(): Promise<{ data: (Producto & { marcas?: { nombre: string } | null })[] }> {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("productos")
    .select("*, marcas(nombre)")
    .eq("institucion_id", INSTITUCION_ID)
    .order("created_at", { ascending: false });
  return { data: (data as any) ?? [] };
}

export async function getProductoImagenes(productoId: string): Promise<{ data: ProductoImg[] }> {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("productos_imagenes")
    .select("*")
    .eq("producto_id", productoId)
    .order("orden", { ascending: true });
  return { data: data ?? [] };
}

export async function getProductoCategorias(productoId: string): Promise<{ categoriaIds: string[] }> {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("productos_categorias")
    .select("categoria_id")
    .eq("producto_id", productoId);
  return { categoriaIds: (data ?? []).map((r) => r.categoria_id) };
}

export async function createProducto(
  payload: Omit<Producto, "id" | "created_at" | "updated_at">,
  imagenes: { url: string; orden: number }[],
  categoriaIds: string[],
): Promise<{ id?: string; error?: string }> {
  const supabase = getAdminClient();

  const { data: prod, error } = await supabase
    .from("productos")
    .insert({ ...payload, institucion_id: INSTITUCION_ID } as any)
    .select()
    .single();

  if (error) return { error: error.message };

  if (imagenes.length > 0) {
    await supabase.from("productos_imagenes").insert(
      imagenes.map((img) => ({ producto_id: prod.id, url: img.url, orden: img.orden })),
    );
  }
  if (categoriaIds.length > 0) {
    await supabase.from("productos_categorias").insert(
      categoriaIds.map((cat_id) => ({ producto_id: prod.id, categoria_id: cat_id })),
    );
  }

  return { id: prod.id };
}

export async function updateProducto(
  id: string,
  payload: Partial<Producto>,
  imagenes: { url: string; orden: number }[],
  categoriaIds: string[],
): Promise<{ error?: string }> {
  const supabase = getAdminClient();

  const { error } = await supabase
    .from("productos")
    .update({ ...payload, updated_at: new Date().toISOString() } as any)
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("productos_imagenes").delete().eq("producto_id", id);
  if (imagenes.length > 0) {
    await supabase.from("productos_imagenes").insert(
      imagenes.map((img) => ({ producto_id: id, url: img.url, orden: img.orden })),
    );
  }

  await supabase.from("productos_categorias").delete().eq("producto_id", id);
  if (categoriaIds.length > 0) {
    await supabase.from("productos_categorias").insert(
      categoriaIds.map((cat_id) => ({ producto_id: id, categoria_id: cat_id })),
    );
  }

  return {};
}
