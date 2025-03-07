import { useEffect, ReactNode } from 'react'
import { supabase } from '../../../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Update queries when auth state changes
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
      
      if (session?.user) {
        queryClient.invalidateQueries({ queryKey: ['profile', session.user.id] })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  return children
}
