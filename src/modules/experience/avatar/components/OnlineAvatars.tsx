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
  
  // Single source of truth for position and rotation
  const targetPositionRef = useRef(position.clone());
  const targetRotationRef = useRef(rotation);
  
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
  }, [position, rotation]);
  
  // Handle smooth movement and animation updates
  useFrame((_, delta) => {
    if (!rigidBodyRef.current || !modelRef.current) return;
    
    // Get current position from rigid body
    const currentPos = rigidBodyRef.current.translation();
    const currentPosVector = new Vector3(currentPos.x, currentPos.y, currentPos.z);
    
    // Calculate distance to target
    const distanceToTarget = currentPosVector.distanceTo(targetPositionRef.current);
    
    // Only interpolate if we need to move
    if (distanceToTarget > 0.01) {
      // Calculate interpolated position
      const lerpFactor = Math.min(1, delta * (isMoving ? 10 : 5)); // Faster when moving
      const newPos = currentPosVector.clone().lerp(targetPositionRef.current, lerpFactor);
      
      // Apply position directly to rigid body
      rigidBodyRef.current.setTranslation(
        { x: newPos.x, y: newPos.y, z: newPos.z },
        true
      );
    } else if (distanceToTarget > 0 && distanceToTarget <= 0.01) {
      // If very close to target, snap to exact position to avoid tiny movements
      rigidBodyRef.current.setTranslation(
        { 
          x: targetPositionRef.current.x, 
          y: targetPositionRef.current.y, 
          z: targetPositionRef.current.z 
        },
        true
      );
    }
    
    // Handle rotation
    const currentRotY = modelRef.current.rotation.y;
    const targetRotY = targetRotationRef.current;
    
    // Normalize rotations to [-PI, PI] range
    let normalizedCurrentRot = currentRotY;
    let normalizedTargetRot = targetRotY;
    
    while (normalizedCurrentRot > Math.PI) normalizedCurrentRot -= Math.PI * 2;
    while (normalizedCurrentRot < -Math.PI) normalizedCurrentRot += Math.PI * 2;
    while (normalizedTargetRot > Math.PI) normalizedTargetRot -= Math.PI * 2;
    while (normalizedTargetRot < -Math.PI) normalizedTargetRot += Math.PI * 2;
    
    // Find shortest rotation path
    let rotDiff = normalizedTargetRot - normalizedCurrentRot;
    if (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    if (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    
    // Only apply rotation if there's a significant difference
    if (Math.abs(rotDiff) > 0.01) {
      // Apply smooth rotation
      const rotLerpFactor = Math.min(1, delta * 5);
      modelRef.current.rotation.y = normalizedCurrentRot + rotDiff * rotLerpFactor;
    }
    
    // Update animations based on actual movement state
    updateAnimation(isMoving, isRunning, false);
    updateAnimations(delta);
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
        <primitive object={scene} />
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