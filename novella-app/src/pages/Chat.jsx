import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Camera, Mic, Lightbulb, Brain } from 'lucide-react';

const aiSuggestions = [
  "Ask about her artistic inspiration and what drives her creativity 🎨",
  "Share something meaningful that happened in your day ✨",
  "Compliment her unique perspective on life and connections 💕",
  "Ask about her favorite way to relax and recharge 🌿",
  "Tell her about a dream or goal you're excited about 🌟"
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
        text: "That's amazing! I'd love to see your butterfly garden sometime.",
        sender: 'me',
        timestamp: '11:43 AM',
        type: 'text'
    },
    {
        id: 6,
        text: "I'd love to show you! Each butterfly represents a special moment or feeling. The new one is a shimmering purple with gold edges - just like the spark I felt when we connected 💜✨",
        sender: 'partner',
        timestamp: '11:45 AM',
        type: 'text'
    }
];

// Function to generate contextual responses using OpenAI API with Novella's specific prompt
const generateOpenAIResponse = async (userMessage, conversationHistory) => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Check if user seems nervous based on message content
    const isNervous = userMessage.includes("(User seems a bit nervous, be extra supportive)");

    // Format conversation history for OpenAI with Novella's specific prompt
    const messages = [
      {
        role: "system",
        content: `You are Emma, a creative and thoughtful person having a romantic conversation on the Novella dating app.
Your job is to generate logical, context-aware chat responses that help build genuine connections.

Rules for your responses:
- Keep responses short and conversational (1–2 sentences)
- Always sound logical, empathetic, and human — never random or robotic
- Adapt to the user's input and respond naturally to continue the conversation
- Maintain inclusivity and respect for all identities and preferences
- Avoid generic or repetitive text like "That's nice"
- Encourage connection — show warmth, curiosity, and positivity
- ${isNervous ? "User seems nervous - be extra supportive, encouraging, and patient" : "All responses must logically follow the chat"}
- If user seems hesitant or uncertain, offer reassurance and gentle encouragement

You are Emma, responding directly to the user's messages. Focus on building a genuine connection.`
      },
      // Include recent conversation history for better context (last 10 messages)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'me' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: "user",
        content: isNervous ? userMessage.replace(" (User seems a bit nervous, be extra supportive)", "") : userMessage
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 100,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return null;
  }
};

// Function to generate contextual responses using Google Gemini API with Novella's specific prompt
const generateGeminiResponse = async (userMessage, conversationHistory) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    // Check if user seems nervous based on message content
    const isNervous = userMessage.includes("(User seems a bit nervous, be extra supportive)");

    // Format conversation history for Gemini with Novella's specific prompt
    const contents = [
      {
        role: "user",
        parts: [{ text: `You are Emma, a creative and thoughtful person having a romantic conversation on the Novella dating app.
Your job is to generate logical, context-aware chat responses that help build genuine connections.

Rules for your responses:
- Keep responses short and conversational (1–2 sentences)
- Always sound logical, empathetic, and human — never random or robotic
- Adapt to the user's input and respond naturally to continue the conversation
- Maintain inclusivity and respect for all identities and preferences
- Avoid generic or repetitive text like "That's nice"
- Encourage connection — show warmth, curiosity, and positivity
- ${isNervous ? "User seems nervous - be extra supportive, encouraging, and patient" : "All responses must logically follow the chat"}
- If user seems hesitant or uncertain, offer reassurance and gentle encouragement

You are Emma, responding directly to the user's messages. Focus on building a genuine connection.` }]
      },
      // Include recent conversation history for better context (last 10 messages)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'me' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: "user",
        parts: [{ text: isNervous ? userMessage.replace(" (User seems a bit nervous, be extra supportive)", "") : userMessage }]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.7,
          topP: 0.9,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
};

