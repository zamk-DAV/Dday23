import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const CoupleConnection: React.FC = () => {
    const { user, checkCoupleStatus } = useAuthStore();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'create' | 'join' | null>(null);
    const [code, setCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateCode = async () => {
        if (!user) return;
        setLoading(true);
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        try {
            const { error } = await supabase
                .from('connection_codes')
                .insert({
                    code: newCode,
                    creator_id: user.id
                } as any);

            if (error) throw error;
            setGeneratedCode(newCode);

            // Listen for connection
            // @ts-ignore
            supabase.channel(`connect_${newCode}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'couples',
                    filter: `notion_api_key=eq.${newCode}`
                }, async () => {
                    alert("Partner connected!");
                    await checkCoupleStatus();
                    navigate('/setup');
                })
                .subscribe();

            // Cleaner logic: Poll or subscription on 'couples' where user1_id or user2_id is me
            // @ts-ignore
            supabase.channel('my_couple_status')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'couples', filter: `user1_id=eq.${user.id}` },
                    async () => {
                        await checkCoupleStatus();
                        navigate('/setup');
                    })
                .subscribe();

        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const joinCouple = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Find Author of code
            // @ts-ignore
            const { data: codeData, error: codeError } = await supabase
                .from('connection_codes')
                .select('*')
                .eq('code', code)
                .single();

            if (codeError || !codeData) throw new Error("Invalid or expired code");

            // 2. Create Couple
            // @ts-ignore
            const { error: coupleError } = await supabase
                .from('couples')
                .insert({
                    user1_id: (codeData as any).creator_id,
                    user2_id: user.id,
                    d_day: new Date().toISOString()
                });

            if (coupleError) throw coupleError;

            // 3. Delete Code
            await supabase.from('connection_codes').delete().eq('code', code);

            await checkCoupleStatus();
            navigate('/setup');

        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-bg-secondary relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-pop/10 rounded-full blur-[80px] pointer-events-none" />

            <Card className="w-full max-w-md p-8 text-center relative z-10" variant="glass">
                <motion.div layout>
                    <h2 className="text-3xl font-bold mb-2 text-text-primary">Connect Partner</h2>
                    <p className="text-text-secondary mb-8">Start your journey together</p>

                    <AnimatePresence mode='wait'>
                        {!mode && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                                key="menu"
                            >
                                <Button variant="primary" size="lg" className="w-full text-lg shadow-md" onClick={() => { setMode('create'); generateCode(); }}>
                                    Generate Code
                                </Button>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-black/5"></span></div>
                                    <div className="relative flex justify-center text-sm"><span className="px-4 bg-white/50 backdrop-blur rounded-full text-text-secondary">Or</span></div>
                                </div>
                                <Button variant="secondary" size="lg" className="w-full text-lg" onClick={() => setMode('join')}>
                                    Enter Partner's Code
                                </Button>
                            </motion.div>
                        )}

                        {mode === 'create' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                                key="create"
                            >
                                <div className="bg-white/50 p-6 rounded-3xl border border-white">
                                    <p className="mb-4 text-text-secondary text-sm font-medium uppercase tracking-wider">Your Code</p>
                                    <motion.div
                                        onClick={copyCode}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-5xl font-mono font-bold tracking-widest text-text-primary mb-2 cursor-pointer select-all"
                                    >
                                        {loading ? '...' : generatedCode}
                                    </motion.div>
                                    <button onClick={copyCode} className="text-accent-pop text-sm font-medium hover:underline">
                                        {copied ? 'Copied!' : 'Tap to Copy'}
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-text-secondary animate-pulse">
                                    <div className="w-2 h-2 bg-accent-pop rounded-full" />
                                    <p className="text-sm">Waiting for partner...</p>
                                </div>

                                <Button variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
                            </motion.div>
                        )}

                        {mode === 'join' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                                key="join"
                            >
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="ENTER CODE"
                                        className="text-center text-3xl p-6 w-full rounded-2xl bg-white/60 border-2 border-transparent focus:border-accent focus:bg-white outline-none transition-all placeholder:text-black/10 text-text-primary shadow-inner font-mono tracking-widest uppercase"
                                        value={code}
                                        onChange={e => setCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                    />
                                    <p className="text-xs text-text-secondary">Ask your partner for the code</p>
                                </div>

                                <Button variant="primary" size="lg" className="w-full shadow-lg" onClick={joinCouple} isLoading={loading}>
                                    Connect
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={() => setMode(null)}>Cancel</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </Card>
        </div>
    );
};
