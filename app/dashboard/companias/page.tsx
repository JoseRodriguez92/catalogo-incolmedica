import { createClient } from "@/lib/supabase/server";
import CompaniaClient from "./CompaniaClient";

const INSTITUCION_ID = "d90e53d2-9383-45f2-a46a-992e407a1772";

export default async function CompaniasPage() {
  const supabase = await createClient();

  const { data: institucion, error } = await supabase
    .from("instituciones")
    .select("*")
    .eq("id", INSTITUCION_ID)
    .single();

  if (error || !institucion) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-gray-500">No se pudo cargar la información de la compañía.</p>
      </div>
    );
  }

  return <CompaniaClient institucion={institucion} />;
}