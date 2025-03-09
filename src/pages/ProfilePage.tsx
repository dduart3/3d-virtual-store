import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '../modules/auth/hooks/useAuth'
import { supabase } from '../lib/supabase'
import { useRouteHistory } from '../shared/hooks/useRouteHistory'

export function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)


  const navigate = useNavigate();
  const { previousRoute } = useRouteHistory();
  
  const handleGoBack = () => {
    if (previousRoute?.includes('/store')) {
      navigate({ to: '/store' });
    } else {
      navigate({ to: '/' });
    }
  };




  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user?.id)

      if (error) throw error
      
      setSuccess('Profile updated successfully')
    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Perfil</h1>
            {/* Replace Link with button that uses the dynamic navigation */}
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
            >
              Volver
            </button>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-500 text-green-200">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Correo
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded text-white/70 cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-white/50">El correo no puede ser cambiado</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1" htmlFor="username">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
                />
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-white text-black rounded font-medium hover:bg-white/90 transition-colors disabled:opacity-70"
              >
                {saving ? 'Guardando cambios...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}
