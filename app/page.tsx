import Navbar from "./components/Navbar";
import PlpHeader from "./components/PlpHeader";
import ProductGrid from "./components/ProductGrid";
import FiltersSidebar from "./components/FiltersSidebar";
import { type Product } from "./components/ProductCard";

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Monitor de Signos Vitales Multiparamétrico",
    brand: "Mindray",
    price: 4500000,
    originalPrice: 5800000,
    description: "Monitor portátil con pantalla táctil de 10\". Mide SpO2, NIBP, ECG, temperatura y respiración en tiempo real.",
    category: "Diagnóstico",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Ecógrafo Portátil Doppler Color",
    brand: "GE Healthcare",
    price: 18900000,
    originalPrice: 22000000,
    description: "Ultrasonido portátil con Doppler color, 4 sondas incluidas, almacenamiento en la nube y conectividad DICOM.",
    category: "Diagnóstico",
    isNew: true,
  },
  {
    id: 3,
    name: "Desfibrilador Bifásico Automático DEA",
    brand: "Philips",
    price: 8200000,
    description: "Desfibrilador externo automático con guía de voz, ECG integrado y batería de larga duración. Incluye maletín.",
    category: "Equipos Médicos",
    isFeatured: true,
  },
  {
    id: 4,
    name: "Centrifugadora de Mesa Digital",
    brand: "Hettich",
    price: 3100000,
    originalPrice: 3800000,
    description: "Centrifugadora para laboratorio con velocidad ajustable 200–6.000 RPM, 24 posiciones y display digital.",
    category: "Laboratorio",
  },
  {
    id: 5,
    name: "Oxímetro de Pulso Portátil",
    brand: "Nonin",
    price: 280000,
    originalPrice: 350000,
    description: "Oxímetro de dedo con lectura de SpO2 y frecuencia cardíaca, pantalla OLED, alarma audible y visual.",
    category: "Diagnóstico",
    isNew: true,
  },
  {
    id: 6,
    name: "Camilla Eléctrica Multifuncional",
    brand: "Dixion",
    price: 6700000,
    description: "Camilla hospitalaria eléctrica de 3 secciones, barandas abatibles, ruedas con freno y capacidad 250 kg.",
    category: "Equipos Médicos",
  },
  {
    id: 7,
    name: "Autoclave Vertical 50L",
    brand: "Tuttnauer",
    price: 5400000,
    originalPrice: 6200000,
    description: "Esterilizador a vapor de 50 litros, ciclos preprogramados, impresora integrada y doble cámara de seguridad.",
    category: "Equipos Médicos",
  },
  {
    id: 8,
    name: "Microscopio Binocular Laboratorio",
    brand: "Olympus",
    price: 4900000,
    originalPrice: 5500000,
    description: "Microscopio óptico binocular con aumentos 40X–1000X, iluminación LED koehler y cabezal inclinable 30°.",
    category: "Laboratorio",
    isNew: true,
  },
];

const CATEGORIES = ["Todos", "Equipos Médicos", "Diagnóstico", "Laboratorio", "Rehabilitación", "Consumibles"];

export default function CatalogPage() {
  return (
    <div className="min-h-screen pt-[112px] sm:pt-[64px]" style={{
      background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 40%, #ffffff 100%)"
    }}>
      <Navbar />

      <PlpHeader total={MOCK_PRODUCTS.length} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <FiltersSidebar />

          <ProductGrid products={MOCK_PRODUCTS} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <span className="text-white font-black text-lg">INCOLMEDICA</span>
            <p className="mt-2 leading-relaxed">Tu proveedor de equipos médicos y de diagnóstico de confianza en Colombia.</p>
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
              {CATEGORIES.slice(1).map((cat) => (
                <li key={cat}><a href="#" className="hover:text-white transition-colors">{cat}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-700 text-xs text-center">
          © 2025 Incolmedica · Todos los derechos reservados
        </div>
      </footer>

      {/* WhatsApp flotante */}
      <a
        href="https://wa.me/576011234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20b958] text-white font-bold text-sm px-4 py-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 group"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        <span className="hidden sm:inline">¿Hablamos?</span>
      </a>
    </div>
  );
}
