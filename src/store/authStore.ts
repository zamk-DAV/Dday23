import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    profile: any | null;
    couple: any | null;
    loading: boolean;
    initialized: boolean;
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
    checkCoupleStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    couple: null,
    loading: true,
    initialized: false,

    initialize: async () => {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();

        set({ user: session?.user || null, loading: !!session });

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user || null;
            set({ user: currentUser });
            if (currentUser) {
                await get().checkCoupleStatus();
            } else {
                set({ profile: null, couple: null, loading: false });
            }
        });

        if (session) {
            await get().checkCoupleStatus();
        }
        set({ initialized: true });
    },

    checkCoupleStatus: async () => {
        const user = get().user;
        if (!user) return;
        set({ loading: true });

        try {
            // 1. Get Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // If no profile, it might be first login, waiting for trigger or manual insert?
            // Assuming profile is auto-created or we handle it in Onboarding.

            // 2. Get Couple Status
            // Check if user is in any couple
            const { data: couple } = await supabase
                .from('couples')
                .select('*')
                .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
                .single();

            set({ profile, couple, loading: false });
        } catch (error) {
            console.error('Error loading user data:', error);
            set({ loading: false });
        }
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null, couple: null });
    },

    signInWithId: async (id: string, password: string) => {
        const email = `${id}@dear23.app`;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    signUpWithId: async (id: string, password: string) => {
        const email = `${id}@dear23.app`;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }
}));
