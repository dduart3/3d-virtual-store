import { useRef } from "react";
import { Stats, useGLTF, useKeyboardControls } from "@react-three/drei";
import { Group } from "three";
import {
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { useAvatarMovement } from "../hooks/useAvatarMovement";
import { useAvatarCamera } from "../hooks/useAvatarCamera";
import { useAvatarAnimations } from "../hooks/useAvatarAnimations";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import {avatarUrlAtom} from "../state/avatar";
enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

export const Avatar = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<Group>(null);
  const [, get] = useKeyboardControls<Controls>();
  const [avatarUrl] = useAtom(avatarUrlAtom);

  // Load character model
  const { scene } = useGLTF(avatarUrl || "https://readyplayerme.github.io/visage/male.glb");
  
  // Let the hook handle position, rotation and movement
 useAvatarMovement(rigidBodyRef, modelRef);
  
  // Other hooks for camera, animations, etc.
  useAvatarCamera(rigidBodyRef);
  const { updateAnimation, update: updateAnimations } = useAvatarAnimations(modelRef);
  
  // Update animations
  useFrame((_, delta) => {
    // Animation updates only - movement handled in useAvatarMovement
    const { forward, backward, left, right, run } = get();
    const isMoving = forward || backward || left || right;
    const isRunning = isMoving && run;
    
    updateAnimation(isMoving, isRunning, false);
    updateAnimations(delta);
  });

  // Update animations
  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    const { forward, backward, left, right, run } = get();
    const isMoving = forward || backward || left || right;
    const isRunning = isMoving && run;

    updateAnimation(isMoving, isRunning, false);
    updateAnimations(delta);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      enabledRotations={[false, false, false]}
      mass={1}
      friction={1}
      colliders={false}
    >
      <CuboidCollider
        args={[0.2, 0.9, 0.3]} // Width, height, depth (half-extents)
        position={[0, -0.1, 0]}
      />
      <Stats />;
      <group ref={modelRef} scale={1} position={[0, -1, 0]}>
        <primitive object={scene} />
      </group>
    </RigidBody>
  );
};
