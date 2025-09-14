# 🦋 Novella Chat Troubleshooting Guide

## Overview
This guide helps diagnose and resolve issues with the Novella chat system not providing logical responses. The guide covers common problems and their solutions.

## 🔍 Common Issues and Solutions

### 1. API Keys Not Working

#### Symptoms:
- Chat responses are generic/default instead of AI-generated
- Console shows API errors
- No network requests to OpenAI/Gemini

#### Solutions:
1. **Verify API Keys in .env file**:
   ```env
   REACT_APP_OPENAI_API_KEY=sk-your-actual-key-here
   REACT_APP_GEMINI_API_KEY=AIza-your-actual-key-here
   ```

2. **Check Key Format**:
   - OpenAI keys start with `sk-`
   - Gemini keys start with `AIza`

3. **Restart Development Server**:
   ```bash
   npm start
   ```

4. **Test Keys Independently**:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_OPENAI_KEY"
   ```

### 2. Environment Variables Not Loading

#### Symptoms:
- `process.env.REACT_APP_OPENAI_API_KEY` is undefined
- API calls fail with "API key not found" errors

#### Solutions:
1. **Verify File Name**: Must be exactly `.env` (not `.env.local` or other variants)
2. **Check Prefix**: Variables must start with `REACT_APP_`
3. **Restart Server**: Environment variables are only loaded at server start
4. **Check for Spaces**: No spaces around `=` in `.env` file

### 3. Network/Firewall Issues

#### Symptoms:
- API calls time out
- CORS errors in console
- "Network error" messages

#### Solutions:
1. **Check Internet Connection**
2. **Verify API Endpoints Are Accessible**:
   - OpenAI: `https://api.openai.com/v1/chat/completions`
   - Gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
3. **Check Firewall/Proxy Settings**
4. **Test with cURL**:
   ```bash
   curl -X POST https://httpbin.org/post -d "test=data"
   ```

### 4. Incorrect API Implementation

#### Symptoms:
- API calls return 400/401/403 errors
- Malformed request payloads
- Wrong endpoint URLs

#### Solutions:
1. **Verify Request Format**:
   ```javascript
   // Correct OpenAI format
   const response = await fetch('https://api.openai.com/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${apiKey}`
     },
     body: JSON.stringify({
       model: "gpt-3.5-turbo",
       messages: messages,
       max_tokens: 100
     })
   });
   ```

2. **Check Response Handling**:
   ```javascript
   if (!response.ok) {
     throw new Error(`API error: ${response.status}`);
   }
   ```

### 5. Context Not Being Passed Correctly

#### Symptoms:
- Responses don't reference previous messages
- Conversation feels disjointed
- Generic responses to specific questions

#### Solutions:
1. **Verify Conversation History**:
   ```javascript
   // Include recent conversation history (last 10 messages)
   const messages = [
     ...conversationHistory.slice(-10).map(msg => ({
       role: msg.sender === 'me' ? 'user' : 'assistant',
       content: msg.text
     })),
     {
       role: "user",
       content: userMessage
     }
   ];
   ```

2. **Check Role Mapping**:
   - User messages: `role: "user"`
   - Assistant messages: `role: "assistant"`

### 6. Nervousness Context Not Integrated

#### Symptoms:
- Emma doesn't respond differently when user is nervous
- No supportive responses despite backspace usage

#### Solutions:
1. **Verify Nervousness Detection**:
   ```javascript
   // Check if text was actually deleted
   if (currentValue.length < previousMessageLength.current) {
     // Increase nervousness
     setNervousnessLevel(prev => Math.min(85, prev + increment));
   }
   ```

2. **Pass Nervousness to API**:
   ```javascript
   const messages = [
     {
       role: "system",
       content: nervousnessLevel > 50 
         ? "User seems nervous - be extra supportive" 
         : "Normal conversation"
     },
     // ... conversation history
   ];
   ```

## 🧪 Debugging Steps

### 1. Check Browser Console
- Open Developer Tools (F12)
- Look for JavaScript errors
- Check Network tab for failed API requests
- Verify console.log outputs

### 2. Add Debug Logging
```javascript
console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);
console.log('Conversation History:', conversationHistory);
console.log('Nervousness Level:', nervousnessLevel);
```

### 3. Test API Calls Independently
```javascript
// Test function to verify API connectivity
const testApiConnection = async () => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      }
    });
    console.log('API Connection Test:', response.ok);
  } catch (error) {
    console.error('API Connection Error:', error);
  }
};
```

### 4. Verify Component State
```javascript
useEffect(() => {
  console.log('Messages State:', messages);
  console.log('Nervousness State:', nervousnessLevel);
}, [messages, nervousnessLevel]);
```

## 🛠️ Quick Fixes

### 1. Immediate Workaround
If APIs aren't working, ensure default responses are logical:
```javascript
const defaultResponses = [
  "That sounds interesting! What made you think of that?",
  "I'd love to hear more about that. How did it happen?",
  "That's really cool! Do you often think about things like that?",
  "I can see why that would be important to you. Tell me more?"
];
```

### 2. Verify File Structure
```
novella-app/
├── .env              # API keys here
├── .env.example      # Template
├── src/
│   └── pages/
│       └── Chat.jsx  # Main chat component
```

### 3. Check Dependencies
```bash
npm list react-scripts
npm list dotenv
```

## 📞 Support Resources

### Documentation
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)

### Community
- Stack Overflow tags: `reactjs`, `openai-api`, `gemini-api`
- GitHub Issues for related libraries

### Direct Testing
Use the standalone HTML test files:
- `test-logical-chat.html` - Full API integration test
- `demo-logical-chat.html` - Logic demonstration without APIs

## 🚨 Emergency Solutions

### 1. Hardcoded Test Responses
```javascript
// Temporary solution for testing
const testResponses = {
  "hello": "Hi there! It's great to meet you! 😊",
  "how are you": "I'm doing well, thank you for asking! How are you doing today?",
  "what are you doing": "Just thinking about our conversation! What about you?",
  "default": "That's really interesting! Tell me more about that?"
};

const getTestResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(testResponses)) {
    if (lowerMessage.includes(key) && key !== "default") {
      return response;
    }
  }
  return testResponses.default;
};
```

### 2. Local Response Generation
```javascript
// Simple pattern matching for basic logical responses
const generateLocalResponse = (userMessage, conversationHistory) => {
  if (userMessage.includes("?")) {
    return "That's a great question! What made you think of that?";
  }
  if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
    return "Hello! It's wonderful to see you again! 😊";
  }
  // Add more patterns as needed
  return "I really enjoyed reading that. What else is on your mind?";
};
```

## 📈 Testing Checklist

Before declaring the chat "working":

- [ ] API keys are correctly configured in `.env`
- [ ] Environment variables are loaded (`console.log` check)
- [ ] Network requests to APIs are successful
- [ ] Conversation history is properly passed to APIs
- [ ] Nervousness context affects response generation
- [ ] Responses are logical and contextually appropriate
- [ ] Fallback responses are reasonable when APIs fail
- [ ] Error handling works correctly
- [ ] Performance is acceptable (response times < 5 seconds)

## 🆘 When to Seek Help

Contact support if:
1. API keys are valid but still not working
2. Network requests are blocked by unknown factors
3. Console shows unexpected errors
4. None of the troubleshooting steps resolve the issue
5. You need help implementing specific features

Provide the following information:
- Exact error messages from console
- Screenshots of network tab showing failed requests
- Contents of your `.env` file (without actual keys)
- Version information (Node.js, npm, react-scripts)