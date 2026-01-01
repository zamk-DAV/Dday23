import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { motion } from 'framer-motion';
import { BsPlusLg, BsGrid3X3, BsListUl } from 'react-icons/bs';
import { Button } from '../../components/Button';
import { MediaViewer } from '../../components/MediaViewer';

// Mock Data
const MOCK_DIARY_ENTRIES = Array.from({ length: 12 }).map((_, i) => ({
    id: `diary-${i}`,
    imageUrl: `https://picsum.photos/seed/${i}/800/800`, // Better quality for zoom
    title: `Diary Entry ${i + 1}`,
    date: new Date().toISOString()
}));

export const DiaryFeed: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    // Using constant for now since setEntries is unused
    const entries = MOCK_DIARY_ENTRIES;

    const selectedIndex = entries.findIndex(e => e.id === selectedId);
    const selectedEntry = entries[selectedIndex];

    const handleNext = () => {
        if (selectedIndex < entries.length - 1) setSelectedId(entries[selectedIndex + 1].id);
    };

    const handlePrev = () => {
        if (selectedIndex > 0) setSelectedId(entries[selectedIndex - 1].id);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] p-4 pb-20">
            <MediaViewer
                isOpen={!!selectedId}
                onClose={() => setSelectedId(null)}
                imageSrc={selectedEntry?.imageUrl || ''}
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={selectedIndex < entries.length - 1}
                hasPrev={selectedIndex > 0}
            />

            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Our Diary</h1>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'text-[var(--color-accent)]' : 'text-gray-400'}
                    >
                        <BsGrid3X3 />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'text-[var(--color-accent)]' : 'text-gray-400'}
                    >
                        <BsListUl />
                    </Button>
                    <Button variant="primary" size="sm" className="ml-2">
                        <BsPlusLg className="mr-1" /> New
                    </Button>
                </div>
            </header>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-3 gap-1">
                    {entries.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="aspect-square bg-gray-200 relative overflow-hidden group cursor-pointer"
                            onClick={() => setSelectedId(entry.id)}
                            layoutId={entry.id}
                        >
                            <img
                                src={entry.imageUrl}
                                alt={entry.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-6">
                    {entries.map((entry) => (
                        <Card key={entry.id} className="overflow-hidden" padding="none">
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                <span className="font-medium text-sm">Dear23</span>
                            </div>
                            <img
                                src={entry.imageUrl}
                                alt={entry.title}
                                className="w-full aspect-square object-cover"
                                onClick={() => setSelectedId(entry.id)}
                            />
                            <div className="p-4">
                                <p className="font-bold mb-1">{entry.title}</p>
                                <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
