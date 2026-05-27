"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import ContactForm from "../components/ContactForm";

export default function ConsultaPage() {
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
      className="pt-28 sm:pt-16"
      style={{
        background:
          "linear-gradient(180deg, #eef2ff 0%, #f8fafc 40%, #ffffff 100%)",
      }}
    >
      <Navbar />

      {/* Header */}
      <div
        ref={rootRef}
        className="relative overflow-hidden mt-10"
        style={{
          background:
            "linear-gradient(135deg, #0a4f9e 0%, #005cb9 50%, #0e9fdd 100%)",
        }}
      >
        {/* Swoosh oscuro diagonal — esquina superior izquierda */}
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

        {/* Swoosh cyan claro encima */}
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

        {/* Swoosh oscuro — esquina inferior derecha */}
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

        {/* Swoosh azul corporativo — encima del oscuro inferior derecha */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          {/* Chip */}
          <div className="inline-flex items-center gap-2 bg-incolmedica-cyan/20 border border-incolmedica-cyan/40 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-widest">
              Atención al cliente
            </span>
          </div>

          {/* Breadcrumb */}
          <nav className="text-xs text-incolmedica-cyan mb-3 flex items-center gap-1.5">
            <a href="/" className="hover:text-white transition-colors">
              Inicio
            </a>
            <span>/</span>
            <span className="text-blue-100 font-medium">
              Solicitar información
            </span>
          </nav>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tight">
            <span className="block text-white">SOLICITAR</span>
            <span className="block" style={{ color: "#facc15" }}>
              INFORMACIÓN
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-blue-100 text-sm mt-3">
            Déjanos tus datos y un asesor te contactará a la brevedad.
          </p>
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

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Info lateral */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">
                ¿Cómo podemos ayudarte?
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Completa el formulario y uno de nuestros asesores especializados
                en equipos médicos se pondrá en contacto contigo para resolver
                tus inquietudes.
              </p>
            </div>

            {/* Canales de contacto */}
            <div className="space-y-4">
              {[
                {
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  ),
                  label: "Teléfono",
                  value: "+57 (601) 123-4567",
                },
                {
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  label: "Correo",
                  value: "ventas@incolmedica.com.co",
                },
                {
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ),
                  label: "Ubicación",
                  value: "Bogotá, Colombia",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-incolmedica-cyan/10 text-incolmedica-primary flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Horario */}
            <div className="bg-incolmedica-primary rounded-2xl p-5 text-white">
              <h3 className="font-bold text-sm uppercase tracking-wide text-incolmedica-cyan mb-3">
                Horario de atención
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-100">Lunes – Viernes</span>
                  <span className="font-semibold">8:00 am – 6:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Sábados</span>
                  <span className="font-semibold">9:00 am – 1:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Domingos</span>
                  <span className="text-incolmedica-cyan">Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}
