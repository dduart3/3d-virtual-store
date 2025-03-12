export interface ChatMessage {
    id: string;
    sender: string;
    sender_id?: string;
    content: string;
    read: boolean;
    type: "system" | "admin" | "user";	

}