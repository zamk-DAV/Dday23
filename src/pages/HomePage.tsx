import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-[80vh] p-4">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Home</h2>
            </div>

            {/* CSS Grid Layout for Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[120px]">
                {/* Chat Shortcut */}
                <div
                    onClick={() => navigate('/chat')}
                    className="col-span-1 row-span-1 cursor-pointer"
                >
                    <Card variant="glass" className="h-full flex flex-col items-center justify-center hover:bg-white/50 active:scale-95 transition-transform">
                        <span className="text-3xl">💬</span>
                        <span className="mt-2 font-medium">Chat</span>
                    </Card>
                </div>

                {/* Calendar Widget */}
                <div
                    onClick={() => navigate('/calendar')}
                    className="col-span-2 row-span-2 cursor-pointer"
                >
                    <Card variant="default" className="h-full p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-[var(--color-accent-pop)]">Upcoming</h3>
                        <ul className="mt-2 text-sm space-y-2">
                            <li className="flex justify-between"><span>D-Day</span> <span>D-23</span></li>
                            <li className="flex justify-between"><span>Date Night</span> <span>Fri</span></li>
                        </ul>
                    </Card>
                </div>

                {/* Feed Shortcut */}
                <div
                    onClick={() => navigate('/feed')}
                    className="col-span-1 row-span-1 cursor-pointer"
                >
                    <Card variant="flat" className="h-full flex flex-col items-center justify-center bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                        <span className="text-3xl">🐦</span>
                        <span className="mt-2 font-medium">Feed</span>
                    </Card>
                </div>

                {/* Diary Shortcut */}
                <div
                    onClick={() => navigate('/diary')}
                    className="col-span-1 row-span-1 cursor-pointer"
                >
                    <Card className="h-full flex flex-col items-center justify-center bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors">
                        <span className="text-3xl">📔</span>
                        <span className="mt-2 font-medium">Diary</span>
                    </Card>
                </div>

                {/* Settings Shortcut */}
                <div
                    onClick={() => navigate('/settings')}
                    className="col-span-1 row-span-1 cursor-pointer"
                >
                    <Card variant="flat" className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-200 transition-colors">
                        <span className="text-3xl">⚙️</span>
                        <span className="mt-2 font-medium">Settings</span>
                    </Card>
                </div>
            </div>
        </div>
    );
};
