import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WidgetLayout } from '../types';

// Define layout types for different breakpoints
interface LayoutState {
    layouts: {
        lg: WidgetLayout[]; // Desktop
        md: WidgetLayout[]; // Tablet
        sm: WidgetLayout[]; // Mobile
    };
    updateLayout: (breakpoint: 'lg' | 'md' | 'sm', newLayout: WidgetLayout[]) => void;
    resetLayouts: () => void;
}

const defaultLayouts: LayoutState['layouts'] = {
    lg: [
        { i: 'chat-shortcut', x: 0, y: 0, w: 2, h: 2 },
        { i: 'calendar-widget', x: 2, y: 0, w: 4, h: 4 },
        { i: 'feed-shortcut', x: 0, y: 2, w: 2, h: 2 },
        { i: 'memo-widget', x: 6, y: 0, w: 2, h: 4 }
    ],
    md: [
        { i: 'chat-shortcut', x: 0, y: 0, w: 2, h: 2 },
        { i: 'calendar-widget', x: 2, y: 0, w: 4, h: 4 },
        { i: 'feed-shortcut', x: 0, y: 2, w: 2, h: 2 },
        { i: 'memo-widget', x: 0, y: 4, w: 4, h: 4 }
    ],
    sm: [
        { i: 'chat-shortcut', x: 0, y: 0, w: 2, h: 2 },
        { i: 'feed-shortcut', x: 2, y: 0, w: 2, h: 2 },
        { i: 'calendar-widget', x: 0, y: 2, w: 4, h: 4 },
        { i: 'memo-widget', x: 0, y: 6, w: 4, h: 4 }
    ]
};

export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            layouts: defaultLayouts,
            updateLayout: (breakpoint, newLayout) =>
                set((state) => ({
                    layouts: {
                        ...state.layouts,
                        [breakpoint]: newLayout
                    }
                })),
            resetLayouts: () => set({ layouts: defaultLayouts })
        }),
        {
            name: 'dear23-layout-storage', // Save to localStorage
        }
    )
);
