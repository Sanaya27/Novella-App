import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Camera, Mic, Lightbulb, Brain, Activity } from 'lucide-react';

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
        text: "Hey! I love your butterfly collection! 🦋",
        sender: 'partner',
        timestamp: '10:30 AM',
        type: 'text'
    },
    {
        id: 2,
        text: "Thank you! I see we have a 94% sync rate ✨",
        sender: 'me',
        timestamp: '10:32 AM',
        type: 'text'
    },
    {
        id: 3,
        text: "That's amazing! Want to try the heart sync feature?",
        sender: 'partner',
        timestamp: '10:33 AM',
        type: 'text'
    }
];

export default function Chat() {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [nervousnessLevel, setNervousnessLevel] = useState(15); // 0-100
    const [caringScore, setCaringScore] = useState(87); // 0-100
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
            
            if (hasQuestion) setCaringScore(prev => Math.min(100, prev + 2));
            if (hasCompliment) setCaringScore(prev => Math.min(100, prev + 3));
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
            paddingTop: '16px'
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
                        }}>Sofia Luna</h2>
                        <p style={{
                            color: '#22d3ee',
                            fontSize: '14px',
                            margin: 0,
                            fontStyle: 'italic'
                        }}>Online now • 94% sync</p>
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
                
                {/* Metrics Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                }}>
                    {/* Nervousness Indicator */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Activity style={{
                            width: '16px',
                            height: '16px',
                            color: nervousnessLevel > 50 ? '#ff6b6b' : '#4ecdc4'
                        }} />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                marginBottom: '2px'
                            }}>
                                Nervousness
                            </div>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                height: '6px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${nervousnessLevel}%`,
                                    height: '100%',
                                    background: nervousnessLevel > 50 ? '#ff6b6b' : '#4ecdc4',
                                    transition: 'all 0.3s ease'
                                }} />
                            </div>
                        </div>
                        <span style={{
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {nervousnessLevel}%
                        </span>
                    </div>
                    
                    {/* Caring Score */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Heart style={{
                            width: '16px',
                            height: '16px',
                            color: '#ff6b9d'
                        }} />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                marginBottom: '2px'
                            }}>
                                Caring Score
                            </div>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                height: '6px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${caringScore}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #ff6b9d, #c084fc)',
                                    transition: 'all 0.3s ease'
                                }} />
                            </div>
                        </div>
                        <span style={{
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {caringScore}%
                        </span>
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
                                maxWidth: '80%',
                                background: message.sender === 'me' 
                                    ? 'linear-gradient(135deg, #22d3ee, #8b5cf6)' 
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: message.sender === 'me' 
                                    ? '20px 20px 4px 20px' 
                                    : '20px 20px 20px 4px',
                                padding: '12px 16px',
                                border: message.sender === 'me' 
                                    ? 'none' 
                                    : '1px solid rgba(139, 92, 246, 0.2)'
                            }}>
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
                                color: '#c4b5fd',
                                fontSize: '14px',
                                fontStyle: 'italic'
                            }}>
                                Sofia is typing...
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
                            background: 'rgba(0, 0, 0, 0.5)',
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

            {/* Input Area */}
            <div style={{
                position: 'fixed',
                bottom: '80px', // Account for bottom navigation (80px height)
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.5)',
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
                            placeholder="Type a thoughtful message..."
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