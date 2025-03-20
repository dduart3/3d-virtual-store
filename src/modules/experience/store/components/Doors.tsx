import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../../shared/components/Model";
import { useState } from "react";
import { Euler, Vector3 } from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

type DoorsStatus = "open" | "closed";

const DOOR_POSITIONS = {
  closed: {
    left: { position: [-159.15, -0.45, -58.75], rotation: [0, 0, 0] },
    right: { position: [-159.15, -0.45, -59.8], rotation: [0, 0, 0] },
  },
  open: {
    left: {
      position: [-159.15, -0.45, -58.75],
      rotation: [0, -Math.PI / 1.5, 0],
    },
    right: {
      position: [-159.15, -0.45, -60.8],
      rotation: [0, -Math.PI / 3, 0],
    },
  },
} as const;

const useHoverCursor = () => ({
  onPointerOver: () => (document.body.style.cursor = "pointer"),
  onPointerOut: () => (document.body.style.cursor = "default"),
});

const Door = ({
  side,
  status,
}: {
  side: "left" | "right";
  status: DoorsStatus;
}) => (
  <RigidBody
    position={new Vector3(...DOOR_POSITIONS[status][side].position)}
    rotation={new Euler(...DOOR_POSITIONS[status][side].rotation)}
    type="fixed"
    colliders={false}
  >
    <CuboidCollider args={[0.05, 1.46, 0.53]} position={[0.03, 1.46, -0.52]} />
    <Model name={`${side}Door`} isCritical={true} modelPath="/misc/door" />
  </RigidBody>
);

export const Doors = (props: GroupProps) => {
  const [status, setStatus] = useState<DoorsStatus>("closed");
  const hoverProps = useHoverCursor();

  return (
    <group
      {...props}
      {...hoverProps}
      onClick={() =>
        setStatus((prev) => (prev === "closed" ? "open" : "closed"))
      }
    >
      <Door side="left" status={status} />
      <Door side="right" status={status} />
    </group>
  );
};
