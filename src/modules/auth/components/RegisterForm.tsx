import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    
    setLoading(true)
    
    try {
      const { error } = await signUp(email, password, { username })
      
      if (error) {
        throw error
      }
      
      // Show success message and redirect to login
      navigate({ to: '/login', search: { message: 'registration-success' } })
    } catch (error: any) {
      setError(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
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
          Password
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
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-white text-black font-medium rounded hover:bg-opacity-90 transition-colors disabled:opacity-70"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
