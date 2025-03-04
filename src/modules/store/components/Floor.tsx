import { useTexture } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { RepeatWrapping } from "three";

export const Floor = (props: MeshProps) => {
  const floorTexture = useTexture("/textures/concrete.jpg");
  // Make the texture repeat
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);


  return (
    <RigidBody type="fixed"  colliders="cuboid" position={props.position} rotation={props.rotation}>
      <mesh receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
    </RigidBody>
  );
};
