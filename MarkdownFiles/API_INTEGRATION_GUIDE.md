# 🤖 Novella Chat - API Integration Guide

## Overview
This guide explains how to integrate OpenAI and Google Gemini APIs to make the Novella chat more realistic and contextual. The implementation uses environment variables to securely store API keys and provides fallback mechanisms for reliability.

## 🔑 API Keys Setup

### 1. Environment Variables
API keys are stored in the `.env` file in the `novella-app` directory:

```env
# OpenAI API (ChatGPT)
REACT_APP_OPENAI_API_KEY=your-key-here

# Google Gemini API
REACT_APP_GEMINI_API_KEY=your-key-here
```

### 2. Security Notes
- Never commit `.env` files to version control
- Keys are only accessible on the client-side
- Use restricted API keys with limited permissions

## 🧠 AI Integration Details

### Response Generation Flow
1. **Primary**: OpenAI GPT-3.5-turbo API
2. **Fallback**: Google Gemini Pro API
3. **Last Resort**: Default predefined responses

### Implementation Features
- **Contextual Awareness**: Responses consider the entire conversation history
- **Character Persona**: Emma's personality is maintained through system prompts
- **Natural Language**: Responses are conversational and text-like
- **Error Handling**: Graceful fallbacks when APIs fail
- **Rate Limiting**: Built-in delay to prevent API overuse

## 🚀 How It Works

### 1. API Functions
Two main functions handle API calls:
- `generateOpenAIResponse()`: Calls OpenAI ChatGPT API
- `generateGeminiResponse()`: Calls Google Gemini API

### 2. Fallback Mechanism
```javascript
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

  // Final fallback to default responses
  return defaultResponse();
};
```

### 3. Conversation Context
The system maintains conversation history to provide contextually relevant responses:
- Previous messages are sent as context
- Character personality is preserved
- Emotional continuity is maintained

## 🛠️ Customization

### Adjusting Response Style
Modify the system prompt in the API functions to change Emma's personality:

```javascript
{
  role: "system",
  content: "You are Emma, a creative and thoughtful person having a romantic conversation..."
}
```

### Response Parameters
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 100 (concise responses)
- **Model**: gpt-3.5-turbo / gemini-pro

## 🧪 Testing the Integration

### 1. Verify Environment Variables
Check that your `.env` file contains the API keys:

```bash
cat .env
```

### 2. Start the Application
```bash
npm start
```

### 3. Test Chat Functionality
- Open the chat interface
- Send messages to Emma
- Observe contextual, realistic responses

## 🔧 Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `.env` file exists in `novella-app/` directory
   - Verify variable names match exactly
   - Restart development server after changes

2. **API Rate Limits**
   - Implement request throttling if needed
   - Check API provider documentation for limits

3. **Network Errors**
   - Verify internet connectivity
   - Check API provider status pages

### Debugging
- Check browser console for API errors
- Verify API keys are valid and active
- Test APIs independently using curl or Postman

## 💰 Cost Management

### OpenAI Pricing (Approximate)
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Typical message: 50-100 tokens
- 100 messages: ~$0.01-$0.02

### Google Gemini Pricing
- Free tier available
- Pay-as-you-go after free limits
- Generally less expensive than OpenAI

### Cost Optimization Tips
1. Use shorter max_tokens values
2. Implement local caching for common responses
3. Monitor usage through provider dashboards

## 🔄 Future Enhancements

### Possible Improvements
1. **Response Caching**: Store common responses locally
2. **Sentiment Analysis**: Adjust responses based on user mood
3. **Multimodal Support**: Integrate image analysis
4. **Voice Integration**: Text-to-speech for responses
5. **Advanced Personality**: Dynamic personality adjustments

## 📚 API Documentation References

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)
