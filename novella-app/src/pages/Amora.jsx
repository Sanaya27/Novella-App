import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';

export default function Amora() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm Amora, your AI relationship coach. I'm here to help you navigate love, relationships, and emotional connections. How can I assist you today? 💕",
            sender: 'amora',
            timestamp: new Date().toISOString()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessageToAPI = async (userMessage) => {
        // Try multiple AI services in order of preference
        const apiConfigs = [
            {
                name: 'OpenAI GPT',
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                type: 'openai'
            },
            {
                name: 'OpenAI GPT-4',
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-4',
                type: 'openai'
            },
            {
                name: 'Anthropic Claude',
                apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
                endpoint: 'https://api.anthropic.com/v1/messages',
                model: 'claude-3-sonnet-20240229',
                type: 'anthropic'
            },
            {
                name: 'Anthropic Claude Haiku',
                apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
                endpoint: 'https://api.anthropic.com/v1/messages',
                model: 'claude-3-haiku-20240307',
                type: 'anthropic'
            },
            {
                name: 'Google Gemini Pro',
                apiKey: process.env.REACT_APP_GEMINI_API_KEY,
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
                model: 'gemini-pro',
                type: 'gemini'
            },
            {
                name: 'Google Gemini Flash',
                apiKey: process.env.REACT_APP_GEMINI_API_KEY,
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
                model: 'gemini-1.5-flash',
                type: 'gemini'
            }
        ];
        
        // Filter to only available APIs (those with keys)
        const availableAPIs = apiConfigs.filter(config => config.apiKey && config.apiKey.trim());
        
        if (availableAPIs.length === 0) {
            return "I need an API key to provide intelligent responses! Please add one of these to your .env file:\n\n• REACT_APP_OPENAI_API_KEY (for ChatGPT)\n• REACT_APP_ANTHROPIC_API_KEY (for Claude)\n• REACT_APP_GEMINI_API_KEY (for Gemini)\n\nThen restart the app. 🔑💕";
        }

        // Try each available API until one works
        for (const api of availableAPIs) {
            try {
                console.log(`Trying ${api.name}...`);
                let response;
                
                if (api.type === 'openai') {
                    response = await fetch(api.endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${api.apiKey}`
                        },
                        body: JSON.stringify({
                            model: api.model,
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are Amora, an AI relationship coach in the Novella dating app. You provide warm, empathetic advice about love, relationships, dating, and emotional connections. Keep responses concise but meaningful, and always be supportive and understanding. Use occasional heart emojis but not excessively.'
                                },
                                {
                                    role: 'user',
                                    content: userMessage
                                }
                            ],
                            max_tokens: 200,
                            temperature: 0.7
                        })
                    });
                    
                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(`HTTP ${response.status}: ${error}`);
                    }
                    
                    const data = await response.json();
                    return data.choices[0].message.content;
                    
                } else if (api.type === 'anthropic') {
                    response = await fetch(api.endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': api.apiKey,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify({
                            model: api.model,
                            max_tokens: 200,
                            messages: [{
                                role: 'user',
                                content: `You are Amora, an AI relationship coach in the Novella dating app. Provide warm, empathetic advice about love, relationships, and emotional connections. Keep responses supportive and meaningful.\n\nUser question: ${userMessage}`
                            }]
                        })
                    });
                    
                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(`HTTP ${response.status}: ${error}`);
                    }
                    
                    const data = await response.json();
                    return data.content[0].text;
                    
                } else if (api.type === 'gemini') {
                    response = await fetch(`${api.endpoint}?key=${api.apiKey}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `You are Amora, an AI relationship coach in the Novella dating app. Provide warm, empathetic advice about love, relationships, dating, and emotional connections. Keep responses supportive and meaningful.\n\nUser question: ${userMessage}`
                                }]
                            }],
                            generationConfig: {
                                maxOutputTokens: 200,
                                temperature: 0.7
                            }
                        })
                    });
                    
                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(`HTTP ${response.status}: ${error}`);
                    }
                    
                    const data = await response.json();
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        return data.candidates[0].content.parts[0].text;
                    } else {
                        throw new Error('Unexpected response format from Gemini');
                    }
                }
            } catch (error) {
                console.error(`${api.name} failed:`, error.message);
                // Continue to next API
                continue;
            }
        }
        
        // If all APIs failed
        return "I'm having trouble connecting to all AI services right now. This could be due to:\n\n• Invalid API keys\n• Network issues\n• Service outages\n\nPlease check your API keys and try again later. 💕";
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: newMessage.trim(),
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsTyping(true);

        // Get AI response
        const aiResponse = await sendMessageToAPI(userMessage.text);
        
        setTimeout(() => {
            const amoraMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'amora',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, amoraMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={{
            height: '100vh',
            background: 'linear-gradient(to bottom right, #581c87, #7c3aed, #312e81)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff6b9d, #c44eb8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Bot style={{ width: '20px', height: '20px', color: 'white' }} />
                    </div>
                    <div>
                        <h2 style={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '600',
                            margin: 0
                        }}>Amora</h2>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                            margin: 0
                        }}>AI Relationship Coach</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'flex',
                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <div style={{
                            maxWidth: '80%',
                            padding: '12px 16px',
                            borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: message.sender === 'user' 
                                ? 'linear-gradient(135deg, #7c3aed, #312e81)'
                                : 'linear-gradient(135deg, #ff6b9d, #c44eb8)',
                            color: 'white',
                            fontSize: '14px',
                            lineHeight: '1.4'
                        }}>
                            {message.text}
                        </div>
                    </motion.div>
                ))}
                
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '18px 18px 18px 4px',
                            background: 'linear-gradient(135deg, #ff6b9d, #c44eb8)',
                            color: 'white',
                            fontSize: '14px'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '4px',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    animation: 'pulse 1.5s infinite'
                                }} />
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    animation: 'pulse 1.5s infinite 0.2s'
                                }} />
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    animation: 'pulse 1.5s infinite 0.4s'
                                }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-end'
                }}>
                    <div style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px'
                    }}>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask Amora anything about love and relationships..."
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'white',
                                fontSize: '14px',
                                resize: 'none',
                                minHeight: '20px',
                                maxHeight: '100px'
                            }}
                            rows={1}
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: newMessage.trim() 
                                ? 'linear-gradient(135deg, #ff6b9d, #c44eb8)'
                                : 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Send style={{
                            width: '18px',
                            height: '18px',
                            color: 'white'
                        }} />
                    </button>
                </div>
            </div>
        </div>
    );
}