import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-[var(--color-accent)] rounded-full mb-4" />
          <span className="text-[var(--color-text-secondary)] font-medium">Loading Dear23...</span>
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
