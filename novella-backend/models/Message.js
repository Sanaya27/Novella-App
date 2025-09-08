const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  match_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  message_type: {
    type: String,
    enum: ['text', 'voice_mood', 'ghost_glimpse', 'flutter_tap', 'image', 'heart_sync_invite'],
    default: 'text'
  },
  voice_mood: {
    type: String,
    enum: ['golden_pollen', 'blue_mist', 'silver_whisper', 'rose_ember'],
    default: null
  },
  voice_file_url: {
    type: String,
    default: null
  },
  image_url: {
    type: String,
    default: null
  },
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date,
    default: null
  },
  has_butterfly: {
    type: Boolean,
    default: false
  },
  butterfly_interactions: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    butterfly_type: {
      type: String,
      enum: ['monarch', 'swallowtail', 'morpho', 'glasswing', 'rare_phoenix']
    },
    interaction_type: {
      type: String,
      enum: ['landed', 'collected', 'shared']
    },
    timestamp: { type: Date, default: Date.now }
  }],
  emotion_analysis: {
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    emotions: [{
      emotion: String,
      intensity: { type: Number, min: 0, max: 1 }
    }]
  },
  reply_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  edited: {
    is_edited: { type: Boolean, default: false },
    edited_at: { type: Date },
    original_content: { type: String }
  },
  delivery_status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ match_id: 1, createdAt: -1 });
messageSchema.index({ sender_id: 1 });
messageSchema.index({ is_read: 1 });
messageSchema.index({ message_type: 1 });

// Mark message as read
messageSchema.methods.markAsRead = function() {
  if (!this.is_read) {
    this.is_read = true;
    this.read_at = new Date();
    this.delivery_status = 'read';
    return this.save();
  }
  return Promise.resolve(this);
};

// Add butterfly interaction
messageSchema.methods.addButterflyInteraction = function(userId, butterflyType, interactionType) {
  this.has_butterfly = true;
  this.butterfly_interactions.push({
    user_id: userId,
    butterfly_type: butterflyType,
    interaction_type: interactionType
  });
  return this.save();
};

// Analyze voice mood from file (placeholder for future AI integration)
messageSchema.methods.analyzeVoiceMood = function() {
  // This would integrate with voice analysis AI in the future
  const moods = ['golden_pollen', 'blue_mist', 'silver_whisper', 'rose_ember'];
  this.voice_mood = moods[Math.floor(Math.random() * moods.length)];
  return this.save();
};

// Edit message
messageSchema.methods.editContent = function(newContent) {
  if (!this.edited.is_edited) {
    this.edited.original_content = this.content;
  }
  this.content = newContent;
  this.edited.is_edited = true;
  this.edited.edited_at = new Date();
  return this.save();
};

// Get butterfly probability based on message content and context
messageSchema.methods.getButterflyProbability = function() {
  let probability = 0.1; // Base 10% chance
  
  // Increase based on message type
  if (this.message_type === 'voice_mood') probability += 0.2;
  if (this.message_type === 'flutter_tap') probability += 0.3;
  
  // Increase based on sentiment
  if (this.emotion_analysis.sentiment === 'positive') {
    probability += this.emotion_analysis.confidence * 0.3;
  }
  
  // Increase for longer messages
  if (this.content.length > 100) probability += 0.1;
  
  // Decrease if too many recent butterflies
  const recentButterflies = this.butterfly_interactions.filter(
    interaction => new Date() - interaction.timestamp < 24 * 60 * 60 * 1000
  ).length;
  probability = Math.max(0.05, probability - (recentButterflies * 0.1));
  
  return Math.min(0.8, probability); // Cap at 80%
};

module.exports = mongoose.model('Message', messageSchema);