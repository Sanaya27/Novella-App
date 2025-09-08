# 🚀 Novella App - Step-by-Step Running Guide

## Prerequisites ✅
- ✅ Node.js 22.19.0 (Installed)
- ✅ npm (Installed with Node.js)
- ⚠️ MongoDB (Need to install)
- ⚠️ Docker Desktop (Need to start)

## Option A: Quick Start (Backend Only)

### Step 1: Start the Backend Server
```bash
cd novella-backend
npm run dev
```
The backend will run at `http://localhost:5000` but will show MongoDB connection errors until DB is ready.

### Step 2: Test Backend Health
Open browser to: `http://localhost:5000/api/health`
You should see: `{"status":"ok","message":"Novella Backend is running"}`

## Option B: Complete Setup (Backend + Database)

### Step 1: Install MongoDB

**Option 1A: Using MongoDB Community Server (Recommended)**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. During installation, choose "Install MongoDB as a Service"
4. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**Option 1B: Using Docker Desktop**
1. Start Docker Desktop application
2. Run MongoDB container:
   ```bash
   docker run -d -p 27017:27017 --name novella-mongodb mongo:latest
   ```

### Step 2: Start Backend with Database
```bash
cd novella-backend
npm run dev
```

### Step 3: Seed Sample Data (Optional)
```bash
npm run seed
```
This creates 4 sample users and 2 matches with chat history.

### Step 4: Start Frontend
```bash
cd ../novella-app
npm install
npm start
```
Frontend runs at `http://localhost:3000`

## Option C: Frontend Only (For UI Testing)

### Step 1: Start React App
```bash
cd novella-app
npm install
npm start
```
The frontend will run at `http://localhost:3000` but won't have backend functionality.

## 🧪 Testing Your Setup

### Backend Testing
1. **Health Check**: http://localhost:5000/api/health
2. **API Documentation**: Check `novella-backend/README.md`

### Frontend Testing  
1. **React App**: http://localhost:3000
2. **Components**: Test your dating and chat components

### Full Integration Testing (After both are running)
1. **Register**: Create new user account
2. **Login**: Test authentication
3. **Discovery**: View potential matches
4. **Chat**: Send messages
5. **Heart Sync**: Try synchronization features
6. **Butterflies**: Collect butterflies through interactions

## 🔑 Sample Login Credentials (After Seeding)
- alice@example.com / password123
- bob@example.com / password123
- carol@example.com / password123
- david@example.com / password123

## 🛠️ Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `net start MongoDB`
- Or start Docker: `docker start novella-mongodb`
- Check connection: `mongodb://localhost:27017/novella_db`

### "Port already in use"
- Backend (5000): Change PORT in `.env` file
- Frontend (3000): React will offer alternative port

### "Module not found"
- Run `npm install` in respective directory
- Clear cache: `npm cache clean --force`

### "CORS errors"
- Ensure backend is running first
- Check CORS_ORIGIN in `.env` matches frontend URL

## 📁 Project Structure Quick Reference
```
Novella-/
├── novella-backend/     # Node.js API server
│   ├── src/server.js   # Main server
│   ├── .env           # Environment config
│   └── package.json   # Dependencies
├── novella-app/        # React frontend
│   ├── src/App.js     # Main React app
│   └── package.json   # React dependencies
└── Components/         # Your custom components
```

## 🚀 Quick Commands Reference

### Backend Commands
```bash
cd novella-backend
npm run dev      # Start development server
npm start        # Start production server
npm run seed     # Add sample data
npm run lint     # Check code quality
```

### Frontend Commands  
```bash
cd novella-app
npm start        # Start React development server
npm run build    # Build for production
npm test         # Run tests
```

## 🎯 Next Steps After Running

1. **Connect Frontend to Backend**: Update API calls in React components
2. **Test Features**: Try heart sync, butterfly collection, chat
3. **Customize**: Modify matching algorithms, butterfly generation
4. **Deploy**: Consider hosting options for production

Happy coding! Your Novella dating app is ready to create meaningful connections! 🦋💕