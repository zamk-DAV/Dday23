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
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary relative overflow-hidden transition-colors duration-1000">
            {/* Background Decorations (Sentimental Blurs) */}
            <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ filter: 'url(#grainy)' }} />

            <Card className="w-full max-w-[420px] p-12 text-center relative z-10 border-text-primary/10 shadow-2xl" variant="glass">
                <motion.div layout transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="space-y-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
                        >
                            <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Our Space</span>
                        </motion.div>

                        <div className="space-y-3">
                            <h2 className="text-4xl font-serif text-text-primary tracking-tight leading-tight">
                                {mode === 'create' ? '우리의 코드' : mode === 'join' ? '코드 입력하기' : '둘만의 공간 연결'}
                            </h2>
                            <p className="text-text-secondary/60 text-[11px] font-medium tracking-[0.3em] uppercase">
                                {mode === 'create' ? '상대방에게 이 코드를 알려주세요' : mode === 'join' ? '받은 코드를 여기에 적어주세요' : '함께할 상대방을 기다리고 있어요'}
                            </p>
                        </div>
                    </div>

                    <AnimatePresence mode='wait'>
                        {!mode && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-4"
                                key="menu"
                            >
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full h-16 rounded-[24px] bg-text-primary text-bg-primary text-xs font-bold tracking-[0.2em] shadow-xl hover:opacity-90 transition-all border border-text-primary/10"
                                    onClick={() => { setMode('create'); generateCode(); }}
                                >
                                    코드 만들기
                                </Button>
                                <div className="relative py-4 flex items-center justify-center">
                                    <div className="absolute inset-x-0 h-[1px] bg-text-primary/5" />
                                    <span className="relative px-4 text-[10px] font-bold text-text-secondary/30 uppercase tracking-[0.3em] bg-bg-primary/5 backdrop-blur-sm rounded-full">혹은</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-full h-16 rounded-[24px] bg-bg-secondary/50 text-text-primary text-xs font-bold tracking-[0.2em] hover:bg-bg-secondary transition-all border border-text-primary/5"
                                    onClick={() => setMode('join')}
                                >
                                    받은 코드 입력
                                </Button>
                            </motion.div>
                        )}

                        {mode === 'create' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                                key="create"
                            >
                                <div className="bg-bg-secondary/40 p-10 rounded-[32px] border border-text-primary/5 relative group cursor-pointer overflow-hidden" onClick={copyCode}>
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <motion.div
                                        className="text-5xl font-mono font-bold tracking-[0.2em] text-text-primary mb-3 relative z-10"
                                    >
                                        {loading ? '...' : generatedCode}
                                    </motion.div>
                                    <p className="text-accent text-[10px] font-bold tracking-widest uppercase relative z-10">
                                        {copied ? '복사 완료!' : '눌러서 복사하기'}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-3 text-text-secondary/60">
                                        <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                                        <p className="text-[11px] font-medium tracking-wide">상대방의 연결을 기다리고 있어요...</p>
                                    </div>
                                    <button
                                        onClick={() => setMode(null)}
                                        className="text-[10px] text-text-secondary/40 hover:text-text-primary transition-colors font-bold uppercase tracking-widest"
                                    >
                                        취소하고 돌아가기
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {mode === 'join' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                                key="join"
                            >
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="CODE"
                                        className="text-center text-4xl p-8 w-full rounded-[32px] bg-bg-secondary/40 border-[1.5px] border-text-primary/10 focus:border-accent focus:bg-bg-primary outline-none transition-all placeholder:text-text-placeholder/30 text-text-primary font-mono tracking-[0.3em] uppercase shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                        value={code}
                                        onChange={e => setCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full h-16 rounded-[24px] bg-text-primary text-bg-primary text-xs font-bold tracking-[0.2em] shadow-xl"
                                        onClick={joinCouple}
                                        isLoading={loading}
                                    >
                                        연결하기
                                    </Button>
                                    <button
                                        onClick={() => setMode(null)}
                                        className="text-[10px] text-text-secondary/40 hover:text-text-primary transition-colors font-bold uppercase tracking-widest"
                                    >
                                        취소하고 돌아가기
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </Card>
        </div>
    );
};
