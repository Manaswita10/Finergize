import { ChatRequest, ChatResponse } from '@/types/chatbot';

const API_URL = 'https://financial-chatbot-api.onrender.com';

/**
 * Sends a message to the chatbot API and returns the response
 * @param request The chat request containing user message and history
 * @returns Promise with the chatbot response
 */
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `API error: ${response.status} ${response.statusText}${
                    errorData?.detail ? ` - ${errorData.detail}` : ''
                }`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error calling chatbot API:', error);
        throw error;
    }
}

/**
 * Fallback method if the main API fails
 */
export async function sendMessageSimple(request: ChatRequest): Promise<ChatResponse> {
    try {
        const response = await fetch(`${API_URL}/simple-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`Simple API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error calling simple chatbot API:', error);
        throw error;
    }
}

/**
 * Check if the chatbot API is available
 */
export async function checkChatbotHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Chatbot health check failed:', error);
        return false;
    }
}