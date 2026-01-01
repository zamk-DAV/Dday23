import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen space-y-10 bg-transparent">
            {/* Sentimental Greeting Header */}
            <header className="flex justify-between items-end px-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl font-serif text-text-primary tracking-tight leading-tight">
                        반가워요, <span className="opacity-60 italic">User</span>
                    </h2>
                    <p className="text-text-secondary/60 text-[11px] font-medium tracking-[0.3em] uppercase mt-2">
                        우리의 기록이 쌓이는 중
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 p-1 relative group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Avatar" className="relative z-10 rounded-full" />
                </motion.div>
            </header>

            {/* Dashboard Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-5"
            >
                {/* Main Widget: Couple Status (Large Card) */}
                <motion.div variants={item} className="col-span-2">
                    <Card variant="glass" className="p-8 relative overflow-hidden group cursor-pointer border-accent/10" onClick={() => navigate('/calendar')}>
                        {/* Decorative Background Symbol */}
                        <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-150 rotate-12">
                            <span className="text-8xl">❤️</span>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Loving Together</h3>
                            </div>

                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-serif text-text-primary tracking-tighter">D+23</span>
                                <span className="text-text-secondary/40 text-[10px] font-medium tracking-widest uppercase">
                                    since 2026.01.01
                                </span>
                            </div>

                            {/* Visual Progress Line */}
                            <div className="w-full h-[1px] bg-text-primary/5 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '40%' }}
                                    className="absolute inset-y-0 left-0 bg-accent/40 shadow-[0_0_8px_var(--color-accent)]"
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Grid Widgets (Themed & Balanced) */}
                <HomeWidget
                    icon="💬"
                    label="Chat"
                    sub="0 unread"
                    onClick={() => navigate('/chat')}
                    color="bg-blue-400/5 text-blue-400"
                />
                <HomeWidget
                    icon="📸"
                    label="Feed"
                    sub="New stories"
                    onClick={() => navigate('/feed')}
                    color="bg-emerald-400/5 text-emerald-400"
                />
                <HomeWidget
                    icon="📔"
                    label="Diary"
                    sub="Letter to you"
                    onClick={() => navigate('/diary')}
                    color="bg-rose-400/5 text-rose-400"
                />
                <HomeWidget
                    icon="⚙️"
                    label="Settings"
                    sub="Manage"
                    onClick={() => navigate('/settings')}
                    color="bg-zinc-400/5 text-zinc-400"
                />
            </motion.div>
        </div>
    );
};

const HomeWidget = ({ icon, label, sub, onClick, color }: any) => (
    <motion.div variants={item} onClick={onClick} className="cursor-pointer group">
        <Card variant="glass" className="h-[150px] flex flex-col justify-between p-6 group-hover:border-accent/30 group-active:scale-[0.98]">
            <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all group-hover:scale-110", color)}>
                {icon}
            </div>
            <div className="space-y-1">
                <span className="block font-serif text-text-primary text-xl tracking-tight">{label}</span>
                <span className="block text-[9px] text-text-secondary/40 font-bold uppercase tracking-widest">{sub}</span>
            </div>
        </Card>
    </motion.div>
);
