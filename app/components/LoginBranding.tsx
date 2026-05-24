"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LoginBranding() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Desktop panel ── */
      const dtl = gsap.timeline({ defaults: { ease: "power3.out" } });

      dtl
        .fromTo(".lb-swoosh",
          { x: -140, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, stagger: 0.15 }, 0)
        .fromTo(".lb-logo",
          { y: -24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }, 0.3)
        .fromTo(".lb-chip",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 }, 0.55)
        .fromTo(".lb-title .lb-line",
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.12 }, 0.65)
        .fromTo(".lb-desc",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }, 0.95)
        .fromTo(".lb-stat",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.1 }, 1.05);

      /* ── Mobile header ── */
      const mtl = gsap.timeline({ defaults: { ease: "power3.out" } });

      mtl
        .fromTo(".mb-swoosh",
          { x: -80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, 0)
        .fromTo(".mb-logo",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }, 0.25)
        .fromTo(".mb-chip",
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" }, 0.45);
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Desktop branding panel ── */}
      <div
        ref={desktopRef}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
      >
        <svg className="lb-swoosh absolute -top-10 -left-10 w-80 h-60 opacity-40" viewBox="0 0 320 240" aria-hidden>
          <path d="M0 0 L220 0 Q320 0 280 120 Q240 200 80 240 L0 240 Z" fill="#020617" />
        </svg>
        <svg className="lb-swoosh absolute -bottom-8 -right-8 w-96 h-52 opacity-50" viewBox="0 0 384 208" aria-hidden>
          <path d="M384 208 L80 208 Q0 208 30 100 Q60 10 240 0 L384 0 Z" fill="#020617" />
        </svg>
        <svg className="lb-swoosh absolute bottom-0 right-0 w-72 h-36 opacity-40" viewBox="0 0 288 144" aria-hidden>
          <path d="M288 144 L100 144 Q20 144 50 72 Q80 10 220 0 L288 0 Z" fill="#2563eb" />
        </svg>
        <div className="absolute top-1/2 -right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />

        {/* Logo */}
        <div className="lb-logo relative z-10">
          <span className="text-3xl font-black text-white tracking-tight">INCOLMEDICA</span>
          <span className="block text-xs text-blue-300 tracking-widest uppercase mt-1">Catálogo Virtual</span>
        </div>

        {/* Copy */}
        <div className="relative z-10 space-y-4">
          <div className="lb-chip inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/30 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Panel de administración</span>
          </div>
          <h2 className="lb-title text-4xl font-black text-white leading-tight overflow-hidden">
            <span className="lb-line block">Gestiona tu</span>
            <span className="lb-line block" style={{ color: "#facc15" }}>catálogo</span>
          </h2>
          <p className="lb-desc text-blue-300 text-sm leading-relaxed max-w-xs">
            Accede para administrar productos, categorías y solicitudes de información de tus clientes.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-6 text-sm">
          {[["500+", "Productos"], ["80+", "Marcas"], ["2.000+", "Clientes"]].map(([n, l]) => (
            <div key={l} className="lb-stat">
              <span className="text-yellow-400 font-black text-lg">{n}</span>
              <p className="text-blue-300 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile branding header ── */}
      <div
        ref={mobileRef}
        className="lg:hidden relative overflow-hidden flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
      >
        <svg className="mb-swoosh absolute -top-4 -left-6 w-52 h-36 opacity-50" viewBox="0 0 208 144" aria-hidden>
          <path d="M0 0 L140 0 Q208 0 180 72 Q160 130 50 144 L0 144 Z" fill="#020617" />
        </svg>
        <svg className="mb-swoosh absolute -bottom-2 -right-4 w-48 h-24 opacity-50" viewBox="0 0 192 96" aria-hidden>
          <path d="M192 96 L50 96 Q0 96 20 48 Q40 8 140 0 L192 0 Z" fill="#020617" />
        </svg>
        <svg className="mb-swoosh absolute bottom-0 right-0 w-36 h-16 opacity-40" viewBox="0 0 144 64" aria-hidden>
          <path d="M144 64 L50 64 Q10 64 24 32 Q38 4 110 0 L144 0 Z" fill="#2563eb" />
        </svg>

        <div className="relative z-10 px-6 pt-10 pb-8 flex items-center justify-between">
          <div className="mb-logo">
            <span className="text-2xl font-black text-white tracking-tight">INCOLMEDICA</span>
            <span className="block text-xs text-blue-300 tracking-widest uppercase mt-0.5">Catálogo Virtual</span>
          </div>
          <div className="mb-chip inline-flex items-center gap-1.5 bg-blue-500/30 border border-blue-400/30 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Admin</span>
          </div>
        </div>

        <svg className="w-full block" viewBox="0 0 375 32" preserveAspectRatio="none" style={{ marginBottom: "-1px" }}>
          <path d="M0 32 C100 0 275 0 375 32 L375 32 L0 32 Z" fill="#f8fafc" />
        </svg>
      </div>
    </>
  );
}
