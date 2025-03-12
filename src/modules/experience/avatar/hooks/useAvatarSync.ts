import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { avatarUrlAtom, avatarIdAtom } from '../state/avatar';
import { useAuth } from '../../../auth/hooks/useAuth';

export function useAvatarSync() {
  const { profile, loading } = useAuth();
  const [, setAvatarUrl] = useAtom(avatarUrlAtom);
  const [, setAvatarId] = useAtom(avatarIdAtom);

  useEffect(() => {
    // When profile data is loaded and available
    if (!loading && profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
      setAvatarId(profile.avatar_url.split('/').pop().split('.')[0]);
    }
  }, [profile, loading, setAvatarUrl]);

  return null; // This hook doesn't need to return anything
}
