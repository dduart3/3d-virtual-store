import { useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAtom } from 'jotai';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { chatInputFocusedAtom } from '../state/chat';
import { useAuth } from '../../auth/hooks/useAuth';

export interface ChatMessage {
  id: string;
  sender: string;
  sender_id?: string;
  content: string;
  type: 'system' | 'admin' | 'user';
  timestamp: number;
}

// Generate a unique ID for this user session
const USER_ID = Math.random().toString(36).substring(2, 15);
const CHANNEL = 'public-chat';
const MESSAGES_QUERY_KEY = 'chat-messages';

export function useChat() {
  // Use TanStack Query for messages
  const queryClient = useQueryClient();
  
  // Get current user profile using your existing hook
  const { profile } = useAuth();
  
  const [, setInputFocused] = useAtom(chatInputFocusedAtom);
  const channelRef = useRef<any>(null);
  
  // Store connection status
  const { data: connected = false } = useQuery({
    queryKey: ['chat-connection-status'],
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
      // In a real implementation, you might want to post to your API
      // This is just a local update
      return Promise.resolve(message);
    },
    onSuccess: (newMessage) => {
      // Update the cached messages with the new one
      queryClient.setQueryData<ChatMessage[]>(
        [MESSAGES_QUERY_KEY],
        (oldMessages = []) => {
          // Check if we already have this message (to prevent duplicates)
          if (oldMessages.some(m => m.id === newMessage.id)) {
            return oldMessages;
          }
          return [...oldMessages, newMessage];
        }
      );
    },
  });

  // Set up the Realtime subscription
  useEffect(() => {
    if (!channelRef.current) {
      console.log('Creating new chat channel subscription');
      
      const channel = supabase.channel(CHANNEL, {
        config: {
          broadcast: { self: true } // We'll handle deduplication in addMessage
        }
      });

      // When a new message arrives
      channel
        .on('broadcast', { event: 'message' }, (payload) => {
          const message = payload.payload as ChatMessage;
          // Use the mutation to add the message
          addMessage.mutate(message);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Connected to chat channel');
            // Update connection status
            queryClient.setQueryData(['chat-connection-status'], true);
            
            // Add welcome messages if there are none
            if (messages.length === 0) {
              const welcomeMessages = [
                {
                  id: 'system-welcome',
                  sender: 'Sistema',
                  content: '¡Bienvenido a la Tienda Virtual!',
                  type: 'system' as const,
                  timestamp: Date.now()
                },
                {
                  id: 'admin-tip',
                  sender: 'Admin',
                  content: 'Explora y añade productos a tu carrito.',
                  type: 'admin' as const,
                  timestamp: Date.now() + 100
                }
              ];
              
              // Add welcome messages to cache
              queryClient.setQueryData([MESSAGES_QUERY_KEY], welcomeMessages);
            }
            
            // Announce that a new user joined if we have a profile
            if (profile) {
              const username = profile.username || profile.full_name || 'Usuario';
              channel.send({
                type: 'broadcast',
                event: 'message',
                payload: {
                  id: `system-join-${Date.now()}`,
                  sender: 'Sistema',
                  content: `${username} se ha unido al chat.`,
                  type: 'system',
                  timestamp: Date.now()
                }
              });
            }
          }
        });

      // Store the channel reference
      channelRef.current = channel;
    }

    return () => {
      // We don't unsubscribe here to maintain the connection
    };
  }, [profile, queryClient, messages.length, addMessage]);

  // Send a message to all connected clients
  const sendMessage = (content: string) => {
    if (!content.trim() || !channelRef.current) return;
    
    const username = profile ? (profile.username || profile.full_name || 'Usuario') : 'Usuario';
    
    const newMessage: ChatMessage = {
      id: `${USER_ID}-${Date.now()}`,
      sender: username,
      sender_id: profile?.id,
      content,
      type: 'user',
      timestamp: Date.now()
    };
    
    // Broadcast the message to all clients
    channelRef.current.send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage
    });
  };

  return {
    messages,
    sendMessage,
    connected,
    setInputFocused,
    username: profile ? (profile.username || profile.full_name || 'Usuario') : 'Usuario',
    userId: profile?.id
  };
}
