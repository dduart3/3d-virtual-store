export interface ChatMessage {
    id: string;
    sender: string;
    sender_id?: string;
    content: string;
    type: "system" | "admin" | "user" | "ai";
    timestamp: number;
    read: boolean;
  }
  
  export interface ChatUser {
    id: string;
    username: string;
    avatar_url?: string;
    last_seen?: number;
  }
  