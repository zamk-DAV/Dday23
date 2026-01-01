import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen space-y-6 bg-transparent">
            {/* Header */}
            <header className="flex justify-between items-end px-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-semibold text-text-primary">
                        반가워요
                    </h2>
                    <p className="text-text-secondary text-xs mt-1">
                        우리의 기록이 쌓이는 중
                    </p>
                </motion.div>
            </header>

            {/* Widget Grid - Using CSS Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3"
            >
                {/* D-Day Widget - Full Width */}
                <motion.div variants={item} className="col-span-2">
                    <WidgetCard onClick={() => navigate('/calendar')} className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Together</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-semibold text-text-primary">D+23</span>
                            <span className="text-text-secondary text-xs">2026.01.01</span>
                        </div>
                    </WidgetCard>
                </motion.div>

                {/* Small Widgets */}
                <motion.div variants={item}>
                    <WidgetCard onClick={() => navigate('/chat')} className="h-[140px]">
                        <WidgetContent icon="💬" label="채팅" sub="0개 안읽음" />
                    </WidgetCard>
                </motion.div>

                <motion.div variants={item}>
                    <WidgetCard onClick={() => navigate('/feed')} className="h-[140px]">
                        <WidgetContent icon="📸" label="피드" sub="새 이야기" />
                    </WidgetCard>
                </motion.div>

                <motion.div variants={item}>
                    <WidgetCard onClick={() => navigate('/diary')} className="h-[140px]">
                        <WidgetContent icon="📔" label="일기" sub="오늘의 편지" />
                    </WidgetCard>
                </motion.div>

                <motion.div variants={item}>
                    <WidgetCard onClick={() => navigate('/settings')} className="h-[140px]">
                        <WidgetContent icon="⚙️" label="설정" sub="관리" />
                    </WidgetCard>
                </motion.div>
            </motion.div>
        </div>
    );
};

const WidgetCard = ({
    children,
    onClick,
    className
}: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}) => (
    <div
        onClick={onClick}
        className={clsx(
            "bg-bg-secondary rounded-2xl cursor-pointer transition-all",
            "hover:bg-bg-secondary/80 active:scale-[0.98]",
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
