"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    label: "Catalog",
    icon: (
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
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    subItems: [
      { href: "/dashboard/productos", label: "Producto" },
      { href: "/dashboard/categorias", label: "Categoría" },
      { href: "/dashboard/marcas", label: "Marca" },
    ],
  },
  {
    href: "/dashboard/informes",
    label: "Informes",
    icon: (
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
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg, #0a4f9e 0%, #005cb9 100%)",
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-incolmedica-cyan/30">
          <span className="text-xl font-black text-white tracking-tight">
            INCOLMEDICA
          </span>
          <span className="block text-xs text-incolmedica-cyan uppercase tracking-widest mt-0.5">
            Panel Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map((item, index) => {
            // Item con sub-items (acordeón)
            if (item.subItems) {
              const isAnySubActive = item.subItems.some(
                (sub) => pathname === sub.href,
              );

              return (
                <div key={index}>
                  <button
                    onClick={() => setCatalogOpen(!catalogOpen)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isAnySubActive
                        ? "bg-incolmedica-primary/50 text-white"
                        : "text-blue-100 hover:bg-incolmedica-primary/50 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    <svg
                      className={`w-4 h-4 ml-auto transition-transform ${catalogOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {catalogOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const subActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              subActive
                                ? "bg-incolmedica-cyan text-white"
                                : "text-blue-200 hover:bg-incolmedica-primary/30 hover:text-white"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${subActive ? "bg-white" : "bg-blue-300"}`}
                            />
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Item normal (sin sub-items)
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-incolmedica-cyan text-white shadow-lg shadow-incolmedica-dark/40"
                    : "text-blue-100 hover:bg-incolmedica-primary/50 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
                {item.label === "Informes" && (
                  <span className="ml-auto bg-yellow-400 text-incolmedica-dark text-xs font-black px-2 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-5 border-t border-incolmedica-cyan/30 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-incolmedica-cyan flex items-center justify-center text-white font-black text-sm shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                Administrador
              </p>
              <p className="text-incolmedica-cyan text-xs truncate">
                admin@incolmedica.com
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 text-blue-100 hover:text-white text-sm px-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="font-black text-incolmedica-primary">
            INCOLMEDICA
          </span>
          <span className="ml-auto text-xs text-gray-400 uppercase tracking-wide">
            Admin
          </span>
        </header>

        <main className="flex-1 p-5 lg:p-8 overflow-auto max-h-[100dvh]">
          {children}
        </main>
      </div>
    </div>
  );
}
