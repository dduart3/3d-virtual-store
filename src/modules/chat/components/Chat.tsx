import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { chatInputFocusedAtom } from "../state/chat";
import { useAIChat } from '../hooks/useAIChat';

// In a real implementation, this would come from your socket connection

const mockMessages = [
  {
    id: 1,
    sender: "Sistema",
    content: "¡Bienvenido a la Tienda Virtual!",
    read: false,
    type: "system",
  },
  {
    id: 2,
    sender: "Admin",
    content: "Explora y añade productos a tu carrito.",
    read: false,
    type: "admin",
  },
  {
    id: 3,
    sender: "Usuario",
    content: "¿Cómo puedo ver los detalles del producto?",
    read: false,
    type: "user",
  },
];

export const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setChatInputFocused] = useAtom(chatInputFocusedAtom);
  const [activeTab, setActiveTab] = useState<'chat' | 'ai'>('chat');

  const [messages, setMessages] = useState(mockMessages);
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: "AI Assistant",
      content: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?",
      read: false,
      type: "system",
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(
    mockMessages.filter((msg) => !msg.read).length
  );
  const [newMessage, setNewMessage] = useState("");

  // Format unread count with 99+ cap
  const formattedUnreadCount =
    unreadCount > 99 ? "99+" : unreadCount.toString();

  // Mark all messages as read when opening the chat
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({ ...msg, read: true }))
      );
      setUnreadCount(0);
    }
  }, [isOpen, unreadCount]);

  const { isLoading, sendMessage } = useAIChat();
  // Remove isTyping state

  const handleSendMessage = async () => {
    if (newMessage.trim() && !isLoading) {
      const message = {
        id: (activeTab === 'chat' ? messages : aiMessages).length + 1,
        sender: activeTab === 'chat' ? "Usuario" : "User",
        content: newMessage,
        read: true,
        type: "user",
      };

      if (activeTab === 'chat') {
        setMessages(prev => [...prev, message]);
        setNewMessage("");
        setChatInputFocused(false);
      } else {
        try {
          const updatedMessages = [...aiMessages, message];
          setAiMessages(updatedMessages);
          setNewMessage("");
          setChatInputFocused(false);

          const aiMessage = await sendMessage(updatedMessages);
          setAiMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Failed to get AI response:', error);
          const errorMessage = {
            id: aiMessages.length + 2,
            sender: "System",
            content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
            read: true,
            type: "system",
          };
          setAiMessages(prev => [...prev, errorMessage]);
        }
      }
    }
  };

  // Add tab change handler
  const handleTabChange = (tab: 'chat' | 'ai') => {
    setActiveTab(tab);
    setChatInputFocused(false); // Release focus when switching tabs
  };

  // Update the tab buttons to use the new handler
  return (
    <div className="absolute bottom-5 left-5 pointer-events-auto">
      <div
        className={`bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 flex flex-col transition-all duration-300 
        ${!isOpen ? "w-60 h-10" : "w-96 h-64"}`}
      >
        {/* Chat Header with unread count */}
        <div
          className="p-2 border-b border-white/20 flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-white flex items-center">
            <div
              className={`w-2 h-2 rounded-full ${unreadCount > 0 ? "bg-red-500 animate-pulse" : "bg-green-500"
                } mr-2`}
            ></div>
            <span>
              {!isOpen && unreadCount > 0
                ? `Chat (${formattedUnreadCount} mensaje${unreadCount > 1 ? "s" : ""
                } nuevo${unreadCount > 1 ? "s" : ""})`
                : "Chat"}
            </span>
          </div>
          <button className="text-white/70 hover:text-white">
            {!isOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* Tab Switcher - Only visible when chat is open */}
        {isOpen && (
          <div className="flex border-b border-white/20">
            <button
              className={`flex-1 p-2 text-sm ${activeTab === 'chat'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
                }`}
              onClick={() => handleTabChange('chat')}
            >
              Chat
            </button>
            <button
              className={`flex-1 p-2 text-sm ${activeTab === 'ai'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
                }`}
              onClick={() => handleTabChange('ai')}
            >
              Asistente AI
            </button>
          </div>
        )}

        {/* Chat Messages - Hidden when closed */}
        <div
          className={`flex-1 p-3 overflow-auto transition-all ${!isOpen ? "hidden" : "block"
            }`}
        >
          {/* Chat Messages section */}
          <div className={`flex-1 p-3 overflow-auto transition-all ${!isOpen ? "hidden" : "block"}`}>
            {/* Only show messages corresponding to the active tab */}
            {activeTab === 'chat' ? (
              // General chat messages
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`text-sm mb-1 ${message.type === "system"
                    ? "text-green-400"
                    : message.type === "admin"
                      ? "text-blue-400"
                      : "text-white"
                    }`}
                >
                  <span className="text-yellow-400">{message.sender}:</span>{" "}
                  {message.content}
                  {!message.read && (
                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block" />
                  )}
                </div>
              ))
            ) : (
              // AI chat messages
              <>
                {aiMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`text-sm mb-1 ${message.type === "system"
                      ? "text-green-400"
                      : "text-white"
                      }`}
                  >
                    <span className="text-yellow-400">{message.sender}:</span>{" "}
                    {message.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="text-sm text-gray-400 italic">
                    El asistente está escribiendo...
                  </div>
                )}
              </>
            )}
          </div>
          {/* Remove this line that uses isTyping */}
          {/* Chat Input section continues... */}
        </div>

        {/* Chat Input - Hidden when closed */}
        <div
          className={`p-2 border-t border-white/20 flex transition-all ${!isOpen ? "hidden" : "block"
            }`}
        >
          <input
            type="text"
            placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu mensaje..."}
            className="flex-1 bg-black/40 text-white p-2 rounded border border-white/30 text-sm focus:outline-none focus:border-white/50"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            onFocus={() => setChatInputFocused(true)}
            onBlur={() => setChatInputFocused(false)}
            disabled={isLoading}
          />
          <button
            className={`ml-2 px-3 rounded ${isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20"
              } text-white`}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
