"use client";

import { useState, useEffect } from "react";
import { sendEmail } from "../actions";

interface Props {
  to: string;
  name: string | null;
  onClose: () => void;
}

export function EmailModal({ to, name, onClose }: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setSubject(""); setBody(""); setSent(false); setError(null);
  }, [to]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setError(null);
    const html = body.replace(/\n/g, "<br/>");
    const { error: err } = await sendEmail(to, subject, html);
    setSending(false);
    if (err) { setError(err); return; }
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-gray-800">Enviar correo</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Para: <span className="font-semibold text-incolmedica-primary">{name ?? to}</span> &lt;{to}&gt;
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-800">Correo enviado</p>
            <p className="text-xs text-gray-400">El mensaje fue enviado a {to}</p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-xl text-sm font-bold bg-incolmedica-primary text-white hover:bg-incolmedica-blue transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Asunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Asunto del mensaje"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Mensaje
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSend}
                disabled={sending || !subject.trim() || !body.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-md shadow-blue-200 transition-colors disabled:opacity-50"
              >
                {sending ? (
                  "Enviando…"
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
