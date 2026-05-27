"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["productos"]["Row"] & {
  marcas?: { nombre: string } | null;
  categorias?: string[];
};

function formatPrice(p: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(p);
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cargar productos de Supabase
  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("productos")
        .select(
          `
          *,
          marcas (
            nombre
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando productos:", error);
        setLoading(false);
        return;
      }

      // Transformar los datos para incluir categorías
      // TODO: Implementar query para categorías cuando sea necesario
      const productsWithCategories = (data || []).map((p: any) => ({
        ...p,
        categorias: [], // Temporal, necesitarás hacer join con productos_categorias
      }));

      setProducts(productsWithCategories);
      setLoading(false);
    }

    loadProducts();
  }, []);

  // Animación de entrada con GSAP
  useEffect(() => {
    if (isModalOpen && overlayRef.current && modalRef.current) {
      // Animación del overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );

      // Animación del modal con efecto elástico
      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.4)",
        },
      );

      // Animación escalonada de los campos del formulario
      const formFields = modalRef.current.querySelectorAll(".form-field");
      gsap.fromTo(
        formFields,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    }
  }, [isModalOpen]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      sku: "",
      nombre: "",
      descripcion: "",
      marca_id: null,
      precio: 0,
      precio_iva: 0,
      referencia: "",
      imagen_principal: "",
      activo: true,
      nuevo: false,
      destacado: false,
      stock: 0,
      stock_minimo: 0,
      unidad_venta: "unidad",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (overlayRef.current && modalRef.current) {
      // Animación de salida
      gsap.to(modalRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData({});
        },
      });
    } else {
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({});
    }
  };

  const handleSave = () => {
    if (editingProduct) {
      // Editar producto existente
      console.log("Editando producto:", formData);
    } else {
      // Crear nuevo producto
      console.log("Creando nuevo producto:", formData);
    }
    handleCloseModal();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "precio" ||
        name === "precio_iva" ||
        name === "stock" ||
        name === "stock_minimo"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-800">
            Catálogo de Productos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? "Cargando..."
              : `${products.length} productos registrados`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-200 w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo producto
        </button>
      </div>

      {/* Filtros rapidos */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <div className="relative flex-1 sm:min-w-50">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-initial">
          <option>Todas las categorías</option>
          <option>Equipos Médicos</option>
          <option>Diagnóstico</option>
          <option>Laboratorio</option>
        </select>
        <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-initial">
          <option>Todos los estados</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>

      {/* Vista de tabla para desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  SKU
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Producto
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Marca
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Categoría
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden xl:table-cell">
                  Precio
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-500">
                        Cargando productos...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-sm text-gray-500">
                      No hay productos registrados
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {p.sku}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                          {p.imagen_principal ? (
                            <img
                              src={p.imagen_principal}
                              alt={p.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-5 h-5 text-blue-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate max-w-50">
                            {p.nombre}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-gray-700 font-medium">
                        {p.marcas?.nombre || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.categorias && p.categorias.length > 0 ? (
                          p.categorias.map((cat, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                            >
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">
                            Sin categoría
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-semibold hidden xl:table-cell">
                      {formatPrice(p.precio)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${p.activo ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
                          title="Eliminar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Mostrando {products.length} de {products.length} productos
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                  n === 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vista de cards para mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Cargando productos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500">
              No hay productos registrados
            </p>
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {p.imagen_principal ? (
                      <img
                        src={p.imagen_principal}
                        alt={p.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-6 h-6 text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                      {p.nombre}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {p.sku}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    p.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${p.activo ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  {p.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Marca:</span>
                  <span className="font-medium text-gray-700">
                    {p.marcas?.nombre || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Precio:</span>
                  <span className="font-bold text-gray-800">
                    {formatPrice(p.precio)}
                  </span>
                </div>
                {p.categorias && p.categorias.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-500 shrink-0">Categorías:</span>
                    <div className="flex flex-wrap gap-1">
                      {p.categorias.map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar
                </button>
                <button className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de edición */}
      {isModalOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-black text-gray-800">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* SKU */}
              <div className="form-field">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="Ej: MSV-MIN-001"
                />
              </div>

              {/* Nombre del producto */}
              <div className="form-field">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese el nombre del producto"
                />
              </div>

              {/* Descripción */}
              <div className="form-field">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={handleInputChange as any}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción detallada del producto"
                />
              </div>

              {/* Marca */}
              <div className="form-field">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  name="marca"
                  placeholder="Marca del producto (proximamente select)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>

              {/* Imagen Principal */}
              <div className="form-field">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Imagen Principal (URL)
                </label>
                <input
                  type="url"
                  name="imagen_principal"
                  value={formData.imagen_principal || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.imagen_principal && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                    <img
                      src={formData.imagen_principal}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Referencia y Stock en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 form-field">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Referencia
                  </label>
                  <input
                    type="text"
                    name="referencia"
                    value={formData.referencia || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="REF-2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Stock Disponible
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Categoría y Precio en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 form-field">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Precio (COP)
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Precio con IVA
                  </label>
                  <input
                    type="number"
                    name="precio_iva"
                    value={formData.precio_iva || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Estado y checkboxes */}
              <div className="form-field">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Opciones
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          activo: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Activo
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="nuevo"
                      checked={formData.nuevo || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nuevo: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Nuevo
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="destacado"
                      checked={formData.destacado || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          destacado: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Destacado
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-200"
              >
                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
