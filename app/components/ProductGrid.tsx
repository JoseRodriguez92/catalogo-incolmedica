"use client";

import { useState } from "react";
import ProductCard, { type Product } from "./ProductCard";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);
}

function ProductListItem({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row">
        {/* Image — fila completa en mobile, columna fija en desktop */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-40 sm:h-auto sm:w-44 sm:flex-shrink-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-row sm:flex-col gap-1 flex-wrap">
            {product.isNew && <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">NUEVO</span>}
            {discount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
            {product.isFeatured && <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">DEST.</span>}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">{product.brand}</p>
            <h3 className="font-bold text-gray-800 text-base leading-snug mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>
          </div>

          {/* Precio + acciones — fila en mobile, columna alineada a la derecha en desktop */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:flex-shrink-0 gap-3">
            <div className="sm:text-right">
              <div className="text-xl font-black text-blue-700">{formatPrice(product.price)}</div>
              {product.originalPrice && (
                <div className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</div>
              )}
              <p className="text-xs text-gray-400">IVA incluido</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                Ver más
              </button>
              <button className="w-9 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors flex-shrink-0" title="Contactar">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex-1">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <span className="text-sm text-gray-500">Ordenar por</span>
        <select className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Más relevantes</option>
          <option>Menor precio</option>
          <option>Mayor precio</option>
          <option>Más recientes</option>
        </select>

        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setView("grid")}
            className={`p-2 transition-colors ${view === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-50"}`}
            title="Vista cuadrícula"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 transition-colors ${view === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-50"}`}
            title="Vista lista"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Products */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load more */}
      <div className="mt-10 text-center">
        <button className="bg-white border-2 border-blue-200 text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 hover:border-blue-400 transition-all">
          Cargar más productos
        </button>
      </div>
    </div>
  );
}
