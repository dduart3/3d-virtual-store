import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { avatarIdAtom, avatarUrlAtom } from "../../avatar/state/avatar";
import { useAtom } from "jotai";
import { AvatarCreator } from "../../avatar/components/AvatarCreator";
import ReactDOM from "react-dom";

export function UserMenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, isUpdatingAvatar } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [, setAvatarUrl] = useAtom(avatarUrlAtom);
  const [avatarId, setAvatarId] = useAtom(avatarIdAtom);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  const handleSignOut = async () => {
    setAvatarId(null);
    setAvatarUrl(null);
    signOut();
    navigate({ to: "/" });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // When avatar creator is closed, save the new avatar if it changed
  const handleAvatarCreatorClose = () => {
    setShowAvatarCreator(false);
  };

  if (!user) return null;

  return (
    <div className="pointer-events-auto" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 p-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <div
          className="w-6 h-6 rounded-full bg-no-repeat"
          style={{
            backgroundImage: `url(${`https://models.readyplayer.me/${avatarId}.png`})`,
            transform: "scale(10)",
            backgroundSize: "40%",
            backgroundPosition: "50% 60% ",
          }}
        />
      </button>
      {showAvatarCreator &&
        ReactDOM.createPortal(
          <AvatarCreator onClose={handleAvatarCreatorClose} />,
          document.body
        )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <p className="text-white font-medium">
              {profile?.username || "User"}
            </p>
            <p className="text-white/70 text-sm truncate">
              {user.email || "No email"}
            </p>
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
              onClick={() => {
                setShowAvatarCreator(true);
                setIsOpen(false);
              }}
              disabled={isUpdatingAvatar}
              className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50"
            >
              {isUpdatingAvatar ? "Actualizando..." : "Cambiar avatar"}
            </button>

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
  );
}
