"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function submitFormulario(payload: {
  nombre_completo: string;
  telefono: string;
  correo_electronico: string;
  mensaje: string;
  acepta_politica_privacidad: boolean;
}): Promise<{ error?: string }> {
  const supabase = getAdminClient();

  const { error } = await supabase
    .from("instituciones_registros_formulario")
    .insert({
      ...payload,
      institucion_id: INSTITUCION_ID,
      estado: "pendiente",
      origen: "formulario_web",
    });

  if (error) return { error: error.message };
  return {};
}
