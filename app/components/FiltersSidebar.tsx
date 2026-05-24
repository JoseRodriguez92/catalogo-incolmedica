"use client";

import { useState } from "react";

const CATEGORIES = ["Todos", "Equipos Médicos", "Diagnóstico", "Laboratorio", "Rehabilitación", "Consumibles"];
const BRANDS = ["Mindray", "Philips", "GE Healthcare", "Olympus", "Hettich"];

function FilterContent() {
  return (
    <div className="space-y-5">
      {/* Categoría */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Categoría</h3>
        <ul className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
                <input
                  type="checkbox"
                  defaultChecked={cat === "Todos"}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Precio */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Precio</h3>
        <div className="space-y-2">
          <input type="range" min={0} max={25000000} defaultValue={25000000} className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>$0</span>
            <span>$25.000.000</span>
          </div>
        </div>
      </div>

      {/* Marca */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Marca</h3>
        <ul className="space-y-1.5">
          {BRANDS.map((brand) => (
            <li key={brand}>
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function FiltersSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0 space-y-5">
        <FilterContent />
      </aside>

      {/* Mobile — botón flotante */}
      <div className="lg:hidden fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-xl shadow-blue-300/50 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtros
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal centrado */}
          <div className="lg:hidden fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-gray-50 rounded-3xl shadow-2xl max-h-[80dvh] flex flex-col">
            {/* Handle + header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                <span className="font-black text-gray-800">Filtros</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-4 py-4">
              <FilterContent />
            </div>

            {/* Aplicar */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition-colors active:scale-95"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
