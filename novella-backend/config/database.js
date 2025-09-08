module.exports = {
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/novella_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  bcryptSaltRounds: 12,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedAudioTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // requests per window
};