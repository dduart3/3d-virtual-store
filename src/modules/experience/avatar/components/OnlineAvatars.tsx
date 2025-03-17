import { useAtom } from "jotai";
import { onlineAvatarsAtom, currentAvatarIdAtom } from "../state/onlineAvatars";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group } from "three";
import { useAvatarAnimations } from "../hooks/useAvatarAnimations";
import { useFrame } from "@react-three/fiber";

export const OnlineAvatars = () => {
  const [onlineAvatars] = useAtom(onlineAvatarsAtom);
  const [currentAvatarId] = useAtom(currentAvatarIdAtom);
  
  return (
    <>
      {Object.values(onlineAvatars).map((avatar) => {
        // Don't render our own avatar
        if (avatar.id === currentAvatarId) return null;
        
        return (
          <OnlineAvatar
            key={avatar.id}
            id={avatar.id}
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
  id: string;
  username: string;
  avatarUrl: string;
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
}

const OnlineAvatar = ({
  username,
  avatarUrl,
  position,
  rotation,
  isMoving,
  isRunning
}: OnlineAvatarProps) => {
  const modelRef = useRef<Group>(null);
  
  // Load the avatar model directly
  const { scene } = useGLTF(
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Use the same animation system as the main avatar
  const { updateAnimation, update: updateAnimations } = useAvatarAnimations(modelRef);
  
  // Update animations based on movement state
  useFrame((_, delta) => {
    // Update animations based on the received movement state
    updateAnimation(isMoving, isRunning, false);
    updateAnimations(delta);
  });
  
  // Add the model to the scene
  useEffect(() => {
    if (modelRef.current) {
      // Clear any existing children
      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
      }
      
      // Add the scene directly without cloning
      modelRef.current.add(scene);
    }
    
    // Cleanup function
    return () => {
      if (modelRef.current) {
        // Remove the scene from the group before unmounting
        if (scene && modelRef.current.children.includes(scene)) {
          modelRef.current.remove(scene);
        }
        
        // Clear any remaining children
        while (modelRef.current.children.length > 0) {
          modelRef.current.remove(modelRef.current.children[0]);
        }
      }
    };
  }, [scene]);
  
  return (
    <RigidBody
      type="kinematicPosition"
      position={position}
      rotation={[0, rotation, 0]}
      enabledRotations={[false, false, false]}
      mass={1}
      friction={1}
      colliders={false}
    >
      <CuboidCollider
        args={[0.2, 0.9, 0.3]}
        position={[0, -0.1, 0]}
      />
      
      <group ref={modelRef} scale={1} position={[0, -1, 0]} />
      
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
