"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Database } from "@/types/database.types";
import { MAP_STYLE } from "../constants";
import { InfoRow } from "../shared";

type Institucion = Database["public"]["Tables"]["instituciones"]["Row"];

export function InfoAndMapSection({
  institucion,
}: {
  institucion: Institucion;
}) {
  const hasCoords =
    institucion.latitude != null && institucion.longitude != null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Info cards */}
      <div className="flex flex-col gap-4">
        <InfoRow
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          label="Correo de contacto"
          value={institucion.correo_contacto || "—"}
        />
        <InfoRow
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          label="Teléfono"
          value={institucion.telefono || "—"}
        />
        <InfoRow
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          label="Ubicación"
          value={institucion.ubicacion || "—"}
        />
        <InfoRow
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          }
          label="Coordenadas"
          value={
            hasCoords
              ? `${institucion.latitude}, ${institucion.longitude}`
              : "—"
          }
        />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Descripción
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {institucion.descripcion || "Sin descripción."}
          </p>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[320px] lg:min-h-0">
        {hasCoords ? (
          <Map
            initialViewState={{
              longitude: institucion.longitude!,
              latitude: institucion.latitude!,
              zoom: 14,
            }}
            style={{ width: "100%", height: "100%", minHeight: 320 }}
            mapStyle={MAP_STYLE}
            attributionControl={false}
          >
            <Marker
              longitude={institucion.longitude!}
              latitude={institucion.latitude!}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-incolmedica-primary border-4 border-white shadow-lg shadow-blue-300/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="w-2 h-2 bg-incolmedica-primary rounded-full mt-0.5 shadow" />
              </div>
            </Marker>

            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-incolmedica-dark">
                {institucion.nombre}
              </p>
              {institucion.ubicacion && (
                <p className="text-xs text-gray-500">{institucion.ubicacion}</p>
              )}
            </div>
          </Map>
        ) : (
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center gap-3 text-gray-400">
            <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-sm font-medium">Sin coordenadas</p>
            <p className="text-xs text-center px-8">
              Agrega latitud y longitud en "Editar información" para ver el mapa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
