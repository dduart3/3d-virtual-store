export interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    read: boolean;
    type: string;
}