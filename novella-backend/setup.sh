#!/bin/bash

# Novella Backend Setup Script

echo "🦋 Setting up Novella Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   sudo service mongod start"
    echo "   OR"
    echo "   docker run -d -p 27017:27017 --name mongodb mongo:latest"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file
if [ ! -f .env ]; then
    echo "🔧 Creating environment file..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your configuration."
else
    echo "✅ Environment file already exists."
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
    echo "✅ Created uploads directory."
fi

# Create logs directory
if [ ! -d "logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir logs
    echo "✅ Created logs directory."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your MongoDB URI and JWT secret"
echo "2. Start MongoDB if not already running"
echo "3. Run 'npm run seed' to add sample data (optional)"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "The server will be available at http://localhost:5000"