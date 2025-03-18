import {
  AvatarCreator as RPMAvatarCreator,
  AvatarExportedEvent,
} from "@readyplayerme/react-avatar-creator";
import { useAtom } from "jotai";
import { avatarUrlAtom, avatarIdAtom } from "../state/avatar";
import { useToast } from "../../../../shared/context/ToastContext";
import { useAuth } from "../../../auth/hooks/useAuth";

export const AvatarCreator = ({ onClose }: { onClose: () => void }) => {
  const [, setAvatarUrl] = useAtom(avatarUrlAtom);
  const [, setAvatarId] = useAtom(avatarIdAtom);
  const { showToast } = useToast();
  const { user, updateAvatar } = useAuth();

  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
    console.log("Avatar exported event:", event);
    const url = event.data?.url;
    const id = event.data?.avatarId;

    if (user) {
      updateAvatar({ userId: user.id, avatarUrl: url });
      showToast("Avatar actualizado con éxito", "success");
    }

    setAvatarUrl(url);
    setAvatarId(id);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[20] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full h-[90vh] max-w-5xl rounded-xl overflow-hidden border border-white/20 shadow-2xl">
        {/* Improved close button */}
        <button
          onClick={onClose}
          className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 absolute top-4 right-4 z-20"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="white"
            className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Header with title */}
        <div className="absolute top-0 left-0 right-0  backdrop-blur-sm py-4 px-6 border-b border-white/10">
          <h2 className="text-white text-xl font-light tracking-wider">
            Crea tu avatar
          </h2>
        </div>

        {/* Avatar creator with better padding to account for our header */}
        <div className="w-full h-full pt-16">
          <RPMAvatarCreator
            subdomain="demo"
            onAvatarExported={handleOnAvatarExported}
            className="w-full h-full"
            config={{
              clearCache: true,
              bodyType: "fullbody",
              quickStart: false,
              language: "es",
            }}
          />
        </div>
      </div>
    </div>
  );
};
