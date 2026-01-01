import { createClient } from '@supabase/supabase-js';

// Database Interface for strong typing
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string | null;
                    username: string | null;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email?: string | null;
                    username?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string | null;
                    username?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                };
            };
            couples: {
                Row: {
                    id: string;
                    user1_id: string;
                    user2_id: string | null;
                    d_day: string | null;
                    notion_api_key: string | null;
                    notion_db_map: Json | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user1_id: string;
                    user2_id?: string | null;
                    d_day?: string | null;
                    notion_api_key?: string | null;
                    notion_db_map?: Json | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user1_id?: string;
                    user2_id?: string | null;
                    d_day?: string | null;
                    notion_api_key?: string | null;
                    notion_db_map?: Json | null;
                    created_at?: string;
                };
            };
            connection_codes: {
                Row: {
                    code: string;
                    creator_id: string;
                    created_at: string;
                    expires_at: string;
                };
                Insert: {
                    code: string;
                    creator_id: string;
                    created_at?: string;
                    expires_at?: string;
                };
                Update: {
                    code?: string;
                    creator_id?: string;
                    created_at?: string;
                    expires_at?: string;
                };
            };
            messages: {
                Row: {
                    id: string; // uuid
                    content: string;
                    user_id: string;
                    created_at: string;
                    chat_room_id: string; // uuid
                    type: 'text' | 'image' | 'video' | 'sticker';
                    reactions: Json; // { [emoji]: [userIds] }
                };
                Insert: {
                    id?: string;
                    content: string;
                    user_id: string;
                    created_at?: string;
                    chat_room_id: string;
                    type?: 'text' | 'image' | 'video' | 'sticker';
                    reactions?: Json;
                };
                Update: {
                    id?: string;
                    content?: string;
                    user_id?: string;
                    created_at?: string;
                    chat_room_id?: string;
                    type?: 'text' | 'image' | 'video' | 'sticker';
                    reactions?: Json;
                };
            };
        };
    };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key missing in environment variables');
}

export const supabase = createClient<any>(
    supabaseUrl as string,
    supabaseAnonKey as string
);
