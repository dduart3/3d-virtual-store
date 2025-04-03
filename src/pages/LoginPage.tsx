import { Link, useSearch } from "@tanstack/react-router";
import { LoginForm } from "../modules/auth/components/LoginForm";

export function LoginPage() {
  const search = useSearch({ from: "/login"});
  const message = search.message as string | undefined;

  return (
    <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
        <h2 className="text-3xl font-light mb-6 text-center">Iniciar sesión</h2>
        {message === "registration-success" && (
          <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-500 text-green-200">
            Registro exitoso! Por favor inicia sesión con tu cuenta.
          </div>
        )}
        {message === "password-reset-success" && (
          <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-500 text-green-200">
            Tu contraseña ha sido actualizada correctamente. Por favor inicia
            sesión con tu nueva contraseña.
          </div>
        )}
        {message === "email-confirmation-success" && (
          <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-500 text-green-200">
            ¡Tu correo electrónico ha sido confirmado! Ahora puedes iniciar
            sesión.
          </div>
        )}

        {message === "registration-email-confirmation" && (
          <div className="mb-4 p-3 rounded bg-blue-500/20 border border-blue-500 text-blue-200">
            Registro exitoso! Te hemos enviado un correo electrónico de
            confirmación. Por favor, verifica tu bandeja de entrada y sigue las
            instrucciones para activar tu cuenta.
          </div>
        )}
        <LoginForm />
        <p className="mt-6 text-center text-gray-400">
          No tienes una cuenta?{" "}
          <Link to="/register" className="text-white hover:underline">
            Registrarse
          </Link>
        </p>
        <p className="mt-2 text-center text-gray-400">
          <Link to="/forgot-password" className="text-white hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link to="/" className="text-gray-400 hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
