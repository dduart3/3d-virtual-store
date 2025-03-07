import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) return null

  return (
    <div className="absolute top-5 right-5 z-10 pointer-events-auto" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-black/80 transition-colors"
      >
        <span className="mr-2">{profile?.username || user.email}</span>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
          {profile?.username ? profile.username[0].toUpperCase() : user.email?.[0].toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <p className="text-white font-medium">{profile?.username || 'User'}</p>
            <p className="text-white/70 text-sm truncate">{user.email || 'No email'}</p>
          </div>
          
          <div className="p-2">
            <Link
              to="/profile"
              className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}