import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export const AuthPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
            <Card className="w-full max-w-md p-8 flex flex-col gap-6" variant="glass">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">Dear23</h1>
                    <p className="text-[var(--color-text-secondary)]">Our warm & cozy space</p>
                </div>

                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-4 rounded-xl bg-white/50 focus:bg-white border-none outline-none transition-all focus:ring-2 focus:ring-[var(--color-accent)]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-4 rounded-xl bg-white/50 focus:bg-white border-none outline-none transition-all focus:ring-2 focus:ring-[var(--color-accent)]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full mt-2"
                        isLoading={loading}
                    >
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-[var(--color-text-secondary)] hover:underline underline-offset-4"
                    >
                        {isSignUp ? 'Already have an account? Log In' : 'Create a new account'}
                    </button>
                </div>
            </Card>
        </div>
    );
};
