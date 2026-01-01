import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './features/auth/AuthPage';
import { useAuthStore } from './store/authStore';
import { CoupleConnection } from './features/onboarding/CoupleConnection';
import { NotionSetup } from './features/onboarding/NotionSetup';
import { ChatRoom } from './features/chat/ChatRoom';
import { DiaryFeed } from './features/diary/DiaryFeed';
import { FeedList } from './features/feed/FeedList';
import { CalendarView } from './features/calendar/CalendarView';
import { SettingsPage } from './features/settings/SettingsPage';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialize, couple } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary gap-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-accent-pop)" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          </svg>
        </motion.div>
        <motion.span
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-text-secondary font-medium tracking-wide"
        >
          Loading Dear23...
        </motion.span>
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
  const { user, loading, initialize } = useAuthStore();

  useEffect(() => {
    if (!loading) initialize();
  }, [initialize, loading]);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
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
