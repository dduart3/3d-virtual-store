import { useEffect, useRef } from "react";
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
import { avatarUrlAtom } from "../state/avatar";
import { isSceneReadyAtom } from "../../../../shared/state/loading";
import { useAvatarMultiplayer } from "../hooks/useAvatarMultiplayer";
import { jukeboxModeAtom } from "../../jukebox/state/jukebox";

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
  const [isSceneReady] = useAtom(isSceneReadyAtom);
  const [jukeboxMode] = useAtom(jukeboxModeAtom);

  // Load character model
  const { scene } = useGLTF(
    avatarUrl || "https://readyplayerme-assets.s3.amazonaws.com/animations/visage/male.glb"
  );

  // Let the hook handle position, rotation and movement
  useAvatarMovement(rigidBodyRef, modelRef);

  // Other hooks for camera, animations, etc.
  useAvatarCamera(rigidBodyRef);
  const { updateAnimation, update: updateAnimations } = useAvatarAnimations(modelRef);

  useAvatarMultiplayer(rigidBodyRef, modelRef);

  // Update animations
  useFrame((_, delta) => {
    // If jukebox is active, force idle animation
    if (jukeboxMode === 'active') {
      updateAnimation(false, false, false);
      updateAnimations(delta);
      return;
    }

    // Animation updates only - movement handled in useAvatarMovement
    const { forward, backward, left, right, run } = get();
    const isMoving = forward || backward || left || right;
    const isRunning = isMoving && run;

    updateAnimation(isMoving, isRunning, false);
    updateAnimations(delta);
  });

  useEffect(() => {
    if (!rigidBodyRef.current) return;

    if (isSceneReady) {
      // Wait a moment for floor colliders to fully initialize
      // Add null check here
      rigidBodyRef.current.setBodyType(0, true); // 1 = dynamic (with physics)
    } else {
      // Already checked above, but being explicit for clarity
      rigidBodyRef.current.setBodyType(2, true); // 2 = kinematic (no physics)
    }
  }, [isSceneReady]);

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
        args={[0.2, 0.9, 0.25]} // Width, height, depth (half-extents)
        position={[0, 0.9, 0]}
      />
      <Stats />;
      <group ref={modelRef} scale={1} position={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </RigidBody>
  );
};
