import { Link } from '@tanstack/react-router';
import { ResetPasswordForm } from '../modules/auth/components/ResetPasswordForm';
import { useEffect, useState } from 'react';
import { useAuth } from '../modules/auth/hooks/useAuth';

export function ResetPasswordPage() {
  const { session } = useAuth();
  const [isValidReset, setIsValidReset] = useState(false);
  
  // Check if the user is authenticated via a reset password flow
  useEffect(() => {
    // Supabase automatically handles the reset token in the URL
    // and creates a session with a special type
    if (session) {
      setIsValidReset(true);
    }
  }, [session]);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
        <h2 className="text-3xl font-light mb-6 text-center">Restablecer contraseña</h2>
        
        {isValidReset ? (
          <>
            <p className="mb-6 text-gray-400 text-center">
              Crea una nueva contraseña para tu cuenta.
            </p>
            
            <ResetPasswordForm />
          </>
        ) : (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-4 rounded">
            <p className="mb-2 font-medium">Enlace inválido o expirado</p>
            <p className="text-sm">
              Este enlace de restablecimiento de contraseña no es válido o ha expirado. 
              Por favor, solicita un nuevo enlace de restablecimiento.
            </p>
            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-white hover:underline">
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link to="/" className="text-gray-400 hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
