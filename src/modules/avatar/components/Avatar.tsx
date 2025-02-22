import { GroupProps, useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Group } from "three";
import { useRef } from "react";
import { useAvatarControls } from "../hooks/useAvatarControls";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

export const Avatar = (props: GroupProps) => {
  const characterRef = useRef<Group>(null);
  const [, get] = useKeyboardControls<Controls>();
  const { updateMovement, updateCamera } = useAvatarControls(characterRef);

  useFrame((state) => {
    updateMovement(get());
    updateCamera(state);
  });

  return (
    <group position={[-165, 0, -59]} ref={characterRef} {...props}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
};