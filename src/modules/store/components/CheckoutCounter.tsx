import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../shared/components/Model";

export const CheckoutCounter = (props: GroupProps) => {
  return <Model modelPath="/misc/checkout-counter" {...props} />;
};
