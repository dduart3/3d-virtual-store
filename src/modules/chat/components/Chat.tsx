import { useAtom } from "jotai";
import { useState, useEffect, useRef } from "react";
import { chatInputFocusedAtom } from "../state/chat";
import { useChat } from "../hooks/useChat";
import { useAIChat } from "../hooks/useAIChat";
import { ChatMessage } from "../types/chat";

export const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setChatInputFocused] = useAtom(chatInputFocusedAtom);
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");

  // Real-time chat functionality
  const { messages, sendMessage: sendChatMessage, connected } = useChat();

  // AI chat functionality
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: `msg-${Date.now()}`,
      sender: "Asistente AI",
      content: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?",
      read: false,
      type: "system",
    },
  ]);

  const [newAIChatMessage, setNewAIChatMessage] = useState<string>("");
  const [newChatMessage, setNewChatMessage] = useState<string>("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  // Format unread count with 99+ cap
  const formattedUnreadCount =
    unreadCount > 99 ? "99+" : unreadCount.toString();

  // Mark all messages as read when opening the chat
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
    }
  }, [isOpen, unreadCount]);

  // Track new messages for unread count
  useEffect(() => {
    if (!isOpen && messages.length > prevMessageCountRef.current) {
      const newMessages = messages.slice(prevMessageCountRef.current);
      const newUnreadCount = newMessages.filter(
        (m) => m.sender !== "Usuario"
      ).length;
      if (newUnreadCount > 0) {
        setUnreadCount((prev) => prev + newUnreadCount);
      }
    }

    prevMessageCountRef.current = messages.length;

    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isOpen]);

  const { isLoading, sendMessage: sendAIMessage } = useAIChat();

  const handleSendMessage = async () => {
    if (newChatMessage.trim() && activeTab === "chat" && connected) {
      sendChatMessage(newChatMessage);
      setNewChatMessage("");
    }

    if (newAIChatMessage.trim() && activeTab === "ai" && !isLoading) {
      try {
        const message = {
          id: `msg-${Date.now()}`,
          sender: "User",
          content: newAIChatMessage,
          read: true,
          type: "user",
        };

        const updatedMessages = [...aiMessages, message];
        setAiMessages(updatedMessages);
        setNewAIChatMessage("");

        const aiMessage = await sendAIMessage(updatedMessages);
        setAiMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Failed to get AI response:", error);
        const errorMessage = {
          id: `msg-${Date.now()}`,
          sender: "System",
          content:
            "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
          read: true,
          type: "system",
        };
        setAiMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  const handleTabChange = (tab: "chat" | "ai") => {
    setActiveTab(tab);
  };

  const inputValue = activeTab === "chat" ? newChatMessage : newAIChatMessage;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (activeTab === "chat") {
      setNewChatMessage(value);
    } else {
      setNewAIChatMessage(value);
    }
  };
  const isInputDisabled = (activeTab === 'chat' && !connected) || (activeTab === 'ai' && isLoading)

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
              className={`w-2 h-2 rounded-full ${
                activeTab === "chat"
                  ? connected
                    ? "bg-green-500"
                    : "bg-red-500 animate-pulse"
                  : unreadCount > 0
                  ? "bg-red-500 animate-pulse"
                  : "bg-green-500"
              } mr-2`}
            ></div>
            <span>
              {!isOpen && unreadCount > 0
                ? `Chat (${formattedUnreadCount} mensaje${
                    unreadCount > 1 ? "s" : ""
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
              className={`flex-1 p-2 text-sm ${
                activeTab === "chat"
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => handleTabChange("chat")}
            >
              Chat
            </button>
            <button
              className={`flex-1 p-2 text-sm ${
                activeTab === "ai"
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10"
              }`}
              onClick={() => handleTabChange("ai")}
            >
              Asistente AI
            </button>
          </div>
        )}

        {/* Chat Messages Area */}
        <div
          className={`flex-1 p-3 overflow-auto transition-all ${
            !isOpen ? "hidden" : "block"
          }`}
        >
          {activeTab === "chat" ? (
            // Real-time chat messages
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`text-sm mb-1 ${
                    message.type === "system"
                      ? "text-green-400"
                      : message.type === "admin"
                      ? "text-blue-400"
                      : "text-white"
                  }`}
                >
                  <span className="text-yellow-400">{message.sender}:</span>{" "}
                  {message.content}
                </div>
              ))}
            </>
          ) : (
            // AI chat messages
            <>
              {aiMessages.map((message) => (
                <div
                  key={message.id}
                  className={`text-sm mb-1 ${
                    message.type === "system" ? "text-green-400" : "text-white"
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
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div
          className={`p-2 border-t border-white/20 flex transition-all ${
            !isOpen ? "hidden" : "block"
          }`}
        >
          <input
            type="text"
            placeholder={
              activeTab === "chat"
                ? connected
                  ? "Escribe tu mensaje..."
                  : "Conectando..."
                : isLoading
                ? "Esperando respuesta..."
                : "Escribe tu mensaje..."
            }
            className="flex-1 bg-black/40 text-white p-2 rounded border border-white/30 text-sm focus:outline-none focus:border-white/50"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            onFocus={() => setChatInputFocused(true)}
            onBlur={() => setChatInputFocused(false)}
            disabled={isInputDisabled}
          />
          <button
            className={`ml-2 px-3 rounded ${
              (activeTab === "chat" && !connected) ||
              (activeTab === "ai" && isLoading)
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-white/10 hover:bg-white/20"
            } text-white`}
            onClick={handleSendMessage}
            disabled={
              (activeTab === "chat" && !connected) ||
              (activeTab === "ai" && isLoading)
            }
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
