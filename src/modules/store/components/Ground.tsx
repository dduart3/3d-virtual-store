import { useTexture } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { CuboidCollider } from "@react-three/rapier";
import { RepeatWrapping } from "three";

export const Ground = (props: MeshProps) => {
  const floorTexture = useTexture("/textures/concrete.jpg");
  // Make the texture repeat
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-165, -0.5, -60]}
        receiveShadow
        {...props}
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
      <CuboidCollider args={[100, 0, 100]} position={[-165, -0.4, -60]} />
    </group>
  );
};
