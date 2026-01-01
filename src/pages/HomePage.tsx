import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import GridLayout, { Layout } from 'react-grid-layout';

const STORAGE_KEY = 'dear23_widget_layout';

const defaultLayout: Layout[] = [
    { i: 'couple', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'chat', x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'feed', x: 1, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'diary', x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'settings', x: 1, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(350);
    const [layout, setLayout] = useState<Layout[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultLayout;
    });
    const [isEditing, setIsEditing] = useState(false);

    // Measure container width on mount and resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleLayoutChange = (newLayout: Layout[]) => {
        setLayout(newLayout);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
    };

    const resetLayout = () => {
        setLayout(defaultLayout);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLayout));
    };

    return (
        <div className="w-full min-h-screen space-y-6 bg-transparent">
            {/* Header */}
            <header className="flex justify-between items-end px-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl font-semibold text-text-primary tracking-tight leading-tight">
                        반가워요
                    </h2>
                    <p className="text-text-secondary text-xs mt-1">
                        우리의 기록이 쌓이는 중
                    </p>
                </motion.div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs transition-colors",
                            isEditing
                                ? "bg-accent text-bg-primary"
                                : "bg-bg-secondary text-text-secondary hover:text-text-primary"
                        )}
                    >
                        {isEditing ? '완료' : '편집'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={resetLayout}
                            className="px-3 py-1.5 rounded-lg text-xs bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
                        >
                            초기화
                        </button>
                    )}
                </div>
            </header>

            {/* Widget Grid */}
            <div ref={containerRef} className="relative">
                {containerWidth > 0 && (
                    <GridLayout
                        className="layout"
                        layout={layout}
                        cols={2}
                        rowHeight={75}
                        width={containerWidth}
                        onLayoutChange={handleLayoutChange}
                        isDraggable={isEditing}
                        isResizable={isEditing}
                        margin={[12, 12]}
                        containerPadding={[0, 0]}
                        useCSSTransforms={true}
                    >
                        {/* Couple Status Widget */}
                        <div key="couple">
                            <WidgetCard
                                onClick={() => !isEditing && navigate('/calendar')}
                                isEditing={isEditing}
                                className="h-full"
                            >
                                <div className="flex flex-col justify-center h-full p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Together</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-semibold text-text-primary">D+23</span>
                                        <span className="text-text-secondary text-xs">2026.01.01</span>
                                    </div>
                                </div>
                            </WidgetCard>
                        </div>

                        {/* Chat Widget */}
                        <div key="chat">
                            <WidgetCard
                                onClick={() => !isEditing && navigate('/chat')}
                                isEditing={isEditing}
                                className="h-full"
                            >
                                <WidgetContent icon="💬" label="채팅" sub="0개 안읽음" />
                            </WidgetCard>
                        </div>

                        {/* Feed Widget */}
                        <div key="feed">
                            <WidgetCard
                                onClick={() => !isEditing && navigate('/feed')}
                                isEditing={isEditing}
                                className="h-full"
                            >
                                <WidgetContent icon="📸" label="피드" sub="새 이야기" />
                            </WidgetCard>
                        </div>

                        {/* Diary Widget */}
                        <div key="diary">
                            <WidgetCard
                                onClick={() => !isEditing && navigate('/diary')}
                                isEditing={isEditing}
                                className="h-full"
                            >
                                <WidgetContent icon="📔" label="일기" sub="오늘의 편지" />
                            </WidgetCard>
                        </div>

                        {/* Settings Widget */}
                        <div key="settings">
                            <WidgetCard
                                onClick={() => !isEditing && navigate('/settings')}
                                isEditing={isEditing}
                                className="h-full"
                            >
                                <WidgetContent icon="⚙️" label="설정" sub="관리" />
                            </WidgetCard>
                        </div>
                    </GridLayout>
                )}

                {isEditing && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-accent/30 rounded-2xl" />
                )}
            </div>

            {isEditing && (
                <p className="text-center text-xs text-text-secondary">
                    위젯을 드래그하여 위치를 변경하세요
                </p>
            )}
        </div>
    );
};

const WidgetCard = ({
    children,
    onClick,
    isEditing,
    className
}: {
    children: React.ReactNode;
    onClick: () => void;
    isEditing: boolean;
    className?: string;
}) => (
    <div
        onClick={onClick}
        className={clsx(
            "bg-bg-secondary rounded-2xl transition-all cursor-pointer h-full",
            isEditing ? "ring-2 ring-accent/50 cursor-move" : "hover:bg-bg-secondary/80 active:scale-[0.98]",
            className
        )}
    >
        {children}
    </div>
);

const WidgetContent = ({ icon, label, sub }: { icon: string; label: string; sub: string }) => (
    <div className="flex flex-col justify-between h-full p-5">
        <span className="text-2xl">{icon}</span>
        <div>
            <span className="block text-text-primary font-medium">{label}</span>
            <span className="block text-xs text-text-secondary">{sub}</span>
        </div>
    </div>
);
