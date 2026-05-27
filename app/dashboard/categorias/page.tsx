export default function CategoriasPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800">
          Gestión de Categorías
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Administra las categorías de productos del catálogo
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-600">
            Módulo de Categorías
          </p>
          <p className="text-sm mt-2">
            Esta sección estará disponible próximamente
          </p>
        </div>
      </div>
    </div>
  );
}
