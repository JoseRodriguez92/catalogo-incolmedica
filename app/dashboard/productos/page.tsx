"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import { useCategoriasStore } from "@/lib/store/categorias-store";
import { useMarcasStore } from "@/lib/store/marcas-store";
import { getCategorias } from "@/app/dashboard/categorias/actions";
import { getMarcas } from "@/app/dashboard/marcas/actions";
import {
  getProductos,
  getProductoImagenes,
  getProductoCategorias,
  createProducto,
  updateProducto,
} from "./actions";

type Product = Database["public"]["Tables"]["productos"]["Row"] & {
  marcas?: { nombre: string } | null;
};

type GalleryItem = {
  tempId: string;
  url: string;
  file?: File;
  isVideo: boolean;
};

const INST_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm|ogg|avi)(\?|$)/i.test(url);
}

function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

function formatPrice(p: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(p);
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-incolmedica-primary";

export default function ProductosPage() {
  const [products,       setProducts]       = useState<Product[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData,       setFormData]       = useState<Partial<Product>>({});
  const [gallery,             setGallery]             = useState<GalleryItem[]>([]);
  const [selectedCategorias,  setSelectedCategorias]  = useState<string[]>([]);
  const [uploading,      setUploading]      = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [loadingMedia,   setLoadingMedia]   = useState(false);

  const overlayRef  = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtros
  const [filterSearch,    setFilterSearch]    = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterMarca,     setFilterMarca]     = useState("");

  // Stores
  const { categorias, loading: catLoading, loaded: catLoaded, setCategorias, setLoading: setCatLoading } = useCategoriasStore();
  const { marcas,     loading: marcaLoading, loaded: marcaLoaded, setMarcas, setLoading: setMarcaLoading } = useMarcasStore();

  const loadCatalogos = useCallback(async () => {
    if (!catLoaded) {
      setCatLoading(true);
      const { data } = await getCategorias();
      setCategorias(data ?? []);
      setCatLoading(false);
    }
    if (!marcaLoaded) {
      setMarcaLoading(true);
      const { data } = await getMarcas();
      setMarcas(data ?? []);
      setMarcaLoading(false);
    }
  }, [catLoaded, marcaLoaded, setCategorias, setCatLoading, setMarcas, setMarcaLoading]);

  useEffect(() => { loadCatalogos(); }, [loadCatalogos]);

  // Cargar productos
  useEffect(() => {
    getProductos().then(({ data }) => {
      setProducts(data as Product[]);
      setLoading(false);
    });
  }, []);

  // Animación modal
  useEffect(() => {
    if (isModalOpen && overlayRef.current && modalRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" },
      );
    }
  }, [isModalOpen]);

  const emptyForm: Partial<Product> = {
    sku: "", nombre: "", descripcion: "", marca_id: null,
    precio: 0, precio_iva: 0, referencia: "", imagen_principal: "",
    activo: true, nuevo: false, destacado: false,
    stock: 0, stock_minimo: 0, unidad_venta: "unidad",
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setGallery([]);
    setSelectedCategorias([]);
    setIsModalOpen(true);
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setGallery([]);
    setSelectedCategorias([]);
    setLoadingMedia(true);
    setIsModalOpen(true);

    // Cargar imágenes y categorías vía server actions (bypassan RLS)
    const [{ data: imgs }, { categoriaIds }] = await Promise.all([
      getProductoImagenes(product.id),
      getProductoCategorias(product.id),
    ]);

    // Si no hay registros en productos_imagenes pero el producto tiene
    // imagen_principal, la mostramos como primer item de la galería.
    const galleryItems = imgs.length > 0
      ? imgs.map((img) => ({ tempId: img.id, url: img.url, isVideo: isVideoUrl(img.url) }))
      : product.imagen_principal
        ? [{ tempId: "principal", url: product.imagen_principal, isVideo: isVideoUrl(product.imagen_principal) }]
        : [];

    setGallery(galleryItems);
    setSelectedCategorias(categoriaIds);
    setLoadingMedia(false);
  };

  const closeModal = () => {
    if (!overlayRef.current || !modalRef.current) { setIsModalOpen(false); return; }
    gsap.to(modalRef.current,  { opacity: 0, y: -20, scale: 0.95, duration: 0.25, ease: "power2.in" });
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.25, ease: "power2.in",
      onComplete: () => { setIsModalOpen(false); setEditingProduct(null); setFormData({}); setGallery([]); setSelectedCategorias([]); },
    });
  };

  // Agregar archivos a la galería (preview local)
  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const items: GalleryItem[] = Array.from(files).map((file) => ({
      tempId: `${Date.now()}_${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      isVideo: isVideoFile(file),
    }));
    setGallery((prev) => [...prev, ...items]);
  };

  const removeGalleryItem = (tempId: string) => {
    setGallery((prev) => {
      const item = prev.find((i) => i.tempId === tempId);
      if (item?.file) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.tempId !== tempId);
    });
  };

  // Drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    // 1. Subir archivos nuevos
    setUploading(true);
    const uploadedItems: GalleryItem[] = [];
    for (const item of gallery) {
      if (!item.file) {
        uploadedItems.push(item);
        continue;
      }
      const ext  = item.file.name.split(".").pop();
      const path = `${INST_ID}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("productos")
        .upload(path, item.file, { contentType: item.file.type, upsert: false });
      if (error) { console.error("Upload error:", error); continue; }
      const { data: { publicUrl } } = supabase.storage.from("productos").getPublicUrl(data.path);
      URL.revokeObjectURL(item.url);
      uploadedItems.push({ ...item, url: publicUrl, file: undefined });
    }
    setUploading(false);

    // 2. Imagen principal = primer item de la galería
    const principalUrl = uploadedItems[0]?.url ?? formData.imagen_principal ?? null;
    const imagenesPayload = uploadedItems.map((item, idx) => ({ url: item.url, orden: idx }));

    // 3. Guardar producto vía server action (bypassan RLS)
    if (editingProduct) {
      await updateProducto(
        editingProduct.id,
        { ...formData, imagen_principal: principalUrl } as any,
        imagenesPayload,
        selectedCategorias,
      );
    } else {
      await createProducto(
        { ...formData, imagen_principal: principalUrl } as any,
        imagenesPayload,
        selectedCategorias,
      );
    }

    setSaving(false);
    closeModal();

    // Recargar lista vía server action
    const { data } = await getProductos();
    setProducts(data as Product[]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["precio", "precio_iva", "stock", "stock_minimo"].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  // Filtrar productos
  const filtered = products.filter((p) => {
    const matchSearch = !filterSearch || p.nombre.toLowerCase().includes(filterSearch.toLowerCase()) || (p.sku ?? "").toLowerCase().includes(filterSearch.toLowerCase());
    const matchMarca  = !filterMarca  || p.marca_id === filterMarca;
    return matchSearch && matchMarca;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Catálogo de Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? "Cargando..." : `${products.length} productos registrados`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-incolmedica-primary hover:bg-incolmedica-blue text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-200 w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo producto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Búsqueda */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Buscar por nombre o SKU…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-incolmedica-primary focus:bg-white transition-colors"
            />
          </div>

          {/* Separador vertical */}
          <div className="hidden sm:block w-px bg-gray-100 self-stretch" />

          {/* Categoría */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <select
              value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)}
              className={`pl-8 pr-8 py-2 rounded-xl border text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-incolmedica-primary transition-colors ${
                filterCategoria ? "border-incolmedica-primary bg-incolmedica-primary/5 text-incolmedica-primary font-semibold" : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              <option value="">Categoría</option>
              {categorias.filter((c) => c.activo).map((c) => (
                <option key={c.id} value={c.id}>{c.parent_id ? "└ " : ""}{c.nombre}</option>
              ))}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Marca */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <select
              value={filterMarca} onChange={(e) => setFilterMarca(e.target.value)}
              className={`pl-8 pr-8 py-2 rounded-xl border text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-incolmedica-primary transition-colors ${
                filterMarca ? "border-incolmedica-primary bg-incolmedica-primary/5 text-incolmedica-primary font-semibold" : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              <option value="">Marca</option>
              {marcas.filter((m) => m.activo).map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Limpiar filtros */}
          {(filterSearch || filterCategoria || filterMarca) && (
            <button
              onClick={() => { setFilterSearch(""); setFilterCategoria(""); setFilterMarca(""); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar
            </button>
          )}
        </div>

        {/* Resultados activos */}
        {(filterSearch || filterCategoria || filterMarca) && (
          <p className="text-xs text-gray-400 mt-2.5 pt-2.5 border-t border-gray-100">
            <span className="font-semibold text-gray-600">{filtered.length}</span> resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Tabla */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Marca</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Precio</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-7 h-7 border-4 border-incolmedica-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-400">Cargando productos...</p>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-400">
                  {products.length === 0 ? "No hay productos registrados" : "Sin resultados para esa búsqueda"}
                </td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.sku}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {p.imagen_principal ? (
                          <img src={p.imagen_principal} alt={p.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800 truncate max-w-48">{p.nombre}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-600 font-medium">{p.marcas?.nombre || "—"}</td>
                  <td className="px-5 py-4 hidden xl:table-cell text-gray-700 font-semibold">{formatPrice(p.precio)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? "bg-green-500" : "bg-gray-400"}`} />
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-7 h-7 border-4 border-incolmedica-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {p.imagen_principal ? (
                    <img src={p.imagen_principal} alt={p.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 truncate">{p.nombre}</p>
                  <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {p.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => handleEdit(p)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div ref={overlayRef} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-6">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">
                {editingProduct ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body — 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

              {/* ── Columna izquierda: datos ── */}
              <div className="lg:col-span-3 p-6 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Información general</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">SKU *</label>
                    <input type="text" name="sku" value={formData.sku || ""} onChange={handleInputChange} className={inputCls} placeholder="MSV-001" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Referencia</label>
                    <input type="text" name="referencia" value={formData.referencia || ""} onChange={handleInputChange} className={inputCls} placeholder="REF-2024" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre || ""} onChange={handleInputChange} className={inputCls} placeholder="Nombre del producto" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Descripción</label>
                  <textarea name="descripcion" value={formData.descripcion || ""} onChange={handleInputChange} rows={3}
                    className={`${inputCls} resize-none`} placeholder="Descripción detallada..." />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Marca</label>
                  <select name="marca_id" value={formData.marca_id || ""} onChange={handleInputChange} disabled={marcaLoading} className={`${inputCls} disabled:text-gray-300`}>
                    <option value="">{marcaLoading ? "Cargando marcas…" : "Sin marca"}</option>
                    {marcas.filter((m) => m.activo).map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Categorías */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Categorías
                    {selectedCategorias.length > 0 && (
                      <span className="ml-2 normal-case font-normal text-incolmedica-primary">
                        {selectedCategorias.length} seleccionada{selectedCategorias.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-gray-200 bg-white min-h-10">
                    {catLoading ? (
                      <span className="text-xs text-gray-300 self-center flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin inline-block" />
                        Cargando categorías…
                      </span>
                    ) : categorias.filter((c) => c.activo).length === 0 ? (
                      <span className="text-xs text-gray-300 self-center">Sin categorías disponibles</span>
                    ) : categorias.filter((c) => c.activo).map((c) => {
                      const selected = selectedCategorias.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() =>
                            setSelectedCategorias((prev) =>
                              selected ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                            )
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                            selected
                              ? "bg-incolmedica-primary text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          } ${c.parent_id ? "opacity-80" : ""}`}
                        >
                          {c.parent_id ? "└ " : ""}{c.nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Precio (COP) *</label>
                    <input type="number" name="precio" value={formData.precio || ""} onChange={handleInputChange} className={inputCls} placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Precio con IVA</label>
                    <input type="number" name="precio_iva" value={formData.precio_iva || ""} onChange={handleInputChange} className={inputCls} placeholder="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Stock</label>
                    <input type="number" name="stock" value={formData.stock || ""} onChange={handleInputChange} className={inputCls} placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Stock mínimo</label>
                    <input type="number" name="stock_minimo" value={formData.stock_minimo || ""} onChange={handleInputChange} className={inputCls} placeholder="0" />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6 pt-1">
                  {(["activo", "nuevo", "destacado"] as const).map((key) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!(formData as any)[key]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4 rounded text-incolmedica-primary accent-incolmedica-primary" />
                      <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Columna derecha: galería ── */}
              <div className="lg:col-span-2 p-6 flex flex-col gap-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Galería</p>
                <p className="text-xs text-gray-400 -mt-2">La primera imagen será la principal.</p>

                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-incolmedica-primary rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-incolmedica-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 group-hover:text-incolmedica-primary text-center transition-colors">
                    Arrastra archivos aquí<br />
                    <span className="font-normal text-gray-400">o haz clic para seleccionar</span>
                  </p>
                  <p className="text-xs text-gray-300">Imágenes y videos</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                </div>

                {/* Grid galería */}
                {gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map((item, idx) => (
                      <div key={item.tempId} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        {item.isVideo ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-900">
                            <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span className="text-xs text-white/40">video</span>
                          </div>
                        ) : (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        )}

                        {/* Badge principal */}
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-incolmedica-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-tight">
                            Principal
                          </span>
                        )}

                        {/* Botón eliminar */}
                        <button
                          onClick={() => removeGalleryItem(item.tempId)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {gallery.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    {loadingMedia ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="w-5 h-5 border-2 border-gray-200 border-t-incolmedica-primary rounded-full animate-spin" />
                        <p className="text-xs text-gray-300">Cargando archivos…</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300 text-center">Sin archivos añadidos</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-incolmedica-primary hover:bg-incolmedica-blue text-white shadow-lg shadow-blue-200 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {(saving || uploading) && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {saving || uploading
                  ? (uploading ? "Subiendo archivos..." : "Guardando...")
                  : editingProduct ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
