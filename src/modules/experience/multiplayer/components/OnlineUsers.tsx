import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { onlineUsersAtom, showOnlineUsersAtom } from '../state/onlineUsers';
import { useSocket } from '../context/SocketProvider';

export const OnlineUsers = () => {
  const [onlineUsers] = useAtom(onlineUsersAtom);
  const [showOnlineUsers, setShowOnlineUsers] = useAtom(showOnlineUsersAtom);
  const { userCount } = useSocket();

  // Handle Tab key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default tab behavior
        setShowOnlineUsers(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setShowOnlineUsers(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setShowOnlineUsers]);

  // Convert GLB URL to PNG URL for avatar images
  const getAvatarImageUrl = (glbUrl: string) => {
    return glbUrl.replace('.glb', '.png');
  };

  // Render nothing if not showing
  if (!showOnlineUsers) return null;

  return (
    <div className="fixed top-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-in-out">
      <div className="h-full w-64 bg-black/80 backdrop-blur-md border-l border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <h2 className="text-white text-lg font-medium text-center">
            Usuarios en línea ({userCount})
          </h2>
        </div>
        
        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-2">
          {onlineUsers.length === 0 ? (
            <p className="text-white/70 text-center p-4">No hay usuarios en línea</p>
          ) : (
            <div className="space-y-2">
              {onlineUsers.map(user => (
                <div 
                  key={user.userId} 
                  className="flex items-center p-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-white/10 flex-shrink-0">
                    <img 
                      src={getAvatarImageUrl(user.avatarUrl)} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/40?text=' + user.username.charAt(0).toUpperCase();
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-white/20">
          <p className="text-white/50 text-xs text-center">
            Mantén presionada la tecla Tab para ver los usuarios
          </p>
        </div>
      </div>
    </div>
  );
};
