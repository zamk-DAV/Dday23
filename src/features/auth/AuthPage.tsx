import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore, ThemeType } from '../../store/themeStore';
import { Button } from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthPage: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { signInWithId, signUpWithId } = useAuthStore() as any;
    const { theme, setTheme } = useThemeStore();

    const nextTheme = () => {
        const themes: ThemeType[] = ['moonlight', 'apple', 'forest', 'clay', 'cat', 'morning', 'pastel', 'milktea', 'modern', 'grayscale', 'everest', 'dark'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                await signUpWithId(userId, password);
                alert('가입을 환영해요! 이제 로그인을 시도해주세요.');
                setIsSignUp(false);
            } else {
                await signInWithId(userId, password);
            }
        } catch (err: any) {
            setError(err.message === 'Invalid login credentials' ? '아이디 또는 비밀번호가 맞지 않아요.' : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-secondary relative overflow-hidden font-base transition-colors duration-700">
            {/* Ambient Background Blur */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ filter: 'url(#grainy)' }} />

            {/* Quick Theme Toggle (Helper) */}
            <button
                onClick={nextTheme}
                className="absolute top-8 right-8 text-[10px] tracking-[0.2em] text-text-secondary/40 hover:text-text-primary transition-colors border border-text-secondary/20 rounded-full px-3 py-1 z-50 uppercase"
            >
                Theme: {theme}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[420px] z-10"
            >
                {/* Envelope-style Card with Defined Borders */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-text-primary/5 rounded-[40px] translate-y-3 blur-2xl opacity-60 transition-transform group-hover:translate-y-4" />

                    <div className="relative bg-bg-primary border-[1.5px] border-text-primary/20 rounded-[40px] p-12 shadow-sm overflow-hidden transition-colors duration-700">
                        {/* Top Flap Decorative Line (Sharp & Clear) */}
                        <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

                        <div className="text-center space-y-4 mb-14">
                            <motion.h1
                                className="text-5xl font-serif text-text-primary tracking-tight leading-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Dear23
                            </motion.h1>
                            <p className="text-text-secondary text-[11px] font-medium tracking-[0.3em] uppercase opacity-60">
                                {isSignUp ? '우리의 새로운 공간을 만들어요' : '우리만 아는 비밀 우체통'}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-secondary/60 ml-1 uppercase tracking-widest">아이디</label>
                                    <input
                                        type="text"
                                        placeholder="어떻게 부를까요?"
                                        className="w-full p-4 rounded-2xl bg-bg-secondary/50 border-[1.5px] border-text-primary/10 focus:border-accent focus:bg-bg-primary outline-none transition-all placeholder:text-text-placeholder/50 text-text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-secondary/60 ml-1 uppercase tracking-widest">비밀번호</label>
                                    <input
                                        type="password"
                                        placeholder="둘만의 암호를 정해주세요"
                                        className="w-full p-4 rounded-2xl bg-bg-secondary/50 border-[1.5px] border-text-primary/10 focus:border-accent focus:bg-bg-primary outline-none transition-all placeholder:text-text-placeholder/50 text-text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[11px] text-error text-center font-medium tracking-tight"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full h-16 rounded-[24px] bg-text-primary text-bg-primary hover:opacity-90 transition-all text-xs font-bold tracking-[0.2em] shadow-xl active:scale-[0.97] border border-text-primary/10"
                                isLoading={loading}
                            >
                                {isSignUp ? '만들기' : '열어보기'}
                            </Button>
                        </form>

                        <div className="mt-12 text-center border-t border-text-primary/5 pt-8">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-[10px] text-text-secondary/60 hover:text-text-primary transition-colors font-medium tracking-widest uppercase"
                            >
                                {isSignUp ? '이미 공간이 있나요? 로그인' : '처음이신가요? 계정 만들기'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
