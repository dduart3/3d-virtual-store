import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { avatarUrlAtom } from '../state/avatar';
import { supabase } from '../../../lib/supabase';

export const useAvatarPersistence = (userId: string | null) => {
  const [avatarUrl, setAvatarUrl] = useAtom(avatarUrlAtom);
  
  // Load avatar from database when component mounts
  useEffect(() => {
    if (!userId) return;
    
    const loadAvatar = async () => {
      const { data, error } = await supabase
        .from('avatars')
        .select('avatar_url')
        .eq('user_id', userId)
        .single();
        
      if (data && !error) {
        setAvatarUrl(data.avatar_url);
      }
    };
    
    loadAvatar();
  }, [userId]);
  
  // Save avatar to database when it changes
  useEffect(() => {
    if (!userId || !avatarUrl) return;
    
    const saveAvatar = async () => {
      await supabase
        .from('avatars')
        .upsert({
          user_id: userId,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });
    };
    
    saveAvatar();
  }, [avatarUrl, userId]);
};
