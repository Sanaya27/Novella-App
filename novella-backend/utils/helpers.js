// Utility functions for the Novella backend

/**
 * Generate a random session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate distance between two geographic coordinates
 * @param {Array} coords1 - [longitude, latitude]
 * @param {Array} coords2 - [longitude, latitude]
 * @returns {number} Distance in kilometers
 */
function calculateDistance(coords1, coords2) {
  if (!coords1 || !coords2 || coords1[0] === 0 || coords2[0] === 0) {
    return null;
  }

  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input
 * @param {string} input 
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Generate a unique filename for uploads
 * @param {string} originalName 
 * @returns {string}
 */
function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${random}.${extension}`;
}

/**
 * Check if a file type is allowed
 * @param {string} mimetype 
 * @returns {boolean}
 */
function isAllowedFileType(mimetype) {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/ogg'
  ];
  return allowedTypes.includes(mimetype);
}

/**
 * Format time ago string
 * @param {Date} date 
 * @returns {string}
 */
function timeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Generate a random butterfly type based on rarity
 * @param {number} rarityBonus - 0-1 multiplier for rare butterflies
 * @returns {string}
 */
function generateRandomButterfly(rarityBonus = 0) {
  const butterflies = [
    { type: 'monarch', weight: 50 },
    { type: 'swallowtail', weight: 30 },
    { type: 'morpho', weight: 15 },
    { type: 'glasswing', weight: 4 },
    { type: 'rare_phoenix', weight: 1 }
  ];

  // Apply rarity bonus to rare butterflies
  if (rarityBonus > 0) {
    butterflies[3].weight += rarityBonus * 10; // glasswing
    butterflies[4].weight += rarityBonus * 5;  // rare_phoenix
  }

  const totalWeight = butterflies.reduce((sum, b) => sum + b.weight, 0);
  const random = Math.random() * totalWeight;
  
  let currentWeight = 0;
  for (const butterfly of butterflies) {
    currentWeight += butterfly.weight;
    if (random <= currentWeight) {
      return butterfly.type;
    }
  }
  
  return 'monarch'; // fallback
}

/**
 * Calculate compatibility score between two users
 * @param {Object} user1 
 * @param {Object} user2 
 * @returns {number} Score from 0-100
 */
function calculateCompatibility(user1, user2) {
  let score = 0;

  // Interest compatibility (40 points max)
  const commonInterests = user1.interests.filter(interest =>
    user2.interests.includes(interest)
  );
  const maxInterests = Math.max(user1.interests.length, user2.interests.length, 1);
  score += (commonInterests.length / maxInterests) * 40;

  // Age compatibility (20 points max)
  const ageDiff = Math.abs(user1.age - user2.age);
  if (ageDiff <= 2) score += 20;
  else if (ageDiff <= 5) score += 15;
  else if (ageDiff <= 10) score += 10;
  else if (ageDiff <= 15) score += 5;

  // Collection rate similarity (20 points max)
  const collectionDiff = Math.abs(user1.collection_rate - user2.collection_rate);
  score += Math.max(0, 20 - collectionDiff / 5);

  // Activity level (10 points max)
  const now = new Date();
  const user1Active = (now - user1.last_active) / (1000 * 60 * 60 * 24); // days
  const user2Active = (now - user2.last_active) / (1000 * 60 * 60 * 24); // days
  
  if (user1Active < 1 && user2Active < 1) score += 10;
  else if (user1Active < 7 && user2Active < 7) score += 5;

  // Bio similarity (10 points max) - simple word matching
  if (user1.bio && user2.bio) {
    const words1 = user1.bio.toLowerCase().split(/\s+/);
    const words2 = user2.bio.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => 
      word.length > 3 && words2.includes(word)
    );
    score += Math.min(10, commonWords.length * 2);
  }

  return Math.min(100, Math.round(score));
}

/**
 * Validate heart rate data
 * @param {number} rate 
 * @returns {boolean}
 */
function isValidHeartRate(rate) {
  return typeof rate === 'number' && rate >= 40 && rate <= 200;
}

/**
 * Generate error response object
 * @param {string} message 
 * @param {number} code 
 * @returns {Object}
 */
function createError(message, code = 500) {
  return {
    error: message,
    code: code,
    timestamp: new Date().toISOString()
  };
}

/**
 * Log function with timestamp
 * @param {string} level 
 * @param {string} message 
 * @param {Object} data 
 */
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
}

module.exports = {
  generateSessionId,
  calculateDistance,
  isValidEmail,
  sanitizeInput,
  generateUniqueFilename,
  isAllowedFileType,
  timeAgo,
  generateRandomButterfly,
  calculateCompatibility,
  isValidHeartRate,
  createError,
  log
};