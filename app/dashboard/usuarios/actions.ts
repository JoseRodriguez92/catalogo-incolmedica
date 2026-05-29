"use server";

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import type { Database } from "@/types/database.types";

type RolInstitucion = Database["public"]["Enums"]["tipo_rol_institucion"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type InstUsuario = Database["public"]["Tables"]["instituciones_usuarios"]["Row"];

export type UsuarioConPerfil = InstUsuario & { profiles: Profile | null };

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function getUsuarios(
  institucionId: string,
): Promise<{ data?: UsuarioConPerfil[]; error?: string }> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("instituciones_usuarios")
    .select("*, profiles(*)")
    .eq("institucion_id", institucionId)
    .is("fecha_desvinculacion", null)
    .order("created_at", { ascending: false });
  if (error) return { error: error.message };
  return { data: (data ?? []) as UsuarioConPerfil[] };
}

export async function createUsuario(
  institucionId: string,
  email: string,
  password: string,
  fullName: string,
  phone: string | null,
  rol: RolInstitucion,
): Promise<{ data?: { userId: string }; error?: string }> {
  const supabase = getAdminClient();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
  if (authError) return { error: authError.message };

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    full_name: fullName,
    phone: phone || null,
  });
  if (profileError) return { error: profileError.message };

  const { error: linkError } = await supabase
    .from("instituciones_usuarios")
    .insert({
      user_id: userId,
      institucion_id: institucionId,
      rol_institucion: rol,
      fecha_asignacion: new Date().toISOString(),
    });
  if (linkError) return { error: linkError.message };

  return { data: { userId } };
}

export async function updateUsuario(
  userId: string,
  institucionId: string,
  fullName: string,
  phone: string | null,
  rol: RolInstitucion,
): Promise<{ error?: string }> {
  const supabase = getAdminClient();

  const [profileResult, rolResult] = await Promise.all([
    supabase
      .from("profiles")
      .update({ full_name: fullName, phone: phone || null })
      .eq("id", userId),
    supabase
      .from("instituciones_usuarios")
      .update({ rol_institucion: rol })
      .eq("user_id", userId)
      .eq("institucion_id", institucionId),
  ]);

  if (profileResult.error) return { error: profileResult.error.message };
  if (rolResult.error) return { error: rolResult.error.message };
  return {};
}

export async function desvincularUsuario(
  userId: string,
  institucionId: string,
): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("instituciones_usuarios")
    .update({ fecha_desvinculacion: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("institucion_id", institucionId);
  if (error) return { error: error.message };
  return {};
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ error?: string }> {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Incolmedica" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return {};
  } catch (err) {
    return { error: (err as Error).message };
  }
}
