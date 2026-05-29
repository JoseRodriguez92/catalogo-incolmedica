"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useInstitucionStore } from "@/lib/store/instituciones-store";
import { getLogos } from "@/app/dashboard/companias/actions";
import { INSTITUCION_ID } from "@/app/dashboard/companias/constants";

export default function LoginBranding() {
  const desktopRef = useRef<HTMLDivElement>(null);

  const { logos, setLogos } = useInstitucionStore();

  // 1. Si ya hay logos en el store (sessionStorage) los usa directo
  // 2. Si no, hace fetch solo de logos
  // 3. Guarda en el store
  useEffect(() => {
    if (logos.length > 0) return;
    getLogos(INSTITUCION_ID).then(({ data }) => {
      if (data) setLogos(data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Desktop panel ── */
      const dtl = gsap.timeline({ defaults: { ease: "power3.out" } });

      dtl
        .fromTo(
          ".lb-swoosh",
          { x: -140, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, stagger: 0.15 },
          0,
        )
        .fromTo(
          ".lb-logo",
          { y: -24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.3,
        )
        .fromTo(
          ".lb-chip",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          0.55,
        )
        .fromTo(
          ".lb-title .lb-line",
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.12 },
          0.65,
        )
        .fromTo(
          ".lb-desc",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.95,
        );

    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Desktop branding panel ── */}
      <div
        ref={desktopRef}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col p-12"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
        }}
      >
        <svg
          className="lb-swoosh absolute -top-10 -left-10 w-80 h-60 opacity-40"
          viewBox="0 0 320 240"
          aria-hidden
        >
          <path
            d="M0 0 L220 0 Q320 0 280 120 Q240 200 80 240 L0 240 Z"
            fill="#020617"
          />
        </svg>
        <svg
          className="lb-swoosh absolute -bottom-8 -right-8 w-96 h-52 opacity-50"
          viewBox="0 0 384 208"
          aria-hidden
        >
          <path
            d="M384 208 L80 208 Q0 208 30 100 Q60 10 240 0 L384 0 Z"
            fill="#020617"
          />
        </svg>
        <svg
          className="lb-swoosh absolute bottom-0 right-0 w-72 h-36 opacity-40"
          viewBox="0 0 288 144"
          aria-hidden
        >
          <path
            d="M288 144 L100 144 Q20 144 50 72 Q80 10 220 0 L288 0 Z"
            fill="#2563eb"
          />
        </svg>
        <div
          className="absolute top-1/2 -right-20 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #06b6d4, transparent)",
          }}
        />

        {/* Content — centrado en el panel */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 text-center">
          {/* Copy */}
          <div className="space-y-5 w-full">
            <div className="lb-chip inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                Panel de administración
              </span>
            </div>

            <h2
              className="lb-title font-black leading-none overflow-hidden"
              style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
            >
              <span className="lb-line block text-white">Todo tu</span>
              <span className="lb-line block" style={{ color: "#facc15" }}>
                catálogo,
              </span>
              <span className="lb-line block text-white">bajo control.</span>
            </h2>

            <p className="lb-desc text-blue-200/75 text-base leading-relaxed max-w-sm mx-auto">
              Gestiona logos, horarios e información de tu institución desde un
              solo lugar.
            </p>
          </div>
        </div>
      </div>

    </>
  );
}
