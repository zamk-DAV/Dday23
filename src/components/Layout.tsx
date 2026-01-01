import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Image, Book, Calendar, Settings } from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="min-h-screen w-full flex flex-col bg-bg-primary transition-colors duration-1000 font-base relative overflow-x-hidden">
            {/* Ambient Background Blur (Subtle Global) */}
            <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 px-6 py-5 flex items-center justify-between backdrop-blur-xl bg-bg-primary/40 border-b border-text-primary/5 transition-all duration-700">
                <motion.h1
                    onClick={() => navigate('/')}
                    className="text-2xl font-serif text-text-primary cursor-pointer tracking-tight"
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Dear23
                </motion.h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2.5 hover:bg-text-primary/5 rounded-2xl transition-all text-text-secondary/60 hover:text-text-primary group"
                    >
                        <Settings size={20} className="transition-transform group-hover:rotate-12" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-8 pb-40">
                <Outlet />
            </main>

            {/* Bottom Tab Navigation (Floating Glass Pill) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-sm">
                <nav className="backdrop-blur-2xl bg-bg-primary/60 border border-text-primary/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[32px] px-6 py-3 transition-colors duration-700">
                    <div className="flex justify-between items-center">
                        <NavItem
                            icon={<Home size={22} />}
                            active={location.pathname === '/'}
                            onClick={() => navigate('/')}
                        />
                        <NavItem
                            icon={<MessageCircle size={22} />}
                            active={location.pathname.startsWith('/chat')}
                            onClick={() => navigate('/chat')}
                        />
                        <NavItem
                            icon={<Image size={22} />}
                            active={location.pathname.startsWith('/feed')}
                            onClick={() => navigate('/feed')}
                        />
                        <NavItem
                            icon={<Book size={22} />}
                            active={location.pathname.startsWith('/diary')}
                            onClick={() => navigate('/diary')}
                        />
                        <NavItem
                            icon={<Calendar size={22} />}
                            active={location.pathname.startsWith('/calendar')}
                            onClick={() => navigate('/calendar')}
                        />
                    </div>
                </nav>
            </div>

            {/* Grainy Texture (Global) */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ filter: 'url(#grainy)' }} />
        </div>
    );
};

const NavItem = ({ icon, active, onClick }: {
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={clsx(
            "relative p-3 transition-all duration-500 rounded-2xl overflow-hidden group",
            active ? "text-text-primary bg-text-primary/5" : "text-text-secondary/40 hover:text-text-secondary"
        )}
    >
        {active && (
            <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 bg-accent/20 blur-lg rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
        <div className={clsx(
            "relative z-10 transition-all duration-300",
            active ? "drop-shadow-[0_0_10px_var(--color-accent)]" : "group-hover:scale-110"
        )}>
            {icon}
        </div>
    </button>
);
