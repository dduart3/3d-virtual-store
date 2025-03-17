import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3 } from "three";
import { RapierRigidBody } from "@react-three/rapier";
import { Group } from "three";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAtom } from "jotai";
import { avatarUrlAtom } from "../../avatar/state/avatar";
import { useOnlineAvatars } from "../../avatar/hooks/useOnlineAvatars";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

// This hook extends your avatar movement to broadcast position
export function useMultiplayerSync(
  rigidBodyRef: React.RefObject<RapierRigidBody>,
  modelRef: React.RefObject<Group>
) {
  const [, get] = useKeyboardControls<Controls>();
  
  // Get user info for multiplayer
  const { user } = useAuth();
  const [avatarUrl] = useAtom(avatarUrlAtom);
  
  // Initialize online avatars system
  const { broadcastPosition } = useOnlineAvatars(
    user?.id || "anonymous",
    user?.user_metadata?.username || "Usuario",
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
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
