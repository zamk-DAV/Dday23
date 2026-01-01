import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export interface Message {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    type: 'text' | 'image' | 'video' | 'sticker';
    reactions: any;
}

export const ChatRoom: React.FC = () => {
    const { user, couple } = useAuthStore();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user || !couple) return;

        // 1. Load initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_room_id', couple.id) // Assuming couple_id based chat
                .order('created_at', { ascending: true })
                .limit(100);

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data as Message[]);
            }
            setLoading(false);
            scrollToBottom();
        };

        fetchMessages();

        // 2. Subscribe to new messages
        const channel = supabase
            .channel(`chat_${couple.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_room_id=eq.${couple.id}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [...prev, newMessage]);
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, couple]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (content: string) => {
        if (!user || !couple) return;

        // Optimistic UI could be added here (append local message first)
        // @ts-ignore
        const { error } = await supabase.from('messages').insert({
            content,
            user_id: user.id,
            chat_room_id: couple.id,
            type: 'text'
        } as any);

        if (error) {
            alert('Failed to send message');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading Chat...</div>;

    return (
        <div className="flex flex-col h-[100dvh] bg-[#ABC1D1]"> {/* KakaoTalk Blue-ish Gray Default, or use var(--color-bg-primary) */}
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                <Button variant="ghost" onClick={() => navigate('/')} size="sm">
                    &lt; Back
                </Button>
                <h1 className="text-lg font-semibold text-white">
                    {couple ? `Couple Chat` : 'Chat'}
                </h1>
                <div className="w-8" /> {/* Spacer */}
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                    const isMine = msg.user_id === user?.id;
                    const showDate = index === 0 ||
                        new Date(msg.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString();

                    return (
                        <React.Fragment key={msg.id}>
                            {showDate && (
                                <div className="flex justify-center my-4">
                                    <span className="bg-black/10 text-white text-xs px-3 py-1 rounded-full">
                                        {format(new Date(msg.created_at), 'yyyy. MM. dd. EEEE')}
                                    </span>
                                </div>
                            )}
                            <MessageBubble message={msg} isMine={isMine} />
                        </React.Fragment>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
};
