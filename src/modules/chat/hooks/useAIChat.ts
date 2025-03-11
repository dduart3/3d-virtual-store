import { useState } from 'react';
import { getAIResponse, AIMessage } from '../services/aiService';

export function useAIChat() {
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (messages: AIMessage[]): Promise<AIMessage> => {
        setIsLoading(true);
        try {
            const aiResponse = await getAIResponse(messages);
            return {
                id: messages.length + 2,
                sender: 'AI Assistant',
                content: aiResponse,
                read: true,
                type: 'system'
            };
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        sendMessage
    };
}