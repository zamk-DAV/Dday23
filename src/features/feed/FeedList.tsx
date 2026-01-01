import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { BsPencilSquare, BsHeart, BsChat, BsShare } from 'react-icons/bs';
import { MediaViewer } from '../../components/MediaViewer';

const MOCK_FEED = [
    { id: 1, author: 'Partner', content: 'Today was amazing! ❤️', image: null, time: '2h ago', likes: 5 },
    { id: 2, author: 'Me', content: 'Look at this delicious food!', image: 'https://picsum.photos/seed/food/800/600', time: '5h ago', likes: 12 },
    { id: 3, author: 'Partner', content: 'Can we go here next weekend?', image: 'https://picsum.photos/seed/travel/800/600', time: '1d ago', likes: 8 },
];

export const FeedList: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] pb-20">
            <MediaViewer
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageSrc={selectedImage || ''}
                // Feed is vertical list, simpler to just view single image for now
                hasNext={false}
                hasPrev={false}
            />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 px-4 py-3 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold">Feed</h1>
                <Button variant="ghost" size="icon" className="text-[var(--color-accent)]">
                    <BsPencilSquare size={20} />
                </Button>
            </header>

            {/* Feed Items */}
            <div className="p-4 space-y-4">
                {MOCK_FEED.map(post => (
                    <Card key={post.id} className="overflow-hidden" padding="none">
                        <div className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                            <div>
                                <p className="font-bold text-sm">{post.author}</p>
                                <p className="text-xs text-gray-500">{post.time}</p>
                            </div>
                        </div>

                        {post.content && <p className="px-4 pb-2 text-gray-800">{post.content}</p>}

                        {post.image && (
                            <img
                                src={post.image}
                                alt="Post"
                                className="w-full h-64 object-cover cursor-pointer"
                                onClick={() => setSelectedImage(post.image)}
                            />
                        )}

                        <div className="p-4 flex items-center justify-between text-gray-500 border-t border-gray-100 mt-2">
                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                <BsHeart /> <span className="text-xs">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <BsChat /> <span className="text-xs">Comment</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                                <BsShare />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
