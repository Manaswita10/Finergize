'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/types/chatbot';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  resetMessages: (initialMessage?: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) => 
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      resetMessages: (initialMessage) => 
        set({ 
          messages: initialMessage 
            ? [{ role: 'assistant', content: initialMessage }] 
            : [] 
        }),
    }),
    {
      name: 'chat-storage',
    }
  )
);