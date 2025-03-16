import { useAtom } from "jotai";
import { useRef, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { onlineAvatarsAtom, currentAvatarIdAtom, OnlineAvatar } from "../state/onlineAvatars";
import { useQueryClient } from "@tanstack/react-query";
import { Vector3 } from "three";

// Constants
const AVATAR_CHANNEL = "avatars";
const POSITION_UPDATE_INTERVAL = 100; // ms - how often to broadcast position
const POSITION_THRESHOLD = 0.1; // minimum distance to trigger update

export function useOnlineAvatars(userId: string, username: string, avatarUrl: string) {
  const [onlineAvatars, setOnlineAvatars] = useAtom(onlineAvatarsAtom);
  const [, setCurrentAvatarId] = useAtom(currentAvatarIdAtom);
  const queryClient = useQueryClient();
  
  // Refs to avoid unnecessary re-renders
  const channelRef = useRef<any>(null);
  const lastPositionRef = useRef<Vector3>(new Vector3());
  const lastRotationRef = useRef<number>(0);
  const updateIntervalRef = useRef<number | null>(null);
  
  // Initialize avatar synchronization
  useEffect(() => {
    if (!userId || !username) return;
    
    console.log("Initializing online avatars for user:", username);
    setCurrentAvatarId(userId);
    
    // Create the channel if it doesn't exist
    if (!channelRef.current) {
      const channel = supabase.channel(AVATAR_CHANNEL, {
        config: {
          broadcast: { self: false }, // Don't receive our own broadcasts
          presence: {
            key: userId,
          },
        },
      });
      
      // Handle avatar position updates
      channel.on("broadcast", { event: "avatar_update" }, ({ payload }) => {
        const avatarData = payload as OnlineAvatar;
        
        // Update the avatar in our state
        setOnlineAvatars((prev) => ({
          ...prev,
          [avatarData.id]: avatarData,
        }));
      });
      
      // Handle presence events for avatars joining/leaving
      channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("Avatar joined:", key, newPresences);
        if (newPresences && newPresences.length > 0) {
          const userInfo = newPresences[0] as any;
          
          // Add new avatar to our state
          if (key !== userId && userInfo.username) {
            setOnlineAvatars((prev) => ({
              ...prev,
              [key]: {
                id: key,
                username: userInfo.username,
                avatar_url: userInfo.avatar_url || "",
                position: userInfo.position || [-165, 0, -59],
                rotation: userInfo.rotation || 0,
                isMoving: false,
                isRunning: false,
                last_updated: Date.now(),
              },
            }));
          }
        }
      });
      
      channel.on("presence", { event: "leave" }, ({ key }) => {
        console.log("Avatar left:", key);
        
        // Remove avatar from our state
        if (key !== userId) {
          setOnlineAvatars((prev) => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
        }
      });
      
      channel.on("presence", { event: "sync" }, () => {
        console.log("Avatar presence state synchronized");
        
        // Get list of online avatars from presence state
        const presenceState = channel.presenceState();
        const avatars: Record<string, OnlineAvatar> = {};
        
        Object.entries(presenceState).forEach(([avatarId, presences]) => {
          if (avatarId !== userId) {
            const userInfo = presences[0] as any;
            avatars[avatarId] = {
              id: avatarId,
              username: userInfo.username || "Usuario",
              avatar_url: userInfo.avatar_url || "",
              position: userInfo.position || [-165, 0, -59],
              rotation: userInfo.rotation || 0,
              isMoving: userInfo.isMoving || false,
              isRunning: userInfo.isRunning || false,
              last_updated: userInfo.last_updated || Date.now(),
            };
          }
        });
        
        // Update online avatars state
        setOnlineAvatars(avatars);
      });
      
      // Subscribe to the channel
      channel.subscribe(async (status) => {
        console.log(`Avatar channel status: ${status}`);
        
        if (status === "SUBSCRIBED") {
          console.log("Successfully connected to avatar channel");
          
          // Track our presence with initial position
          try {
            await channel.track({
              username,
              avatar_url: avatarUrl,
              position: [-165, 0, -59], // Initial position
              rotation: 0,
              isMoving: false,
              isRunning: false,
              last_updated: Date.now(),
            });
            console.log("Successfully tracked avatar presence");
          } catch (error) {
            console.error("Failed to track avatar presence:", error);
          }
        }
      });
      
      // Store channel reference
      channelRef.current = channel;
      
      // Handle page close/refresh - untrack presence
      const handleBeforeUnload = () => {
        if (channelRef.current) {
          channelRef.current.untrack();
        }
      };
      
      window.addEventListener("beforeunload", handleBeforeUnload);
      
      // Cleanup function
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
          updateIntervalRef.current = null;
        }
        
        if (channelRef.current) {
          channelRef.current.untrack();
          channelRef.current.unsubscribe();
          channelRef.current = null;
        }
      };
    }
  }, [userId, username, avatarUrl]);
  
  // Function to broadcast avatar position update
  const broadcastPosition = (
    position: Vector3, 
    rotation: number, 
    isMoving: boolean, 
    isRunning: boolean
  ) => {
    if (!channelRef.current) return;
    
    // Check if position or state has changed significantly
    const positionChanged = 
      Math.abs(position.x - lastPositionRef.current.x) > POSITION_THRESHOLD ||
      Math.abs(position.y - lastPositionRef.current.y) > POSITION_THRESHOLD ||
      Math.abs(position.z - lastPositionRef.current.z) > POSITION_THRESHOLD;
      
    const rotationChanged = Math.abs(rotation - lastRotationRef.current) > 0.05;
    
    if (positionChanged || rotationChanged) {
      // Update last known position and rotation
      lastPositionRef.current.copy(position);
      lastRotationRef.current = rotation;
      
      // Broadcast position update
      channelRef.current.send({
        type: "broadcast",
        event: "avatar_update",
        payload: {
          id: userId,
          username,
          avatar_url: avatarUrl,
          position: [position.x, position.y, position.z],
          rotation,
          isMoving,
          isRunning,
          last_updated: Date.now(),
        },
      });
      
      // Also update presence data
      channelRef.current.track({
        username,
        avatar_url: avatarUrl,
        position: [position.x, position.y, position.z],
        rotation,
        isMoving,
        isRunning,
        last_updated: Date.now(),
      });
    }
  };
  
  // Function to manually reconnect
  const reconnect = () => {
    if (channelRef.current) {
      console.log("Attempting to reconnect avatar channel...");
      channelRef.current.unsubscribe();
      channelRef.current.subscribe();
    }
  };
  
  return {
    onlineAvatars,
    broadcastPosition,
    reconnect,
  };
}
