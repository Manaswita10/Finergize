'use client';
import React, { createContext, useContext, useState } from 'react';
import ChatbotDialog from '@/components/ChatbotDialog';

// Create context type
interface ChatbotContextType {
    openChat: () => void;
    closeChat: () => void;
    isOpen: boolean;
}

// Create context with default values
const ChatbotContext = createContext<ChatbotContextType>({
    openChat: () => { },
    closeChat: () => { },
    isOpen: false,
});

// Provider component
export function ChatbotContextProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);

    return (
        <ChatbotContext.Provider value={{ openChat, closeChat, isOpen }}>
            {children}
            <ChatbotDialog open={isOpen} onOpenChange={setIsOpen} />
        </ChatbotContext.Provider>
    );
}

// Hook for using the chatbot context
export function useChatbotContext() {
    const context = useContext(ChatbotContext);

    if (context === undefined) {
        throw new Error('useChatbotContext must be used within a ChatbotContextProvider');
    }

    return context;
}

export default ChatbotContext;