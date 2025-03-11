'use client';
import { MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { useChatbotContext } from '@/contexts/ChatbotContext';

const ChatbotButton = () => {
    const { openChat } = useChatbotContext();

    return (
        <Button
            onClick={openChat}
            className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-black border border-purple-500 p-0 flex items-center justify-center z-50 animate-pulse hover:animate-none hover:bg-purple-900 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            aria-label="Open Financial Advisor"
        >
            <div className="relative">
                <MessageSquare className="h-7 w-7 text-white relative z-10" />
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full animate-pulse"></div>
            </div>
        </Button>
    );
};

export default ChatbotButton;