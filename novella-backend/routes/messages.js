const express = require('express');
const Message = require('../models/Message');
const ChatMessage = require('../models/ChatMessage');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Get messages for a match
router.get('/match/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify user has access to this match
    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const messages = await Message.find({ match_id: matchId })
      .populate('sender_id', 'name avatar_url')
      .populate('reply_to', 'content sender_id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark messages as read for the current user
    const unreadMessages = messages.filter(msg => 
      !msg.sender_id._id.equals(req.user.id) && !msg.is_read
    );

    if (unreadMessages.length > 0) {
      await Promise.all(unreadMessages.map(msg => msg.markAsRead()));
    }

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      page: parseInt(page),
      total: await Message.countDocuments({ match_id: matchId }),
      unread_count: 0 // Now 0 since we marked them as read
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { match_id, content, message_type = 'text', reply_to } = req.body;

    if (!match_id || !content) {
      return res.status(400).json({ error: 'Match ID and content are required' });
    }

    // Verify user has access to this match
    const match = await Match.findOne({
      _id: match_id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ],
      status: 'active'
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found or inactive' });
    }

    // Create message
    const message = new Message({
      match_id,
      sender_id: req.user.id,
      content,
      message_type,
      reply_to: reply_to || null
    });

    await message.save();
    await message.populate('sender_id', 'name avatar_url');

    // Update match last interaction
    await match.updateLastInteraction();

    // Update ghosting detection
    const isUser1 = match.user1_id.equals(req.user.id);
    if (isUser1) {
      match.ghosting_detection.last_response_user1 = new Date();
    } else {
      match.ghosting_detection.last_response_user2 = new Date();
    }
    
    // Reset ghosting status if it was previously detected
    if (match.is_ghosted) {
      match.is_ghosted = false;
    }

    await match.save();

    // Check for butterfly generation
    const butterflyProbability = message.getButterflyProbability();
    const shouldGenerateButterfly = Math.random() < butterflyProbability;

    if (shouldGenerateButterfly) {
      const butterflyType = match.butterfly_type;
      await message.addButterflyInteraction(req.user.id, butterflyType, 'landed');
    }

    res.json({
      message: message,
      butterfly_generated: shouldGenerateButterfly,
      butterfly_type: shouldGenerateButterfly ? match.butterfly_type : null
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Upload file (image or voice)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'voice_mood';

    res.json({
      file_url: fileUrl,
      file_type: fileType,
      original_name: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Send message with file
router.post('/send-file', authMiddleware, async (req, res) => {
  try {
    const { match_id, content, file_url, message_type } = req.body;

    if (!match_id || !file_url) {
      return res.status(400).json({ error: 'Match ID and file URL are required' });
    }

    // Verify user has access to this match
    const match = await Match.findOne({
      _id: match_id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ],
      status: 'active'
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found or inactive' });
    }

    // Create message with file
    const messageData = {
      match_id,
      sender_id: req.user.id,
      content: content || (message_type === 'image' ? '📷 Image' : '🎵 Voice message'),
      message_type: message_type || 'text'
    };

    if (message_type === 'image') {
      messageData.image_url = file_url;
    } else if (message_type === 'voice_mood') {
      messageData.voice_file_url = file_url;
    }

    const message = new Message(messageData);
    
    // Analyze voice mood if it's a voice message
    if (message_type === 'voice_mood') {
      await message.analyzeVoiceMood();
    }

    await message.save();
    await message.populate('sender_id', 'name avatar_url');

    // Update match last interaction
    await match.updateLastInteraction();

    res.json({ message });
  } catch (error) {
    console.error('Send file message error:', error);
    res.status(500).json({ error: 'Failed to send file message' });
  }
});

// Edit message
router.put('/:messageId', authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const message = await Message.findOne({
      _id: messageId,
      sender_id: req.user.id
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }

    // Can only edit text messages
    if (message.message_type !== 'text') {
      return res.status(400).json({ error: 'Can only edit text messages' });
    }

    await message.editContent(content);
    await message.populate('sender_id', 'name avatar_url');

    res.json({
      message: 'Message updated successfully',
      updated_message: message
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

// Delete message
router.delete('/:messageId', authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      sender_id: req.user.id
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Interact with butterfly on message
router.post('/:messageId/butterfly', authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { interaction_type = 'collected' } = req.body;

    const message = await Message.findById(messageId)
      .populate('sender_id', 'name');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify user has access to this match
    const match = await Match.findOne({
      _id: message.match_id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    });

    if (!match) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!message.has_butterfly) {
      return res.status(400).json({ error: 'No butterfly on this message' });
    }

    // Add butterfly interaction
    await message.addButterflyInteraction(req.user.id, match.butterfly_type, interaction_type);

    // Add to user's collection if collected
    if (interaction_type === 'collected') {
      const user = await require('../models/Member').findById(req.user.id);
      await user.addButterfly(match.butterfly_type, match._id);
    }

    res.json({
      message: 'Butterfly interaction recorded',
      butterfly_type: match.butterfly_type,
      interaction_type
    });
  } catch (error) {
    console.error('Butterfly interaction error:', error);
    res.status(500).json({ error: 'Failed to interact with butterfly' });
  }
});

// Get unread message count for user
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    // Get all active matches for the user
    const matches = await Match.find({
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ],
      status: 'active'
    }).select('_id');

    const matchIds = matches.map(match => match._id);

    // Count unread messages in all matches
    const unreadCount = await Message.countDocuments({
      match_id: { $in: matchIds },
      sender_id: { $ne: req.user.id },
      is_read: false
    });

    res.json({ unread_count: unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Chatbot conversation routes
router.get('/chatbot/history/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await ChatMessage.getSessionHistory(sessionId, parseInt(limit));

    res.json({
      session_id: sessionId,
      messages: messages
    });
  } catch (error) {
    console.error('Get chatbot history error:', error);
    res.status(500).json({ error: 'Failed to fetch chatbot history' });
  }
});

router.post('/chatbot/send', authMiddleware, async (req, res) => {
  try {
    const { content, session_id, context } = req.body;

    if (!content || !session_id) {
      return res.status(400).json({ error: 'Content and session ID are required' });
    }

    // Save user message
    const userMessage = new ChatMessage({
      content,
      sender: 'user',
      user_id: req.user.id,
      session_id,
      context: context || {}
    });

    await userMessage.save();

    // Generate AI response (this would integrate with your AI service)
    const aiResponse = generateChatbotResponse(content, context);

    const aiMessage = new ChatMessage({
      content: aiResponse,
      sender: 'ai',
      session_id,
      context: context || {},
      metadata: {
        response_time_ms: 500, // Mock response time
        confidence_score: 0.85
      }
    });

    await aiMessage.save();

    res.json({
      user_message: userMessage,
      ai_response: aiMessage
    });
  } catch (error) {
    console.error('Chatbot send error:', error);
    res.status(500).json({ error: 'Failed to process chatbot message' });
  }
});

// Simple chatbot response generator (replace with actual AI integration)
function generateChatbotResponse(userMessage, context) {
  const responses = {
    greeting: [
      "Hello! I'm here to help you navigate the world of meaningful connections. What's on your mind?",
      "Hi there! Ready to explore deeper connections? How can I assist you today?",
      "Welcome! I'm your relationship companion. What would you like to talk about?"
    ],
    dating_tips: [
      "Here's a tip: Be genuinely curious about your matches. Ask questions that go beyond small talk.",
      "Remember, authenticity attracts authenticity. Be yourself, and you'll attract the right person.",
      "Quality over quantity - focus on meaningful conversations rather than trying to match with everyone."
    ],
    conversation_starters: [
      "Try asking: 'What's something that made you smile today?' It's positive and revealing.",
      "A good opener: 'I noticed you're into [interest]. What got you started with that?'",
      "Share something genuine: 'I'm having a [type of day]. What kind of day are you having?'"
    ],
    heart_sync: [
      "Heart sync sessions create a unique bonding experience. Try taking deep breaths together.",
      "The magic happens when you both relax and focus on the present moment together.",
      "Heart sync works best when you're both in a calm, open state of mind."
    ]
  };

  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
    return responses.dating_tips[Math.floor(Math.random() * responses.dating_tips.length)];
  } else if (lowerMessage.includes('conversation') || lowerMessage.includes('start') || lowerMessage.includes('opener')) {
    return responses.conversation_starters[Math.floor(Math.random() * responses.conversation_starters.length)];
  } else if (lowerMessage.includes('heart') || lowerMessage.includes('sync')) {
    return responses.heart_sync[Math.floor(Math.random() * responses.heart_sync.length)];
  } else {
    return "That's an interesting perspective! In relationships, it's important to stay open and communicate honestly. What specific aspect would you like to explore further?";
  }
}

module.exports = router;