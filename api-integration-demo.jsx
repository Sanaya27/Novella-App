// This is a demonstration of how the API integration should work in the React component
// This is not meant to be run directly, but to show the correct implementation

import React, { useState, useRef, useEffect } from 'react';

// Function to generate contextual responses using OpenAI API
const generateOpenAIResponse = async (userMessage, conversationHistory, nervousnessLevel) => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found');
    }

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
- ${nervousnessLevel > 50 ? "User seems nervous - be extra supportive, encouraging, and patient" : "All responses must logically follow the chat"}

You are Emma, responding directly to the user's messages. Focus on building a genuine connection.`
      },
      // Include recent conversation history for better context (last 10 messages)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'me' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: "user",
        content: userMessage
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

// Function to generate contextual responses using Google Gemini API
const generateGeminiResponse = async (userMessage, conversationHistory, nervousnessLevel) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

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
- ${nervousnessLevel > 50 ? "User seems nervous - be extra supportive, encouraging, and patient" : "All responses must logically follow the chat"}

You are Emma, responding directly to the user's messages. Focus on building a genuine connection.` }]
      },
      // Include recent conversation history for better context (last 10 messages)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'me' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: "user",
        parts: [{ text: userMessage }]
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
const generateContextualResponse = async (userMessage, conversationHistory, nervousnessLevel) => {
  // Try OpenAI first
  if (process.env.REACT_APP_OPENAI_API_KEY) {
    const openAIResponse = await generateOpenAIResponse(userMessage, conversationHistory, nervousnessLevel);
    if (openAIResponse) return openAIResponse;
  }

  // Fallback to Gemini
  if (process.env.REACT_APP_GEMINI_API_KEY) {
    const geminiResponse = await generateGeminiResponse(userMessage, conversationHistory, nervousnessLevel);
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

// Main Chat Component
export default function Chat() {
    const [messages, setMessages] = useState([
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
            text: "Right? I've never experienced anything like it. My butterfly garden has a new species now!",
            sender: 'partner',
            timestamp: '11:39 AM',
            type: 'text'
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [nervousnessLevel, setNervousnessLevel] = useState(20); // 0-100
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

    // Handle backspace detection and nervousness increase
    const handleBackspaceDetection = (currentValue) => {
        // Check if text was actually deleted (current length < previous length)
        if (currentValue.length < previousMessageLength.current) {
            // Increase nervousness by 1-2% for each backspace deletion, capped at 85%
            const increment = Math.random() < 0.7 ? 1 : 2; // 70% chance of 1%, 30% chance of 2%
            setNervousnessLevel(prev => Math.min(85, prev + increment));
        }
    };

    const sendMessage = async (text = newMessage) => {
        if (text.trim()) {
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
            
            // Update nervousness and caring based on message content
            const hasQuestion = text.includes('?');
            const hasCompliment = text.toLowerCase().includes('beautiful') || text.toLowerCase().includes('amazing') || text.toLowerCase().includes('love');
            
            if (hasQuestion) {
                // User is engaging, reduce nervousness more
                setNervousnessLevel(prev => Math.max(10, prev - (10 + Math.floor(Math.random() * 10))));
            } else if (hasCompliment) {
                // User is being kind, reduce nervousness more
                setNervousnessLevel(prev => Math.max(5, prev - (15 + Math.floor(Math.random() * 10))));
            } else {
                // Normal message, reduce nervousness
                setNervousnessLevel(prev => Math.max(10, prev - (5 + Math.floor(Math.random() * 10))));
            }
            
            // Simulate partner typing
            setIsTyping(true);
            const typingDelay = Math.min(3000, Math.max(1000, text.length * 50)); // 1-3 seconds based on message length
            setTimeout(async () => {
                setIsTyping(false);
                
                // Generate contextual response using AI APIs
                const responseText = await generateContextualResponse(text, messages, nervousnessLevel);
                
                const response = {
                    id: Date.now() + 1,
                    text: responseText,
                    sender: 'partner',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'text'
                };
                setMessages(prev => [...prev, response]);
            }, typingDelay);
        }
    };

    return (
        <div>
            {/* Chat UI implementation would go here */}
            {/* This is just to demonstrate the API integration logic */}
            <div style={{ padding: '20px', background: '#f0f0f0' }}>
                <h2>API Integration Demo</h2>
                <p>This demonstrates how the logical chat responses should work with API integration.</p>
                <p>The key points are:</p>
                <ul>
                    <li>Context-aware responses based on conversation history</li>
                    <li>Nervousness-aware response generation</li>
                    <li>Fallback mechanisms when APIs fail</li>
                    <li>Logical, human-like conversation flow</li>
                </ul>
            </div>
        </div>
    );
}