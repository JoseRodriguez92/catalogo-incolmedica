"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Mostrar navbar si estamos cerca del top o si scrolleamos hacia arriba
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolleando hacia arriba
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolleando hacia abajo
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`bg-linear-to-r from-white via-blue-50/30 to-white backdrop-blur-sm shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-incolmedica-cyan/10 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Fila única en desktop / Fila superior en mobile */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 transition-transform hover:scale-105 duration-300"
        >
          <img
            src="https://imcolmedica.com.co/wp-content/uploads/2021/10/ISOLOGO-IMCOL-700X200.png"
            alt="INCOLMEDICA"
            className="h-10 md:h-16 w-auto object-contain drop-shadow-sm"
          />
        </Link>

        {/* Search — oculto en mobile, visible en sm+ */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-auto">
          <div className="relative w-full group">
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-10 py-2.5 rounded-full border border-incolmedica-cyan/20 bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary focus:border-transparent focus:bg-white shadow-sm hover:shadow-md transition-all duration-300"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-incolmedica-blue hover:text-incolmedica-primary transition-colors duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-incolmedica-cyan/5 to-incolmedica-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>

        {/* Spacer en mobile para empujar acciones a la derecha */}
        <div className="flex-1 sm:hidden" />

        {/* Acciones */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Contáctanos — texto completo en desktop, solo ícono en mobile */}
          <Link
            href="/consulta"
            className="relative flex items-center gap-2 bg-linear-to-r from-incolmedica-primary to-incolmedica-dark hover:from-incolmedica-dark hover:to-incolmedica-primary text-white font-bold rounded-full transition-all duration-300 px-4 py-2.5 sm:px-6 text-sm shadow-lg shadow-incolmedica-primary/25 hover:shadow-xl hover:shadow-incolmedica-primary/40 hover:scale-105 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <svg
              className="w-5 h-5 shrink-0 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="hidden sm:inline relative z-10">Contáctanos</span>
          </Link>
        </div>
      </div>

      {/* Barra de búsqueda inferior — solo en mobile */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative group">
          <input
            type="search"
            placeholder="Buscar productos..."
            className="w-full pl-4 pr-10 py-3 rounded-full border border-incolmedica-cyan/20 bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary focus:border-transparent focus:bg-white shadow-sm hover:shadow-md transition-all duration-300"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-incolmedica-blue hover:text-incolmedica-primary transition-colors duration-200">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <div className="absolute inset-0 rounded-full bg-linear-to-r from-incolmedica-cyan/5 to-incolmedica-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>
    </header>
  );
}
