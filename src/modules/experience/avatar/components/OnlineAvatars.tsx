import { useEffect, useState, useRef, createRef } from "react";
import { Text } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useAvatarAnimations } from "../../avatar/hooks/useAvatarAnimations";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSocket } from "../../multiplayer/context/SocketProvider";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

interface RemotePlayer {
  id: string;
  username: string;
  avatarUrl: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
  lastUpdate: number;
  modelRef: React.RefObject<Group>;
  rigidBodyRef: React.RefObject<RapierRigidBody>;
}

export function OnlineAvatars() {
  const { socket } = useSocket();
  const { profile } = useAuth();
  const [players, setPlayers] = useState<Record<string, RemotePlayer>>({});

  useEffect(() => {
    if (!socket || !profile) return;

    // Handle initial players list
    const handleInitialPlayers = (initialPlayers: any[]) => {
      const playersMap: Record<string, RemotePlayer> = {};

      initialPlayers.forEach((player) => {
        // Skip self - compare with our own user ID
        if (player.id !== profile.id) {
          playersMap[player.id] = {
            ...player,
            lastUpdate: Date.now(),
            modelRef: createRef<Group>(),
            rigidBodyRef: createRef<RapierRigidBody>(),
          };
        }
      });

      setPlayers(playersMap);
    };

    // Handle player updates
    const handlePlayerUpdate = (update: any) => {
      // Skip self - compare with our own user ID
      if (update.id === profile.id) return;

      setPlayers((prev) => {
        // If player doesn't exist yet, add them
        if (!prev[update.id]) {
          return {
            ...prev,
            [update.id]: {
              id: update.id,
              username: update.username,
              avatarUrl: update.avatarUrl,
              position: update.position,
              rotation: update.rotation,
              isMoving: update.isMoving,
              isRunning: update.isRunning,
              lastUpdate: Date.now(),
              modelRef: createRef<Group>(),
              rigidBodyRef: createRef<RapierRigidBody>(),
            },
          };
        }

        // Otherwise update existing player
        return {
          ...prev,
          [update.id]: {
            ...prev[update.id],
            position: update.position,
            rotation: update.rotation,
            isMoving: update.isMoving,
            isRunning: update.isRunning,
            lastUpdate: Date.now(),
          },
        };
      });
    };

    // Handle player disconnection
    const handlePlayerDisconnect = (playerId: string) => {
      setPlayers((prev) => {
        const newPlayers = { ...prev };
        delete newPlayers[playerId];
        return newPlayers;
      });
    };

    // Subscribe to events
    socket.on("users:initial", handleInitialPlayers);
    socket.on("avatar:update", handlePlayerUpdate);
    socket.on("user:disconnect", handlePlayerDisconnect);

    return () => {
      socket.off("users:initial", handleInitialPlayers);
      socket.off("avatar:update", handlePlayerUpdate);
      socket.off("user:disconnect", handlePlayerDisconnect);
    };
  }, [socket, profile]);

  return (
    <>
      {Object.values(players).map((player) => (
        <OnlineAvatar key={player.id} player={player} />
      ))}
    </>
  );
}

interface OnlineAvatarProps {
  player: RemotePlayer;
}

function OnlineAvatar({ player }: OnlineAvatarProps) {
  const {
    position,
    rotation,
    isMoving,
    isRunning,
    username,
    avatarUrl,
    modelRef,
    rigidBodyRef,
  } = player;

  // Position tracking with improved interpolation
  const positionRef = useRef(new Vector3(position.x, position.y, position.z));
  const targetPositionRef = useRef(
    new Vector3(position.x, position.y, position.z)
  );
  const rotationRef = useRef(rotation);
  const targetRotationRef = useRef(rotation);

  // Store previous state for smoother transitions
  const prevIsMovingRef = useRef(isMoving);

  // Use the same animation system as the main avatar
  const { updateAnimation, update } = useAvatarAnimations(modelRef);

  // Load the avatar model
  const { scene } = useGLTF(
    avatarUrl ||
      "https://readyplayerme-assets.s3.amazonaws.com/animations/visage/male.glb"
  );

  const velocityRef = useRef(new Vector3());
  const lastUpdateTimeRef = useRef(Date.now());

  // Update the useEffect to calculate velocity:
  useEffect(() => {
    const now = Date.now();
    const timeDelta = (now - lastUpdateTimeRef.current) / 1000;

    if (timeDelta > 0 && timeDelta < 0.5) {
      // Ignore very old updates
      // Calculate position delta
      const oldPosition = targetPositionRef.current.clone();
      const newPosition = new Vector3(position.x, position.y, position.z);
      const positionDelta = newPosition.clone().sub(oldPosition);

      // Calculate velocity (units per second)
      velocityRef.current.copy(positionDelta.divideScalar(timeDelta));

      // Limit velocity to reasonable values to prevent jumps
      const maxSpeed = 10; // Maximum reasonable speed
      if (velocityRef.current.length() > maxSpeed) {
        velocityRef.current.normalize().multiplyScalar(maxSpeed);
      }
    }

    targetPositionRef.current.set(position.x, position.y, position.z);
    targetRotationRef.current = rotation;
    lastUpdateTimeRef.current = now;
  }, [position, rotation]);

  // Smooth movement and animation updates
  useFrame((_, delta) => {
    const now = Date.now();
    const timeSinceLastUpdate = (now - lastUpdateTimeRef.current) / 1000;

    // Apply prediction only if we're moving and haven't received an update recently
    if (isMoving && timeSinceLastUpdate > 0.1 && timeSinceLastUpdate < 0.3) {
      // Apply very conservative prediction
      const prediction = velocityRef.current
        .clone()
        .multiplyScalar(delta * 0.5);
      targetPositionRef.current.add(prediction);
    }
    // Adaptive interpolation - faster when moving, slower when stationary
    const lerpFactor = isMoving
      ? Math.min(delta * 12, 0.25) // Faster when moving
      : Math.min(delta * 8, 0.15); // Slower when stationary

    // Apply position interpolation
    positionRef.current.lerp(targetPositionRef.current, lerpFactor);

    // Smooth rotation interpolation
    const rotationDelta = targetRotationRef.current - rotationRef.current;
    // Normalize to find shortest rotation path
    const normalizedDelta =
      ((rotationDelta + Math.PI) % (Math.PI * 2)) - Math.PI;
    rotationRef.current += normalizedDelta * Math.min(delta * 8, 0.2);

    // Update rigid body position
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation(
        {
          x: positionRef.current.x,
          y: positionRef.current.y,
          z: positionRef.current.z,
        },
        true
      );
    }

    // Update model rotation
    if (modelRef.current) {
      modelRef.current.rotation.y = rotationRef.current;
    }

    // Update animations
    updateAnimation(isMoving, isRunning, false);
    update(delta);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      enabledRotations={[false, false, false]}
      colliders={false}
    >
      <CuboidCollider args={[0.2, 0.9, 0.3]} position={[0, 0.9, 0]} />
      <group>
        <group ref={modelRef} rotation={[0, rotationRef.current, 0]}>
          <primitive object={scene} />
        </group>
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {username}
        </Text>
      </group>
    </RigidBody>
  );
}
