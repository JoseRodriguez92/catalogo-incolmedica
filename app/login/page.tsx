import LoginBranding from "../components/LoginBranding";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      <LoginBranding />

      {/* Panel formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-800">Iniciar sesión</h1>
            <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para continuar.</p>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 Incolmedica · Todos los derechos reservados
          </p>
        </div>
      </div>

    </div>
  );
}
