import { RefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { RapierRigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useSocket } from "../../multiplayer/context/SocketProvider";
import { BinaryProtocol } from "../../multiplayer/utils/BinaryProtocol";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

// Adaptive update rate based on movement
const MIN_UPDATE_RATE = 50;  // ms (20 updates/sec when moving fast)
const MAX_UPDATE_RATE = 200; // ms (5 updates/sec when idle)
const DISTANCE_THRESHOLD = 0.01; // Minimum distance to trigger update

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
  
  // Track velocity for adaptive update rate
  const velocityRef = useRef(new Vector3());

  // Send position updates at an adaptive rate
  useFrame(({ clock }) => {
    if (!socket || !isConnected || !rigidBodyRef.current || !modelRef.current)
      return;

    const time = clock.getElapsedTime() * 1000;
    
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
    
    // Calculate velocity and distance moved
    const timeDelta = (time - lastUpdateTimeRef.current) / 1000;
    if (timeDelta > 0) {
      const positionDelta = currentPosition.clone().sub(lastPositionRef.current);
      velocityRef.current.copy(positionDelta.divideScalar(timeDelta));
    }
    
    const distanceMoved = currentPosition.distanceTo(lastPositionRef.current);
    
    // Calculate adaptive update rate based on movement
    let updateRate = MAX_UPDATE_RATE;
    if (isMoving) {
      // Scale update rate based on speed (faster movement = more frequent updates)
      const speed = velocityRef.current.length();
      updateRate = Math.max(MIN_UPDATE_RATE, MAX_UPDATE_RATE - speed * 20);
    }

    // Check if we should send an update
    const timeSinceLastUpdate = time - lastUpdateTimeRef.current;
    const shouldUpdate = 
      timeSinceLastUpdate >= updateRate || 
      (distanceMoved > DISTANCE_THRESHOLD && timeSinceLastUpdate >= MIN_UPDATE_RATE);
      
    if (!shouldUpdate) return;

    // Check if anything has changed
    const positionChanged = distanceMoved > DISTANCE_THRESHOLD;
    const rotationChanged = Math.abs(currentRotation - lastRotationRef.current) > 0.01;
    const movingChanged = isMoving !== lastIsMovingRef.current;
    const runningChanged = isRunning !== lastIsRunningRef.current;

    // Only send update if something changed
    if (positionChanged || rotationChanged || movingChanged || runningChanged) {
      const update = {
        position: {
          x: currentPosition.x,
          y: currentPosition.y,
          z: currentPosition.z,
        },
        rotation: currentRotation,
        isMoving,
        isRunning,
      };
      
      // Use binary protocol for position updates
      const binaryData = BinaryProtocol.encodeAvatarUpdate(update);
      socket.emit("avatar:update", binaryData);

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