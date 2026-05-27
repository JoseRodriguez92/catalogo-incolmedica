import Link from "next/link";

export default function Footer() {
  const CATEGORIES = [
    "Equipos Médicos",
    "Diagnóstico",
    "Laboratorio",
    "Rehabilitación",
    "Consumibles",
  ];

  return (
    <footer className="bg-incolmedica-dark text-blue-200 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <Link
            href="/"
            className="inline-block mb-3 transition-transform hover:scale-105 duration-300"
          >
            <img
              src="https://imcolmedica.com.co/wp-content/uploads/2024/10/cropped-VAR-BLANCO-ISOLOGO-IMCOL-700X200-555x159.png"
              alt="INCOLMEDICA"
              className="h-12 w-auto object-contain drop-shadow-sm"
            />
          </Link>
          <p className="mt-2 leading-relaxed text-blue-100">
            Tu proveedor de equipos médicos y de diagnóstico de confianza en
            Colombia.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contacto</h4>
          <ul className="space-y-1">
            <li>+57 (601) 123-4567</li>
            <li>ventas@incolmedica.com.co</li>
            <li>Bogotá, Colombia</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Catálogo</h4>
          <ul className="space-y-1">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <a
                  href="#"
                  className="hover:text-incolmedica-cyan transition-colors"
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-incolmedica-primary/30 text-xs text-center text-blue-100">
        © 2026 Incolmedica · Todos los derechos reservados
      </div>
    </footer>
  );
}
