const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar_url: {
    type: String,
    default: null
  },
  collection_rate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'online'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  age: {
    type: Number,
    min: 18,
    max: 100
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  interests: [{
    type: String,
    trim: true
  }],
  preferences: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 }
    },
    maxDistance: { type: Number, default: 50 }, // km
    interestedIn: {
      type: String,
      enum: ['men', 'women', 'both'],
      default: 'both'
    }
  },
  butterflies_collected: [{
    type: {
      type: String,
      enum: ['monarch', 'swallowtail', 'morpho', 'glasswing', 'rare_phoenix']
    },
    collected_at: { type: Date, default: Date.now },
    source_match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' }
  }],
  heart_rate_history: [{
    timestamp: { type: Date, default: Date.now },
    rate: { type: Number, min: 40, max: 200 },
    mood: {
      type: String,
      enum: ['golden_pollen', 'blue_mist', 'silver_whisper', 'rose_ember']
    }
  }],
  last_active: {
    type: Date,
    default: Date.now
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verification_token: String,
  reset_password_token: String,
  reset_password_expires: Date
}, {
  timestamps: true
});

// Index for location-based queries
memberSchema.index({ location: '2dsphere' });
memberSchema.index({ email: 1 });
memberSchema.index({ last_active: -1 });

// Hash password before saving
memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
memberSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last active
memberSchema.methods.updateLastActive = function() {
  this.last_active = new Date();
  return this.save();
};

// Add butterfly to collection
memberSchema.methods.addButterfly = function(butterflyType, sourceMatch) {
  this.butterflies_collected.push({
    type: butterflyType,
    source_match: sourceMatch
  });
  
  // Update collection rate
  const uniqueTypes = new Set(this.butterflies_collected.map(b => b.type));
  this.collection_rate = (uniqueTypes.size / 5) * 100; // 5 total butterfly types
  
  return this.save();
};

// Transform for API response (remove sensitive data)
memberSchema.methods.toJSON = function() {
  const member = this.toObject();
  delete member.password;
  delete member.verification_token;
  delete member.reset_password_token;
  delete member.reset_password_expires;
  return member;
};

module.exports = mongoose.model('Member', memberSchema);