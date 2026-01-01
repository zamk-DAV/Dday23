import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { BsPlusLg, BsEmojiSmile, BsArrowUp } from 'react-icons/bs'; // Need to ensure react-icons is installed

export const ChatInput: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <div className="bg-white p-2 pb-safe-area flex items-end gap-2 border-t border-gray-100">
            <Button variant="ghost" size="icon" className="text-gray-400">
                <BsPlusLg />
            </Button>

            <div className="flex-1 bg-gray-100 rounded-[18px] px-4 py-2 flex items-center gap-2">
                <textarea
                    className="bg-transparent border-none outline-none w-full resize-none max-h-24 text-sm"
                    rows={1}
                    placeholder="Message..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ minHeight: '24px' }}
                />
                <button className="text-gray-400 hover:text-gray-600">
                    <BsEmojiSmile />
                </button>
            </div>

            <Button
                variant={text.trim() ? "primary" : "ghost"} // Highlight when active
                size="icon"
                className={`transition-colors ${text.trim() ? "bg-[#FAE100] text-black" : "text-gray-400"}`}
                onClick={() => handleSubmit()}
            >
                <BsArrowUp />
            </Button>
        </div>
    );
};
