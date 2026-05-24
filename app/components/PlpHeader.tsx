"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PlpHeader({ total }: { total: number }) {
  const rootRef    = useRef<HTMLDivElement>(null);
  const chipRef    = useRef<HTMLDivElement>(null);
  const breadRef   = useRef<HTMLElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const swoosh1Ref = useRef<SVGSVGElement>(null);
  const swoosh2Ref = useRef<SVGSVGElement>(null);
  const swoosh3Ref = useRef<SVGSVGElement>(null);
  const swoosh4Ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Swooshes entran desde fuera
      tl.fromTo(swoosh1Ref.current,
        { x: -120, opacity: 0 },
        { x: 0, opacity: 0.6, duration: 0.9 }, 0)
        .fromTo(swoosh2Ref.current,
          { x: -80, opacity: 0 },
          { x: 0, opacity: 0.5, duration: 0.7 }, 0.1)
        .fromTo(swoosh3Ref.current,
          { x: 120, opacity: 0 },
          { x: 0, opacity: 0.7, duration: 0.9 }, 0)
        .fromTo(swoosh4Ref.current,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 0.6, duration: 0.7 }, 0.1)

        // Chip y breadcrumb
        .fromTo(chipRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }, 0.35)
        .fromTo(breadRef.current,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 }, 0.45)

        // Título línea a línea
        .fromTo(".plp-title-line",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, 0.5)

        // Subtítulo
        .fromTo(subRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }, 0.85);

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
    >
      {/* Swoosh negro diagonal — esquina superior izquierda */}
      <svg ref={swoosh1Ref} className="absolute -top-6 -left-10 w-80 h-52" viewBox="0 0 320 208" aria-hidden>
        <path d="M0 0 L220 0 Q320 0 280 100 Q240 180 100 208 L0 208 Z" fill="#020617" />
      </svg>

      {/* Swoosh azul claro encima */}
      <svg ref={swoosh2Ref} className="absolute top-0 left-0 w-64 h-40" viewBox="0 0 256 160" aria-hidden>
        <path d="M0 0 L160 0 Q220 0 200 70 Q180 130 60 160 L0 160 Z" fill="#3b82f6" />
      </svg>

      {/* Swoosh negro — esquina inferior derecha */}
      <svg ref={swoosh3Ref} className="absolute -bottom-4 -right-8 w-96 h-40" viewBox="0 0 384 160" aria-hidden>
        <path d="M384 160 L100 160 Q0 160 40 80 Q80 10 240 0 L384 0 Z" fill="#020617" />
      </svg>

      {/* Swoosh azul — encima del negro inferior derecha */}
      <svg ref={swoosh4Ref} className="absolute -bottom-2 right-0 w-72 h-28" viewBox="0 0 288 112" aria-hidden>
        <path d="M288 112 L120 112 Q30 112 60 56 Q90 10 220 0 L288 0 Z" fill="#2563eb" />
      </svg>

      {/* Círculos decorativos cyan */}
      <div className="absolute top-4 right-48 w-20 h-20 rounded-full opacity-20" style={{ background: "#06b6d4" }} />
      <div className="absolute top-8 right-52 w-10 h-10 rounded-full opacity-30" style={{ background: "#22d3ee" }} />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex items-center justify-between gap-6">
        <div>
          {/* Chip */}
          <div ref={chipRef} className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/40 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Catálogo 2026</span>
          </div>

          {/* Breadcrumb */}
          <nav ref={breadRef} className="text-xs text-blue-400 mb-3 flex items-center gap-1.5">
            <span className="hover:text-white cursor-pointer transition-colors">Inicio</span>
            <span>/</span>
            <span className="text-blue-200 font-medium">Catálogo de Productos</span>
          </nav>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tight overflow-hidden">
            <span className="plp-title-line block text-white">CATÁLOGO</span>
            <span className="plp-title-line block" style={{ color: "#facc15" }}>DE PRODUCTOS</span>
          </h1>

          {/* Sub info */}
          <div ref={subRef} className="flex items-center gap-4 mt-4">
            <span className="text-blue-300 text-sm font-medium">{total} productos disponibles</span>
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            <span className="text-blue-300 text-sm hidden sm:inline">Equipos médicos · Diagnóstico · Laboratorio</span>
          </div>
        </div>

      </div>

      {/* Ondas de transición — 3 capas */}
      <div className="relative" style={{ height: "60px" }}>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden style={{ display: "block" }}>
          <path d="M0 60 C480 10 960 10 1440 60 L1440 60 L0 60 Z" fill="#1e40af" opacity="0.5" />
          <path d="M0 60 C360 20 1080 5 1440 60 L1440 60 L0 60 Z" fill="#1d4ed8" opacity="0.4" />
          <path d="M0 60 C600 0 840 0 1440 60 L1440 60 L0 60 Z" fill="#f9fafb" />
        </svg>
      </div>
    </div>
  );
}
