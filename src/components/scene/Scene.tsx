import { GroupProps } from "@react-three/fiber";
import { Model } from "../Model";
import { Floor } from "./Floor";
import { Doors } from "./Doors";

export const Scene = (props: GroupProps) => {
  return (
    <group {...props}>
      <Model modelName="scene" />
      <Model modelName="/misc/checkout-counter" position={[-139.5, 0, -56.5]} />
      <Doors />

      <Floor rotation={[-Math.PI / 2, 0, 0]} position={[-165, -1, -60]} />
    </group>
  );
};
