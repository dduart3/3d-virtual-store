import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useAtom } from "jotai";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { avatarCameraRotationAtom, avatarPositionAtom, avatarUrlAtom } from "../state/avatar";
import { Vector3 } from "three";

import { useKeyboardControls } from "@react-three/drei";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

export const SimpleAvatar = () => {
  const [position, setPosition] = useAtom(avatarPositionAtom);
  const [avatarUrl] = useAtom(avatarUrlAtom);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls<Controls>();
  const [cameraRotation] = useAtom(avatarCameraRotationAtom);
  
  // Use a fallback URL if avatarUrl is not set
  const modelUrl = avatarUrl || "https://models.readyplayer.me/67c73014fc7b58705586f455.glb";
  
  const { scene } = useGLTF(modelUrl);
  
  // Add just the camera update part of useAvatarControls
  useFrame((state) => {
    if (!rigidBodyRef.current) return;
    
    // Add simplified movement logic
    const { forward, backward, left, right } = get();
    const moveDirection = new Vector3();
    if (forward) moveDirection.z -= 1;
    if (backward) moveDirection.z += 1;
    if (left) moveDirection.x -= 1;
    if (right) moveDirection.x += 1;
    
    if (moveDirection.length() > 0) {
      moveDirection.normalize().multiplyScalar(0.1);
      moveDirection.applyAxisAngle(new Vector3(0, 1, 0), cameraRotation);
      
      // Apply movement to rigid body
      rigidBodyRef.current.setLinvel(
        { x: moveDirection.x * 10, y: 0, z: moveDirection.z * 10 },
        true // Add this second parameter
      );
      
      // Set rotation based on movement
      rigidBodyRef.current.setRotation(
        { x: 0, y: Math.atan2(moveDirection.x, moveDirection.z), z: 0, w: 1 },
        true // Add this second parameter
      );
    }
    
    // Update position atom with current physics body position
    const physicsPosition = rigidBodyRef.current.translation();
    setPosition(new Vector3(physicsPosition.x, physicsPosition.y, physicsPosition.z));
  });
  
  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[position.x, position.y, position.z]}
      enabledRotations={[false, true, false]}
      mass={1}
      colliders="cuboid"
    >
      <primitive object={scene} scale={1.5} position={[0, -0.9, 0]} />
    </RigidBody>
  );
};
