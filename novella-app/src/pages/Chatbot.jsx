import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Heart, Sparkles, MessageSquare } from 'lucide-react';

const amoraPersonality = {
    greeting: "Hey beautiful soul! 🦋 I'm Amora, your personal dating coach. I'm here to help you navigate the wonderful world of connections!",
    responses: {
        dating: [
            "Remember, authenticity is your superpower! ✨ Be genuinely yourself and the right person will be drawn to your energy.",
            "Dating tip: Ask questions that reveal values, not just facts. Instead of 'What do you do?' try 'What makes you feel most alive?' 😊",
            "Your heart rate sync feature is amazing! High sync usually means great compatibility. Trust those butterflies! 🦋"
        ],
        conversation: [
            "Great conversation starters: Share something you're passionate about, ask about their dreams, or mention something unique from their profile! 💬",
            "If conversation feels forced, it might not be the right match. Natural flow is a beautiful sign of compatibility! 🌊",
            "Pro tip: Share stories, not just facts. Stories create emotional connections! 📝"
        ],
        confidence: [
            "You are worthy of love exactly as you are right now. Don't change yourself to fit someone else's idea of perfect! 💕",
            "Rejection isn't about your worth - it's about compatibility. Every 'no' brings you closer to your 'yes'! 🌈",
            "Your butterfly collection shows you're building meaningful connections. That's beautiful! 🦋✨"
        ]
    }
};

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: amoraPersonality.greeting,
            sender: 'amora',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getAmoraResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();
        let responses = [];
        
        if (msg.includes('dating') || msg.includes('match') || msg.includes('profile')) {
            responses = amoraPersonality.responses.dating;
        } else if (msg.includes('talk') || msg.includes('conversation') || msg.includes('chat')) {
            responses = amoraPersonality.responses.conversation;
        } else if (msg.includes('nervous') || msg.includes('scared') || msg.includes('confidence') || msg.includes('worry')) {
            responses = amoraPersonality.responses.confidence;
        } else {
            responses = [
                ...amoraPersonality.responses.dating,
                ...amoraPersonality.responses.conversation,
                ...amoraPersonality.responses.confidence
            ];
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: messages.length + 1,
                text: newMessage,
                sender: 'me',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text'
            };
            setMessages([...messages, message]);
            const userMsg = newMessage;
            setNewMessage('');
            
            // Amora typing
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                const response = {
                    id: messages.length + 2,
                    text: getAmoraResponse(userMsg),
                    sender: 'amora',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'text'
                };
                setMessages(prev => [...prev, response]);
            }, 2500);
        }
    };

    const quickActions = [
        "Dating tips?",
        "How to start a conversation?",
        "Building confidence",
        "What makes a good match?"
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '16px'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <Bot style={{
                        width: '24px',
                        height: '24px',
                        color: 'white'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#10b981',
                        border: '2px solid rgba(0,0,0,0.3)'
                    }} />
                </div>
                <div>
                    <h2 style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        margin: 0,
                        fontStyle: 'italic'
                    }}>Amora AI</h2>
                    <p style={{
                        color: '#c4b5fd',
                        fontSize: '14px',
                        margin: 0,
                        fontStyle: 'italic'
                    }}>Your Dating Coach • Always here for you</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <Sparkles style={{
                        width: '24px',
                        height: '24px',
                        color: '#f59e0b'
                    }} />
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                paddingBottom: '180px'
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
                                marginBottom: '16px',
                                alignItems: 'flex-start',
                                gap: '8px'
                            }}
                        >
                            {message.sender === 'amora' && (
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Bot style={{
                                        width: '16px',
                                        height: '16px',
                                        color: 'white'
                                    }} />
                                </div>
                            )}
                            
                            <div style={{
                                maxWidth: '75%',
                                background: message.sender === 'me' 
                                    ? 'linear-gradient(135deg, #22d3ee, #8b5cf6)' 
                                    : 'rgba(0, 0, 0, 0.3)',
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
                            marginBottom: '16px',
                            alignItems: 'flex-start',
                            gap: '8px'
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Bot style={{
                                width: '16px',
                                height: '16px',
                                color: 'white'
                            }} />
                        </div>
                        
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.3)',
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
                                gap: '2px'
                            }}>
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#8b5cf6'
                                        }}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{
                                color: '#c4b5fd',
                                fontSize: '12px',
                                fontStyle: 'italic'
                            }}>Amora is thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{
                position: 'fixed',
                bottom: '80px',
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '16px',
                zIndex: 10
            }}>
                {/* Quick Actions */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px',
                    overflowX: 'auto',
                    paddingBottom: '4px'
                }}>
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={action}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNewMessage(action)}
                            style={{
                                background: 'rgba(139, 92, 246, 0.2)',
                                border: '1px solid rgba(139, 92, 246, 0.4)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                color: '#c4b5fd',
                                fontSize: '14px',
                                fontStyle: 'italic',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }}
                        >
                            {action}
                        </motion.button>
                    ))}
                </div>

                {/* Message Input */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask Amora for dating advice..."
                        style={{
                            flex: 1,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '24px',
                            padding: '12px 16px',
                            color: 'white',
                            fontSize: '16px',
                            outline: 'none',
                            fontStyle: 'italic'
                        }}
                    />
                    
                    <motion.button
                        onClick={sendMessage}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: newMessage.trim() 
                                ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                                : 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            padding: '12px',
                            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                            color: 'white'
                        }}
                        disabled={!newMessage.trim()}
                    >
                        <Send style={{ width: '20px', height: '20px' }} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}