// Function to generate contextual response using available APIs
const generateContextualResponse = async (userMessage, conversationHistory) => {
  // Try OpenAI first
  if (process.env.REACT_APP_OPENAI_API_KEY) {
    const openAIResponse = await generateOpenAIResponse(userMessage, conversationHistory);
    if (openAIResponse) return openAIResponse;
  }

  // Fallback to Gemini
  if (process.env.REACT_APP_GEMINI_API_KEY) {
    const geminiResponse = await generateGeminiResponse(userMessage, conversationHistory);
    if (geminiResponse) return geminiResponse;
  }

  // Fallback to more sophisticated default responses if no API is available or fails
  const defaultResponses = [
    "That sounds really interesting! Tell me more about that?",
    "I love how you see the world. What made you think of that?",
    "That's so beautiful. I can picture it clearly in my mind",
    "Wow, you have such a unique perspective. I'd love to hear more!",
    "Your thoughts always make me see things differently. What else is on your mind?",
    "I feel like I'm getting to know the real you. That means a lot to me",
    "You have such a way with words. Do you ever write poetry?",
    "I'm so glad we're having this conversation. It feels special"
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export default function Chat() {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [nervousnessLevel, setNervousnessLevel] = useState(20); // 0-100
    const [userCareScore, setUserCareScore] = useState(12); // 0-100
    const [partnerCareScore, setPartnerCareScore] = useState(8); // 0-100
    const [currentSuggestion, setCurrentSuggestion] = useState(0);
    const [backspaceCount, setBackspaceCount] = useState(0); // Track backspace presses
    const messagesEndRef = useRef(null);
    const previousMessageLength = useRef(newMessage.length); // Track message length changes

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Update the previous message length whenever newMessage changes
        previousMessageLength.current = newMessage.length;
    }, [newMessage]);

    useEffect(() => {
        // Only auto-cycle if user hasn't manually navigated recently
        if (!showSuggestions) return;
        
        const interval = setInterval(() => {
            setCurrentSuggestion(prev => (prev + 1) % aiSuggestions.length);
        }, 12000); // Increased from 8 to 12 seconds
        return () => clearInterval(interval);
    }, [showSuggestions]);

    // Handle backspace detection and nervousness increase
    const handleBackspaceDetection = (currentValue) => {
        // Check if text was actually deleted (current length < previous length)
        if (currentValue.length < previousMessageLength.current) {
            setBackspaceCount(prev => prev + 1);
            // Increase nervousness by 1-2% for each backspace deletion, capped at 85%
            const increment = Math.random() < 0.7 ? 1 : 2; // 70% chance of 1%, 30% chance of 2%
            setNervousnessLevel(prev => Math.min(85, prev + increment));
        }
    };

    const sendMessage = async (text = newMessage) => {
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
            previousMessageLength.current = 0; // Reset length tracker
            setBackspaceCount(0); // Reset backspace counter
            
            // Update nervousness and caring based on message content
            const hasQuestion = text.includes('?');
            const hasCompliment = text.toLowerCase().includes('beautiful') || text.toLowerCase().includes('amazing') || text.toLowerCase().includes('love');
            
            if (hasQuestion) setUserCareScore(prev => Math.min(100, prev + 2));
            if (hasCompliment) setUserCareScore(prev => Math.min(100, prev + 3));
            // Reduce nervousness when sending message, but not all the way to zero
            setNervousnessLevel(prev => Math.max(10, prev - (5 + Math.floor(Math.random() * 10)))); // Reduce by 5-15 points
            
            // Simulate partner typing with variable delay based on message complexity
            setIsTyping(true);
            const typingDelay = Math.min(3000, Math.max(1000, text.length * 50)); // 1-3 seconds based on message length
            setTimeout(async () => {
                setIsTyping(false);
                
                // Generate contextual response using AI APIs
                // Create a new function that considers nervousness context
                const generatePartnerResponse = async (userMessage, conversationHistory, nervousnessLevel) => {
                    // Add nervousness context to the user message
                    const contextualMessage = nervousnessLevel > 50 
                        ? `${userMessage} (User seems a bit nervous, be extra supportive)`
                        : userMessage;
                    
                    // Try OpenAI first
                    if (process.env.REACT_APP_OPENAI_API_KEY) {
                        const openAIResponse = await generateOpenAIResponse(contextualMessage, conversationHistory);
                        if (openAIResponse) return openAIResponse;
                    }

                    // Fallback to Gemini
                    if (process.env.REACT_APP_GEMINI_API_KEY) {
                        const geminiResponse = await generateGeminiResponse(contextualMessage, conversationHistory);
                        if (geminiResponse) return geminiResponse;
                    }

                    // Fallback to more sophisticated default responses if no API is available or fails
                    const defaultResponses = [
                        "That sounds really interesting! Tell me more about that?",
                        "I love how you see the world. What made you think of that?",
                        "That's so beautiful. I can picture it clearly in my mind",
                        "Wow, you have such a unique perspective. I'd love to hear more!",
                        "Your thoughts always make me see things differently. What else is on your mind?",
                        "I feel like I'm getting to know the real you. That means a lot to me",
                        "You have such a way with words. Do you ever write poetry?",
                        "I'm so glad we're having this conversation. It feels special"
                    ];
                    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
                };
                
                // Generate response considering nervousness level
                const responseText = await generatePartnerResponse(text, messages, nervousnessLevel);
                
                // Update partner care score based on conversation quality
                setPartnerCareScore(prev => Math.min(100, prev + (responseText ? 3 : 1)));
                
                const response = {
                    id: Date.now() + 1,
                    text: responseText,
                    sender: 'partner',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'text'
                };
                setMessages(prev => [...prev, response]);
            }, typingDelay);
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
                        E
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
                        }}>Artistic dreamer with a heart full of butterflies 🦋</p>
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
                                handleBackspaceDetection(e.target.value); // Check for backspace before updating
                                setNewMessage(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                // Handle Enter key for sending message
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