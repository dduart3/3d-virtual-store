import { useState, useEffect, useRef } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ChatMessage, ChatUser } from "../types/chat";
import { useSocket } from "../../experience/multiplayer/context/SocketProvider";
import { useAuth } from "../../auth/hooks/useAuth";

// Constants
const MESSAGES_QUERY_KEY = "chat-messages";
const USERS_QUERY_KEY = "chat-users";
const CLIENT_ID = Math.random().toString(36).substring(2, 15);

export function useSocketChat() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();
  const { profile } = useAuth();
  const [isLoading] = useState(false);

  // References to maintain state without causing re-renders
  const messageIdsRef = useRef(new Set<string>());

  // Query for messages with read status
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: [MESSAGES_QUERY_KEY],
    queryFn: () => [], // Empty initial state
    staleTime: Infinity,
    initialData: [],
  });

  // Query for online users
  const { data: onlineUsers = [] } = useQuery<ChatUser[]>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (message: Omit<ChatMessage, "id" | "timestamp">) => {
      if (!socket || !isConnected) {
        throw new Error("Socket not connected");
      }

      const fullMessage: ChatMessage = {
        ...message,
        id: `${CLIENT_ID}-${Date.now()}`,
        timestamp: Date.now(),
      };

      socket.emit("chat:message", fullMessage);
      return fullMessage;
    },
    onSuccess: (message) => {
      // Optimistically update the messages list
      queryClient.setQueryData<ChatMessage[]>(
        [MESSAGES_QUERY_KEY],
        (old = []) => [...old, message]
      );
    },
  });

  // Effect to handle socket events
  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages
    const handleMessage = (message: ChatMessage) => {
      // Avoid duplicate messages
      if (messageIdsRef.current.has(message.id)) return;
      messageIdsRef.current.add(message.id);

      // Update messages query data
      queryClient.setQueryData<ChatMessage[]>(
        [MESSAGES_QUERY_KEY],
        (old = []) => [...old, { ...message, read: false }]
      );
    };
 
    // Handle user list updates
    const handleUsersInitial = (users: ChatUser[]) => {
      queryClient.setQueryData([USERS_QUERY_KEY], users);
    };

    const handleUserJoin = (user: ChatUser) => {
      queryClient.setQueryData<ChatUser[]>([USERS_QUERY_KEY], (old = []) => [
        ...old.filter((u) => u.id !== user.id),
        user,
      ]);
    };

    const handleUserDisconnect = (userId: string) => {
      queryClient.setQueryData<ChatUser[]>([USERS_QUERY_KEY], (old = []) =>
        old.filter((user) => user.id !== userId)
      );
    };

    // Subscribe to socket events
    socket.on("chat:message", handleMessage);
    socket.on("users:initial", handleUsersInitial);
    socket.on("user:join", handleUserJoin);
    socket.on("user:disconnect", handleUserDisconnect);

    // Subscribe to AI chat events
    //aiChat.onResponse(handleAIResponse);

    return () => {
      // Unsubscribe from socket events
      socket.off("chat:message", handleMessage);
      socket.off("users:initial", handleUsersInitial);
      socket.off("user:join", handleUserJoin);
      socket.off("user:disconnect", handleUserDisconnect);
    };
  }, [socket, queryClient, profile]);

  // Mark message as read
  const markAsRead = (messageId: string) => {
    if (!socket || !isConnected) return;

    socket.emit("chat:read", messageId);

    queryClient.setQueryData<ChatMessage[]>([MESSAGES_QUERY_KEY], (old = []) =>
      old.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
  };

  // Send a new message
  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    return sendMessageMutation.mutate({
      sender: profile?.username || "Usuario",
      sender_id: profile?.id,
      content,
      type: "user",
      read: true,
    });
  };

  return {
    messages,
    onlineUsers,
    sendMessage,
    markAsRead,
    isLoading: isLoading || sendMessageMutation.isPending,
  };
}
