import { useAvatarSync } from '../../modules/experience/avatar/hooks/useAvatarSync';

// This component doesn't render anything, it just handles data synchronization
export function AuthDataLoader() {
  useAvatarSync();
  
  // Add more data loading hooks here if needed in the future
  
  return null;
}
