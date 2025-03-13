import { useMutation } from '@tanstack/react-query';
import { storeData } from '../../experience/store/data/store-sections';
import { ChatMessage } from '../types/chat';
import { getAIModel } from '../../../lib/ai';
import { formatStoreData, createAIPreamble } from '../utils/chat';

export function useAIChat() {
  // Use TanStack Query's useMutation for better request handling
  const mutation = useMutation({
    mutationFn: async (messages: ChatMessage[]): Promise<ChatMessage> => {
      if (messages.length === 0) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'Asistente IA',
          content: "No hay mensajes para procesar.",
          read: true,
          type: 'system',
          timestamp: Date.now()
        };
      }

      try {
        // Get AI model
        const model = getAIModel();
        
        // Format the store data and get the last user message
        const lastMessage = messages[messages.length - 1].content;
        const storeContext = formatStoreData(storeData);
        const contextoPreamble = createAIPreamble(storeContext);

        // Initialize chat
        const chat = model.startChat();

        // Send message with context
        const prompt = `${contextoPreamble}\n\nPregunta del usuario: ${lastMessage}`;
        const result = await chat.sendMessage(prompt);
        const response = result.response.text() || "Lo siento, no pude procesar tu mensaje.";

        // Return formatted AI response
        return {
          id: `msg-${Date.now()}`,
          sender: 'Asistente IA',
          content: response,
          read: true,
          type: 'system',
          timestamp: Date.now()
        };
      } catch (error) {
        console.error("AI Chat Error:", error);
        throw new Error("No pudimos procesar tu mensaje. Por favor, intenta de nuevo más tarde.");
      }
    }
  });

  const sendMessage = async (messages: ChatMessage[]): Promise<ChatMessage> => {
    return await mutation.mutateAsync(messages);
  };

  return {
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    sendMessage
  };
}
