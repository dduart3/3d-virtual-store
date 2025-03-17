import { useAtom } from "jotai";
import { onlineAvatarsAtom, currentUserIdAtom } from "../state/onlineAvatars";
import { RigidBody, CuboidCollider, RapierRigidBody } from "@react-three/rapier";
import { Text, useGLTF } from "@react-three/drei";
import { useRef} from "react";
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
          <OnlineAvatar
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

const OnlineAvatar = ({
  username,
  avatarUrl,
  position,
  rotation,
  isMoving,
  isRunning
}: OnlineAvatarProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<Group>(null);
  
  // Load the avatar model
  const { scene } = useGLTF(
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
  );
  
  // Use the same animation system as the main avatar
  const { updateAnimation, update: updateAnimations } = useAvatarAnimations(modelRef);
  
  // Update animations and position
  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;
    
    // Update position
    rigidBodyRef.current.setTranslation(
      { x: position.x, y: position.y, z: position.z },
      true
    );
    
    // Update rotation
    if (modelRef.current) {
      modelRef.current.rotation.y = rotation;
    }
    
    // Update animations
    updateAnimation(isMoving, isRunning, false);
    updateAnimations(delta);
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
