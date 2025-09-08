const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  is_streaming: {
    type: Boolean,
    default: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: function() {
      return this.sender === 'user';
    }
  },
  session_id: {
    type: String,
    required: true,
    index: true
  },
  message_id: {
    type: String,
    unique: true,
    default: function() {
      return new mongoose.Types.ObjectId().toString();
    }
  },
  ai_model: {
    type: String,
    default: 'novella-chatbot'
  },
  context: {
    conversation_topic: String,
    user_mood: {
      type: String,
      enum: ['happy', 'sad', 'excited', 'nervous', 'romantic', 'playful', 'contemplative']
    },
    relationship_advice_type: {
      type: String,
      enum: ['dating_tips', 'conversation_starters', 'profile_optimization', 'match_analysis', 'confidence_building']
    }
  },
  feedback: {
    helpful: { type: Boolean, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, maxlength: 500 }
  },
  metadata: {
    response_time_ms: { type: Number },
    token_count: { type: Number },
    confidence_score: { type: Number, min: 0, max: 1 }
  }
}, {
  timestamps: true
});

// Indexes
chatMessageSchema.index({ session_id: 1, timestamp: 1 });
chatMessageSchema.index({ user_id: 1, timestamp: -1 });
chatMessageSchema.index({ sender: 1 });

// Get conversation history for session
chatMessageSchema.statics.getSessionHistory = function(sessionId, limit = 50) {
  return this.find({ session_id: sessionId })
    .sort({ timestamp: 1 })
    .limit(limit)
    .populate('user_id', 'name avatar_url');
};

// Get user's chat statistics
chatMessageSchema.statics.getUserChatStats = function(userId) {
  return this.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        avgResponseTime: { $avg: '$metadata.response_time_ms' },
        topicsDiscussed: { $addToSet: '$context.conversation_topic' },
        lastChatDate: { $max: '$timestamp' }
      }
    }
  ]);
};

// Mark message as helpful/unhelpful
chatMessageSchema.methods.provideFeedback = function(helpful, rating = null, comment = null) {
  this.feedback.helpful = helpful;
  if (rating) this.feedback.rating = rating;
  if (comment) this.feedback.comment = comment;
  return this.save();
};

// Update streaming status
chatMessageSchema.methods.updateStreamingStatus = function(isStreaming) {
  this.is_streaming = isStreaming;
  return this.save();
};

module.exports = mongoose.model('ChatMessage', chatMessageSchema);