import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';

export function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        // Check if we have the necessary parameters
        if (!params.get('access_token') && !params.get('refresh_token')) {
          setStatus('error');
          setErrorMessage('No se encontró un token de confirmación válido.');
          return;
        }

        // The Supabase client will automatically handle the token exchange
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }

        setStatus('success');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate({ to: '/login', search: { message: 'email-confirmation-success' } });
        }, 5000);
      } catch (err) {
        setStatus('error');
        setErrorMessage('Ocurrió un error al confirmar tu correo electrónico.');
        console.error(err);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
        <h2 className="text-3xl font-light mb-6 text-center">Confirmación de correo</h2>
        
        {status === 'loading' && (
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p>Verificando tu correo electrónico...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded mb-6">
            <p className="font-medium mb-2">¡Correo electrónico confirmado!</p>
            <p>Tu dirección de correo electrónico ha sido verificada correctamente.</p>
            <p className="mt-2 text-sm">Serás redirigido al inicio de sesión en unos segundos...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded mb-6">
            <p className="font-medium mb-2">Error de confirmación</p>
            <p>{errorMessage || 'No se pudo confirmar tu correo electrónico.'}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link search={{message: ""}} to="/login" className="text-white hover:underline">
            Ir a iniciar sesión
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
