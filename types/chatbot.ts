export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    message: string;
    history: ChatMessage[];
    userInfo?: {
        name?: string;
        [key: string]: any;
    } | null;
}

export interface ChatResponse {
    response: string;
    [key: string]: any;
}