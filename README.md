# Novella-App
Where Hearts Sync and Stories Begin

**Ignite Connections, Elevate Emotions, Redefine Relationships**

![last commit](https://img.shields.io/badge/last%20commit-today-blue) ![javascript](https://img.shields.io/badge/javascript-89.3%25-yellow) ![languages](https://img.shields.io/badge/languages-5-green) ![version](https://img.shields.io/badge/version-1.0.0-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue)

**Built with the tools and technologies:**

![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) ![JSON](https://img.shields.io/badge/JSON-000000?style=flat&logo=json&logoColor=white) ![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat&logo=markdown&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white) ![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735?style=flat&logo=autoprefixer&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)

![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat&logo=nodemon&logoColor=white) ![GNU Bash](https://img.shields.io/badge/GNU%20Bash-4EAA25?style=flat&logo=gnubash&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Table of Contents

- [🌟 Overview](#overview)
- [🚀 Getting Started](#getting-started)
- [📋 Prerequisites](#prerequisites)
- [⚙️ Installation](#installation)
- [💫 Usage](#usage)
- [🧪 Testing](#testing)
- [🏗️ Project Structure](#project-structure)
- [🗺️ Roadmap](#roadmap)
- [🤝 Contribution](#contribution)
- [📄 License](#license)
- [🙏 Acknowledgements](#acknowledgements)

---

## 🌟 Overview

Novella is a revolutionary dating application that transcends traditional swiping to create authentic emotional connections through innovative features like real-time heart synchronization, butterfly collection mechanics, and AI-powered conversational experiences.

### ✨ Premium Features

#### 💓 Heart Synchronization Engine
- **Advanced compatibility algorithms** based on heart rate variability
- **Bioluminescent visualizations** that respond to emotional resonance
- **Synchronization scoring** based on your personality

#### 🦋 Butterfly Collection System
- **Dynamic butterfly generation** triggered by meaningful conversations
- **8-tier rarity system**: Morpho → Swallowtail → Monarch → Glasswing → Twilight → Phoenix → Prism → Eternal Bond
- **Seasonal butterflies** for special events and milestones
- **AR butterfly viewing** in your personal garden space

#### 🤖 AI-Powered Emotional Intelligence (Amora)
- **Context-aware responses** using OpenAI GPT-3.5-turbo and Google Gemini
- **Nervousness detection** through behavioral pattern analysis
- **Conversation coaching** with real-time suggestions
- **Personality adaptation** that learns from your communication style

#### 🎭 Advanced Behavioral Analytics
- **Typing pattern recognition** for emotional state detection
- **Voice sentiment analysis** with mood visualization
- **Compatibility prediction** using machine learning algorithms

---

## 🚀 Getting Started

Transform your approach to digital dating with Novella's groundbreaking emotional connection platform.

### 🎯 Quick Demo
```bash
# Experience Novella in 4 commands
git clone https://github.com/Sanaya27/Novella-App.git
cd novella-app 
npm install
npm start
```

### 🔧 Development Setup
```bash
# Full development environment
./scripts/dev-setup.sh
npm run dev:full-stack
```

---

## 📋 Prerequisites

### System Requirements
- **Node.js** 16.14.0 or higher
- **MongoDB** 4.4+ (or MongoDB Atlas)
- **Redis** 6.0+ for session management
- **FFmpeg** for voice/video processing

### API Keys (Optional)
- **OpenAI API Key** for advanced AI chat
- **Google Gemini API Key** for fallback AI responses
- **WebRTC TURN Server** for video calls
- **AWS S3** for media storage

### Hardware Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Camera/Microphone** for heart sync features

---

## ⚙️ Installation

### 🔧 Manual Installation

#### Backend Setup
```bash
cd novella-backend
npm install

# Environment configuration
cp .env.example .env
nano .env  # Configure your settings

# Database setup
npm run db:migrate
npm run seed:demo-data

# Start services
npm run dev
```

#### Frontend Setup  
```bash
cd novella-app
npm install

# Configure AI features
cp .env.example .env
# Add your API keys

# Start development server
npm start
```

### 🐳 Docker Deployment
```bash
docker-compose up -d
# Includes MongoDB, Redis, and all services
```

---

## 💫 Usage

### 🌟 Core Features

#### Real-time Heart Synchronization
```javascript
// Start a heart sync session
const syncSession = await heartSync.initiate(matchId);
syncSession.onHeartBeat((data) => {
  visualizer.updateSynchronization(data.compatibility);
});
```

#### AI Conversation Enhancement
```javascript
// Enable intelligent responses
const amoraChat = new AmoraAI({
  nervousnessDetection: true,
  contextWindow: 10,
  personalityMode: 'empathetic'
});
```

#### Butterfly Collection
```javascript
// Generate butterflies from conversations
const butterfly = await ButterflyEngine.generateFromConversation({
  sentiment: 'positive',
  engagement: 'high',
  milestone: 'first_heart_sync'
});
```

### 🎮 User Journey

1. **Onboarding**: Complete personality assessment and preferences
2. **Discovery**: AI-powered matching based on emotional compatibility  
3. **Connection**: Engage through heart sync and meaningful conversations
4. **Growth**: Collect butterflies as relationship milestones
5. **Evolution**: Deepen bonds through shared experiences

---

## 🧪 Testing

### 🎯 Quick Test Suite
```bash
npm run test:integration
npm run test:ai-responses
npm run test:heart-sync
npm run test:butterfly-generation
```

### 🧑‍💻 Demo Accounts
```
Username: alice@novella.app | Password: HeartSync2024!
Username: bob@novella.app   | Password: ButterflyGarden!
Username: carol@novella.app | Password: EmotionalAI!
```

### 🔍 Testing Scenarios
- [ ] Complete user onboarding flow
- [ ] Real-time heart synchronization
- [ ] AI chat with nervousness detection
- [ ] Butterfly generation mechanics
- [ ] Video call integration
- [ ] Match compatibility scoring

---

## 🏗️ Project Structure

```
novella-app/
├── 🎨 src/
│   ├── components/          # Reusable UI components
│   │   ├── dating/         # Dating-specific features
│   │   │   ├── ButterflyAnimation.jsx
│   │   │   ├── HeartSyncVisualization.jsx
│   │   │   └── RealisticButterfly.jsx
│   │   └── chat/           # AI chat components
│   ├── pages/              # Main application screens
│   │   ├── Home.jsx        # Discovery and matching
│   │   ├── Chat.jsx        # Messaging interface
│   │   ├── Sync.jsx        # Heart synchronization
│   │   ├── Garden.jsx      # Butterfly collection
│   │   └── Amora.jsx       # AI companion
│   ├── context/            # Global state management
│   ├── utils/              # Helper functions
│   └── hooks/              # Custom React hooks
├── 🛠️ novella-backend/
│   ├── src/
│   │   ├── server.js       # Express server
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # Database schemas
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Authentication & validation
│   │   └── utils/          # Backend utilities
│   ├── config/             # Configuration files
│   └── tests/              # Backend test suites
├── 📱 mobile/              # React Native app (coming soon)
├── 🎭 testing-files/       # All Testing HTML files
├── 🦋 assets/              # Butterfly species data
└── 📚 markdown-files/      # Documentation
```

---

## 🗺️ Roadmap

### 🚀 Phase 1: Foundation (Current)
- [ ] Core dating functionality
- [ ] Real-time chat with AI integration
- [ ] Heart synchronization basics
- [ ] Butterfly collection system
- [ ] Advanced matching algorithms

### 🌟 Phase 2: Intelligence (Q2 2024)
- [ ] Advanced AI personality matching
- [ ] Emotion recognition in video calls
- [ ] Predictive compatibility scoring
- [ ] Voice tone analysis
- [ ] Behavioral pattern learning

### 🔮 Phase 3: Immersion (Q3 2024)
- [ ] AR butterfly interactions
- [ ] VR date experiences  
- [ ] Haptic feedback integration
- [ ] Biometric wearable sync
- [ ] 3D avatar creation

### 🌍 Phase 4: Social (Q4 2024)
- [ ] Friend network integration
- [ ] Group dating events
- [ ] Community challenges
- [ ] Relationship mentorship program
- [ ] Global compatibility insights

---

## 🤝 Contribution

We welcome contributors who share our vision of authentic digital connections!

### 🎯 Contribution Areas

#### 🎨 Frontend Development
- React component optimization
- 3D animation enhancements  
- Mobile responsiveness
- Accessibility improvements

#### 🔧 Backend Engineering
- API performance optimization
- Database query improvements
- Real-time feature scaling
- Security enhancements

#### 🤖 AI/ML Engineering
- Conversation model training
- Emotion recognition algorithms
- Compatibility prediction models
- Natural language processing

#### 🦋 Data Science
- User behavior analysis
- A/B testing frameworks
- Recommendation engines
- Predictive analytics

### 📋 Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-connection`
3. Implement changes with tests
4. Submit pull request with detailed description
5. Code review and collaboration
6. Merge and celebrate! 🎉


## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Commercial Usage
- ✅ Personal and commercial use allowed
- ✅ Modification and distribution permitted
- ✅ Private use encouraged
- ❗ Attribution required

---

## 🙏 Acknowledgements

### 🎨 Design Inspiration
- **Butterflies in Nature**: Biomimetic animation references
- **Heart Rate Variability Research**: Stanford HRV Lab
- **Emotional AI**: MIT Media Lab collaboration

### 🛠️ Technology Partners
- **OpenAI**: Advanced language models
- **Google Gemini**: AI response generation
- **Socket.IO**: Real-time communication
- **MongoDB**: Flexible data storage
- **React**: Modern UI framework

# FAQS

Does Heart Sync share my raw heartbeat?
No. With consent, devices read BPM; only derived visuals (flutters, DNA swirl) are shown in chat not raw BPM streams.

Is Voice Mood recording me?
No. Analysis is intended to run on-device; if any label is sent, it’s categorical only (e.g., “calm”).

Can I disable analytics or cues?
Yes - ship with toggles so users can disable mood/heartbeat cues entirely.

What happens to Ghost Glimpse after viewing?
It fades after one view. External capture is still possible; discourage misuse and allow reporting. 
(Implement server-side deletion & signed URLs with short TTLs.)
## 🔗 Additional Resources

### 📖 Documentation
- [API Reference](docs/api-reference.md) - Complete API documentation
- [Component Library](docs/components.md) - UI component guide  
- [AI Integration Guide](docs/ai-integration.md) - Set up intelligent features
- [Deployment Guide](docs/deployment.md) - Production setup instructions

### 🎯 Quick Links
- [Live Demo]([https://demo.novella.app](https://novella-app-ayush.vercel.app/login)) - Experience Novella instantly
- [Feature Requests](https://github.com/Sanaya27/Novella-App/issues) - Suggest improvements
- [Bug Reports](https://github.com/Sanaya27/Novella-App/issues/new?template=bug_report.md) - Report issues

### 🌐 Connect With Us
- **Email**: sanayagirdhar@gmail.com

---

<div align="center">

**💝 Built with love by the Novella Team**

*"In a world of endless swipes, we choose to sync hearts."*

[![Star on GitHub](https://img.shields.io/github/stars/Sanaya27/novella-app/novella?style=social)](https://github.com/Sanaya27/Novella-App)

</div>ories Begin
