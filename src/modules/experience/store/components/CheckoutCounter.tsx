import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../../shared/components/Model";

export const CheckoutCounter = (props: GroupProps) => {
  return <Model isCritical={true} modelPath="misc/checkout-counter" {...props} />;
};
