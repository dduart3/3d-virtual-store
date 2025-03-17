import { useAtom } from "jotai";
import { onlineAvatarsAtom, currentUserIdAtom } from "../state/onlineAvatars";
import { RigidBody, CuboidCollider, RapierRigidBody } from "@react-three/rapier";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { Group, Vector3 } from "three";
import { useAvatarAnimations } from "../hooks/useAvatarAnimations";
import { useFrame } from "@react-three/fiber";

export const OnlineAvatars = () => {
  const [onlineAvatars] = useAtom(onlineAvatarsAtom);
  const [currentUserId] = useAtom(currentUserIdAtom);
  
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

const OnlineAvatarInstance = ({
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
  const [currentPosition, setCurrentPosition] = useState(() => position.clone());
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [targetPosition, setTargetPosition] = useState(() => position.clone());
  const [targetRotation, setTargetRotation] = useState(rotation);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  
  // Load the avatar model
  const { scene } = useGLTF(
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Use the same animation system as the main avatar
  const { updateAnimation, update: updateAnimations } = useAvatarAnimations(modelRef);
  
  // Update target position and rotation when props change
  useEffect(() => {
    setTargetPosition(position.clone());
    setTargetRotation(rotation);
    setLastUpdateTime(Date.now());
  }, [position, rotation]);
  
  // Smooth interpolation and animation updates
  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;
    
    // Smooth position interpolation
    const lerpFactor = Math.min(1, delta * 10); // Adjust this value for smoother/faster interpolation
    
    // Calculate new interpolated position
    const newPosition = currentPosition.clone().lerp(targetPosition, lerpFactor);
    setCurrentPosition(newPosition);
    
    // Calculate new interpolated rotation
    // Use shortest path for rotation interpolation
    let newRotation = currentRotation;
    const rotationDiff = targetRotation - currentRotation;
    
    // Handle rotation wrapping
    if (rotationDiff > Math.PI) {
      newRotation = currentRotation + (rotationDiff - 2 * Math.PI) * lerpFactor;
    } else if (rotationDiff < -Math.PI) {
      newRotation = currentRotation + (rotationDiff + 2 * Math.PI) * lerpFactor;
    } else {
      newRotation = currentRotation + rotationDiff * lerpFactor;
    }
    
    // Normalize rotation to [-PI, PI]
    if (newRotation > Math.PI) newRotation -= 2 * Math.PI;
    if (newRotation < -Math.PI) newRotation -= 2 * Math.PI;
    
    setCurrentRotation(newRotation);
    
    // Apply interpolated position to rigid body
    rigidBodyRef.current.setTranslation(
      { x: newPosition.x, y: newPosition.y, z: newPosition.z },
      true
    );
    
    // Apply interpolated rotation to model
    if (modelRef.current) {
      modelRef.current.rotation.y = newRotation;
    }
    
    // Update animations
    updateAnimation(isMoving, isRunning, false);
    updateAnimations(delta);
    
    // Predict movement for smoother animation when network updates are sparse
    if (isMoving) {
      // Calculate movement direction from rotation
      const moveSpeed = isRunning ? 0.1 : 0.05; // Adjust these values to match your main avatar's speed
      const direction = new Vector3(
        Math.sin(newRotation),
        0,
        Math.cos(newRotation)
      ).normalize().multiplyScalar(moveSpeed * delta * 60);
      
      // Only apply prediction if we haven't received an update recently
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate > 100) { // Only predict if last update was more than 100ms ago
        setTargetPosition(prev => prev.clone().add(direction));
      }
    }
  });
  
  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      enabledRotations={[false, false, false]}
      mass={1}
      friction={1}
      colliders={false}
    >
      <CuboidCollider
        args={[0.2, 0.9, 0.3]}
        position={[0, -0.1, 0]}
      />
      
      <group ref={modelRef} scale={1} position={[0, -1, 0]}>
        <primitive object={scene} />
      </group>
      
      {/* Username label */}
      <Text
        position={[0, 1.5, 0]}
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
