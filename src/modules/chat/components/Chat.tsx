import { useAtom } from "jotai";
import { useState, useEffect, useRef } from "react";
import { chatInputFocusedAtom, chatOpenAtom } from "../state/chat";
import { useChat } from "../hooks/useChat";
import { useAIChat } from "../hooks/useAIChat";
import { useAuth } from "../../auth/hooks/useAuth";

export const Chat = () => {
  // Add new states for resizing
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(256);
  const minHeight = 256;
  const maxHeight = window.innerHeight - 100;

  // Add resize handlers
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrag = (e: MouseEvent) => {
    if (isDragging && isOpen) {
      const chatBottom = window.innerHeight - 20;
      const newHeight = chatBottom - e.clientY;
      setHeight(Math.min(maxHeight, Math.max(minHeight, newHeight)));
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add effect for drag handling
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useAtom(chatOpenAtom);
  const [, setChatInputFocused] = useAtom(chatInputFocusedAtom);
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");

  // Use the separate hooks for socket chat and AI chat
  const {
    messages,
    sendMessage: sendSocketMessage,
    markAsRead,
    initializeWelcomeMessages,
    isLoading: isSocketLoading,
  } = useChat();

  const {
    aiMessages,
    sendAIMessage,
    initializeAIWelcomeMessages,
    isLoading: isAILoading,
  } = useAIChat();

  const [newChatMessage, setNewChatMessage] = useState<string>("");
  const [newAIChatMessage, setNewAIChatMessage] = useState<string>("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  // Format unread count with 99+ cap
  const formattedUnreadCount =
    unreadCount > 99 ? "99+" : unreadCount.toString();

  useEffect(() => {
    if (profile && profile.username && profile.avatar_url) {

      // Initialize welcome messages
      initializeWelcomeMessages();
      initializeAIWelcomeMessages();
    }
  }, []);

  // Mark all messages as read when opening the chat
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Mark messages as read
      messages.filter((msg) => !msg.read).forEach((msg) => markAsRead(msg.id));
      setUnreadCount(0);
    }
  }, [isOpen, unreadCount, messages, markAsRead]);

  // Track new messages for unread count
  useEffect(() => {
    if (!isOpen && messages.length > prevMessageCountRef.current) {
      const newMessages = messages.slice(prevMessageCountRef.current);
      const newUnreadCount = newMessages.filter(
        (m) => m.sender !== profile?.username
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
  }, [messages.length, isOpen, profile]);

  const handleSendMessage = async () => {
    if (activeTab === "chat" && newChatMessage.trim()) {
      // Send regular chat message
      sendSocketMessage(newChatMessage);
      setNewChatMessage("");
    } else if (activeTab === "ai" && newAIChatMessage.trim() && !isAILoading) {
      // Send AI message
      sendAIMessage(newAIChatMessage);
      setNewAIChatMessage("");
    }
    setChatInputFocused(false);
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

  const isInputDisabled =
    (activeTab === "chat" && isSocketLoading) ||
    (activeTab === "ai" && isAILoading);

  //const isLoading = activeTab === "chat" ? isSocketLoading : isAILoading;

  return (
    <div className="absolute bottom-5 left-5 pointer-events-auto">
      <div
        className={`bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 flex flex-col transition-all duration-300
        ${!isOpen ? "w-60 h-10" : "w-96"}`}
        style={{ height: isOpen ? height : 40 }}
      >
        {/* Resize Handle - Only visible when chat is open */}
        {isOpen && (
          <div
            className="absolute -top-1 left-0 right-0 h-2 cursor-n-resize hover:bg-white/10 rounded-t-lg"
            onMouseDown={handleDragStart}
          />
        )}

        {/* Chat Header with unread count */}
        <div
          className="relative p-2 border-b border-white/20 flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-white flex items-center">
            <div
              className={`w-2 h-2 rounded-full ${
                activeTab === "chat"
                  ? !isSocketLoading
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
              Asistente IA
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
                  {!message.read && (
                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  )}
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
                  <div
                    className="whitespace-pre-wrap break-words [&_a]:text-blue-400 [&_a]:underline [&_a]:cursor-pointer"
                    style={{ whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              ))}
              {isAILoading && (
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
                ? !isSocketLoading
                  ? "Escribe tu mensaje..."
                  : "Conectando..."
                : isAILoading
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
              isInputDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-white/10 hover:bg-white/20"
            } text-white`}
            onClick={handleSendMessage}
            disabled={isInputDisabled}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
