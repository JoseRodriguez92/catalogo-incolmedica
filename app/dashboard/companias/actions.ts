"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type InstitucionUpdate =
  Database["public"]["Tables"]["instituciones"]["Update"];
type TipoLogo = Database["public"]["Enums"]["tipo_logo"];
type Logo = Database["public"]["Tables"]["instituciones_logos"]["Row"];
type Horario = Database["public"]["Tables"]["horarios_atencion"]["Row"];
type HorarioInsert =
  Database["public"]["Tables"]["horarios_atencion"]["Insert"];
type HorarioUpdate =
  Database["public"]["Tables"]["horarios_atencion"]["Update"];

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function updateInstitucion(id: string, data: InstitucionUpdate) {
  const supabase = getAdminClient();

  const { data: updated, error } = await supabase
    .from("instituciones")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: updated };
}

export async function getLogos(
  institucionId: string,
): Promise<{ data?: Logo[]; error?: string }> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("instituciones_logos")
    .select("*")
    .eq("institucion_id", institucionId)
    .order("orden", { ascending: true });

  if (error) return { error: error.message };
  return { data: data ?? [] };
}

export async function uploadLogo(
  institucionId: string,
  fileBase64: string,
  fileName: string,
  mimeType: string,
  tipo: TipoLogo,
  categoria: "principal" | "secundario" | "normal",
  nombre: string | null,
): Promise<{ data?: Logo; error?: string }> {
  const supabase = getAdminClient();

  const buffer = Buffer.from(fileBase64, "base64");
  const storagePath = `${institucionId}/${Date.now()}-${fileName}`;

  const { error: storageError } = await supabase.storage
    .from("instituciones-logos")
    .upload(storagePath, buffer, { contentType: mimeType, upsert: false });

  if (storageError) return { error: storageError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("instituciones-logos").getPublicUrl(storagePath);

  const { data: logo, error: dbError } = await supabase
    .from("instituciones_logos")
    .insert({
      institucion_id: institucionId,
      url: publicUrl,
      tipo,
      categoria,
      nombre: nombre || null,
    })
    .select()
    .single();

  if (dbError) {
    await supabase.storage.from("instituciones-logos").remove([storagePath]);
    return { error: dbError.message };
  }

  return { data: logo };
}

export async function deleteLogo(
  logoId: string,
  url: string,
): Promise<{ error?: string }> {
  const supabase = getAdminClient();

  const marker = "instituciones-logos/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const storagePath = url.slice(idx + marker.length);
    await supabase.storage.from("instituciones-logos").remove([storagePath]);
  }

  const { error } = await supabase
    .from("instituciones_logos")
    .delete()
    .eq("id", logoId);
  if (error) return { error: error.message };
  return {};
}

export async function updateLogo(
  logoId: string,
  tipo: TipoLogo,
  categoria: "principal" | "secundario" | "normal",
  nombre: string | null,
): Promise<{ data?: Logo; error?: string }> {
  const supabase = getAdminClient();

  const { data: logo, error } = await supabase
    .from("instituciones_logos")
    .update({ tipo, categoria, nombre: nombre || null })
    .eq("id", logoId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data: logo };
}

// ── Horarios ──────────────────────────────────────────────────────────────────

export async function getHorarios(
  institucionId: string,
): Promise<{ data?: Horario[]; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("horarios_atencion")
    .select("*")
    .eq("institucion_id", institucionId)
    .order("dia_semana", { ascending: true })
    .order("hora_apertura", { ascending: true });
  if (error) return { error: error.message };
  return { data: data ?? [] };
}

export async function createHorario(
  data: HorarioInsert,
): Promise<{ data?: Horario; error?: string }> {
  const supabase = getAdminClient();
  const { data: created, error } = await supabase
    .from("horarios_atencion")
    .insert(data)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: created };
}

export async function updateHorario(
  id: string,
  data: HorarioUpdate,
): Promise<{ data?: Horario; error?: string }> {
  const supabase = getAdminClient();
  const { data: updated, error } = await supabase
    .from("horarios_atencion")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: updated };
}

export async function deleteHorario(id: string): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("horarios_atencion")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  return {};
}
