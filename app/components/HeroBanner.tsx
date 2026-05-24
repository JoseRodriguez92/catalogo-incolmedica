export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
        {/* Left content */}
        <div className="flex-1 space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            OFERTA POR TIEMPO LIMITADO
          </div>

          <div>
            <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-1">Catálogo 2025</p>
            <h1 className="text-5xl md:text-6xl font-black leading-none">
              GRAN
              <br />
              <span className="text-yellow-400">VENTA</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 text-blue-900 rounded-2xl px-5 py-3 text-center font-black">
              <span className="text-4xl leading-none">30%</span>
              <p className="text-xs font-bold uppercase tracking-wide">de descuento</p>
            </div>
            <p className="text-blue-100 text-sm max-w-xs leading-relaxed">
              En equipos médicos y de diagnóstico seleccionados. Solo hasta agotar existencias.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-white text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-all shadow-lg">
              Ver ofertas
            </button>
            <button className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all">
              Catálogo completo
            </button>
          </div>
        </div>

        {/* Right — featured product placeholder */}
        <div className="flex-shrink-0 relative">
          <div className="w-72 h-72 md:w-80 md:h-80 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-400/20 rounded-full"></div>

            {/* Product icon placeholder */}
            <div className="relative z-10 text-center">
              <div className="w-40 h-40 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-20 h-20 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
              <p className="text-white font-bold">Producto Destacado</p>
              <p className="text-blue-200 text-sm">$ 1.299.000</p>
            </div>
          </div>

          {/* Price badge */}
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-blue-900 rounded-full w-16 h-16 flex flex-col items-center justify-center font-black text-xs leading-tight shadow-lg">
            <span>BRAND</span>
            <span>NEW</span>
            <span>2025</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-blue-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-8 overflow-x-auto text-sm">
          {[
            { label: "Productos", value: "500+" },
            { label: "Marcas", value: "80+" },
            { label: "Clientes", value: "2.000+" },
            { label: "Años de experiencia", value: "15+" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-yellow-400 font-black text-lg">{stat.value}</span>
              <span className="text-blue-200">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
