import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { chatInputFocusedAtom } from "../state/chat";

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
  
  const [messages, setMessages] = useState(mockMessages);
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "User",
        content: newMessage,
        read: true,
        type: "user",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

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
                unreadCount > 0 ? "bg-red-500 animate-pulse" : "bg-green-500"
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

        {/* Chat Messages - Hidden when closed */}
        <div
          className={`flex-1 p-3 overflow-auto transition-all ${
            !isOpen ? "hidden" : "block"
          }`}
        >
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
        </div>

        {/* Chat Input - Hidden when closed */}
        <div
          className={`p-2 border-t border-white/20 flex transition-all ${
            !isOpen ? "hidden" : "block"
          }`}
        >
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-black/40 text-white p-2 rounded border border-white/30 text-sm focus:outline-none focus:border-white/50"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            onFocus={() => setChatInputFocused(true)}
            onBlur={() => setChatInputFocused(false)}
          />
          <button
            className="ml-2 bg-white/10 px-3 rounded hover:bg-white/20 text-white"
            onClick={handleSendMessage}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
