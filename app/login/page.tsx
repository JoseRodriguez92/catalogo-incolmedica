import LoginBranding from "../components/LoginBranding";
import LoginForm from "../components/LoginForm";
import LoginLogo from "../components/LoginLogo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LoginBranding />

      {/* Panel formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-slate-50">
        <div className="w-full max-w-md flex flex-col items-center">
          <LoginLogo />
          <div className="mb-8">
            <p className="text-gray-500 text-sm mt-1">
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Incolmedica · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
