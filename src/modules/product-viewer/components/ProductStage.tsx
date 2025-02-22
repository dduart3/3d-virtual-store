import { useAtom } from "jotai";
import { viewerStateAtom } from "../state/viewer";
import { Model } from "../../../components/Model";
import { GroupProps, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

export const ProductStage = ({
  isDragging,
  rotationSpeed,
  ...props
}: {
  isDragging: boolean;
  rotationSpeed: number;
} & GroupProps) => {
  //const [viewerState] = useAtom(viewerStateAtom);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current === null) return;
    if (isDragging) {
      groupRef.current.rotation.y += rotationSpeed;
    } else {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} scale={8} {...props}>
      <Model modelPath={"/products/men/shoes/oxford"} />
    </group>
  );
};