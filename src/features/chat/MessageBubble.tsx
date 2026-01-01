import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { Message } from './ChatRoom';

interface Props {
    message: Message;
    isMine: boolean;
}

export const MessageBubble: React.FC<Props> = ({ message, isMine }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex max-w-[70%] ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>

                {/* Avatar (Only for partner) */}
                {!isMine && (
                    <div className="w-8 h-8 rounded-[12px] bg-gray-300 flex-shrink-0 mb-4" />
                    // ToDo: Add Profile Image
                )}

                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    {/* Name (Only for partner) */}
                    {!isMine && <span className="text-xs text-gray-600 mb-1 ml-1">Partner</span>}

                    <div className="flex items-end gap-1">
                        {/* Time (Left side if Mine) */}
                        {isMine && (
                            <span className="text-[10px] text-gray-500 mb-1">
                                {format(new Date(message.created_at), 'a h:mm')}
                            </span>
                        )}

                        {/* Bubble */}
                        <div className={`
                             relative px-4 py-2 rounded-[18px] text-sm shadow-sm break-words
                             ${isMine
                                ? 'bg-[#FAE100] text-black rounded-tr-none' // Kakao Yellow
                                : 'bg-white text-black rounded-tl-none'
                            }
                         `}>
                            {message.content}
                        </div>

                        {/* Time (Right side if Partner) */}
                        {!isMine && (
                            <span className="text-[10px] text-gray-500 mb-1">
                                {format(new Date(message.created_at), 'a h:mm')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
