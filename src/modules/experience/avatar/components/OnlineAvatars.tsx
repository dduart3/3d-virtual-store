import { useEffect, useState, useRef, createRef } from "react";
import { Text } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useAvatarAnimations } from "../../avatar/hooks/useAvatarAnimations";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSocket } from "../../multiplayer/context/SocketProvider";

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
  } = player;
  const positionRef = useRef(new Vector3(position.x, position.y, position.z));
  const targetPositionRef = useRef(
    new Vector3(position.x, position.y, position.z)
  );

  // Use the same animation system as the main avatar
  const { updateAnimation, update } = useAvatarAnimations(modelRef);

  // Load the avatar model
  const { scene } = useGLTF(
    avatarUrl || "https://readyplayerme.github.io/visage/male.glb"
  );

  // Update target position when player data changes
  useEffect(() => {
    targetPositionRef.current.set(position.x, position.y, position.z);
  }, [position]);

  // Smooth movement and animation updates
  useFrame((_, delta) => {
    // Smooth position interpolation
    positionRef.current.lerp(
      targetPositionRef.current,
      Math.min(delta * 10, 1)
    );

    // Update animations
    updateAnimation(isMoving, isRunning, false);
    update(delta);
  });

  return (
    <group
      position={[
        positionRef.current.x,
        positionRef.current.y,
        positionRef.current.z,
      ]}
    >
      <group ref={modelRef} rotation={[0, rotation, 0]}>
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
  );
}
