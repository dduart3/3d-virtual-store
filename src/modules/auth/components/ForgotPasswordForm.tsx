import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../../../shared/utils/validations';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword, isResettingPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate email
    if (!isValidEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    resetPassword(email, {
      onSuccess: () => {
        setSuccess(true);
        setEmail('');
      },
      onError: (error: any) => {
        setError(error.message || 'Error al enviar el correo de recuperación');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded">
          Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isResettingPassword}
        className="w-full py-3 bg-white text-black font-medium rounded hover:bg-opacity-90 transition-colors disabled:opacity-70"
      >
        {isResettingPassword ? 'Enviando...' : 'Enviar correo de recuperación'}
      </button>
    </form>
  );
}
