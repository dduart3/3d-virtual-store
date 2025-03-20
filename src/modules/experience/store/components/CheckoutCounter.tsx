import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../../shared/components/Model";
import { CuboidCollider } from "@react-three/rapier";

export const CheckoutCounter = (props: GroupProps) => {
  return (
    <group {...props}>
      <Model isCritical={true} modelPath="misc/checkout-counter"  />
      <CuboidCollider args={[0.6, 0.6, 3.7]} position={[0.6, 0.7, -3.7]} />
      <CuboidCollider args={[0.20, 0.9, 0.25]} position={[1.64, 1, -1.05]} />
    </group>
  );
};
