import DashboardLayout from "../../components/DashboardLayout";

const PRODUCTS = [
  { id: 1, name: "Monitor de Signos Vitales Multiparamétrico", brand: "Mindray",      category: "Diagnóstico",     price: 4500000,  status: "activo",   isNew: false, isFeatured: true  },
  { id: 2, name: "Ecógrafo Portátil Doppler Color",            brand: "GE Healthcare", category: "Diagnóstico",     price: 18900000, status: "activo",   isNew: true,  isFeatured: false },
  { id: 3, name: "Desfibrilador Bifásico Automático DEA",      brand: "Philips",       category: "Equipos Médicos", price: 8200000,  status: "activo",   isNew: false, isFeatured: true  },
  { id: 4, name: "Centrifugadora de Mesa Digital",             brand: "Hettich",       category: "Laboratorio",     price: 3100000,  status: "activo",   isNew: false, isFeatured: false },
  { id: 5, name: "Oxímetro de Pulso Portátil",                 brand: "Nonin",         category: "Diagnóstico",     price: 280000,   status: "activo",   isNew: true,  isFeatured: false },
  { id: 6, name: "Camilla Eléctrica Multifuncional",           brand: "Dixion",        category: "Equipos Médicos", price: 6700000,  status: "inactivo", isNew: false, isFeatured: false },
  { id: 7, name: "Autoclave Vertical 50L",                     brand: "Tuttnauer",     category: "Equipos Médicos", price: 5400000,  status: "activo",   isNew: false, isFeatured: false },
  { id: 8, name: "Microscopio Binocular Laboratorio",          brand: "Olympus",       category: "Laboratorio",     price: 4900000,  status: "activo",   isNew: true,  isFeatured: false },
];

function formatPrice(p: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p);
}

export default function ProductosPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Catálogo de Productos</h1>
          <p className="text-sm text-gray-500 mt-1">{PRODUCTS.length} productos registrados</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-200 self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo producto
        </button>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="search" placeholder="Buscar producto..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Todas las categorías</option>
          <option>Equipos Médicos</option>
          <option>Diagnóstico</option>
          <option>Laboratorio</option>
        </select>
        <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Todos los estados</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Categoría</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Precio</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PRODUCTS.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate max-w-[180px]">{p.name}</p>
                        <p className="text-xs text-blue-500 font-medium">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-700 font-semibold hidden lg:table-cell">{formatPrice(p.price)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      p.status === "activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === "activo" ? "bg-green-500" : "bg-gray-400"}`} />
                      {p.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Mostrando 8 de 8 productos</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
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
