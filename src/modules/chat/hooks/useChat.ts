import { useRef, useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ChatMessage, ChatUser } from "../types/chat";
import { useAIChat } from "./useAIChat";

// Constants
const CHANNEL_NAME = "public-chat";
const MESSAGES_QUERY_KEY = "chat-messages";
const AI_MESSAGES_QUERY_KEY = "ai-chat-messages";
const USERS_QUERY_KEY = "chat-users";
const CLIENT_ID = Math.random().toString(36).substring(2, 15);

export function useChat() {
  const queryClient = useQueryClient();
  const aiChat = useAIChat();
  const [isLoading, setIsLoading] = useState(false);

  // References to maintain state without causing re-renders
  const channelRef = useRef<any>(null);
  const hasJoinedRef = useRef(false);
  const currentUserRef = useRef<ChatUser | null>(null);
  const messageIdsRef = useRef(new Set<string>());

  // Check Supabase configuration
  useEffect(() => {
    console.log(
      "Supabase URL:",
      import.meta.env.VITE_SUPABASE_URL ? "Defined" : "Missing"
    );
    console.log(
      "Supabase key:",
      import.meta.env.VITE_SUPABASE_ANON_KEY ? "Defined" : "Missing"
    );
  }, []);

  // Query for messages with read status
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: [MESSAGES_QUERY_KEY],
    queryFn: () => [], // Empty initial state
    staleTime: Infinity,
    initialData: [],
  });

  // Separate query for AI chat messages
  const { data: aiMessages = [] } = useQuery<ChatMessage[]>({
    queryKey: [AI_MESSAGES_QUERY_KEY],
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  });

  // Connection status tracking
  const { data: connected = false } = useQuery({
    queryKey: ["chat-connection-status"],
    queryFn: () => false,
    staleTime: Infinity,
    initialData: false,
  });

  // Query for online users
  const { data: onlineUsers = [] } = useQuery<ChatUser[]>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: () => [], // Empty initial state
    staleTime: Infinity,
    initialData: [],
  });

  // Add message mutation for public chat
  const addMessage = useMutation({
    mutationFn: (message: ChatMessage) => Promise.resolve(message),
    onSuccess: (newMessage) => {
      // Check if we already have this message to prevent duplicates
      if (messageIdsRef.current.has(newMessage.id)) {
        return;
      }

      messageIdsRef.current.add(newMessage.id);

      queryClient.setQueryData<ChatMessage[]>(
        [MESSAGES_QUERY_KEY],
        (oldMessages = []) => [...oldMessages, newMessage]
      );
    },
  });

  const addAIMessage = useMutation({
    mutationFn: (message: ChatMessage) => Promise.resolve(message),
    onSuccess: (newMessage) => {
      queryClient.setQueryData<ChatMessage[]>(
        [AI_MESSAGES_QUERY_KEY],
        (oldMessages = []) => [...oldMessages, newMessage]
      );
    },
  });

  // Set message as read
  const markMessageAsRead = useMutation({
    mutationFn: (messageId: string) => Promise.resolve(messageId),
    onSuccess: (messageId) => {
      queryClient.setQueryData<ChatMessage[]>(
        [MESSAGES_QUERY_KEY],
        (oldMessages = []) =>
          oldMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
      );
    },
  });

  // Update online users
  const updateOnlineUsers = useMutation({
    mutationFn: (users: ChatUser[]) => Promise.resolve(users),
    onSuccess: (users) => {
      queryClient.setQueryData<ChatUser[]>([USERS_QUERY_KEY], users);
    },
  });

  // Reconnect function
  // Replace the current reconnect function with this:
  const reconnect = () => {
    if (channelRef.current) {
      console.log("Attempting to reconnect to chat channel...");

      // First, unsubscribe from the current channel
      channelRef.current.unsubscribe();

      // Then create a new channel instance
      const user = currentUserRef.current;
      if (user) {
        const newChannel = supabase.channel(CHANNEL_NAME, {
          config: {
            broadcast: { self: true },
            presence: {
              key: user.id,
            },
          },
        });

        // Set up all the same event handlers...
        // (Copy the same event handlers from the original channel setup)

        // Subscribe to the new channel
        newChannel.subscribe(async (status) => {
          // Same subscription handler as before
          console.log(`Chat channel status: ${status}`);

          if (status === "SUBSCRIBED") {
            console.log("Successfully reconnected to chat channel");
            queryClient.setQueryData(["chat-connection-status"], true);

            try {
              await newChannel.track({
                username: user.username,
                avatar_url: user.avatar_url,
                last_seen: Date.now(),
              });
            } catch (error) {
              console.error("Failed to track presence:", error);
            }
          } else if (
            status === "CLOSED" ||
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT"
          ) {
            console.error(`Channel reconnection failed with status: ${status}`);
            queryClient.setQueryData(["chat-connection-status"], false);
          }
        });

        // Update the channel reference
        channelRef.current = newChannel;
      }
    }
  };

  // Initialize the Supabase channel
  const initializeChannel = (user: ChatUser) => {
    // Store current user
    currentUserRef.current = user;

    // Initialize connection state
    queryClient.setQueryData(["chat-connection-status"], false);

    console.log("Initializing chat channel with user:", user.username);

    // Create the channel if it doesn't exist
    if (!channelRef.current) {
      const channel = supabase.channel(CHANNEL_NAME, {
        config: {
          broadcast: { self: true },
          presence: {
            key: user.id,
          },
        },
      });
      console.log("Created channel:", channel);

      // Message handler
      channel.on("broadcast", { event: "message" }, ({ payload }) => {
        console.log("Received message:", payload);
        const message = payload as ChatMessage;
        addMessage.mutate(message);
      });

      // Presence handlers for user join/leave
      channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
        if (newPresences && newPresences.length > 0) {
          const userInfo = newPresences[0] as any;

          // Don't announce if we don't have proper user data yet
          if (!userInfo.username || userInfo.username === "Usuario") {
            return;
          }

          // Create a join message
          const joinMessage: ChatMessage = {
            id: `system-join-${key}-${Date.now()}`,
            sender: "Sistema",
            content: `${userInfo.username} ha entrado al chat.`,
            type: "system",
            timestamp: Date.now(),
            read: false,
          };

          // Broadcast join message if this isn't our join event
          // Our own join event is handled in the checkAndAnnounceJoin function
          if (key !== user.id && !hasJoinedRef.current) {
            channel.send({
              type: "broadcast",
              event: "message",
              payload: joinMessage,
            });
          }
        }
      });

      channel.on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
        if (leftPresences && leftPresences.length > 0) {
          const userInfo = leftPresences[0] as any;

          if (userInfo && userInfo.username && key !== user.id) {
            // Create a leave message
            const leaveMessage: ChatMessage = {
              id: `system-leave-${key}-${Date.now()}`,
              sender: "Sistema",
              content: `${userInfo.username} ha salido del chat.`,
              type: "system",
              timestamp: Date.now(),
              read: false,
            };

            // Broadcast leave message
            channel.send({
              type: "broadcast",
              event: "message",
              payload: leaveMessage,
            });
          }
        }
      });

      channel.on("presence", { event: "sync" }, () => {
        console.log("Presence state synchronized");
        // Get list of online users from presence state
        const presenceState = channel.presenceState();
        const users = Object.entries(presenceState).map(
          ([userId, presences]) => {
            const userInfo = presences[0] as any;
            return {
              id: userId,
              username: userInfo.username || "Usuario",
              avatar_url: userInfo.avatar_url,
              last_seen: userInfo.last_seen || Date.now(),
            };
          }
        );

        console.log("Online users:", users);

        // Update online users list
        updateOnlineUsers.mutate(users);
      });

      // Subscribe to the channel
      channel.subscribe(async (status) => {
        console.log(`Chat channel status: ${status}`);

        if (status === "SUBSCRIBED") {
          console.log("Successfully connected to chat channel");
          // Set connected status to true
          queryClient.setQueryData(["chat-connection-status"], true);

          // Track our presence
          try {
            await channel.track({
              username: user.username,
              avatar_url: user.avatar_url,
              last_seen: Date.now(),
            });
            console.log("Successfully tracked presence");
          } catch (error) {
            console.error("Failed to track presence:", error);
          }
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          console.error(`Channel disconnected with status: ${status}`);
          // Set connected status to false on disconnection
          queryClient.setQueryData(["chat-connection-status"], false);
        } else if (status === "TIMED_OUT") {
          console.error("Channel subscription timed out");
          queryClient.setQueryData(["chat-connection-status"], false);
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

      // Set up reconnection interval
      const reconnectInterval = setInterval(() => {
        if (!queryClient.getQueryData(["chat-connection-status"])) {
          console.log("Still not connected, attempting to reconnect...");
          reconnect();
        }
      }, 5000); // Try to reconnect every 5 seconds

      // Add cleanup
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        clearInterval(reconnectInterval);
        if (channelRef.current) {
          channelRef.current.untrack();
          // We don't unsubscribe to keep connection alive between page navigations
        }
      };
    }
  };

  // Check and announce join if needed
  const checkAndAnnounceJoin = (user: ChatUser) => {
    if (!channelRef.current || hasJoinedRef.current || !user.username) {
      return;
    }

    console.log("Announcing join for user:", user.username);

    // Create join message for self
    const joinMessage: ChatMessage = {
      id: `system-join-${user.id}-${Date.now()}`,
      sender: "Sistema",
      content: `${user.username} ha entrado al chat.`,
      type: "system",
      timestamp: Date.now(),
      read: true, // Mark as read since it's our own join
    };

    // Broadcast to others and add to our own messages
    channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: joinMessage,
    });

    // Also add directly to our messages to ensure we see it
    addMessage.mutate(joinMessage);

    // Mark as joined
    hasJoinedRef.current = true;
  };

  const initializeWelcomeMessages = () => {
    if (messages.length === 0) {
      console.log("Initializing welcome messages");
      const welcomeMessages: ChatMessage[] = [
        {
          id: "system-welcome",
          sender: "Sistema",
          content: "¡Bienvenido a la Tienda Virtual!",
          type: "system",
          timestamp: Date.now(),
          read: true,
        },
        {
          id: "admin-tip",
          sender: "Admin",
          content:
            "Explora y añade productos a tu carrito. Puedes chatear con otros usuarios aquí.",
          type: "admin",
          timestamp: Date.now() + 100,
          read: true,
        },
      ];

      queryClient.setQueryData([MESSAGES_QUERY_KEY], welcomeMessages);
      welcomeMessages.forEach((msg) => messageIdsRef.current.add(msg.id));
    }

    // Initialize AI welcome message if needed
    if (aiMessages.length === 0) {
      const aiWelcomeMessage: ChatMessage = {
        id: "ai-welcome",
        sender: "Asistente IA",
        content: "Hola, soy el asistente virtual. ¿En qué puedo ayudarte?",
        type: "system",
        timestamp: Date.now(),
        read: true,
      };

      queryClient.setQueryData([AI_MESSAGES_QUERY_KEY], [aiWelcomeMessage]);
    }
  };

  // Send a message to the public chat
  const sendMessage = async (content: string, recipientAI: boolean = false) => {
    if (!content.trim() || !currentUserRef.current) {
      console.log(
        "Cannot send message - missing content or user not initialized"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: `msg-${CLIENT_ID}-${Date.now()}`,
        sender: currentUserRef.current.username,
        sender_id: currentUserRef.current.id,
        content,
        type: "user",
        timestamp: Date.now(),
        read: true, // Our own messages are always read
      };

      if (recipientAI) {
        // Handle as AI message
        console.log("Sending message to AI:", content);

        // Create user message for AI chat with a different ID
        const aiUserMessage = {
          ...userMessage,
          id: `ai-msg-${CLIENT_ID}-${Date.now()}`,
        };

        // Add to AI chat history
        addAIMessage.mutate(aiUserMessage);

        // Collect context from previous AI messages (last 5)
        const contextMessages = aiMessages.slice(-5);

        // Get AI response
        const aiResponse = await aiChat.sendMessage([
          ...contextMessages,
          aiUserMessage,
        ]);

        // Add AI response to AI chat history
        addAIMessage.mutate({
          ...aiResponse,
          timestamp: Date.now(),
          read: true,
        });
      } else {
        // Handle as regular message to public chat
        console.log("Sending message to public chat:", content);

        // Broadcast user message to all clients
        channelRef.current.send({
          type: "broadcast",
          event: "message",
          payload: userMessage,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);

      if (recipientAI) {
        // Add error message to AI chat
        addAIMessage.mutate({
          id: `ai-error-${Date.now()}`,
          sender: "Sistema",
          content:
            "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
          type: "system",
          timestamp: Date.now(),
          read: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear AI chat history
  const clearAIChat = () => {
    queryClient.setQueryData([AI_MESSAGES_QUERY_KEY], []);
  };

  return {
    // Include existing return values
    messages,
    onlineUsers,
    connected,
    sendMessage,
    markAsRead: (messageId: string) => markMessageAsRead.mutate(messageId),
    isLoading: isLoading || aiChat.isLoading,
    initializeChannel,
    checkAndAnnounceJoin,
    initializeWelcomeMessages,
    reconnect,

    // Add new return values for AI chat
    aiMessages,
    clearAIChat,
  };
}
