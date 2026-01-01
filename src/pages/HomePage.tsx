import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useLayoutStore } from '../hooks/useLayoutStore';
import type { WidgetLayout } from '../hooks/useLayoutStore';
import { Card } from '../components/Card';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/grid-fix.css'; // Will create this to fix default styles

const ResponsiveGridLayout = WidthProvider(Responsive);

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { layouts, updateLayout } = useLayoutStore();
    const [isDraggable, setIsDraggable] = useState(true);

    // Custom breakpoint handling to sync with store
    const handleLayoutChange = (_layout: WidgetLayout[], allLayouts: { [key: string]: WidgetLayout[] }) => {
        if (allLayouts.lg) updateLayout('lg', allLayouts.lg);
        if (allLayouts.md) updateLayout('md', allLayouts.md);
        if (allLayouts.sm) updateLayout('sm', allLayouts.sm);
    };

    return (
        <div className="w-full h-full min-h-[80vh]">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Home</h2>
                <button
                    onClick={() => setIsDraggable(!isDraggable)}
                    className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full"
                >
                    {isDraggable ? 'Done' : 'Edit Widgets'}
                </button>
            </div>

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1024, md: 768, sm: 0 }}
                cols={{ lg: 12, md: 10, sm: 4 }}
                rowHeight={100}
                onLayoutChange={handleLayoutChange}
                isDraggable={isDraggable}
                isResizable={isDraggable}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                useCSSTransforms={true}
            >
                <div key="chat-shortcut" onClick={() => navigate('/chat')}>
                    <Card variant="glass" className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 active:scale-95 transition-transform">
                        <span className="text-3xl">💬</span>
                        <span className="mt-2 font-medium">Chat</span>
                    </Card>
                </div>

                <div key="calendar-widget" onClick={() => navigate('/calendar')}>
                    <Card variant="default" className="h-full p-4 cursor-pointer hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-[var(--color-accent-pop)]">Upcoming</h3>
                        <ul className="mt-2 text-sm space-y-2">
                            <li className="flex justify-between"><span>D-Day</span> <span>D-23</span></li>
                            <li className="flex justify-between"><span>Date Night</span> <span>Fri</span></li>
                        </ul>
                    </Card>
                </div>

                <div key="feed-shortcut" onClick={() => navigate('/feed')}>
                    <Card variant="flat" className="h-full flex flex-col items-center justify-center bg-blue-50 text-blue-500 cursor-pointer hover:bg-blue-100 transition-colors">
                        <span className="text-3xl">🐦</span>
                        <span className="mt-2 font-medium">Feed</span>
                    </Card>
                </div>

                <div key="diary-shortcut" onClick={() => navigate('/diary')}>
                    <Card className="h-full flex flex-col items-center justify-center bg-pink-50 text-pink-500 cursor-pointer hover:bg-pink-100 transition-colors">
                        <span className="text-3xl">📔</span>
                        <span className="mt-2 font-medium">Diary</span>
                    </Card>
                </div>

                <div key="settings-shortcut" onClick={() => navigate('/settings')}>
                    <Card variant="flat" className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                        <span className="text-3xl">⚙️</span>
                        <span className="mt-2 font-medium">Settings</span>
                    </Card>
                </div>
            </ResponsiveGridLayout>
        </div>
    );
};
