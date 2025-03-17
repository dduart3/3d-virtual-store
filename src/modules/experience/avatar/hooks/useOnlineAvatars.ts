import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { onlineAvatarsAtom, currentUserIdAtom, OnlineAvatar } from "../state/onlineAvatars";
import { Vector3 } from "three";
import { supabase } from "../../../../lib/supabase";

export function useOnlineAvatars(userId: string, username: string, avatarUrl: string) {
  const [onlineAvatars, setOnlineAvatars] = useAtom(onlineAvatarsAtom);
  const [, setCurrentUserId] = useAtom(currentUserIdAtom);
  const channelRef = useRef<any>(null);
  
  // Track last broadcast values to avoid unnecessary updates
  const lastBroadcastRef = useRef({
    position: new Vector3(),
    rotation: 0,
    isMoving: false,
    isRunning: false,
    timestamp: 0
  });
  
  // Set up Supabase Realtime channel for avatar synchronization
  useEffect(() => {
    if (!userId) return;
    
    console.log("Setting up avatar synchronization for:", username);
    setCurrentUserId(userId);
    
    // Create a Supabase Realtime channel if it doesn't exist
    if (!channelRef.current) {
      const channel = supabase.channel('avatars', {
        config: {
          broadcast: { self: false },
          presence: {
            key: userId,
          },
        },
      });
      
      // Handle avatar position updates
      channel.on('broadcast', { event: 'avatar_update' }, ({ payload }) => {
        const avatarData = payload as OnlineAvatar;
        
        setOnlineAvatars(prev => ({
          ...prev,
          [avatarData.id]: {
            ...avatarData,
            position: new Vector3(
              avatarData.position.x,
              avatarData.position.y,
              avatarData.position.z
            ),
            lastUpdated: Date.now()
          }
        }));
      });
      
      // Handle presence events (users joining)
      channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        
        if (newPresences && newPresences.length > 0 && key !== userId) {
          const presence = newPresences[0] as any;
          
          setOnlineAvatars(prev => ({
            ...prev,
            [key]: {
              id: key,
              username: presence.username || 'Usuario',
              avatar_url: presence.avatar_url || '',
              position: new Vector3(
                presence.position?.x || -165,
                presence.position?.y || 0,
                presence.position?.z || -59
              ),
              rotation: presence.rotation || 0,
              isMoving: presence.isMoving || false,
              isRunning: presence.isRunning || false,
              lastUpdated: Date.now()
            }
          }));
        }
      });
      
      // Handle presence events (users leaving)
      channel.on('presence', { event: 'leave' }, ({ key }) => {
        console.log('User left:', key);
        
        if (key !== userId) {
          setOnlineAvatars(prev => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
        }
      });
      
      // Handle presence sync
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state synchronized:', state);
        
        // Update our state with all online users
        const avatars: Record<string, OnlineAvatar> = {};
        
        Object.entries(state).forEach(([key, presences]) => {
          if (key !== userId && presences.length > 0) {
            const presence = presences[0] as any;
            
            avatars[key] = {
              id: key,
              username: presence.username || 'Usuario',
              avatar_url: presence.avatar_url || '',
              position: new Vector3(
                presence.position?.x || -165,
                presence.position?.y || 0,
                presence.position?.z || -59
              ),
              rotation: presence.rotation || 0,
              isMoving: presence.isMoving || false,
              isRunning: presence.isRunning || false,
              lastUpdated: Date.now()
            };
          }
        });
        
        setOnlineAvatars(avatars);
      });
      
      // Subscribe to the channel
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track our presence
          await channel.track({
            username,
            avatar_url: avatarUrl,
            position: { x: -165, y: 0, z: -59 },
            rotation: 0,
            isMoving: false,
            isRunning: false
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
  const broadcastPosition = (
    position: Vector3,
    rotation: number,
    isMoving: boolean,
    isRunning: boolean
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
    
    // Broadcast at least every 100ms if moving, or 1000ms if stationary
    const minInterval = isMoving ? 100 : 1000;
    
    if (positionChanged || rotationChanged || movementChanged || timeSinceLastBroadcast > minInterval) {
      // Update last broadcast values
      lastBroadcastRef.current = {
        position: position.clone(),
        rotation,
        isMoving,
        isRunning,
        timestamp: now
      };
      
      // Broadcast update
      channelRef.current.send({
        type: 'broadcast',
        event: 'avatar_update',
        payload: {
          id: userId,
          username: channelRef.current.presenceState()[userId]?.[0]?.username || 'Usuario',
          avatar_url: channelRef.current.presenceState()[userId]?.[0]?.avatar_url || '',
          position,
          rotation,
          isMoving,
          isRunning,
          lastUpdated: now
        }
      });
      
      // Update presence data
      channelRef.current.track({
        username: channelRef.current.presenceState()[userId]?.[0]?.username || 'Usuario',
        avatar_url: channelRef.current.presenceState()[userId]?.[0]?.avatar_url || '',
        position: { x: position.x, y: position.y, z: position.z },
        rotation,
        isMoving,
        isRunning
      });
    }
  };
  
  return {
    onlineAvatars,
    broadcastPosition
  };
}