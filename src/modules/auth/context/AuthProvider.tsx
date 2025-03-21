import { useEffect, ReactNode } from 'react'
import { supabase } from '../../../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { currentUserIdAtom } from '../../cart/state/cart';
import { useAtom } from 'jotai';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [, setCurrentUserId] = useAtom(currentUserIdAtom);


  useEffect(() => {
    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Update queries when auth state changes
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })

      setCurrentUserId(session?.user?.id || null);
      
      if (session?.user) {
        queryClient.invalidateQueries({ queryKey: ['profile', session.user.id] })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient, setCurrentUserId])

  return children
}
