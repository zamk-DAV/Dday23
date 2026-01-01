import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const NotionSetup: React.FC = () => {
    const { couple } = useAuthStore();
    const navigate = useNavigate();
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSetup = async () => {
        if (!couple) return;
        setLoading(true);
        try {
            // In a real implementation:
            // 1. Validate Key with Notion API (via Edge Function)
            // 2. Check for existence of 'Dear23' Page
            // 3. Create Databases if missing
            // 4. Save DB IDs to Supabase 'couples' table

            // For now, simulate saving the key
            // @ts-ignore
            const { error } = await supabase
                .from('couples')
                .update({ notion_api_key: apiKey, notion_db_map: { status: 'mocked_setup_complete' } } as any)
                .eq('id', couple.id);

            if (error) throw error;

            alert("Notion Setup Complete! Databases created.");
            navigate('/');

        } catch (e: any) {
            alert("Setup Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-8" variant="glass">
                <h2 className="text-2xl font-bold mb-2">Notion Integration</h2>
                <p className="text-gray-600 mb-6">
                    Enter your Notion Integration Token. <br />
                    We will automatically create the <b>Dear23</b> page and databases for you.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Internal Integration Token</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded-lg border bg-white/50"
                            placeholder="secret_..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                        <strong>Tip:</strong> Create an integration at <u>developers.notion.com</u> and give it access to your page.
                    </div>

                    <Button variant="primary" className="w-full" onClick={handleSetup} isLoading={loading}>
                        Start Dear23
                    </Button>
                </div>
            </Card>
        </div>
    );
};
