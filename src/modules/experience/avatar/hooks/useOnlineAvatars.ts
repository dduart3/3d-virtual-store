import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import {
  onlineAvatarsAtom,
  currentUserIdAtom,
  OnlineAvatar,
} from "../state/onlineAvatars";
import { Vector3 } from "three";
import { supabase } from "../../../../lib/supabase";

export function useOnlineAvatars(
  userId: string,
  username: string,
  avatarUrl: string
) {
  const [onlineAvatars, setOnlineAvatars] = useAtom(onlineAvatarsAtom);
  const [, setCurrentUserId] = useAtom(currentUserIdAtom);
  const channelRef = useRef<any>(null);

  // Track last broadcast values to avoid unnecessary updates
  const lastBroadcastRef = useRef({
    position: new Vector3(),
    rotation: 0,
    isMoving: false,
    isRunning: false,
    timestamp: 0,
  });

  // Set up Supabase Realtime channel for avatar synchronization
  useEffect(() => {
    if (!userId) return;

    console.log("Setting up avatar synchronization for:", username);
    setCurrentUserId(userId);

    // Create a Supabase Realtime channel if it doesn't exist
    if (!channelRef.current) {
      const channel = supabase.channel("avatars", {
        config: {
          broadcast: { self: false },
          presence: {
            key: userId,
          },
        },
      });

      // Handle avatar position updates
      channel.on("broadcast", { event: "avatar_update" }, ({ payload }) => {
        const avatarData = payload as OnlineAvatar;

        setOnlineAvatars((prev) => {
          // Get the existing avatar data if available
          const existingAvatar = prev[avatarData.id];

          // Only update if this is a newer update than what we have
          if (
            !existingAvatar ||
            avatarData.lastUpdated > existingAvatar.lastUpdated
          ) {
            return {
              ...prev,
              [avatarData.id]: {
                ...avatarData,
                position: new Vector3(
                  avatarData.position.x,
                  avatarData.position.y,
                  avatarData.position.z
                ),
                lastUpdated: avatarData.lastUpdated,
              },
            };
          }
          return prev;
        });
      });

      // Handle presence events (users joining)
      channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);

        if (newPresences && newPresences.length > 0 && key !== userId) {
          const presence = newPresences[0] as any;

          setOnlineAvatars((prev) => ({
            ...prev,
            [key]: {
              id: key,
              username: presence.username || "Usuario",
              avatar_url: presence.avatar_url || "",
              position: new Vector3(
                presence.position?.x || -165,
                presence.position?.y || 0,
                presence.position?.z || -59
              ),
              rotation: presence.rotation || 0,
              isMoving: presence.isMoving || false,
              isRunning: presence.isRunning || false,
              lastUpdated: Date.now(),
            },
          }));

          // When a new user joins, immediately send our current position
          if (channelRef.current) {
            // Use a small timeout to ensure channel is ready
            setTimeout(() => {
              broadcastPosition(
                lastBroadcastRef.current.position,
                lastBroadcastRef.current.rotation,
                lastBroadcastRef.current.isMoving,
                lastBroadcastRef.current.isRunning,
                true // Force broadcast
              );
            }, 500);
          }
        }
      });

      // Handle presence events (users leaving)
      channel.on("presence", { event: "leave" }, ({ key }) => {
        console.log("User left:", key);

        if (key !== userId) {
          setOnlineAvatars((prev) => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
        }
      });

      // Handle presence sync
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        console.log("Presence state synchronized:", state);

        // Update our state with all online users
        const avatars: Record<string, OnlineAvatar> = {};

        Object.entries(state).forEach(([key, presences]) => {
          if (key !== userId && presences.length > 0) {
            const presence = presences[0] as any;

            avatars[key] = {
              id: key,
              username: presence.username || "Usuario",
              avatar_url: presence.avatar_url || "",
              position: new Vector3(
                presence.position?.x || -165,
                presence.position?.y || 0,
                presence.position?.z || -59
              ),
              rotation: presence.rotation || 0,
              isMoving: presence.isMoving || false,
              isRunning: presence.isRunning || false,
              lastUpdated: Date.now(),
            };
          }
        });

        // Merge with existing avatars to preserve animation state
        setOnlineAvatars((prev) => {
          const newAvatars = { ...avatars };

          // Preserve animation states for existing avatars
          Object.keys(newAvatars).forEach((id) => {
            if (prev[id]) {
              // Keep the existing animation state if the position hasn't changed much
              const positionChanged =
                prev[id].position.distanceTo(newAvatars[id].position) > 0.5;

              if (!positionChanged) {
                newAvatars[id].isMoving = prev[id].isMoving;
                newAvatars[id].isRunning = prev[id].isRunning;
              }
            }
          });

          return newAvatars;
        });
      });

      // Subscribe to the channel
      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track our presence
          await channel.track({
            username,
            avatar_url: avatarUrl,
            position: { x: -165, y: 0, z: -59 },
            rotation: 0,
            isMoving: false,
            isRunning: false,
          });
        }
      });

      channelRef.current = channel;

      // Clean up on unmount
      return () => {
        if (channelRef.current) {
          channelRef.current.untrack();
          channelRef.current.unsubscribe();
        }
      };
    }
  }, [userId, username, avatarUrl]);

  // Function to broadcast position updates
// Inside the broadcast function in useOnlineAvatars.ts

const broadcastPosition = (
  position: Vector3,
  rotation: number,
  isMoving: boolean,
  isRunning: boolean,
  force = false
) => {
  if (!channelRef.current || !userId) return;
  
  // Only broadcast if something significant changed or enough time has passed
  const now = Date.now();
  const timeSinceLastBroadcast = now - lastBroadcastRef.current.timestamp;
  const positionChanged = position.distanceTo(lastBroadcastRef.current.position) > 0.1;
  const rotationChanged = Math.abs(rotation - lastBroadcastRef.current.rotation) > 0.1;
  const movementChanged = 
    isMoving !== lastBroadcastRef.current.isMoving || 
    isRunning !== lastBroadcastRef.current.isRunning;
  
  // Always broadcast movement state changes immediately
  // For position updates: 10 times per second if moving, once every 3 seconds if stationary
  const minInterval = isMoving ? 100 : 3000;
  
  // Important: Always broadcast when movement state changes (start/stop)
  if (force || movementChanged || ((positionChanged || rotationChanged) && timeSinceLastBroadcast > minInterval)) {
    // Update last broadcast values
    lastBroadcastRef.current = {
      position: position.clone(),
      rotation,
      isMoving,
      isRunning,
      timestamp: now
    };
    
    // Get current presence state for this user
    const currentPresence = channelRef.current.presenceState()[userId]?.[0] || {};
    
    // Broadcast update
    channelRef.current.send({
      type: 'broadcast',
      event: 'avatar_update',
      payload: {
        id: userId,
        username: currentPresence.username || username,
        avatar_url: currentPresence.avatar_url || avatarUrl,
        position,
        rotation,
        isMoving,
        isRunning,
        lastUpdated: now
      }
    });
    
    // Update presence data
    channelRef.current.track({
      username: currentPresence.username || username,
      avatar_url: currentPresence.avatar_url || avatarUrl,
      position: { x: position.x, y: position.y, z: position.z },
      rotation,
      isMoving,
      isRunning
    });
  }
};

  return {
    onlineAvatars,
    broadcastPosition,
  };
}
