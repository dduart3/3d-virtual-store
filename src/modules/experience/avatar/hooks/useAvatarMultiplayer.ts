import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3 } from "three";
import { RapierRigidBody } from "@react-three/rapier";
import { Group } from "three";
import { useOnlineAvatars } from "./useOnlineAvatars";
import { useAuth } from "../../../auth/hooks/useAuth";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

export function useAvatarMultiplayer(
  rigidBodyRef: React.RefObject<RapierRigidBody>,
  modelRef: React.RefObject<Group>
) {
  const [, get] = useKeyboardControls<Controls>();
  
  // Get user info
  const { profile } = useAuth();
  
  // Initialize online avatars system
  const { broadcastPosition } = useOnlineAvatars(
    profile?.id || "anonymous",
    profile?.username || "Usuario",
    profile?.avatar_url || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Broadcast position in each frame
  useFrame(() => {
    if (!rigidBodyRef.current || !modelRef.current) return;
    
    const { forward, backward, left, right, run } = get();
    const isMoving = forward || backward || left || right;
    const isRunning = isMoving && run;
    
    // Get current position and rotation
    const position = rigidBodyRef.current.translation();
    const positionVector = new Vector3(position.x, position.y, position.z);
    const rotation = modelRef.current.rotation.y;
    
    // Broadcast position to other players
    broadcastPosition(positionVector, rotation, isMoving, isRunning);
  });
}
