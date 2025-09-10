import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, MessageSquare, Send } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import Butterfly3D from '../components/Butterfly3D';

const ghostGlimpses = [
    {
        id: 1,
        author: 'Zara Moon',
        timeAgo: '3 hours ago',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        text: 'A blurred glimpse awaits...',
        isBlurred: true,
        status: null
    },
    {
        id: 2,
        author: 'Lily Chen',
        timeAgo: '2 minutes ago',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
        text: 'You glimpsed my smile during sunset... 🌅',
        isBlurred: false,
        status: null
    },
    {
        id: 3,
        author: 'Sofia Luna',
        timeAgo: '1 hour ago',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        text: 'Morning coffee thoughts...',
        isBlurred: true,
        status: null
    }
];

export default function Glimpse() {
    const [glimpses, setGlimpses] = useState(ghostGlimpses);
    const [selectedGlimpse, setSelectedGlimpse] = useState(null);
    const [viewingGlimpse, setViewingGlimpse] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isARMode, setIsARMode] = useState(false);
    const [visibleButterflies, setVisibleButterflies] = useState([]);

    // Countdown timer for glimpse viewing
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && viewingGlimpse) {
            // Show reply modal after countdown
            setViewingGlimpse(null);
            setShowReplyModal(true);
        }
    }, [countdown, viewingGlimpse]);

    // Enhanced butterfly animation with debugging (based on memory settings)
    useEffect(() => {
        if (isARMode) {
            console.log('AR Mode activated - generating butterflies');
            
            const createButterfly = () => {
                const newButterfly = {
                    id: Date.now() + Math.random(),
                    startX: Math.random() * (window.innerWidth - 100),
                    startY: Math.random() * (window.innerHeight - 200) + 100,
                    targetX: Math.random() * (window.innerWidth - 100),
                    targetY: Math.random() * (window.innerHeight - 200) + 100,
                    color: Math.random() > 0.5 ? '#ec4899' : '#8b5cf6'
                };
                
                setVisibleButterflies(prev => {
                    const updated = [...prev, newButterfly];
                    console.log('Butterfly added, total count:', updated.length);
                    return updated;
                });
                
                // Remove butterfly after flight (3 seconds as per memory)
                setTimeout(() => {
                    setVisibleButterflies(prev => {
                        const filtered = prev.filter(b => b.id !== newButterfly.id);
                        console.log('Butterfly removed, remaining count:', filtered.length);
                        return filtered;
                    });
                }, 3000);
            };
            
            // Create initial butterflies
            for (let i = 0; i < 5; i++) {
                setTimeout(() => createButterfly(), i * 150); // 150ms delay as per memory
            }
            
            // Continue generating butterflies
            const interval = setInterval(createButterfly, 200);
            
            return () => {
                clearInterval(interval);
                console.log('AR Mode deactivated - clearing butterflies');
            };
        } else {
            setVisibleButterflies([]);
        }
    }, [isARMode]);

    const unlockGlimpse = (glimpseId) => {
        setGlimpses(prev => prev.map(glimpse => 
            glimpse.id === glimpseId 
                ? { ...glimpse, isBlurred: false }
                : glimpse
        ));
    };

    const viewGlimpse = (glimpse) => {
        if (!glimpse.isBlurred) {
            setSelectedGlimpse(glimpse);
            setViewingGlimpse(glimpse);
            setCountdown(3); // 3 second countdown
        }
    };

    const handleReply = () => {
        if (replyText.trim()) {
            // Handle reply logic here
            console.log('Reply sent:', replyText);
            setReplyText('');
            setShowReplyModal(false);
            setSelectedGlimpse(null);
        }
    };

    const closeMaybeLater = () => {
        setShowReplyModal(false);
        setSelectedGlimpse(null);
        setReplyText('');
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '16px',
            paddingTop: '40px',
            background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 50%, #EC4899 100%)',
            paddingBottom: '100px'
        }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '32px' }}
            >
                <h1 style={{
                    fontSize: '42px',
                    fontWeight: '700',
                    background: 'linear-gradient(45deg, #22d3ee, #8b5cf6, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '0 0 8px 0',
                    fontStyle: 'italic'
                }}>
                    Ghost Glimpse
                </h1>
                
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontStyle: 'italic',
                    fontSize: '18px',
                    margin: 0
                }}>
                    Fleeting moments that fade away
                </p>
                
                {/* AR Mode Toggle */}
                <motion.button
                    onClick={() => setIsARMode(!isARMode)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: isARMode 
                            ? 'linear-gradient(135deg, #22d3ee, #8b5cf6)'
                            : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    🦋 {isARMode ? 'Exit AR' : 'AR Mode'}
                </motion.button>
            </motion.div>

            {/* Ghost Glimpses */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '32px'
            }}>
                {glimpses.map((glimpse, index) => (
                    <motion.div
                        key={glimpse.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            position: 'relative'
                        }}
                    >
                        {glimpse.status && (
                            <div style={{
                                padding: '12px 20px',
                                background: 'rgba(139, 92, 246, 0.2)',
                                textAlign: 'center'
                            }}>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '14px',
                                    fontStyle: 'italic',
                                    margin: 0
                                }}>
                                    {glimpse.status}
                                </p>
                            </div>
                        )}
                        
                        {/* Image Container */}
                        <div style={{
                            position: 'relative',
                            height: '200px',
                            overflow: 'hidden',
                            cursor: glimpse.isBlurred ? 'default' : 'pointer'
                        }}
                        onClick={() => viewGlimpse(glimpse)}
                        >
                            <img 
                                src={glimpse.image}
                                alt={`${glimpse.author}'s glimpse`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: glimpse.isBlurred ? 'blur(15px) brightness(0.7)' : 'none'
                                }}
                            />
                            
                            {/* Author Name */}
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: '12px',
                                padding: '6px 12px'
                            }}>
                                <span style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    {glimpse.author}
                                </span>
                            </div>
                            
                            {/* Unlock/View Icon */}
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: '50%',
                                padding: '8px',
                                cursor: 'pointer'
                            }}>
                                {glimpse.isBlurred ? (
                                    <EyeOff style={{
                                        width: '20px',
                                        height: '20px',
                                        color: 'white'
                                    }} />
                                ) : (
                                    <Eye style={{
                                        width: '20px',
                                        height: '20px',
                                        color: '#22d3ee'
                                    }} />
                                )}
                            </div>
                            
                            {/* Time Ago */}
                            <div style={{
                                position: 'absolute',
                                bottom: '16px',
                                right: '16px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: '12px',
                                padding: '4px 8px'
                            }}>
                                <span style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    {glimpse.timeAgo}
                                </span>
                            </div>
                        </div>
                        
                        {/* Text Content */}
                        <div style={{
                            padding: '16px 20px'
                        }}>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '16px',
                                fontStyle: 'italic',
                                margin: 0,
                                lineHeight: '1.4'
                            }}>
                                {glimpse.text}
                            </p>
                            
                            {glimpse.isBlurred && (
                                <motion.button
                                    onClick={() => unlockGlimpse(glimpse.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '8px 16px',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginTop: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <MessageSquare style={{ width: '14px', height: '14px' }} />
                                    Unlock
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* How Ghost Glimpse Works */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                }}
            >
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '20px',
                    fontStyle: 'italic'
                }}>
                    How Ghost Glimpse Works
                </h2>
                
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#22d3ee',
                            marginTop: '6px',
                            flexShrink: 0
                        }} />
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            <strong>Send spontaneous photos</strong> that disappear after viewing once
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#8b5cf6',
                            marginTop: '6px',
                            flexShrink: 0
                        }} />
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            <strong>Blurred previews tease the moment</strong> - reply to unlock the clear image
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#fbbf24',
                            marginTop: '6px',
                            flexShrink: 0
                        }} />
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            <strong>Once viewed, the glimpse fades forever</strong>, creating precious fleeting intimacy
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Full Screen Glimpse Viewer */}
            <AnimatePresence>
                {viewingGlimpse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                aspectRatio: '3/4',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <img 
                                src={viewingGlimpse.image}
                                alt={`${viewingGlimpse.author}'s glimpse`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            
                            {/* Countdown Timer */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0, 0, 0, 0.8)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Eye style={{
                                    width: '16px',
                                    height: '16px',
                                    color: '#22d3ee'
                                }} />
                                <span style={{
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}>
                                    {countdown}s
                                </span>
                            </div>
                            
                            {/* Text Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                padding: '40px 20px 20px'
                            }}>
                                <p style={{
                                    color: 'white',
                                    fontSize: '18px',
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    margin: 0,
                                    lineHeight: '1.4'
                                }}>
                                    {viewingGlimpse.text}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reply Modal */}
            <AnimatePresence>
                {showReplyModal && selectedGlimpse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                background: 'rgba(0, 0, 0, 0.9)',
                                borderRadius: '24px',
                                padding: '32px',
                                border: '2px solid rgba(139, 92, 246, 0.5)',
                                maxWidth: '400px',
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            {/* Butterfly Icon */}
                            <div style={{
                                fontSize: '48px',
                                marginBottom: '20px'
                            }}>
                                🦋
                            </div>
                            
                            <h2 style={{
                                color: 'white',
                                fontSize: '28px',
                                fontWeight: '700',
                                marginBottom: '16px',
                                fontStyle: 'italic'
                            }}>
                                Glimpse Captured
                            </h2>
                            
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '16px',
                                fontStyle: 'italic',
                                marginBottom: '32px',
                                lineHeight: '1.5'
                            }}>
                                The moment has fluttered away... but you can<br />
                                reply to {selectedGlimpse.author} right now!
                            </p>
                            
                            {/* Reply Input */}
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Flutter your thoughts..."
                                style={{
                                    width: '100%',
                                    height: '100px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontStyle: 'italic',
                                    outline: 'none',
                                    resize: 'none',
                                    marginBottom: '24px'
                                }}
                            />
                            
                            {/* Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'center'
                            }}>
                                <button
                                    onClick={closeMaybeLater}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '16px',
                                        padding: '14px 28px',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Maybe later
                                </button>
                                
                                <motion.button
                                    onClick={handleReply}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={!replyText.trim()}
                                    style={{
                                        background: replyText.trim() 
                                            ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                                            : 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '16px',
                                        padding: '14px 28px',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Send style={{ width: '16px', height: '16px' }} />
                                    Reply
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Enhanced AR Garden with Visible Butterflies */}
            {isARMode && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 1001
                }}>
                    {/* AR Header */}
                    <div style={{
                        position: 'absolute',
                        top: '60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        zIndex: 1002
                    }}>
                        <h2 style={{
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            marginBottom: '8px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                        }}>
                            AR Garden View
                        </h2>
                        <p style={{
                            color: '#22d3ee',
                            fontSize: '16px',
                            fontStyle: 'italic',
                            margin: 0,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                        }}>
                            Butterflies projected into your space
                        </p>
                    </div>
                    
                    {/* Exit AR Button */}
                    <motion.button
                        onClick={() => setIsARMode(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(34, 211, 238, 0.9)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            zIndex: 1002,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        📷 Exit AR View
                    </motion.button>
                    
                    {/* Bottom instruction */}
                    <div style={{
                        position: 'absolute',
                        bottom: '100px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        zIndex: 1002
                    }}>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            fontStyle: 'italic',
                            margin: 0,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                        }}>
                            Move your device to see butterflies dance in your environment
                        </p>
                    </div>
                    
                    {/* Visible Flying Butterflies */}
                    <AnimatePresence>
                        {visibleButterflies.map((butterfly) => (
                            <motion.div
                                key={butterfly.id}
                                initial={{
                                    x: butterfly.startX,
                                    y: butterfly.startY,
                                    scale: 0,
                                    opacity: 0
                                }}
                                animate={{
                                    x: butterfly.targetX,
                                    y: butterfly.targetY,
                                    scale: 1,
                                    opacity: 1
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.5
                                }}
                                transition={{
                                    duration: 2.0, // 2.0 seconds as per memory optimization
                                    ease: "easeInOut"
                                }}
                                style={{
                                    position: 'absolute',
                                    fontSize: '48px', // Large emoji butterflies as per memory
                                    pointerEvents: 'none',
                                    zIndex: 9999, // High z-index as per memory
                                    color: butterfly.color,
                                    filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))',
                                    background: 'rgba(139, 92, 246, 0.1)', // Debug background as per memory
                                    borderRadius: '50%',
                                    padding: '8px'
                                }}
                                onClick={() => console.log('Flutter clicked:', butterfly.id)} // Debug logging
                            >
                                🦋
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
