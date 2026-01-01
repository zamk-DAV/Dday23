import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './features/auth/AuthPage';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { CoupleConnection } from './features/onboarding/CoupleConnection';
import { NotionSetup } from './features/onboarding/NotionSetup';
import { ChatRoom } from './features/chat/ChatRoom';
import { DiaryFeed } from './features/diary/DiaryFeed';
import { FeedList } from './features/feed/FeedList';
import { CalendarView } from './features/calendar/CalendarView';
import { SettingsPage } from './features/settings/SettingsPage';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized, initialize, couple } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) initialize();
  }, [initialize, initialized]);

  if (!initialized || (loading && !user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary gap-8 relative overflow-hidden">
        {/* Twinkling Stars Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-accent rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="relative z-10"
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          </svg>
        </motion.div>

        <div className="flex flex-col items-center gap-2 z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-text-primary font-serif italic text-xl tracking-widest"
          >
            Dear23
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-text-secondary text-xs font-medium tracking-[0.3em] uppercase opacity-60"
          >
            우리의 이야기를 불러오는 중
          </motion.span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!couple && !location.pathname.startsWith('/connect') && !location.pathname.startsWith('/setup')) {
    // return <Navigate to="/connect" replace />; 
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) initialize();
  }, [initialize, initialized]);

  if (!initialized || loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />

      <Route path="/" element={
        <AuthGuard>
          <Layout />
        </AuthGuard>
      }>
        <Route index element={<HomePage />} />

        <Route path="connect" element={<CoupleConnection />} />
        <Route path="setup" element={<NotionSetup />} />

        {/* Features */}
        <Route path="chat" element={<ChatRoom />} />
        <Route path="feed" element={<FeedList />} />
        <Route path="diary" element={<DiaryFeed />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
