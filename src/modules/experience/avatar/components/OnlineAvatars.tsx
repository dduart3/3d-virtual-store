import { useAtom } from "jotai";
import { onlineAvatarsAtom, currentUserIdAtom } from "../state/onlineAvatars";
import { RigidBody, CuboidCollider, RapierRigidBody } from "@react-three/rapier";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group, Vector3 } from "three";
import { useAvatarAnimations } from "../hooks/useAvatarAnimations";
import { useFrame } from "@react-three/fiber";

export const OnlineAvatars = () => {
  const [onlineAvatars] = useAtom(onlineAvatarsAtom);
  const [currentUserId] = useAtom(currentUserIdAtom);
  
  // Keep track of when avatars were last seen to handle cleanup
  const lastSeenRef = useRef<Record<string, number>>({});
  
  // Clean up stale avatars that haven't been updated in a while
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleThreshold = 10000; // 10 seconds
      
      Object.entries(lastSeenRef.current).forEach(([id, lastSeen]) => {
        if (now - lastSeen > staleThreshold && !onlineAvatars[id]) {
          // Remove from lastSeen if not in onlineAvatars for 10+ seconds
          const newLastSeen = { ...lastSeenRef.current };
          delete newLastSeen[id];
          lastSeenRef.current = newLastSeen;
        }
      });
    }, 5000);
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  // Update lastSeen for all current avatars
  useEffect(() => {
    const now = Date.now();
    const newLastSeen = { ...lastSeenRef.current };
    
    Object.keys(onlineAvatars).forEach(id => {
      newLastSeen[id] = now;
    });
    
    lastSeenRef.current = newLastSeen;
  }, [onlineAvatars]);
  
  return (
    <>
      {Object.values(onlineAvatars).map((avatar) => {
        // Don't render our own avatar
        if (avatar.id === currentUserId) return null;
        
        return (
          <OnlineAvatarInstance
            key={avatar.id}
            username={avatar.username}
            avatarUrl={avatar.avatar_url}
            position={avatar.position}
            rotation={avatar.rotation}
            isMoving={avatar.isMoving}
            isRunning={avatar.isRunning}
          />
        );
      })}
    </>
  );
};


interface OnlineAvatarProps {
  username: string;
  avatarUrl: string;
  position: Vector3;
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
}

export const OnlineAvatarInstance = ({
  username,
  avatarUrl,
  position,
  rotation,
  isMoving,
  isRunning
}: OnlineAvatarProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<Group>(null);
  
  // State for smooth interpolation
  const currentPositionRef = useRef(position.clone());
  const currentRotationRef = useRef(rotation);
  const targetPositionRef = useRef(position.clone());
  const targetRotationRef = useRef(rotation);
  const lastUpdateTimeRef = useRef(Date.now());
  
  // Animation state tracking to prevent flickering
  const animStateRef = useRef({
    isMoving: isMoving,
    isRunning: isRunning,
    lastChanged: Date.now()
  });
  
  // Load the avatar model
  const { scene } = useGLTF(
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Use the same animation system as the main avatar
  const { updateAnimation, update: updateAnimations } = useAvatarAnimations(modelRef);
  
  // Update target position and rotation when props change
  useEffect(() => {
    targetPositionRef.current = position.clone();
    targetRotationRef.current = rotation;
    lastUpdateTimeRef.current = Date.now();
    
    // Only update animation state if it actually changed or after a minimum time
    // This prevents animation flickering from network jitter
    const now = Date.now();
    const timeSinceLastChange = now - animStateRef.current.lastChanged;
    
    if ((isMoving !== animStateRef.current.isMoving || 
         isRunning !== animStateRef.current.isRunning) && 
        timeSinceLastChange > 300) { // 300ms debounce for animation changes
      
      animStateRef.current = {
        isMoving,
        isRunning,
        lastChanged: now
      };
    }
  }, [position, rotation, isMoving, isRunning]);
  
  // Smooth interpolation and animation updates
  useFrame((_, delta) => {
    if (!rigidBodyRef.current || !modelRef.current) return;
    
    // Position interpolation - smoother for online avatars
    const posLerpFactor = Math.min(1, delta * 4); // Adjust for smoother movement
    currentPositionRef.current.lerp(targetPositionRef.current, posLerpFactor);
    
    // Apply position to rigid body
    rigidBodyRef.current.setTranslation(
      { 
        x: currentPositionRef.current.x, 
        y: currentPositionRef.current.y, 
        z: currentPositionRef.current.z 
      },
      true
    );
    
    // Rotation interpolation - much slower to prevent jittering
    const rotLerpFactor = Math.min(1, delta * 2.5); // Slower rotation lerp
    
    // Calculate shortest path for rotation
    let targetRot = targetRotationRef.current;
    let currentRot = currentRotationRef.current;
    
    // Normalize rotations to [-PI, PI] range
    while (targetRot > Math.PI) targetRot -= Math.PI * 2;
    while (targetRot < -Math.PI) targetRot += Math.PI * 2;
    while (currentRot > Math.PI) currentRot -= Math.PI * 2;
    while (currentRot < -Math.PI) currentRot += Math.PI * 2;
    
    // Find shortest rotation path
    let rotDiff = targetRot - currentRot;
    if (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    if (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    
    // Apply smooth rotation
    currentRotationRef.current = currentRot + rotDiff * rotLerpFactor;
    
    // Apply rotation to model
    modelRef.current.rotation.y = currentRotationRef.current;
    
    // Update animations with stable state from ref
    updateAnimation(
      animStateRef.current.isMoving,
      animStateRef.current.isRunning,
      false
    );
    
    // Update animation mixer
    updateAnimations(delta);
    
    // Optional: Predict movement for smoother animation when network updates are sparse
    const timeSinceLastUpdate = Date.now() - lastUpdateTimeRef.current;
    if (animStateRef.current.isMoving && timeSinceLastUpdate > 200) { // Only predict after 200ms without updates
      const moveSpeed = animStateRef.current.isRunning ? 3.0 : 1.5;
      const moveDir = new Vector3(
        Math.sin(currentRotationRef.current),
        0,
        Math.cos(currentRotationRef.current)
      ).normalize().multiplyScalar(moveSpeed * delta);
      
      targetPositionRef.current.add(moveDir);
    }
  });
  
  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      enabledRotations={[false, false, false]}
      colliders={false}
      position={[position.x, position.y, position.z]}
    >
      <CuboidCollider
        args={[0.2, 0.9, 0.3]}
        position={[0, 0.9, 0]}
      />
      
      <group ref={modelRef} position={[0, 0, 0]}>
        <primitive object={scene.clone()} />
      </group>
      
      {/* Username label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {username}
      </Text>
    </RigidBody>
  );
};