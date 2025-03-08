import { Link } from '@tanstack/react-router'
import { RegisterForm } from '../modules/auth/components/RegisterForm'

export function RegisterPage() {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
        <h2 className="text-3xl font-light mb-6 text-center">Crear cuenta</h2>
        <RegisterForm />
        
        <p className="mt-6 text-center text-gray-400">
          Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-white hover:underline">
            Iniciar sesión
          </Link>
        </p>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link to="/" className="text-gray-400 hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
