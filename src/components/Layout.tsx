import React from 'react';
import clsx from 'clsx';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen w-full flex flex-col bg-[var(--color-bg-primary)]">
            {/* Top Navigation Bar / Header Area */}
            <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between glass">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--color-accent-pop)] to-[var(--color-error)] bg-clip-text text-transparent">
                    Dear23
                </h1>
                <div className="flex gap-2">
                    {/* Placeholder for header actions */}
                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)]" />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
                <Outlet />
            </main>

            {/* Bottom Tab Navigation (Mobile Only) */}
            <nav className="sticky bottom-0 z-50 md:hidden glass border-t border-[rgba(255,255,255,0.4)] pb-safe-area">
                <div className="flex justify-around items-center h-16">
                    <NavIcon label="Home" active />
                    <NavIcon label="Chat" />
                    <NavIcon label="Feed" />
                    <NavIcon label="Diary" />
                    <NavIcon label="Cal" />
                </div>
            </nav>
        </div>
    );
};

// Temporary Nav Icon Component
const NavIcon = ({ label, active }: { label: string; active?: boolean }) => (
    <div className={clsx(
        "flex flex-col items-center gap-1 p-2 transition-transform active:scale-95",
        active ? "text-[var(--color-accent-pop)]" : "text-[var(--color-text-placeholder)]"
    )}>
        <div className="w-6 h-6 rounded bg-current opacity-20" />
        <span className="text-[10px] font-medium">{label}</span>
    </div>
);
