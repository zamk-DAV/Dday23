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
        const themes: ThemeType[] = ['moonlight', 'apple', 'forest', 'modern', 'dark'];
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
                alert('가입 완료! 로그인해주세요.');
                setIsSignUp(false);
            } else {
                await signInWithId(userId, password);
            }
        } catch (err: any) {
            setError(err.message === 'Invalid login credentials' ? '아이디 또는 비밀번호가 틀렸어요.' : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
            {/* Theme Toggle */}
            <button
                onClick={nextTheme}
                className="fixed top-6 right-6 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
                {theme}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-text-primary mb-2">Dear23</h1>
                    <p className="text-sm text-text-secondary">
                        {isSignUp ? '새 계정 만들기' : '로그인'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-bg-secondary rounded-2xl p-8">
                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="block text-xs text-text-secondary mb-2">아이디</label>
                            <input
                                type="text"
                                placeholder="아이디를 입력하세요"
                                className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-text-primary/10 focus:border-accent focus:outline-none text-text-primary text-sm placeholder:text-text-placeholder"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-text-secondary mb-2">비밀번호</label>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-text-primary/10 focus:border-accent focus:outline-none text-text-primary text-sm placeholder:text-text-placeholder"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs text-error text-center"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full py-3 rounded-xl bg-accent text-bg-primary font-medium text-sm hover:opacity-90 transition-opacity"
                            isLoading={loading}
                        >
                            {isSignUp ? '가입하기' : '로그인'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                        >
                            {isSignUp ? '이미 계정이 있나요?' : '계정이 없나요?'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
