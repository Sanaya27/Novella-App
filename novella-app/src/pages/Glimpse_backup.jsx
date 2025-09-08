import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Camera, Timer, Heart, MessageSquare } from 'lucide-react';

const glimpseStories = [
    {
        id: 1,
        author: 'Sofia Luna',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        timeLeft: 180,
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800',
        text: 'Watching butterflies dance in the morning light 🦋',
        hearts: 12,
        viewed: false
    },
    {
        id: 2,
        author: 'Aria Chen',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
        timeLeft: 420,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        text: 'Sunset music session on the rooftop 🎵',
        hearts: 8,
        viewed: true
    },
    {
        id: 3,
        author: 'Zara Moon',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        timeLeft: 600,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        text: 'Morning yoga with the sunrise 🌅',
        hearts: 15,
        viewed: false
    }
];

export default function Glimpse() {
    const [activeStory, setActiveStory] = useState(null);
    const [stories, setStories] = useState(glimpseStories);
    const [showCamera, setShowCamera] = useState(false);
    const [newGlimpseText, setNewGlimpseText] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setStories(prev => prev.map(story => ({
                ...story,
                timeLeft: Math.max(0, story.timeLeft - 1)
            })).filter(story => story.timeLeft > 0));
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const likeStory = (storyId) => {
        setStories(prev => prev.map(story => 
            story.id === storyId 
                ? { ...story, hearts: story.hearts + 1 }
                : story
        ));
    };

    const viewStory = (story) => {
        setActiveStory(story);
        setStories(prev => prev.map(s => 
            s.id === story.id 
                ? { ...s, viewed: true }
                : s
        ));
    };

    const createGlimpse = () => {
        if (newGlimpseText.trim()) {
            setNewGlimpseText('');
            setShowCamera(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            padding: '20px',
            paddingTop: '40px'
        }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '32px' }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    <Eye style={{
                        width: '40px',
                        height: '40px',
                        color: '#6366f1'
                    }} />
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        fontStyle: 'italic'
                    }}>
                        Glimpse
                    </h1>
                </div>
                
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontStyle: 'italic',
                    fontSize: '16px'
                }}>
                    Share fleeting moments that disappear like butterfly wings
                </p>
            </motion.div>

            {/* Create Button */}
            <motion.button
                onClick={() => setShowCamera(true)}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '18px',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                }}
            >
                <Camera style={{ width: '22px', height: '22px' }} />
                Share a Glimpse
            </motion.button>

            {/* Stories Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '100px'
            }}>
                {stories.map((story, index) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => viewStory(story)}
                        style={{
                            position: 'relative',
                            aspectRatio: '9/16',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: story.viewed ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid #6366f1'
                        }}
                    >
                        <img 
                            src={story.image}
                            alt={`${story.author}'s glimpse`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: story.viewed ? 'brightness(0.7)' : 'none'
                            }}
                        />
                        
                        {/* Author avatar */}
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid white',
                            overflow: 'hidden'
                        }}>
                            <img 
                                src={story.avatar}
                                alt={story.author}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        
                        {/* Timer badge */}
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            borderRadius: '12px',
                            padding: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Timer style={{
                                width: '12px',
                                height: '12px',
                                color: 'white'
                            }} />
                            <span style={{
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}>
                                {formatTime(story.timeLeft)}
                            </span>
                        </div>
                        
                        {/* Content overlay */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            padding: '16px'
                        }}>
                            <h4 style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '700',
                                margin: '0 0 4px 0',
                                fontStyle: 'italic'
                            }}>
                                {story.author}
                            </h4>
                            
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '12px',
                                margin: '0 0 8px 0',
                                lineHeight: '1.3',
                                fontStyle: 'italic'
                            }}>
                                {story.text}
                            </p>
                            
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <Heart style={{
                                    width: '14px',
                                    height: '14px',
                                    color: '#ec4899',
                                    fill: 'currentColor'
                                }} />
                                <span style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {story.hearts}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Story Viewer */}
            <AnimatePresence>
                {activeStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveStory(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                aspectRatio: '9/16',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <img 
                                src={activeStory.image}
                                alt={activeStory.author}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                padding: '20px'
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    margin: '0 0 8px 0',
                                    fontStyle: 'italic'
                                }}>
                                    {activeStory.author}
                                </h3>
                                
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '16px',
                                    margin: '0 0 16px 0',
                                    fontStyle: 'italic'
                                }}>
                                    {activeStory.text}
                                </p>
                                
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '16px'
                                }}>
                                    <button
                                        onClick={() => likeStory(activeStory.id)}
                                        style={{
                                            background: 'rgba(236, 72, 153, 0.2)',
                                            border: '1px solid #ec4899',
                                            borderRadius: '50%',
                                            padding: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Heart style={{
                                            width: '20px',
                                            height: '20px',
                                            color: '#ec4899',
                                            fill: 'currentColor'
                                        }} />
                                    </button>
                                    
                                    <button style={{
                                        background: 'rgba(34, 211, 238, 0.2)',
                                        border: '1px solid #22d3ee',
                                        borderRadius: '50%',
                                        padding: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <MessageSquare style={{
                                            width: '20px',
                                            height: '20px',
                                            color: '#22d3ee'
                                        }} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Camera Modal */}
            <AnimatePresence>
                {showCamera && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCamera(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'rgba(0, 0, 0, 0.9)',
                                borderRadius: '24px',
                                padding: '32px',
                                border: '2px solid #6366f1',
                                textAlign: 'center',
                                maxWidth: '400px',
                                width: '100%'
                            }}
                        >
                            <h2 style={{
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: '700',
                                marginBottom: '16px',
                                fontStyle: 'italic'
                            }}>
                                Share a Glimpse
                            </h2>
                            
                            <div style={{
                                width: '200px',
                                height: '300px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                borderRadius: '16px',
                                margin: '0 auto 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Camera style={{
                                    width: '48px',
                                    height: '48px',
                                    color: 'white'
                                }} />
                            </div>
                            
                            <input
                                type="text"
                                value={newGlimpseText}
                                onChange={(e) => setNewGlimpseText(e.target.value)}
                                placeholder="What's this moment about?"
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    color: 'white',
                                    fontSize: '16px',
                                    outline: 'none',
                                    fontStyle: 'italic',
                                    marginBottom: '24px'
                                }}
                            />
                            
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'center'
                            }}>
                                <button
                                    onClick={() => setShowCamera(false)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '12px',
                                        padding: '12px 24px',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createGlimpse}
                                    disabled={!newGlimpseText.trim()}
                                    style={{
                                        background: newGlimpseText.trim() 
                                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                                            : 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '12px 24px',
                                        color: 'white',
                                        cursor: newGlimpseText.trim() ? 'pointer' : 'not-allowed',
                                        fontWeight: '700'
                                    }}
                                >
                                    Share
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}