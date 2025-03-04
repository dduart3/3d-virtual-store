import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAvatarControls } from "../hooks/useAvatarControls";
import { useAtom } from "jotai";
import { avatarPositionAtom } from "../state/avatar";
import { RigidBody, CuboidCollider, RapierRigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

export const Avatar = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [position, setPosition] = useAtom(avatarPositionAtom);
  const [, get] = useKeyboardControls<Controls>();
  const { updateMovement, updateCamera } = useAvatarControls(rigidBodyRef);

  useEffect(() => {
    if (rigidBodyRef.current) {
      // Initialize position
      rigidBodyRef.current.setTranslation({
        x: position.x,
        y: position.y,
        z: position.z
      }, true);
      
      // Set initial velocity to zero to prevent sliding
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, []);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;
    
    // Update movement based on keyboard input
    updateMovement(get());
    
    // Update camera to follow the avatar
    updateCamera(state);
    
    // Update position atom with current position from physics
    const physicsPos = rigidBodyRef.current.translation();
    setPosition(new Vector3(physicsPos.x, physicsPos.y, physicsPos.z));
  });

  return (
    <RigidBody 
      ref={rigidBodyRef}
      type="dynamic"
      position={[position.x, position.y, position.z]}
      enabledRotations={[false, true, false]} // Only allow Y-axis rotation
      mass={1}
      friction={0.2}
      restitution={0.0}
      linearDamping={2}
      angularDamping={2}
      gravityScale={0} // No gravity for top-down movement
    >
      {/* Add a collider for physics interactions */}
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
      
      {/* Visual representation */}
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
};
