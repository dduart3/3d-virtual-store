import { useMutation} from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { queryClient } from '../../../lib/queryClient';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  address: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  username?: string;
  address?: string;
  phone?: string;
  avatar_url?: string;
}



export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: ProfileUpdateData): Promise<UserProfile> => {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(`Error fetching user: ${userError?.message || 'User not found'}`);
      }
      
      // Update profile
      const { data: profile, error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (updateError) {
        throw new Error(`Error updating profile: ${updateError.message}`);
      }
      
      return {
        id: user.id,
        email: user.email || '',
        first_name: profile.first_name,
        last_name: profile.last_name,
        username: profile.username,
        address: profile.address,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
}
