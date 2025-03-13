import { useEffect, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import { useAtom } from "jotai";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { chatInputFocusedAtom } from "../state/chat";
import { useAuth } from "../../auth/hooks/useAuth";
import { ChatMessage } from "../types/chat";

// Generate a unique ID for this user session
const USER_ID = Math.random().toString(36).substring(2, 15);
const CHANNEL = "public-chat";
const MESSAGES_QUERY_KEY = "chat-messages";

// Store already announced sessions in sessionStorage to persist across refreshes
const getAnnouncedSessions = () => {
  try {
    return JSON.parse(sessionStorage.getItem("announced-chat-joins") || "[]");
  } catch (e) {
    return [];
  }
};

const addAnnouncedSession = (userId: string) => {
  try {
    const sessions = getAnnouncedSessions();
    if (!sessions.includes(userId)) {
      sessions.push(userId);
      sessionStorage.setItem("announced-chat-joins", JSON.stringify(sessions));
    }
  } catch (e) {
    console.error("Error storing announced session", e);
  }
};

export function useChat() {
  // Use TanStack Query for messages
  const queryClient = useQueryClient();

  // Get current user profile using your existing hook
  const { profile } = useAuth();
  const [, setInputFocused] = useAtom(chatInputFocusedAtom);
  const channelRef = useRef<any>(null);

  // Track if this user has already been announced in this session
  const hasAnnouncedRef = useRef<boolean>(false);

  // Track if we have a valid username to use for announcements
  const hasValidUsername =
    profile &&
    (profile.username || profile.full_name) &&
    (profile.username !== "" || profile.full_name !== "");

  // Track presence state - who's currently online
  const presenceRef = useRef<Record<string, any>>({});

  // Store connection status
  const { data: connected = false } = useQuery({
    queryKey: ["chat-connection-status"],
    queryFn: () => false, // Initial value
    staleTime: Infinity,
  });

  // Query for messages
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: [MESSAGES_QUERY_KEY],
    queryFn: () => [], // Start with empty array
    staleTime: Infinity, // Never refetch automatically
  });

  // Mutation to add a new message
  const addMessage = useMutation({
    mutationFn: (message: ChatMessage) => {
      return Promise.resolve(message);
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData<ChatMessage[]>(
        [MESSAGES_QUERY_KEY],
        (oldMessages = []) => {
          // Check if we already have this message (to prevent duplicates)
          if (oldMessages.some((m) => m.id === newMessage.id)) {
            return oldMessages;
          }
          return [...oldMessages, newMessage];
        }
      );
    },
  });

  // Helper function to announce user disconnect
  const announceDisconnect = (userId: string, username: string) => {
    if (!channelRef.current) return;

    console.log(`User disconnected: ${username} (${userId})`);

    channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: `system-disconnect-${userId}-${Date.now()}`,
        sender: "Sistema",
        content: `${username} se ha desconectado.`,
        type: "system",
        timestamp: Date.now(),
      },
    });
  };

  // Set up the channel subscription only once
  useEffect(() => {
    if (!channelRef.current && profile) {
      console.log("Creating new chat channel subscription");

      const channel = supabase.channel(CHANNEL, {
        config: {
          broadcast: { self: true },
          presence: {
            key: profile.id,
          },
        },
      });

      // When a new message arrives
      channel
        .on("broadcast", { event: "message" }, (payload) => {
          const message = payload.payload as ChatMessage;
          addMessage.mutate(message);
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          console.log(`User left with key: ${key}`);

          // Find the user info from the left presence
          if (leftPresences && leftPresences.length > 0) {
            const userInfo = leftPresences[0];
            if (userInfo && userInfo.username) {
              announceDisconnect(key, userInfo.username);
            }
          }
        })
        .on("presence", { event: "sync" }, () => {
          const newState = channel.presenceState();

          // Check for users who have left by comparing with our previous state
          Object.keys(presenceRef.current).forEach((userId) => {
            if (!newState[userId]) {
              const userInfo = presenceRef.current[userId]?.[0];
              if (userInfo && userInfo.username) {
                announceDisconnect(userId, userInfo.username);
              }
            }
          });

          // Update our reference
          presenceRef.current = newState;
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("Connected to chat channel");
            queryClient.setQueryData(["chat-connection-status"], true);

            // Add welcome messages if there are none
            if (messages.length === 0) {
              const welcomeMessages = [
                {
                  id: "system-welcome",
                  sender: "Sistema",
                  content: "¡Bienvenido a la Tienda Virtual!",
                  type: "system" as const,
                  timestamp: Date.now(),
                },
                {
                  id: "admin-tip",
                  sender: "Admin",
                  content: "Explora y añade productos a tu carrito.",
                  type: "admin" as const,
                  timestamp: Date.now() + 100,
                },
              ];

              queryClient.setQueryData([MESSAGES_QUERY_KEY], welcomeMessages);
            }

            // Track our own presence once connected
            if (profile) {
              channel.track({
                user_id: profile.id,
                username: profile.username || profile.full_name || "Usuario",
                avatar_url: profile.avatar_url,
              });
            }
          }
        });

      // Store the channel reference
      channelRef.current = channel;

      // Setup beforeunload handler to untrack presence when page closes
      const handleBeforeUnload = () => {
        if (channelRef.current) {
          channelRef.current.untrack();
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Clean up function
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        if (channelRef.current && profile) {
          channelRef.current.untrack();
        }
      };
    }

    return () => {};
  }, [profile, queryClient, messages.length, addMessage]);

  // Separate effect to handle join announcements
  // This will re-run whenever profile changes or hasValidUsername changes
  useEffect(() => {
    // Only proceed if we have a valid channel, profile, valid username,
    // and we haven't announced yet
    if (
      channelRef.current &&
      profile &&
      hasValidUsername &&
      !hasAnnouncedRef.current
    ) {
      const announcedSessions = getAnnouncedSessions();

      if (!announcedSessions.includes(profile.id)) {
        const username = profile.username || profile.full_name;
        console.log(`Announcing user join for ${username} (${profile.id})`);

        // Create join message
        const joinMessage: ChatMessage = {
          id: `system-join-${profile.id}-${Date.now()}`,
          sender: "Sistema",
          content: `${username} se ha unido al chat.`,
          type: "system",
          read: false,
        };

        // Broadcast the message
        channelRef.current.send({
          type: "broadcast",
          event: "message",
          payload: joinMessage,
        });

        // Also add it to our local messages state
        // to ensure we see our own join message
        addMessage.mutate(joinMessage);

        hasAnnouncedRef.current = true;
        addAnnouncedSession(profile.id);
      } else {
        hasAnnouncedRef.current = true;
      }
    }
  }, [profile, hasValidUsername, addMessage]);

  // Send a message to all connected clients
  const sendMessage = (content: string) => {
    if (!content.trim() || !channelRef.current) return;

    const username = profile
      ? profile.username || profile.full_name || "Usuario"
      : "Usuario";

    const newMessage: ChatMessage = {
      id: `${USER_ID}-${Date.now()}`,
      sender: username,
      sender_id: profile?.id,
      content,
      type: "user",
      read: false,
    };

    // Broadcast the message to all clients
    channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: newMessage,
    });
  };

  return {
    messages,
    sendMessage,
    connected,
    setInputFocused,
    username: profile
      ? profile.username || profile.full_name || "Usuario"
      : "Usuario",
    userId: profile?.id,
  };
}
