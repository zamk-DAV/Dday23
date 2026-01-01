import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Image, Book, Calendar, Settings } from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="min-h-screen w-full flex flex-col bg-bg-primary font-base">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/70 border-b border-black/5">
                <motion.h1
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold bg-gradient-to-r from-accent-pop to-accent bg-clip-text text-transparent cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Dear23
                </motion.h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors text-text-secondary"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-4xl mx-auto p-4 pb-32">
                <Outlet />
            </main>

            {/* Bottom Tab Navigation */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md backdrop-blur-xl bg-white/80 border border-white shadow-float rounded-full px-4 py-2">
                <div className="flex justify-around items-center">
                    <NavItem
                        icon={<Home size={22} />}
                        label="Home"
                        active={location.pathname === '/'}
                        onClick={() => navigate('/')}
                    />
                    <NavItem
                        icon={<MessageCircle size={22} />}
                        label="Chat"
                        active={location.pathname.startsWith('/chat')}
                        onClick={() => navigate('/chat')}
                    />
                    <NavItem
                        icon={<Image size={22} />}
                        label="Feed"
                        active={location.pathname.startsWith('/feed')}
                        onClick={() => navigate('/feed')}
                    />
                    <NavItem
                        icon={<Book size={22} />}
                        label="Diary"
                        active={location.pathname.startsWith('/diary')}
                        onClick={() => navigate('/diary')}
                    />
                    <NavItem
                        icon={<Calendar size={22} />}
                        label="Cal"
                        active={location.pathname.startsWith('/calendar')}
                        onClick={() => navigate('/calendar')}
                    />
                </div>
            </nav>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={clsx(
            "relative flex flex-col items-center gap-1 p-2 transition-all duration-300",
            active ? "text-accent-pop scale-110" : "text-text-placeholder hover:text-text-secondary"
        )}
    >
        {active && (
            <motion.div
                layoutId="nav-active"
                className="absolute inset-x-0 -bottom-1 h-1 bg-accent-pop rounded-full mx-4"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
        )}
        <div className={clsx(
            "transition-all duration-300",
            active ? "drop-shadow-[0_0_8px_rgba(255,158,170,0.5)]" : ""
        )}>
            {icon}
        </div>
        <span className="text-[10px] font-bold tracking-tighter uppercase">{label}</span>
    </button>
);
