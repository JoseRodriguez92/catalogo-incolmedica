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
    description:
      'Monitor portátil con pantalla táctil de 10". Mide SpO2, NIBP, ECG, temperatura y respiración en tiempo real.',
    category: "Diagnóstico",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Ecógrafo Portátil Doppler Color",
    brand: "GE Healthcare",
    price: 18900000,
    originalPrice: 22000000,
    description:
      "Ultrasonido portátil con Doppler color, 4 sondas incluidas, almacenamiento en la nube y conectividad DICOM.",
    category: "Diagnóstico",
    isNew: true,
  },
  {
    id: 3,
    name: "Desfibrilador Bifásico Automático DEA",
    brand: "Philips",
    price: 8200000,
    description:
      "Desfibrilador externo automático con guía de voz, ECG integrado y batería de larga duración. Incluye maletín.",
    category: "Equipos Médicos",
    isFeatured: true,
  },
  {
    id: 4,
    name: "Centrifugadora de Mesa Digital",
    brand: "Hettich",
    price: 3100000,
    originalPrice: 3800000,
    description:
      "Centrifugadora para laboratorio con velocidad ajustable 200–6.000 RPM, 24 posiciones y display digital.",
    category: "Laboratorio",
  },
  {
    id: 5,
    name: "Oxímetro de Pulso Portátil",
    brand: "Nonin",
    price: 280000,
    originalPrice: 350000,
    description:
      "Oxímetro de dedo con lectura de SpO2 y frecuencia cardíaca, pantalla OLED, alarma audible y visual.",
    category: "Diagnóstico",
    isNew: true,
  },
  {
    id: 6,
    name: "Camilla Eléctrica Multifuncional",
    brand: "Dixion",
    price: 6700000,
    description:
      "Camilla hospitalaria eléctrica de 3 secciones, barandas abatibles, ruedas con freno y capacidad 250 kg.",
    category: "Equipos Médicos",
  },
  {
    id: 7,
    name: "Autoclave Vertical 50L",
    brand: "Tuttnauer",
    price: 5400000,
    originalPrice: 6200000,
    description:
      "Esterilizador a vapor de 50 litros, ciclos preprogramados, impresora integrada y doble cámara de seguridad.",
    category: "Equipos Médicos",
  },
  {
    id: 8,
    name: "Microscopio Binocular Laboratorio",
    brand: "Olympus",
    price: 4900000,
    originalPrice: 5500000,
    description:
      "Microscopio óptico binocular con aumentos 40X–1000X, iluminación LED koehler y cabezal inclinable 30°.",
    category: "Laboratorio",
    isNew: true,
  },
];

export default function CatalogPage() {
  return (
    <div
      className="pt-28 sm:pt-16"
      style={{
        background:
          "linear-gradient(180deg, #eef2ff 0%, #f8fafc 40%, #ffffff 100%)",
      }}
    >
      <Navbar />

      <PlpHeader total={MOCK_PRODUCTS.length} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <FiltersSidebar />

          <ProductGrid products={MOCK_PRODUCTS} />
        </div>
      </main>
    </div>
  );
}
