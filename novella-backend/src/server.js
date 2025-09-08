const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRoutes = require('../routes/auth');
const memberRoutes = require('../routes/members');
const matchRoutes = require('../routes/matches');
const messageRoutes = require('../routes/messages');
const heartSyncRoutes = require('../routes/heartSync');
const butterflyRoutes = require('../routes/butterflies');

// Import socket handlers
const socketAuth = require('../middleware/socketAuth');
const chatHandler = require('../controllers/chatController');

// Import config
const config = require('../config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/heart-sync', heartSyncRoutes);
app.use('/api/butterflies', butterflyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Novella Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.use(socketAuth);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // Handle chat events
  chatHandler.handleConnection(socket, io);
  
  // Handle heart sync events
  socket.on('join_heart_sync', (data) => {
    socket.join(`heart_sync_${data.matchId}`);
    socket.to(`heart_sync_${data.matchId}`).emit('partner_joined', {
      userId: socket.userId,
      timestamp: new Date()
    });
  });
  
  socket.on('heart_beat_data', (data) => {
    socket.to(`heart_sync_${data.matchId}`).emit('partner_heart_beat', {
      userId: socket.userId,
      heartRate: data.heartRate,
      timestamp: new Date()
    });
  });
  
  // Handle butterfly interactions
  socket.on('butterfly_interaction', (data) => {
    io.to(`match_${data.matchId}`).emit('butterfly_landed', {
      messageId: data.messageId,
      butterflyType: data.butterflyType,
      userId: socket.userId,
      timestamp: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Novella Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };