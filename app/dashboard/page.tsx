import DashboardLayout from "../components/DashboardLayout";

const STATS = [
  { label: "Productos activos", value: "8", delta: "+2 este mes", color: "bg-blue-600", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )},
  { label: "Solicitudes nuevas", value: "3", delta: "Sin atender", color: "bg-yellow-500", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )},
  { label: "Atendidas este mes", value: "12", delta: "+4 vs mes anterior", color: "bg-green-500", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
  { label: "Categorías", value: "6", delta: "Activas", color: "bg-indigo-500", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )},
];

const RECENT = [
  { name: "Carlos Rodríguez", email: "carlos@email.com", product: "Monitor Signos Vitales", date: "Hoy, 10:24 am", status: "nueva" },
  { name: "María López",      email: "maria@email.com",  product: "Ecógrafo Doppler",       date: "Hoy, 8:05 am",  status: "nueva" },
  { name: "Andrés Torres",    email: "andres@email.com", product: "Autoclave 50L",           date: "Ayer, 4:30 pm", status: "nueva" },
  { name: "Juliana Pérez",    email: "juliana@email.com",product: "Oxímetro Nonin",          date: "22 may, 2:10 pm",status: "atendida" },
  { name: "Felipe Gómez",     email: "felipe@email.com", product: "Camilla Eléctrica",       date: "21 may, 11:00 am",status: "atendida" },
];

export default function DashboardHome() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800">Bienvenido, Administrador</h1>
        <p className="text-sm text-gray-500 mt-1">Aquí tienes un resumen de la actividad del catálogo.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className={`w-11 h-11 rounded-xl ${s.color} text-white flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-3xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.delta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla solicitudes recientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-800">Solicitudes recientes</h2>
          <a href="/dashboard/informes" className="text-xs text-blue-600 font-semibold hover:underline">Ver todas →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Producto</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT.map((r) => (
                <tr key={r.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{r.product}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">{r.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      r.status === "nueva"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r.status === "nueva" ? "bg-yellow-500" : "bg-green-500"}`} />
                      {r.status === "nueva" ? "Nueva" : "Atendida"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
