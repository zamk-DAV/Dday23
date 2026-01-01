import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-bg-secondary relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-pop/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <Card className="p-8 flex flex-col gap-8 shadow-float backdrop-blur-xl bg-white/60 border-white/50" variant="glass">
                    <div className="text-center space-y-2">
                        <motion.h1
                            className="text-4xl font-bold text-text-primary tracking-tight"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Dear23
                        </motion.h1>
                        <p className="text-text-secondary text-lg">Our warm & cozy space</p>
                    </div>

                    <form onSubmit={handleAuth} className="flex flex-col gap-5">
                        <div className="space-y-4">
                            <motion.div whileFocusWithin={{ scale: 1.02 }} className="transition-transform">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-4 rounded-2xl bg-white/70 border-2 border-transparent focus:border-accent focus:bg-white outline-none transition-all placeholder:text-text-placeholder text-text-primary shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </motion.div>
                            <motion.div whileFocusWithin={{ scale: 1.02 }} className="transition-transform">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-4 rounded-2xl bg-white/70 border-2 border-transparent focus:border-accent focus:bg-white outline-none transition-all placeholder:text-text-placeholder text-text-primary shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </motion.div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-sm text-error text-center font-medium bg-red-50 p-2 rounded-lg"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-2 text-lg shadow-md"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            isLoading={loading}
                        >
                            {isSignUp ? 'Sign Up' : 'Log In'}
                        </Button>
                    </form>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-text-secondary hover:text-accent-pop transition-colors underline-offset-4 hover:underline"
                        >
                            {isSignUp ? 'Already have an account? Log In' : 'Create a new account'}
                        </button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};
