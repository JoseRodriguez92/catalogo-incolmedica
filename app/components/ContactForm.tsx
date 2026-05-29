"use client";

import { useState } from "react";
import { submitFormulario } from "@/app/consulta/actions";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre_completo: formData.get("nombre_completo") as string,
      telefono: formData.get("telefono") as string,
      correo_electronico: formData.get("correo_electronico") as string,
      mensaje: formData.get("mensaje") as string,
      acepta_politica_privacidad: formData.get("acepta_politica") === "on",
    };

    const { error } = await submitFormulario(data);
    if (error) {
      console.error("Error al enviar formulario:", error);
      setState("error");
      setErrorMessage("Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.");
    } else {
      setState("success");
    }
  }

  if (state === "loading") {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center gap-5 min-h-[400px]">
        <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Enviando tu solicitud...</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center gap-5 min-h-[400px]">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">
            ¡Mensaje enviado!
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            Gracias por contactarnos. Un asesor de Incolmedica se comunicará
            contigo en las próximas horas.
          </p>
        </div>
        <button
          onClick={() => setState("idle")}
          className="text-sm text-blue-600 font-semibold hover:underline"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center gap-5 min-h-[400px]">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">
            Error al enviar
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            {errorMessage}
          </p>
        </div>
        <button
          onClick={() => setState("idle")}
          className="text-sm text-blue-600 font-semibold hover:underline"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-black text-gray-800 mb-1">
        Completa el formulario
      </h2>
      <p className="text-sm text-gray-400 mb-7">
        Todos los campos son obligatorios.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Nombres */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Nombre completo
          </label>
          <input
            type="text"
            name="nombre_completo"
            required
            placeholder="Ej. Carlos Rodríguez"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Teléfono y correo en fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Teléfono / WhatsApp
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                +57
              </span>
              <input
                type="tel"
                name="telefono"
                required
                placeholder="300 123 4567"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo_electronico"
              required
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            ¿En qué podemos ayudarte?
          </label>
          <textarea
            name="mensaje"
            required
            rows={5}
            placeholder="Describe el equipo o producto que necesitas, cantidad aproximada, o cualquier consulta que tengas..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Política */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="acepta_politica"
            required
            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
          />
          <span className="text-xs text-gray-400 leading-relaxed">
            Acepto que Incolmedica utilice mis datos de contacto para responder
            a esta solicitud, de acuerdo con su política de privacidad.
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Enviar solicitud
        </button>
      </form>
    </div>
  );
}
