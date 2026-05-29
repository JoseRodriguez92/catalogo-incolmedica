"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isLogin = pathname?.startsWith("/login");

  if (isDashboard || isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
