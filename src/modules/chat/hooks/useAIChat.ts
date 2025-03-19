import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storeData } from "../../experience/store/data/store-sections";
import { ChatMessage } from "../types/chat";
import { getAIModel } from "../../../lib/ai";
import { formatStoreData, createAIPreamble } from "../utils/chat";
import { useAuth } from "../../auth/hooks/useAuth";

const AI_MESSAGES_QUERY_KEY = "ai-chat-messages";

export function useAIChat() {
  const queryClient = useQueryClient();

  const { profile } = useAuth();

  const { data: aiMessages = [] } = useQuery<ChatMessage[]>({
    queryKey: [AI_MESSAGES_QUERY_KEY],
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  });

  
  const sendMessageToAIModel = useMutation({
    mutationFn: async (message: ChatMessage): Promise<ChatMessage> => {
      if (!message.content) {
        return {
          id: `msg-${Date.now()}`,
          sender: "Asistente IA",
          content: "No hay mensajes para procesar.",
          read: true,
          type: "system",
          timestamp: Date.now(),
        };
      }

      // Get AI model
      const model = getAIModel();

      // Format the store data and get the last user message

      const storeContext = formatStoreData(storeData);
      const contextoPreamble = createAIPreamble(storeContext);

      // Initialize chat
      const chat = model.startChat();

      // Send message with context
      const prompt = `${contextoPreamble}\n\nPregunta del usuario: ${message.content}`;
      const result = await chat.sendMessage(prompt);
      const response =
        result.response.text() || "Lo siento, no pude procesar tu mensaje.";

      // Return formatted AI response
      return {
        id: `ai-msg-${Date.now()}`,
        sender: "Asistente IA",
        content: response,
        read: true,
        type: "system",
        timestamp: Date.now(),
      };
    }
  });

  const sendAIMessageMutation = useMutation({
    mutationFn: async (message: Omit<ChatMessage, "id" | "timestamp">) => {
      if (!profile) {
        throw new Error("No profile found");
      }
      const fullMessage: ChatMessage = {
        ...message,
        id: `ai-msg-${Date.now()}`,
        timestamp: Date.now(),
      };

      const aiResponse = await sendMessageToAIModel.mutateAsync(fullMessage);

      return [fullMessage, aiResponse] ;
    },
    onSuccess: (message) => {
      // Optimistically update the messages list
      queryClient.setQueryData<ChatMessage[]>(
        [AI_MESSAGES_QUERY_KEY],
        (old = []) => [...old, ...message,]
      );
    },
  });


  const sendAIMessage = (content: string) => {
    if (!content.trim()) return;
    return sendAIMessageMutation.mutate({
      sender: profile?.username || "Usuario",
      sender_id: profile?.id,
      content,
      type: "user",
      read: true,
    });
  };

    const initializeAIWelcomeMessages = () => {
    
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

  return {
    isLoading: sendAIMessageMutation.isPending,
    isError: sendAIMessageMutation.isError,
    error: sendAIMessageMutation.error,
    aiMessages,
    initializeAIWelcomeMessages,
    sendAIMessage,
  };
}