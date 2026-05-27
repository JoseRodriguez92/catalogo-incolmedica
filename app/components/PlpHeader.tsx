"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PlpHeader({ total }: { total: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swoosh1Ref = useRef<SVGSVGElement>(null);
  const swoosh2Ref = useRef<SVGSVGElement>(null);
  const swoosh3Ref = useRef<SVGSVGElement>(null);
  const swoosh4Ref = useRef<SVGSVGElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación inicial de los swooshes - entran desde fuera
      gsap.fromTo(
        swoosh1Ref.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 0.6, duration: 1.5, ease: "power2.out" },
      );

      gsap.fromTo(
        swoosh2Ref.current,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 0.5, duration: 1.3, ease: "power2.out", delay: 0.1 },
      );

      gsap.fromTo(
        swoosh3Ref.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 0.7, duration: 1.5, ease: "power2.out", delay: 0.05 },
      );

      gsap.fromTo(
        swoosh4Ref.current,
        { x: 150, opacity: 0 },
        { x: 0, opacity: 0.6, duration: 1.3, ease: "power2.out", delay: 0.15 },
      );

      // Círculos entran con escala
      gsap.fromTo(
        circle1Ref.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.2,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.3,
        },
      );

      gsap.fromTo(
        circle2Ref.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.3,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.4,
        },
      );

      // Animaciones continuas de flotación para círculos
      gsap.to(circle1Ref.current, {
        y: -20,
        x: 15,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(circle2Ref.current, {
        y: 15,
        x: -10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Rotación sutil de círculos
      gsap.to(circle1Ref.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      gsap.to(circle2Ref.current, {
        rotation: -360,
        duration: 15,
        repeat: -1,
        ease: "none",
      });

      // Movimiento sutil de los swooshes para efecto parallax
      gsap.to(swoosh1Ref.current, {
        x: -10,
        y: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(swoosh3Ref.current, {
        x: 10,
        y: -5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden mt-5 md:mt-10"
      style={{
        background:
          "linear-gradient(135deg, #0a4f9e 0%, #005cb9 50%, #0e9fdd 100%)",
      }}
    >
      {/* Swoosh negro diagonal — esquina superior izquierda */}
      <svg
        ref={swoosh1Ref}
        className="absolute -top-6 -left-10 w-80 h-52"
        viewBox="0 0 320 208"
        aria-hidden
      >
        <path
          d="M0 0 L220 0 Q320 0 280 100 Q240 180 100 208 L0 208 Z"
          fill="#003d8f"
        />
      </svg>

      {/* Swoosh azul claro encima */}
      <svg
        ref={swoosh2Ref}
        className="absolute top-0 left-0 w-64 h-40"
        viewBox="0 0 256 160"
        aria-hidden
      >
        <path
          d="M0 0 L160 0 Q220 0 200 70 Q180 130 60 160 L0 160 Z"
          fill="#1887e5"
        />
      </svg>

      {/* Swoosh negro — esquina inferior derecha */}
      <svg
        ref={swoosh3Ref}
        className="absolute -bottom-4 -right-8 w-96 h-40"
        viewBox="0 0 384 160"
        aria-hidden
      >
        <path
          d="M384 160 L100 160 Q0 160 40 80 Q80 10 240 0 L384 0 Z"
          fill="#003d8f"
        />
      </svg>

      {/* Swoosh azul — encima del negro inferior derecha */}
      <svg
        ref={swoosh4Ref}
        className="absolute -bottom-2 right-0 w-72 h-28"
        viewBox="0 0 288 112"
        aria-hidden
      >
        <path
          d="M288 112 L120 112 Q30 112 60 56 Q90 10 220 0 L288 0 Z"
          fill="#005cb9"
        />
      </svg>

      {/* Círculos decorativos cyan */}
      <div
        ref={circle1Ref}
        className="absolute top-4 right-48 w-20 h-20 rounded-full opacity-20"
        style={{ background: "#1887e5" }}
      />
      <div
        ref={circle2Ref}
        className="absolute top-8 right-52 w-10 h-10 rounded-full opacity-30"
        style={{ background: "#0e9fdd" }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex items-center justify-between gap-6">
        <div>
          {/* Chip */}
          <div className="inline-flex items-center gap-2 bg-incolmedica-cyan/20 border border-incolmedica-cyan/40 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-widest">
              Catálogo 2026
            </span>
          </div>

          {/* Breadcrumb */}
          <nav className="text-xs text-incolmedica-cyan mb-3 flex items-center gap-1.5">
            <span className="hover:text-white cursor-pointer transition-colors">
              Inicio
            </span>
            <span>/</span>
            <span className="text-blue-100 font-medium">
              Catálogo de Productos
            </span>
          </nav>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tight">
            <span className="block text-white">CATÁLOGO</span>
            <span className="block" style={{ color: "#facc15" }}>
              DE PRODUCTOS
            </span>
          </h1>

          {/* Sub info */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-blue-100 text-sm font-medium">
              {total} productos disponibles
            </span>
            <span className="w-1 h-1 rounded-full bg-incolmedica-cyan" />
            <span className="text-blue-100 text-sm hidden sm:inline">
              Equipos médicos · Diagnóstico · Laboratorio
            </span>
          </div>
        </div>
      </div>

      {/* Ondas de transición — 3 capas */}
      <div className="relative h-8 md:h-16">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,60 C480,10 960,10 1440,60 L1440,60 L0,60 Z"
            fill="#005cb9"
            opacity="0.5"
          />
          <path
            d="M0,60 C360,20 1080,5 1440,60 L1440,60 L0,60 Z"
            fill="#0e9fdd"
            opacity="0.4"
          />
          <path
            d="M0,60 C600,0 840,0 1440,60 L1440,60 L0,60 Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </div>
  );
}
