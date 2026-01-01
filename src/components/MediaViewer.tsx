import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useDrag } from '@use-gesture/react';
import { BsX, BsDownload, BsShare, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Button } from './Button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export const MediaViewer: React.FC<Props> = ({
    isOpen,
    onClose,
    imageSrc,
    onNext,
    onPrev,
    hasNext,
    hasPrev
}) => {
    // Swipe to dismiss logic
    const bind = useDrag(({ movement: [, my], cancel }) => {
        // Swipe down to dismiss
        if (my > 100) {
            cancel();
            onClose();
        }
    }, {
        filterTaps: true
    });

    const handleDownload = async () => {
        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dear23-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('Download failed', e);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center touch-none"
                    {...(bind() as any)}
                >
                    {/* Controls */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 text-white">
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                            <BsX size={32} />
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={handleDownload} className="text-white hover:bg-white/20">
                                <BsDownload />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                <BsShare />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation */}
                    {hasPrev && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 text-white/50 hover:text-white"
                        >
                            <BsChevronLeft size={40} />
                        </button>
                    )}

                    {hasNext && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 text-white/50 hover:text-white"
                        >
                            <BsChevronRight size={40} />
                        </button>
                    )}

                    {/* Image Area */}
                    <div className="w-full h-full flex items-center justify-center">
                        <TransformWrapper
                            initialScale={1}
                            minScale={1}
                            maxScale={4}
                            centerOnInit={true}
                        >
                            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                <motion.img
                                    src={imageSrc}
                                    alt="View"
                                    className="max-w-full max-h-screen object-contain"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};
