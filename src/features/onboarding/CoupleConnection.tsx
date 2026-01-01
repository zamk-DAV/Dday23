import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const CoupleConnection: React.FC = () => {
    const { user, checkCoupleStatus } = useAuthStore();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'create' | 'join' | null>(null);
    const [code, setCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateCode = async () => {
        if (!user) return;
        setLoading(true);
        // Logic to generate code in DB
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
                    filter: `notion_api_key=eq.${newCode}` // Hacky filter, better to use proper logic
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 text-center" variant="glass">
                <h2 className="text-2xl font-bold mb-6">Connect with Partner</h2>

                {!mode && (
                    <div className="space-y-4">
                        <Button variant="primary" className="w-full" onClick={() => { setMode('create'); generateCode(); }}>
                            Generate Code
                        </Button>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div>
                        </div>
                        <Button variant="secondary" className="w-full" onClick={() => setMode('join')}>
                            Enter Partner's Code
                        </Button>
                    </div>
                )}

                {mode === 'create' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <p className="mb-4 text-gray-600">Share this code with your partner:</p>
                        <div className="text-4xl font-mono font-bold tracking-widest text-[var(--color-accent)] mb-8">
                            {loading ? '...' : generatedCode}
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Waiting for partner...</p>
                        <Button variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
                    </div>
                )}

                {mode === 'join' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4">
                        <input
                            type="text"
                            placeholder="Enter Code (e.g. A1B2C3)"
                            className="text-center text-2xl p-4 w-full rounded-xl border-2 border-[var(--color-accent)] uppercase"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                        />
                        <Button variant="primary" className="w-full" onClick={joinCouple} isLoading={loading}>
                            Connect
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setMode(null)}>Cancel</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};
