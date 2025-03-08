import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { signIn, isSigningIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    signIn(
      { email, password },
      {
        onSuccess: () => {
          navigate({ to: '/store' })
        },
        onError: (error: any) => {
          if(error.message == "Invalid login credentials"){
            setError("Correo o contraseña incorrectos.");
            return
          }
          setError(error.message || 'Falló el inicio de sesión.')
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Correo
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
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
          required
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
            Recuérdame
          </label>
        </div>
        
        <div className="text-sm">
          <a href="#" className="text-white hover:underline">
            Olvidaste tu contraseña?
          </a>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSigningIn}
        className="w-full py-3 bg-white text-black font-medium rounded hover:bg-opacity-90 transition-colors disabled:opacity-70"
      >
        {isSigningIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
