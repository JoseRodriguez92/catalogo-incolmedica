export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-52 flex items-center justify-center overflow-hidden">
        {/* Placeholder icon */}
        <div className="w-28 h-28 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <svg className="w-14 h-14 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">NUEVO</span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
          )}
          {product.isFeatured && (
            <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-full">DESTACADO</span>
          )}
        </div>

      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">{product.description}</p>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-blue-700">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">IVA incluido</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
            Ver más
          </button>
          <button className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors" title="Contactar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
