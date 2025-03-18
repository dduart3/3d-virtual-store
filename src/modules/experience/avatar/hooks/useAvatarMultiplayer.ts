import { RefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3, Quaternion } from "three";
import { RapierRigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useSocket } from "../../multiplayer/context/SocketProvider";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

// Throttle rate for position updates (in milliseconds)
const UPDATE_RATE = 100;

export function useAvatarMultiplayer(
  rigidBodyRef: RefObject<RapierRigidBody>,
  modelRef: RefObject<Group>
) {
  const { socket, isConnected } = useSocket();
  const [, getKeys] = useKeyboardControls<Controls>();

  // Use refs to track last update time and values
  const lastUpdateTimeRef = useRef(0);
  const lastPositionRef = useRef(new Vector3());
  const lastRotationRef = useRef(0);
  const lastIsMovingRef = useRef(false);
  const lastIsRunningRef = useRef(false);

  // Send position updates at a throttled rate
  useFrame(({ clock }) => {
    if (!socket || !isConnected || !rigidBodyRef.current || !modelRef.current)
      return;

    const time = clock.getElapsedTime() * 1000;

    // Check if we should send an update
    if (time - lastUpdateTimeRef.current < UPDATE_RATE) return;

    // Get current input state
    const { forward, backward, left, right, run } = getKeys();
    const isMoving = forward || backward || left || right;
    const isRunning = isMoving && run;

    // Get current position from rigid body
    const physicsPos = rigidBodyRef.current.translation();
    const currentPosition = new Vector3(
      physicsPos.x,
      physicsPos.y,
      physicsPos.z
    );

    // Get current rotation from model
    const currentRotation = modelRef.current.rotation.y;

    // Check if anything has changed
    const positionChanged =
      Math.abs(currentPosition.x - lastPositionRef.current.x) > 0.01 ||
      Math.abs(currentPosition.y - lastPositionRef.current.y) > 0.01 ||
      Math.abs(currentPosition.z - lastPositionRef.current.z) > 0.01;

    const rotationChanged =
      Math.abs(currentRotation - lastRotationRef.current) > 0.01;
    const movingChanged = isMoving !== lastIsMovingRef.current;
    const runningChanged = isRunning !== lastIsRunningRef.current;

    // Only send update if something changed
    if (positionChanged || rotationChanged || movingChanged || runningChanged) {
      socket.emit("avatar:update", {
        position: {
          x: currentPosition.x,
          y: currentPosition.y,
          z: currentPosition.z,
        },
        rotation: currentRotation,
        isMoving,
        isRunning,
      });

      // Update last values
      lastPositionRef.current.copy(currentPosition);
      lastRotationRef.current = currentRotation;
      lastIsMovingRef.current = isMoving;
      lastIsRunningRef.current = isRunning;
      lastUpdateTimeRef.current = time;
    }
  });

  return null;
}
