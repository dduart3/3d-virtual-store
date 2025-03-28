import { GroupProps } from "@react-three/fiber";
import { Model } from "../../../../shared/components/Model";
import { useEffect, useState } from "react";
import { Euler, Vector3 } from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useSocket } from "../../multiplayer/context/SocketProvider";

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
    <Model name={`${side}Door`} isCritical={true} modelPath="/models/misc/door.glb" />
  </RigidBody>
);

export const Doors = (props: GroupProps) => {
  const [status, setStatus] = useState<DoorsStatus>("closed");
  const { socket, isConnected } = useSocket();
  const hoverProps = useHoverCursor();
  const [isInitialized, setIsInitialized] = useState(false);

  // Listen for door state changes from the server
  useEffect(() => {
    if (!socket) return;

    const handleDoorState = (newState: DoorsStatus) => {
      setStatus(newState);
      setIsInitialized(true);
    };

    socket.on("door:state", handleDoorState);

    // Request initial door state if we haven't received it yet
    if (!isInitialized && isConnected) {
      socket.emit("door:getState");
    }

    return () => {
      socket.off("door:state", handleDoorState);
    };
  }, [socket, setStatus, isInitialized, isConnected, status]);

  // Add a reconnection handler to request door state when connection is restored
  useEffect(() => {
    if (isConnected && socket) {
      // When connection is established/restored, request the current door state
      socket.emit("door:getState");
    }
  }, [isConnected, socket]);

  const handleDoorToggle = () => {
    if (!socket || !isConnected) {
      // Fallback to local toggle if socket is not available
      setStatus((prev) => (prev === "closed" ? "open" : "closed"));
      return;
    }

    // Emit door toggle event to server
    socket.emit("door:toggle");
  };

  return (
    <group {...props} {...hoverProps} onClick={handleDoorToggle}>
      <Door side="left" status={status} />
      <Door side="right" status={status} />
    </group>
  );
};
