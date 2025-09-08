const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  user2_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  sync_level: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  butterfly_type: {
    type: String,
    enum: ['monarch', 'swallowtail', 'morpho', 'glasswing', 'rare_phoenix'],
    default: 'monarch'
  },
  last_interaction: {
    type: Date,
    default: Date.now
  },
  conversation_depth: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  is_ghosted: {
    type: Boolean,
    default: false
  },
  heart_sync_sessions: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'ended', 'blocked'],
    default: 'active'
  },
  mutual_likes: {
    user1_liked: { type: Boolean, default: false },
    user2_liked: { type: Boolean, default: false },
    matched_at: { type: Date }
  },
  compatibility_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  shared_interests: [{
    type: String
  }],
  heart_sync_history: [{
    session_date: { type: Date, default: Date.now },
    sync_percentage: { type: Number, min: 0, max: 100 },
    duration_minutes: { type: Number, default: 0 },
    butterfly_generated: { type: Boolean, default: false }
  }],
  conversation_milestones: [{
    milestone: {
      type: String,
      enum: ['first_message', 'first_voice', 'first_heart_sync', 'deep_conversation', 'butterfly_collection']
    },
    achieved_at: { type: Date, default: Date.now },
    butterfly_reward: {
      type: String,
      enum: ['monarch', 'swallowtail', 'morpho', 'glasswing', 'rare_phoenix']
    }
  }],
  ghosting_detection: {
    last_response_user1: { type: Date },
    last_response_user2: { type: Date },
    response_gap_threshold: { type: Number, default: 72 }, // hours
    ghost_warning_sent: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes
matchSchema.index({ user1_id: 1, user2_id: 1 }, { unique: true });
matchSchema.index({ last_interaction: -1 });
matchSchema.index({ status: 1 });
matchSchema.index({ sync_level: -1 });

// Ensure users can't match with themselves
matchSchema.pre('save', function(next) {
  if (this.user1_id.equals(this.user2_id)) {
    const error = new Error('Users cannot match with themselves');
    return next(error);
  }
  next();
});

// Update last interaction
matchSchema.methods.updateLastInteraction = function() {
  this.last_interaction = new Date();
  return this.save();
};

// Calculate butterfly type based on compatibility and depth
matchSchema.methods.calculateButterflyType = function() {
  const score = this.compatibility_score + (this.conversation_depth * 5) + (this.sync_level * 0.5);
  
  if (score >= 90) return 'rare_phoenix';
  if (score >= 70) return 'glasswing';
  if (score >= 50) return 'morpho';
  if (score >= 30) return 'swallowtail';
  return 'monarch';
};

// Add heart sync session
matchSchema.methods.addHeartSyncSession = function(syncPercentage, durationMinutes) {
  this.heart_sync_sessions += 1;
  this.heart_sync_history.push({
    sync_percentage: syncPercentage,
    duration_minutes: durationMinutes,
    butterfly_generated: syncPercentage > 80
  });
  
  // Update sync level (weighted average)
  const totalSessions = this.heart_sync_history.length;
  const weightedSum = this.heart_sync_history.reduce((sum, session, index) => {
    const weight = (index + 1) / totalSessions; // More recent sessions have higher weight
    return sum + (session.sync_percentage * weight);
  }, 0);
  
  this.sync_level = Math.round(weightedSum);
  this.butterfly_type = this.calculateButterflyType();
  
  return this.save();
};

// Check for ghosting
matchSchema.methods.checkForGhosting = function() {
  const now = new Date();
  const thresholdHours = this.ghosting_detection.response_gap_threshold;
  const thresholdMs = thresholdHours * 60 * 60 * 1000;
  
  const user1LastResponse = this.ghosting_detection.last_response_user1 || this.createdAt;
  const user2LastResponse = this.ghosting_detection.last_response_user2 || this.createdAt;
  
  const user1Gap = now - user1LastResponse;
  const user2Gap = now - user2LastResponse;
  
  if (user1Gap > thresholdMs || user2Gap > thresholdMs) {
    this.is_ghosted = true;
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Add conversation milestone
matchSchema.methods.addMilestone = function(milestone, butterflyReward = null) {
  this.conversation_milestones.push({
    milestone,
    butterfly_reward: butterflyReward
  });
  
  this.conversation_depth = Math.min(this.conversation_milestones.length, 10);
  this.butterfly_type = this.calculateButterflyType();
  
  return this.save();
};

module.exports = mongoose.model('Match', matchSchema);