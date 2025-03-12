'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import ChatbotDialog from '@/components/ChatbotDialog';

interface ChatbotContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <ChatbotContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
      <ChatbotDialog open={isOpen} onOpenChange={setIsOpen} />
    </ChatbotContext.Provider>
  );
};

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
};

export default ChatbotContext;