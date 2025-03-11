'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User, Mic, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChatMessage } from '@/types/chatbot';
import { sendMessage, sendMessageSimple } from '@/services/chatbotService';

interface ChatbotDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ChatbotDialog = ({ open, onOpenChange }: ChatbotDialogProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Hi there! I'm your financial advisor. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Basic speech recognition variables
    const recognition = useRef<any>(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize basic speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition ||
                window.webkitSpeechRecognition;

            if (SpeechRecognition && !recognition.current) {
                recognition.current = new SpeechRecognition();
                recognition.current.continuous = false;
                recognition.current.interimResults = false;
                recognition.current.lang = 'en-US';

                recognition.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setIsListening(false);
                };

                recognition.current.onerror = () => {
                    setIsListening(false);
                };

                recognition.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        return () => {
            stopListening();
        };
    }, []);

    // Function to start listening
    const startListening = () => {
        if (recognition.current) {
            try {
                recognition.current.start();
                setIsListening(true);
            } catch (error) {
                console.error('Speech recognition error:', error);
                setIsListening(false);
            }
        }
    };

    // Function to stop listening
    const stopListening = () => {
        if (recognition.current && isListening) {
            try {
                recognition.current.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
            setIsListening(false);
        }
    };

    // Function to toggle audio output
    const toggleAudio = () => {
        setAudioEnabled(!audioEnabled);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    // Function to speak text
    const speakText = (text: string) => {
        if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
            return;
        }

        try {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Speech synthesis error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;

        // Add user message
        const userMessage = { role: 'user' as const, content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Convert messages to API format
            const historyForAPI = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Prepare request
            const request = {
                message: input.trim(),
                history: historyForAPI
            };

            // Try main API first, fall back to simple API if it fails
            let data;
            try {
                data = await sendMessage(request);
            } catch (error) {
                console.log('Main API failed, trying simple API', error);
                data = await sendMessageSimple(request);
            }

            // Add assistant response
            const assistantResponse = data.response;
            setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

            // Speak the response if audio is enabled
            speakText(assistantResponse);
        } catch (error) {
            console.error('Error communicating with chatbot', error);
            const errorMessage = 'Sorry, I encountered an issue. Please try again later or refresh the page.';
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: errorMessage }
            ]);

            // Speak the error message if audio is enabled
            speakText(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => onOpenChange(false)}>
            <div
                className="w-[425px] h-[600px] bg-black border border-purple-500 shadow-[0_0_25px_rgba(147,51,234,0.3)] rounded-xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="p-4 border-b border-purple-800 bg-gradient-to-r from-black via-purple-950 to-black flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Bot className="h-5 w-5 text-blue-400" />
                        <span className="relative">
                            Financial Advisor
                            <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleAudio}
                            className="h-8 w-8 rounded-full hover:bg-purple-900/30 text-white"
                        >
                            {audioEnabled ? (
                                <Volume2 className="h-4 w-4 text-blue-400" />
                            ) : (
                                <VolumeX className="h-4 w-4 text-gray-500" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                            className="h-8 w-8 rounded-full hover:bg-purple-900/30 text-white"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`flex gap-2 max-w-[80%] ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-tl-lg rounded-tr-none rounded-bl-lg rounded-br-lg shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                                            : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-purple-900 rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-lg'
                                        } px-4 py-3`}
                                >
                                    {message.role === 'assistant' && (
                                        <Bot className="h-5 w-5 mt-1 flex-shrink-0 text-blue-400" />
                                    )}
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                    {message.role === 'user' && (
                                        <User className="h-5 w-5 mt-1 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-purple-900 rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-lg px-4 py-3 flex gap-2">
                                    <Bot className="h-5 w-5 mt-1 text-blue-400" />
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input area */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 border-t border-purple-800 bg-black flex gap-2 items-center"
                >
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask me anything about finance..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading || isListening}
                        className="flex-1 bg-gray-900 border-purple-700 text-white focus:ring-purple-500 focus:border-purple-500"
                    />
                    {typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition) && (
                        <Button
                            type="button"
                            size="icon"
                            disabled={isLoading}
                            onClick={isListening ? stopListening : startListening}
                            className={`rounded-full ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-700 hover:bg-purple-800'} text-white ${isListening ? 'animate-pulse' : ''}`}
                        >
                            <Mic className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="rounded-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatbotDialog;