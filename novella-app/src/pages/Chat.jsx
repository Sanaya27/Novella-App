import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Camera, Mic, Lightbulb, Brain } from 'lucide-react';

const aiSuggestions = [
  "Ask about her art - she's passionate about creativity! 🎨",
  "Share a story about your own dreams ✨",
  "Compliment her authenticity - it's what makes her special 💕",
  "Ask about her favorite place to create art 🌆",
  "Share what inspires you most in life 🌌"
];

const initialMessages = [
    {
        id: 1,
        text: "Hey! I had such a great time syncing hearts with you earlier 😊",
        sender: 'partner',
        timestamp: '11:37 AM',
        type: 'text'
    },
    {
        id: 2,
        text: "Me too! It felt so magical.",
        sender: 'me',
        timestamp: '11:38 AM',
        type: 'text'
    },
    {
        id: 3,
        text: "🦋",
        sender: 'system',
        timestamp: '1m gap',
        type: 'reaction'
    },
    {
        id: 4,
        text: "Right? I've never experienced anything like it. My butterfly garden has a new species now!",
        sender: 'partner',
        timestamp: '11:39 AM',
        type: 'text'
    },
    {
        id: 5,
        text: "Suggest exploring the AR garden together",
        sender: 'me',
        timestamp: '11:43 AM',
        type: 'text'
    }
];

export default function Chat() {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [nervousnessLevel, setNervousnessLevel] = useState(20); // 0-100
    const [userCareScore, setUserCareScore] = useState(12); // 0-100
    const [partnerCareScore, setPartnerCareScore] = useState(1); // 0-100
    const [currentSuggestion, setCurrentSuggestion] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Only auto-cycle if user hasn't manually navigated recently
        if (!showSuggestions) return;
        
        const interval = setInterval(() => {
            setCurrentSuggestion(prev => (prev + 1) % aiSuggestions.length);
        }, 12000); // Increased from 8 to 12 seconds
        return () => clearInterval(interval);
    }, [showSuggestions]);

    const sendMessage = (text = newMessage) => {
        console.log('💬 Send message called with:', text);
        if (text.trim()) {
            console.log('💬 Sending message:', text.trim());
            const message = {
                id: Date.now(),
                text: text,
                sender: 'me',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text'
            };
            setMessages([...messages, message]);
            setNewMessage('');
            
            // Update nervousness and caring based on message content
            const hasQuestion = text.includes('?');
            const hasCompliment = text.toLowerCase().includes('beautiful') || text.toLowerCase().includes('amazing') || text.toLowerCase().includes('love');
            
            if (hasQuestion) setUserCareScore(prev => Math.min(100, prev + 2));
            if (hasCompliment) setUserCareScore(prev => Math.min(100, prev + 3));
            setNervousnessLevel(prev => Math.max(0, prev - 5));
            
            // Simulate partner typing
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                const responses = [
                    "That sounds wonderful! 😊",
                    "I feel the same way! 💕",
                    "Let's make some beautiful memories together 🦋",
                    "Your energy is so positive! ✨",
                    "I love how thoughtful you are 💙"
                ];
                const response = {
                    id: Date.now() + 1,
                    text: responses[Math.floor(Math.random() * responses.length)],
                    sender: 'partner',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'text'
                };
                setMessages(prev => [...prev, response]);
            }, 2000);
        } else {
            console.log('💬 Message is empty, not sending');
        }
    };

    const applySuggestion = (suggestion) => {
        const cleanSuggestion = suggestion.replace(/[\ud83c\ud83d\ud83e][\udd00-\udfff]/g, '').trim();
        setNewMessage(cleanSuggestion);
        setShowSuggestions(false);
        setTimeout(() => setShowSuggestions(true), 3000);
    };

    const nextSuggestion = () => {
        setCurrentSuggestion(prev => (prev + 1) % aiSuggestions.length);
    };

    const prevSuggestion = () => {
        setCurrentSuggestion(prev => prev === 0 ? aiSuggestions.length - 1 : prev - 1);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '16px',
            background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 50%, #EC4899 100%)'
        }}>
            {/* Header with Metrics */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '16px'
            }}>
                {/* Profile Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>
                        S
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            margin: 0,
                            fontStyle: 'italic'
                        }}>Emma Rodriguez</h2>
                        <p style={{
                            color: '#22d3ee',
                            fontSize: '14px',
                            margin: 0,
                            fontStyle: 'italic'
                        }}>Emma seems to be choosing her words carefully...</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Heart style={{
                            width: '24px',
                            height: '24px',
                            color: '#ec4899',
                            fill: 'currentColor'
                        }} />
                    </div>
                </div>
                
                {/* Care Scores Header */}
                <div style={{
                    textAlign: 'center',
                    padding: '8px 0',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    marginTop: '12px'
                }}>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                        fontStyle: 'italic'
                    }}>
                        Taking a moment to find the right words is a sign of care.
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '24px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <Heart style={{
                                width: '14px',
                                height: '14px',
                                color: '#22d3ee'
                            }} />
                            <span style={{
                                color: '#22d3ee',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Your Care: {userCareScore}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <Heart style={{
                                width: '14px',
                                height: '14px',
                                color: '#22d3ee'
                            }} />
                            <span style={{
                                color: '#22d3ee',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Emma's Care: {partnerCareScore}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                paddingBottom: showSuggestions ? '280px' : '200px' // Increased padding for bottom nav + input
            }}>
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                display: 'flex',
                                justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                                marginBottom: '16px'
                            }}
                        >
                            <div style={{
                                maxWidth: message.type === 'reaction' ? 'auto' : '80%',
                                background: message.type === 'reaction' 
                                    ? 'transparent'
                                    : message.sender === 'me' 
                                        ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                                        : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: message.type === 'reaction' ? 'none' : 'blur(20px)',
                                borderRadius: message.type === 'reaction'
                                    ? '0'
                                    : message.sender === 'me' 
                                        ? '20px 20px 4px 20px' 
                                        : '20px 20px 20px 4px',
                                padding: message.type === 'reaction' ? '8px 0' : '12px 16px',
                                border: message.type === 'reaction'
                                    ? 'none'
                                    : message.sender === 'me' 
                                        ? 'none' 
                                        : '1px solid rgba(139, 92, 246, 0.2)',
                                textAlign: message.type === 'reaction' ? 'center' : 'left'
                            }}>
                                {message.type === 'reaction' ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <div style={{
                                            fontSize: '32px',
                                            lineHeight: '1'
                                        }}>
                                            {message.text}
                                        </div>
                                        <span style={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            fontSize: '11px',
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            padding: '2px 8px',
                                            borderRadius: '12px'
                                        }}>
                                            ⏱ {message.timestamp}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <p style={{
                                            color: 'white',
                                            margin: '0 0 4px 0',
                                            fontStyle: 'italic',
                                            lineHeight: '1.4'
                                        }}>
                                            {message.text}
                                        </p>
                                        <span style={{
                                            color: message.sender === 'me' ? 'rgba(255,255,255,0.7)' : '#c4b5fd',
                                            fontSize: '12px'
                                        }}>
                                            {message.timestamp}
                                        </span>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            marginBottom: '16px'
                        }}
                    >
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px 20px 20px 4px',
                            padding: '12px 16px',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '4px'
                            }}>
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#c4b5fd'
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{
                                color: '#ff6b6b',
                                fontSize: '14px',
                                fontStyle: 'italic'
                            }}>
                                🦋 fluttering a reply...
                            </span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* AI Suggestions */}
            <AnimatePresence>
                {showSuggestions && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{
                            position: 'fixed',
                            bottom: '160px', // Account for input area (80px) + bottom nav (80px)
                            left: '16px',
                            right: '16px',
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            padding: '16px',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            zIndex: 100
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                        }}>
                            <Brain style={{
                                width: '18px',
                                height: '18px',
                                color: '#22d3ee'
                            }} />
                            <span style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                fontStyle: 'italic',
                                flex: 1
                            }}>
                                AI Conversation Coach
                            </span>
                            {/* Navigation buttons */}
                            <button
                                onClick={prevSuggestion}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                ←
                            </button>
                            <span style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px'
                            }}>
                                {currentSuggestion + 1}/{aiSuggestions.length}
                            </span>
                            <button
                                onClick={nextSuggestion}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                →
                            </button>
                        </div>
                        
                        <motion.button
                            key={currentSuggestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => applySuggestion(aiSuggestions[currentSuggestion])}
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '12px',
                                color: 'white',
                                fontSize: '14px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontStyle: 'italic',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Lightbulb style={{
                                width: '16px',
                                height: '16px',
                                color: '#fbbf24'
                            }} />
                            {aiSuggestions[currentSuggestion]}
                        </motion.button>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '4px',
                            marginTop: '8px'
                        }}>
                            {aiSuggestions.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: index === currentSuggestion ? '#22d3ee' : 'rgba(255, 255, 255, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nervousness Level Indicator */}
            <div style={{
                position: 'fixed',
                bottom: '160px', // Above input area
                left: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 999
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: 1
                }}>
                    <span style={{
                        color: '#4ecdc4',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        Nervousness Level: {nervousnessLevel}%
                    </span>
                    <div style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        height: '8px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${nervousnessLevel}%`,
                            height: '100%',
                            background: '#4ecdc4',
                            transition: 'all 0.3s ease'
                        }} />
                    </div>
                </div>
                <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    Taking your time... 😊
                </div>
            </div>

            {/* Input Area */}
            <div style={{
                position: 'fixed',
                bottom: '80px', // Account for bottom navigation (80px height)
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '16px',
                zIndex: 1000
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    maxWidth: 'none'
                }}>
                    <button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        style={{
                            background: showSuggestions ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            border: `1px solid ${showSuggestions ? '#22d3ee' : 'rgba(255, 255, 255, 0.2)'}`,
                            borderRadius: '12px',
                            padding: '10px',
                            color: showSuggestions ? '#22d3ee' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Brain size={20} />
                    </button>
                    
                    <div style={{
                        flex: 1,
                        position: 'relative'
                    }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => {
                                console.log('💬 Input changed:', e.target.value);
                                setNewMessage(e.target.value);
                            }}
                            onKeyPress={(e) => {
                                console.log('💬 Key pressed:', e.key);
                                if (e.key === 'Enter') {
                                    console.log('💬 Enter pressed, sending message');
                                    sendMessage();
                                }
                            }}
                            placeholder="Flutter a message..."
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                padding: '12px 50px 12px 16px',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none',
                                fontStyle: 'italic'
                            }}
                        />
                        <button
                            onClick={() => {
                                console.log('💬 Send button clicked');
                                sendMessage();
                            }}
                            disabled={!newMessage.trim()}
                            style={{
                                position: 'absolute',
                                right: '4px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: newMessage.trim() ? 'linear-gradient(135deg, #22d3ee, #8b5cf6)' : 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Send style={{
                                width: '16px',
                                height: '16px',
                                color: 'white'
                            }} />
                        </button>
                    </div>
                    
                    <button style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '10px',
                        color: 'white',
                        cursor: 'pointer'
                    }}>
                        <Camera size={20} />
                    </button>
                    
                    <button style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '10px',
                        color: 'white',
                        cursor: 'pointer'
                    }}>
                        <Mic size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}