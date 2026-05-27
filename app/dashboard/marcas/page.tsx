export default function MarcasPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800">Gestión de Marcas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administra las marcas de equipos médicos del catálogo
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-600">
            Módulo de Marcas
          </p>
          <p className="text-sm mt-2">
            Esta sección estará disponible próximamente
          </p>
        </div>
      </div>
    </div>
  );
}
