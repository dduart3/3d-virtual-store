import { Link } from '@tanstack/react-router';
import { ForgotPasswordForm } from '../modules/auth/components/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
        <h2 className="text-3xl font-light mb-6 text-center">Recuperar contraseña</h2>
        
        <p className="mb-6 text-gray-400 text-center">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        
        <ForgotPasswordForm />
        
        <div className="mt-6 text-center text-gray-400">
          <Link search={{message:""}} to="/login" className="text-white hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link to="/" className="text-gray-400 hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
