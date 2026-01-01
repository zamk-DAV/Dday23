import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { BsBell, BsPerson, BsShieldLock, BsBoxArrowRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
    const { user, profile, signOut } = useAuthStore();
    const navigate = useNavigate();

    // Local state for form
    const [username, setUsername] = useState(profile?.username || '');
    const [pushEnabled, setPushEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (profile) setUsername(profile.username || '');
        // Check existing subscription (mock)
        const checkPush = async () => {
            // In real app: navigator.serviceWorker.ready -> subscription
            setPushEnabled(localStorage.getItem('push_enabled') === 'true');
        };
        checkPush();
    }, [profile]);

    const handleUpdateProfile = async () => {
        if (!user) return;
        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({ username } as any)
            .eq('id', user.id);

        if (!error) {
            setMsg('Profile updated!');
            setTimeout(() => setMsg(''), 2000);
            window.location.reload(); // Refresh to catch store update (simple way)
        } else {
            alert('Error updating profile');
        }
        setLoading(false);
    };

    const togglePush = async () => {
        // Toggle Logic (Mock for now, would involve requesting permission)
        if (!pushEnabled) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setPushEnabled(true);
                localStorage.setItem('push_enabled', 'true');

                // Simulate saving token to DB
                // const token = await getTokenFromFCM();
                // await supabase.from('push_subscriptions').insert({ user_id: user.id, token ... });
                alert("Push Notifications Enabled! (Simulator)");
            } else {
                alert("Permission denied");
            }
        } else {
            setPushEnabled(false);
            localStorage.setItem('push_enabled', 'false');
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] p-4 pb-20">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Settings</h1>
            </header>

            <div className="space-y-4">
                {/* Profile Section */}
                <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4 text-[var(--color-accent)]">
                        <BsPerson size={20} />
                        <h2 className="font-semibold text-lg">My Profile</h2>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500">Email</label>
                            <div className="text-gray-700 font-medium">{user?.email}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full mt-1 p-2 bg-gray-50 rounded border border-gray-200 focus:border-[var(--color-accent)] outline-none"
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleUpdateProfile}
                            isLoading={loading}
                            className="w-full mt-2"
                        >
                            Save Changes
                        </Button>
                        {msg && <p className="text-green-500 text-sm text-center">{msg}</p>}
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4 text-[var(--color-accent)]">
                        <BsBell size={20} />
                        <h2 className="font-semibold text-lg">Notifications</h2>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <span className="text-gray-700">Push Notifications</span>
                        <div
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${pushEnabled ? 'bg-green-400' : 'bg-gray-300'}`}
                            onClick={togglePush}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Receive alerts for new messages and diary updates.
                    </p>
                </Card>

                {/* System */}
                <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4 text-gray-500">
                        <BsShieldLock size={20} />
                        <h2 className="font-semibold text-lg">System</h2>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span>Version</span>
                            <span>1.0.0 (Beta)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span>Supabase Connection</span>
                            <span className="text-green-500">Active</span>
                        </div>
                    </div>
                </Card>

                <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50" onClick={handleLogout}>
                    <BsBoxArrowRight className="mr-2" /> Log Out
                </Button>
            </div>
        </div>
    );
};
