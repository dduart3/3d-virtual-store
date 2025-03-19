import { useEffect, useState, useRef, createRef } from "react";
import { Text } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useAvatarAnimations } from "../../avatar/hooks/useAvatarAnimations";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSocket } from "../../multiplayer/context/SocketProvider";
import { BinaryProtocol } from "../../multiplayer/utils/BinaryProtocol";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

// Player mapping from server
interface PlayerInfo {
  id: string;
  username: string;
  avatarUrl: string;
}

interface RemotePlayer extends PlayerInfo {
  position: { x: number; y: number; z: number };
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
  lastUpdate: number;
  modelRef: React.RefObject<Group>;
  rigidBodyRef: React.RefObject<RapierRigidBody>;
  velocity: Vector3;
}

export function OnlineAvatars() {
  const { socket } = useSocket();
  const { profile } = useAuth();
  const [players, setPlayers] = useState<Record<string, RemotePlayer>>({});
  const [playerInfo, setPlayerInfo] = useState<Record<string, PlayerInfo>>({});

  useEffect(() => {
    if (!socket || !profile) return;

    // Handle initial players list
    const handleInitialPlayers = (initialPlayers: any[]) => {
      const playersMap: Record<string, RemotePlayer> = {};
      const infoMap: Record<string, PlayerInfo> = {};

      initialPlayers.forEach((player) => {
        // Skip self - compare with our own user ID
        if (player.id !== profile.id) {
          // Store player info for later use
          infoMap[player.id] = {
            id: player.id,
            username: player.username,
            avatarUrl: player.avatarUrl,
          };

          // Create player object
          playersMap[player.id] = {
            ...infoMap[player.id],
            position: player.position,
            rotation: player.rotation,
            isMoving: player.isMoving,
            isRunning: player.isRunning,
            lastUpdate: Date.now(),
            modelRef: createRef<Group>(),
            rigidBodyRef: createRef<RapierRigidBody>(),
            velocity: new Vector3(),
          };
        }
      });

      setPlayerInfo(infoMap);
      setPlayers(playersMap);
    };

    // Handle binary player updates
    const handlePlayerUpdate = (buffer: ArrayBuffer) => {
      // Extract user ID from the last 4 bytes
      const view = new DataView(buffer);
      const userId = view.getUint32(16, true).toString();

      // Skip self - compare with our own user ID
      if (userId === profile.id) return;

      // Create a new buffer with just the update data (first 16 bytes)
      const updateBuffer = buffer.slice(0, 16);
      const update = BinaryProtocol.decodeAvatarUpdate(updateBuffer);

      setPlayers((prev) => {
        // If player doesn't exist yet but we have their info
        if (!prev[userId] && playerInfo[userId]) {
          return {
            ...prev,
            [userId]: {
              ...playerInfo[userId],
              position: update.position,
              rotation: update.rotation,
              isMoving: update.isMoving,
              isRunning: update.isRunning,
              lastUpdate: Date.now(),
              modelRef: createRef<Group>(),
              rigidBodyRef: createRef<RapierRigidBody>(),
              velocity: new Vector3(),
            },
          };
        }

        // If player exists, update them
        if (prev[userId]) {
          // Calculate velocity
          const timeDelta = (Date.now() - prev[userId].lastUpdate) / 1000;
          let velocity = prev[userId].velocity;

          if (timeDelta > 0 && timeDelta < 1) {
            const oldPos = new Vector3(
              prev[userId].position.x,
              prev[userId].position.y,
              prev[userId].position.z
            );

            const newPos = new Vector3(
              update.position.x,
              update.position.y,
              update.position.z
            );

            const posDelta = newPos.clone().sub(oldPos);
            velocity = posDelta.divideScalar(timeDelta);
          }

          return {
            ...prev,
            [userId]: {
              ...prev[userId],
              position: update.position,
              rotation: update.rotation,
              isMoving: update.isMoving,
              isRunning: update.isRunning,
              lastUpdate: Date.now(),
              velocity,
            },
          };
        }

        return prev;
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
  }, [socket, profile, playerInfo]);

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
    lastUpdate,
    velocity,
  } = player;

  // Position tracking
  const positionRef = useRef(new Vector3(position.x, position.y, position.z));
  const targetPositionRef = useRef(
    new Vector3(position.x, position.y, position.z)
  );
  const velocityRef = useRef(velocity || new Vector3());
  const lastPositionUpdateRef = useRef(lastUpdate);
  const rotationRef = useRef(rotation);
  const targetRotationRef = useRef(rotation);

  // Use the same animation system as the main avatar
  const { updateAnimation, update } = useAvatarAnimations(modelRef);

  // Load the avatar model
  const { scene } = useGLTF(
    avatarUrl ||
      "https://readyplayerme-assets.s3.amazonaws.com/animations/visage/male.glb"
  );

  // Update target position and calculate velocity when player data changes
  useEffect(() => {
    // Update target position and rotation
    targetPositionRef.current.set(position.x, position.y, position.z);
    targetRotationRef.current = rotation;

    // Update velocity reference
    velocityRef.current.copy(velocity || new Vector3());

    // Update last update time
    lastPositionUpdateRef.current = lastUpdate;
  }, [position, rotation, velocity, lastUpdate]);

  // Smooth movement and animation updates with prediction
  useFrame((_, delta) => {
    const now = Date.now();
    const timeSinceLastUpdate = (now - lastPositionUpdateRef.current) / 1000;

    // Predict position based on velocity and time since last update (extrapolation)
    if (timeSinceLastUpdate > 0.1 && isMoving) {
      // Apply velocity-based prediction
      const extrapolation = velocityRef.current
        .clone()
        .multiplyScalar(Math.min(timeSinceLastUpdate, 0.2));
      targetPositionRef.current.add(extrapolation);
    }

    // Smooth position interpolation with dynamic lerp factor
    // Smooth position interpolation with dynamic lerp factor
    // Faster lerp when far away, slower when close
    const distance = positionRef.current.distanceTo(targetPositionRef.current);
    const lerpFactor = Math.min(1, Math.max(0.1, delta * (5 + distance * 2)));

    positionRef.current.lerp(targetPositionRef.current, lerpFactor);

    // Smooth rotation interpolation
    const rotationDelta = targetRotationRef.current - rotationRef.current;
    // Normalize to find shortest rotation path
    const normalizedDelta =
      ((rotationDelta + Math.PI) % (Math.PI * 2)) - Math.PI;
    rotationRef.current += normalizedDelta * Math.min(delta * 10, 1);

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
      <group position={[0, 0, 0]}>
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
