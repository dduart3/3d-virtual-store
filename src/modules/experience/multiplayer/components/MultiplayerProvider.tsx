import { ReactNode } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAtom } from "jotai";
import { avatarUrlAtom, avatarPositionAtom, avatarCameraRotationAtom } from "../../avatar/state/avatar";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useOnlineAvatars } from "../../avatar/hooks/useOnlineAvatars";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

interface MultiplayerProviderProps {
  children: ReactNode;
}

export const MultiplayerProvider = ({ children }: MultiplayerProviderProps) => {
  const { user } = useAuth();
  const [avatarUrl] = useAtom(avatarUrlAtom);
  const [position] = useAtom(avatarPositionAtom);
  const [rotation] = useAtom(avatarCameraRotationAtom);
  const [, get] = useKeyboardControls<Controls>();
  
  // Initialize online avatars system
  const { broadcastPosition } = useOnlineAvatars(
    user?.id || "anonymous",
    user?.user_metadata?.username || "Usuario",
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Broadcast position updates
  useFrame(() => {
    const { forward, backward, left, right, run } = get();
    const isMoving = forward || backward || left || right;
    const isRunning = isMoving && run;
    
    // Convert position from Vector3 to array format
    const positionVector = new Vector3(position.x, position.y, position.z);
    
    // Broadcast position to other players
    broadcastPosition(positionVector, rotation, isMoving, isRunning);
  });
  
  return <>{children}</>;
};
