import DashboardLayout from "../../components/DashboardLayout";

const SUBMISSIONS = [
  { id: 1,  name: "Carlos Rodríguez", phone: "300 123 4567", email: "carlos@email.com",   product: "Monitor de Signos Vitales",    description: "Necesito cotización para 3 unidades para clínica.",                    date: "23 may 2026, 10:24 am", status: "nueva"    },
  { id: 2,  name: "María López",      phone: "310 987 6543", email: "maria@email.com",    product: "Ecógrafo Portátil Doppler",     description: "¿Tienen disponibilidad inmediata? Requiero una demostración.",          date: "23 may 2026, 8:05 am",  status: "nueva"    },
  { id: 3,  name: "Andrés Torres",    phone: "315 456 7890", email: "andres@email.com",   product: "Autoclave Vertical 50L",        description: "Quiero información sobre garantía y mantenimiento incluido.",          date: "23 may 2026, 7:30 am",  status: "nueva"    },
  { id: 4,  name: "Juliana Pérez",    phone: "320 111 2233", email: "juliana@email.com",  product: "Oxímetro Nonin",               description: "Necesito 20 unidades para hospital. Precio por volumen.",              date: "22 may 2026, 2:10 pm",  status: "atendida" },
  { id: 5,  name: "Felipe Gómez",     phone: "312 333 4455", email: "felipe@email.com",   product: "Camilla Eléctrica",            description: "Consulta sobre financiamiento y tiempo de entrega.",                   date: "21 may 2026, 11:00 am", status: "atendida" },
  { id: 6,  name: "Luisa Martínez",   phone: "317 667 8899", email: "luisa@email.com",    product: "Microscopio Binocular",        description: "¿Incluye lentes de inmersión? Requiero para laboratorio clínico.",     date: "20 may 2026, 3:45 pm",  status: "atendida" },
  { id: 7,  name: "Diego Vargas",     phone: "304 221 3344", email: "diego@email.com",    product: "Desfibrilador Philips",        description: "Solicito ficha técnica completa y precio final con IVA.",              date: "19 may 2026, 9:20 am",  status: "atendida" },
];

const STATUS_COLORS: Record<string, string> = {
  nueva:    "bg-yellow-100 text-yellow-700",
  atendida: "bg-green-100 text-green-700",
};
const DOT_COLORS: Record<string, string> = {
  nueva:    "bg-yellow-500",
  atendida: "bg-green-500",
};

export default function InformesPage() {
  const nuevas   = SUBMISSIONS.filter((s) => s.status === "nueva").length;
  const atendidas = SUBMISSIONS.filter((s) => s.status === "atendida").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Informes de Solicitudes</h1>
          <p className="text-sm text-gray-500 mt-1">Formularios recibidos desde el catálogo.</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total",     value: SUBMISSIONS.length, color: "text-blue-600",   bg: "bg-blue-50"   },
          { label: "Nuevas",    value: nuevas,              color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Atendidas", value: atendidas,           color: "text-green-600",  bg: "bg-green-50"  },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-4`}>
            <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
            <span className="text-sm font-semibold text-gray-600">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="search" placeholder="Buscar por nombre o correo..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Todos los estados</option>
          <option>Nueva</option>
          <option>Atendida</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Producto</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Descripción</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Fecha</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {SUBMISSIONS.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                    <p className="text-xs text-gray-400">{s.phone}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-gray-600 text-xs font-medium">{s.product}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-gray-500 text-xs max-w-[200px] line-clamp-2">{s.description}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs hidden md:table-cell whitespace-nowrap">{s.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[s.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[s.status]}`} />
                      {s.status === "nueva" ? "Nueva" : "Atendida"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                        Ver detalle
                      </button>
                      {s.status === "nueva" && (
                        <button className="text-xs font-semibold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                          Marcar atendida
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Mostrando {SUBMISSIONS.length} solicitudes</p>
          <div className="flex gap-1">
            {[1, 2].map((n) => (
              <button key={n} className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                n === 1 ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-100"
              }`}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
