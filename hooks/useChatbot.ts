'use client';
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chatbot';
import { sendMessage, sendMessageSimple } from '@/services/chatbotService';

interface UseChatbotReturn {
    messages: ChatMessage[];
    isLoading: boolean;
    sendMessage: (message: string) => Promise<void>;
    reset: () => void;
}

/**
 * Hook to interact with the financial advisor chatbot
 */
export function useChatbot(initialMessage?: string): UseChatbotReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: initialMessage || "Hi there! I'm your financial advisor. How can I help you today?"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const sendUserMessage = useCallback(async (message: string) => {
        if (!message.trim() || isLoading) return;

        // Add user message to the chat
        const userMessage: ChatMessage = { role: 'user', content: message.trim() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Prepare the API request
            const historyForAPI = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const request = {
                message: message.trim(),
                history: historyForAPI
            };

            // Try main API first, fall back to simple API if it fails
            let data;
            try {
                data = await sendMessage(request);
            } catch (error) {
                console.log('Main API failed, trying simple API');
                data = await sendMessageSimple(request);
            }

            // Add assistant response to the chat
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an issue. Please try again later or refresh the page.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    const reset = useCallback(() => {
        setMessages([
            {
                role: 'assistant',
                content: initialMessage || "Hi there! I'm your financial advisor. How can I help you today?"
            }
        ]);
    }, [initialMessage]);

    return {
        messages,
        isLoading,
        sendMessage: sendUserMessage,
        reset
    };
}

export default useChatbot;