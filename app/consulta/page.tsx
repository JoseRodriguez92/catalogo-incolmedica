import Navbar from "../components/Navbar";
import ContactForm from "../components/ContactForm";

export default function ConsultaPage() {
  return (
    <div className="min-h-screen pt-[112px] sm:pt-[64px]" style={{ background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 40%, #ffffff 100%)" }}>
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden bg-blue-900">
        <svg className="absolute -top-6 -left-10 w-80 h-52 opacity-60" viewBox="0 0 320 208" aria-hidden>
          <path d="M0 0 L220 0 Q320 0 280 100 Q240 180 100 208 L0 208 Z" fill="#020617" />
        </svg>
        <svg className="absolute top-0 left-0 w-64 h-40 opacity-50" viewBox="0 0 256 160" aria-hidden>
          <path d="M0 0 L160 0 Q220 0 200 70 Q180 130 60 160 L0 160 Z" fill="#3b82f6" />
        </svg>
        <svg className="absolute -bottom-4 -right-8 w-96 h-40 opacity-70" viewBox="0 0 384 160" aria-hidden>
          <path d="M384 160 L100 160 Q0 160 40 80 Q80 10 240 0 L384 0 Z" fill="#020617" />
        </svg>
        <svg className="absolute -bottom-2 right-0 w-72 h-28 opacity-60" viewBox="0 0 288 112" aria-hidden>
          <path d="M288 112 L120 112 Q30 112 60 56 Q90 10 220 0 L288 0 Z" fill="#2563eb" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          <nav className="text-xs text-blue-400 mb-3 flex items-center gap-1.5">
            <a href="/" className="hover:text-white transition-colors">Inicio</a>
            <span>/</span>
            <span className="text-blue-200 font-medium">Solicitar información</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            Solicitar
            <span className="text-yellow-400"> Información</span>
          </h1>
          <p className="text-blue-300 text-sm mt-2">Déjanos tus datos y un asesor te contactará a la brevedad.</p>
        </div>

        <div className="relative" style={{ height: "50px" }}>
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 50" preserveAspectRatio="none" aria-hidden style={{ display: "block" }}>
            <path d="M0 50 C480 5 960 5 1440 50 L1440 50 L0 50 Z" fill="#1e40af" opacity="0.4" />
            <path d="M0 50 C600 0 840 0 1440 50 L1440 50 L0 50 Z" fill="#eef2ff" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Info lateral */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">¿Cómo podemos ayudarte?</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Completa el formulario y uno de nuestros asesores especializados en equipos médicos se pondrá en contacto contigo para resolver tus inquietudes.
              </p>
            </div>

            {/* Canales de contacto */}
            <div className="space-y-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: "Teléfono",
                  value: "+57 (601) 123-4567",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "Correo",
                  value: "ventas@incolmedica.com.co",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  label: "Ubicación",
                  value: "Bogotá, Colombia",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Horario */}
            <div className="bg-blue-900 rounded-2xl p-5 text-white">
              <h3 className="font-bold text-sm uppercase tracking-wide text-blue-300 mb-3">Horario de atención</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Lunes – Viernes</span>
                  <span className="font-semibold">8:00 am – 6:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Sábados</span>
                  <span className="font-semibold">9:00 am – 1:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Domingos</span>
                  <span className="text-blue-400">Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-xs text-center">
          © 2026 Incolmedica · Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}
