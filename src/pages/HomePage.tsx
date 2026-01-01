import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';

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
        <div className="w-full min-h-screen p-6 pb-24 space-y-8 bg-bg-primary overflow-x-hidden">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary tracking-tight">Hello, <span className="text-accent-pop">User</span></h2>
                    <p className="text-text-secondary mt-1">Welcome to your space</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent-pop/20 border-2 border-accent-pop p-0.5">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Avatar" className="rounded-full" />
                </div>
            </header>

            {/* Dashboard Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-4"
            >
                {/* Main Widget: Couple Status */}
                <motion.div variants={item} className="col-span-2">
                    <Card variant="glass" className="p-6 relative overflow-hidden group hover:shadow-float transition-shadow cursor-pointer" onClick={() => navigate('/calendar')}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl">❤️</span>
                        </div>
                        <h3 className="text-sm font-semibold text-accent-pop uppercase tracking-wider">Loving You</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-text-primary">D+23</span>
                            <span className="text-text-secondary text-sm">since 2026.01.01</span>
                        </div>
                    </Card>
                </motion.div>

                {/* Chat Widget */}
                <motion.div variants={item} onClick={() => navigate('/chat')} className="cursor-pointer">
                    <Card variant="default" className="h-40 flex flex-col justify-between p-4 bg-white/60 hover:bg-white transition-colors border-none shadow-sm hover:shadow-md">
                        <div className="p-2 bg-blue-100 w-fit rounded-xl text-blue-500">
                            <span className="text-2xl">💬</span>
                        </div>
                        <div>
                            <span className="block font-bold text-text-primary text-lg">Chat</span>
                            <span className="text-xs text-text-secondary">0 unread</span>
                        </div>
                    </Card>
                </motion.div>

                {/* Feed Widget */}
                <motion.div variants={item} onClick={() => navigate('/feed')} className="cursor-pointer">
                    <Card variant="default" className="h-40 flex flex-col justify-between p-4 bg-white/60 hover:bg-white transition-colors border-none shadow-sm hover:shadow-md">
                        <div className="p-2 bg-green-100 w-fit rounded-xl text-green-500">
                            <span className="text-2xl">📸</span>
                        </div>
                        <div>
                            <span className="block font-bold text-text-primary text-lg">Feed</span>
                            <span className="text-xs text-text-secondary">New updates</span>
                        </div>
                    </Card>
                </motion.div>

                {/* Diary Widget */}
                <motion.div variants={item} onClick={() => navigate('/diary')} className="cursor-pointer">
                    <Card variant="default" className="h-40 flex flex-col justify-between p-4 bg-white/60 hover:bg-white transition-colors border-none shadow-sm hover:shadow-md">
                        <div className="p-2 bg-pink-100 w-fit rounded-xl text-pink-500">
                            <span className="text-2xl">📔</span>
                        </div>
                        <div>
                            <span className="block font-bold text-text-primary text-lg">Diary</span>
                            <span className="text-xs text-text-secondary">Write today</span>
                        </div>
                    </Card>
                </motion.div>

                {/* Settings Widget */}
                <motion.div variants={item} onClick={() => navigate('/settings')} className="cursor-pointer">
                    <Card variant="default" className="h-40 flex flex-col justify-between p-4 bg-white/60 hover:bg-white transition-colors border-none shadow-sm hover:shadow-md">
                        <div className="p-2 bg-gray-100 w-fit rounded-xl text-gray-500">
                            <span className="text-2xl">⚙️</span>
                        </div>
                        <div>
                            <span className="block font-bold text-text-primary text-lg">Settings</span>
                            <span className="text-xs text-text-secondary">Manage app</span>
                        </div>
                    </Card>
                </motion.div>

            </motion.div>
        </div>
    );
};
