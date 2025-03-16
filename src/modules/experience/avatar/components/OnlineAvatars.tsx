import { useAtom } from "jotai";
import { onlineAvatarsAtom, currentAvatarIdAtom } from "../state/onlineAvatars";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group } from "three";

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
  id, 
  username, 
  avatarUrl, 
  position, 
  rotation,
  isMoving,
  isRunning
}: OnlineAvatarProps) => {
  const modelRef = useRef<Group>(null);
  
  // Load the avatar model
  const { scene } = useGLTF(
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Clone the scene to avoid sharing issues
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.clear();
      modelRef.current.add(scene.clone());
    }
  }, [scene, avatarUrl]);
  
  return (
    <RigidBody
      type="fixed"
      position={position}
      rotation={[0, rotation, 0]}
      colliders={false}
    >
      <CuboidCollider
        args={[0.2, 0.9, 0.3]} // Width, height, depth (half-extents)
        position={[0, -0.1, 0]}
      />
      
      <group ref={modelRef} scale={1} position={[0, -1, 0]}>
        {/* The avatar model will be added here in useEffect */}
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
