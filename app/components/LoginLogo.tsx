"use client";

import { useEffect } from "react";
import { useInstitucionStore, selectLogoClaro } from "@/lib/store/instituciones-store";
import { getLogos } from "@/app/dashboard/companias/actions";
import { INSTITUCION_ID } from "@/app/dashboard/companias/constants";

export default function LoginLogo() {
  const { logos, setLogos } = useInstitucionStore();
  const logoUrl = useInstitucionStore(selectLogoClaro);

  useEffect(() => {
    if (logos.length > 0) return;
    getLogos(INSTITUCION_ID).then(({ data }) => {
      if (data) setLogos(data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!logoUrl) return null;

  return (
    <img
      src={logoUrl}
      alt="Logo"
      className="h-25 object-contain object-left mb-6"
    />
  );
}
