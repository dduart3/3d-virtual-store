import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { Group, Vector3, Quaternion, Euler } from "three";
import {
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { avatarPositionAtom, avatarCameraRotationAtom } from "../state/avatar";
import { useAvatarControls } from "../hooks/useAvatarControls";
import { useAvatarAnimations } from "../hooks/useAvatarAnimations";
import { chatInputFocusedAtom } from "../../chat/state/chat";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  shift = "shift",
}

export const Avatar = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<Group>(null);
  const [position, setPosition] = useAtom(avatarPositionAtom);
  const [cameraRotation] = useAtom(avatarCameraRotationAtom);
  const [, get] = useKeyboardControls<Controls>();
  const [chatInputFocused] = useAtom(chatInputFocusedAtom);
  const { scene } = useGLTF(
    "https://models.readyplayer.me/67c73014fc7b58705586f455.glb"
  );

  const { updateMovement, updateCamera } = useAvatarControls(rigidBodyRef);
  const { updateAnimation, update: updateAnimations } =
    useAvatarAnimations(modelRef);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    // Update movement and get animation state info
    const movementInfo = updateMovement(get());

    // Update camera to follow character
    updateCamera(state);

    // Update character position atom for other components
    const physicsPosition = rigidBodyRef.current.translation();
    setPosition(
      new Vector3(physicsPosition.x, physicsPosition.y, physicsPosition.z)
    );

    // Explicitly check if character is moving for animation
    if (movementInfo) {
      // Log to debug animation state
      console.log("Movement info:", movementInfo);

      // Update animations based on movement state
      updateAnimation(
        movementInfo.isMoving,
        movementInfo.isRunning,
        movementInfo.isJumping
      );
    } else {
      // If movement info is undefined, ensure we're in idle state
      updateAnimation(false, false, false);
    }

    // Update animation mixer
    updateAnimations(delta);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[position.x, position.y, position.z]}
      enabledRotations={[false, true, false]}
      mass={1}
      friction={1}
      colliders={false} // Disable automatic colliders
    >
      {/* Custom collider with smaller height */}
      <CuboidCollider
        args={[0.4, 1, 0.4]} // Width, height, depth (half-extents)
        position={[0, 0, 0]} // Offset to align with character's visual center
      />

      <group ref={modelRef} scale={1} position={[0, -1, 0]}>
        <primitive object={scene} />
      </group>
    </RigidBody>
  );
};
