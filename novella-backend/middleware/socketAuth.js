const jwt = require('jsonwebtoken');
const config = require('../config/database');

const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication failed: No token provided'));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    next();
  } catch (error) {
    next(new Error('Authentication failed: Invalid token'));
  }
};

module.exports = socketAuth;