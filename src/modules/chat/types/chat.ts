export interface ChatMessage {
    id: number;
    sender: string;
    content: string;
    read: boolean;
    type: string;
}