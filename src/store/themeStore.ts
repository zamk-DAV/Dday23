import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType =
    | 'moonlight'
    | 'apple'
    | 'forest'
    | 'clay'
    | 'cat'
    | 'morning'
    | 'pastel'
    | 'milktea'
    | 'modern'
    | 'grayscale'
    | 'everest'
    | 'dark'
    | 'default';

interface ThemeState {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'moonlight', // Default to our new Moonlight sentiment
            setTheme: (theme) => {
                set({ theme });
                document.documentElement.setAttribute('data-theme', theme);
            },
        }),
        {
            name: 'dear23-theme-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.documentElement.setAttribute('data-theme', state.theme);
                }
            },
        }
    )
);
