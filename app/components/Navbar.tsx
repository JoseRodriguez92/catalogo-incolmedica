export default function Navbar() {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">

      {/* Fila única en desktop / Fila superior en mobile */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <span className="text-xl md:text-2xl font-black text-blue-700 tracking-tight">INCOLMEDICA</span>
          <span className="hidden sm:block text-xs text-gray-400 leading-none tracking-widest uppercase">Catálogo Virtual</span>
        </div>

        {/* Search — oculto en mobile, visible en sm+ */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Spacer en mobile para empujar acciones a la derecha */}
        <div className="flex-1 sm:hidden" />

        {/* Acciones */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Contáctanos — texto completo en desktop, solo ícono en mobile */}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors px-3 py-2 sm:px-4 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="hidden sm:inline">Contáctanos</span>
          </button>
        </div>
      </div>

      {/* Barra de búsqueda inferior — solo en mobile */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="search"
            placeholder="Buscar productos..."
            className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

    </header>
  );
}
