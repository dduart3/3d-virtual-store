import { GroupProps, useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../state/viewer";
import { useRef } from "react";
import { Group } from "three";
import { Model } from "../../../shared/components/Model";

export const ProductStage = ({
  isDragging,
  rotationSpeed,
  ...props
}: {
  isDragging: boolean;
  rotationSpeed: number;
} & GroupProps) => {
  const [viewerState] = useAtom(viewerStateAtom);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current === null) return;
    if (isDragging) {
      groupRef.current.rotation.y += rotationSpeed;
    } else {
      groupRef.current.rotation.y += 0.01;
    }
  });
  
  const model = viewerState.currentProduct?.model;
  if (!model) return null;
  const { path, position, rotation, scale } = model;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation ? rotation : [0, 0, 0]}
      scale={scale ? scale : 1}
      {...props}
    >
      <Model modelPath={path} />
    </group>
  );
};
