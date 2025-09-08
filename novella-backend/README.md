# Novella Backend

A comprehensive backend API for the Novella dating app, featuring real-time chat, heart synchronization, butterfly collection, and AI-powered matching.

## Features

- **User Authentication & Profiles**: JWT-based auth with comprehensive user management
- **Smart Matching Algorithm**: Compatibility scoring based on interests, location, and behavior
- **Real-time Chat**: Socket.IO powered messaging with typing indicators and read receipts
- **Heart Sync Sessions**: Synchronized heartbeat monitoring for emotional connection
- **Butterfly Collection**: Gamified reward system with 5 butterfly species
- **Voice Mood Analysis**: AI-powered mood detection from voice messages
- **Ghosting Detection**: Automatic detection and prevention of conversation abandonment
- **File Upload**: Support for images and voice messages

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, bcryptjs

## Quick Start

### Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone and setup:**
   ```bash
   cd novella-backend
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/novella_db
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRATION=24h
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start MongoDB:**
   ```bash
   # Using MongoDB service
   sudo service mongod start
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will be running at `http://localhost:5000`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/location` - Update user location
- `PUT /api/auth/status` - Update online status

### Member Management

- `GET /api/members/:id` - Get member profile
- `GET /api/members/discover/potential` - Discover potential matches
- `POST /api/members/like/:id` - Like a member
- `GET /api/members/:id/butterflies` - Get butterfly collection
- `POST /api/members/heart-rate` - Record heart rate data

### Matching System

- `GET /api/matches` - Get user's matches
- `GET /api/matches/:id` - Get specific match details
- `PUT /api/matches/:id/status` - Update match status
- `POST /api/matches/:id/calculate-compatibility` - Calculate compatibility
- `POST /api/matches/:id/milestone` - Add conversation milestone

### Real-time Messaging

- `GET /api/messages/match/:matchId` - Get match messages
- `POST /api/messages/send` - Send text message
- `POST /api/messages/upload` - Upload file
- `POST /api/messages/send-file` - Send file message
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### Heart Sync Features

- `POST /api/heart-sync/start/:matchId` - Start heart sync session
- `POST /api/heart-sync/end/:matchId` - End session with results
- `GET /api/heart-sync/history/:matchId` - Get sync history
- `GET /api/heart-sync/compatibility/:matchId` - Calculate heart compatibility

### Butterfly System

- `POST /api/butterflies/generate/:matchId` - Generate butterfly
- `GET /api/butterflies/collection/:userId?` - Get butterfly collection
- `GET /api/butterflies/leaderboard` - Get collection leaderboard
- `GET /api/butterflies/tips` - Get butterfly generation tips
- `POST /api/butterflies/voice-mood/analyze` - Analyze voice mood

## Socket.IO Events

### Client to Server

- `join_match` - Join a match room for real-time chat
- `leave_match` - Leave match room
- `send_message` - Send real-time message
- `typing_start` / `typing_stop` - Typing indicators
- `mark_messages_read` - Mark messages as read
- `send_voice_mood` - Send voice mood message
- `send_flutter_tap` - Send quick emoji reaction
- `send_ghost_glimpse` - Send temporary message
- `join_heart_sync` - Join heart sync session
- `heart_beat_data` - Send heart rate data

### Server to Client

- `new_message` - New message received
- `user_typing` / `user_stopped_typing` - Partner typing status
- `messages_read` - Messages marked as read
- `butterfly_landed` - Butterfly appeared on message
- `partner_heart_beat` - Partner's heart rate data
- `user_online` / `user_offline` - Partner status changes

## Database Schema

### Member Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  avatar_url: String,
  collection_rate: Number (0-100),
  status: Enum ['online', 'offline', 'away'],
  location: GeoJSON Point,
  age: Number,
  bio: String,
  interests: [String],
  preferences: Object,
  butterflies_collected: [ButterflyObject],
  heart_rate_history: [HeartRateObject]
}
```

### Match Model
```javascript
{
  user1_id: ObjectId,
  user2_id: ObjectId,
  sync_level: Number (0-100),
  butterfly_type: Enum,
  conversation_depth: Number (0-10),
  compatibility_score: Number (0-100),
  heart_sync_sessions: Number,
  heart_sync_history: [SessionObject],
  conversation_milestones: [MilestoneObject]
}
```

### Message Model
```javascript
{
  match_id: ObjectId,
  sender_id: ObjectId,
  content: String,
  message_type: Enum ['text', 'voice_mood', 'ghost_glimpse', 'flutter_tap'],
  voice_mood: Enum,
  is_read: Boolean,
  has_butterfly: Boolean,
  butterfly_interactions: [InteractionObject]
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/novella_db` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRATION` | JWT token expiration time | `24h` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding
```bash
npm run seed
```

## Deployment

### Production Setup

1. **Environment Variables:**
   Set production environment variables:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-production-secret
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Build and Start:**
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Security Considerations

- JWT tokens are signed with a secret key
- Passwords are hashed with bcrypt (12 rounds)
- CORS configured for specific origins
- Helmet.js for security headers
- Input validation on all endpoints
- File upload restrictions (5MB limit, specific file types)
- Rate limiting on API endpoints

## Performance Features

- Database indexing for optimal queries
- Socket.IO rooms for efficient real-time communication
- Pagination on list endpoints
- File compression for uploads
- Connection pooling for MongoDB

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

**Socket.IO Connection Issues:**
- Check CORS configuration
- Verify JWT token in socket authentication
- Ensure proper room joining/leaving

**File Upload Problems:**
- Check file size limits (5MB max)
- Verify file type restrictions
- Ensure upload directory exists and is writable

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.