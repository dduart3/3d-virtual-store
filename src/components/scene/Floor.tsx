import { useTexture } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { RepeatWrapping } from "three";

export const Floor = (props: MeshProps) => {
  const floorTexture = useTexture("/textures/concrete.jpg");
  // Make the texture repeat
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  return (
    <>
      <mesh
        castShadow
        {...props}
      >
        <planeGeometry args={[100, 115]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
    </>
  );
};

