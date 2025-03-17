import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Vector3 } from "three";
import { RapierRigidBody } from "@react-three/rapier";
import { Group } from "three";
import { useOnlineAvatars } from "./useOnlineAvatars";
import { useRef } from "react";
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
  
  // Track last broadcast time to limit frequency
  const lastBroadcastTimeRef = useRef(0);
  const lastPositionRef = useRef(new Vector3());
  const lastRotationRef = useRef(0);
  
  // Initialize online avatars system
  const { broadcastPosition } = useOnlineAvatars(
    profile?.id || "anonymous",
    profile?.username || "Usuario",
    profile?.avatar_url || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Broadcast position in each frame, but with rate limiting
  useFrame(() => {
    if (!rigidBodyRef.current || !modelRef.current) return;
    
    const { forward, backward, left, right, run } = get();
    const isMoving = forward || backward || left || right;
    const isRunning = isMoving && run;
    
    // Get current position and rotation
    const position = rigidBodyRef.current.translation();
    const positionVector = new Vector3(position.x, position.y, position.z);
    const rotation = modelRef.current.rotation.y;
    
    // Determine if we should broadcast based on time and movement
    const now = Date.now();
    const timeSinceLastBroadcast = now - lastBroadcastTimeRef.current;
    
    // Calculate position and rotation changes
    const positionChanged = lastPositionRef.current.distanceTo(positionVector) > 0.1;
    const rotationChanged = Math.abs(lastRotationRef.current - rotation) > 0.1;
    
    // Broadcast rate: 10 times per second when moving, once every 3 seconds when stationary
    const broadcastInterval = isMoving ? 100 : 3000;
    
    if ((positionChanged || rotationChanged || isMoving !== lastMovingRef.current) && 
        timeSinceLastBroadcast > broadcastInterval) {
      // Update refs
      lastBroadcastTimeRef.current = now;
      lastPositionRef.current.copy(positionVector);
      lastRotationRef.current = rotation;
      lastMovingRef.current = isMoving;
      
      // Broadcast position to other players
      broadcastPosition(positionVector, rotation, isMoving, isRunning);
    }
  });
  
  // Track last movement state to detect changes
  const lastMovingRef = useRef(false);
}
