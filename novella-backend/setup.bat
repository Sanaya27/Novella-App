@echo off
REM Novella Backend Setup Script for Windows

echo 🦋 Setting up Novella Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if MongoDB is running (basic check)
echo ⚠️  Please ensure MongoDB is running before continuing.
echo    You can start it with: net start MongoDB
echo    OR use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create environment file
if not exist .env (
    echo 🔧 Creating environment file...
    copy .env.example .env
    echo ✅ Created .env file. Please update it with your configuration.
) else (
    echo ✅ Environment file already exists.
)

REM Create uploads directory
if not exist uploads (
    echo 📁 Creating uploads directory...
    mkdir uploads
    echo ✅ Created uploads directory.
)

REM Create logs directory
if not exist logs (
    echo 📁 Creating logs directory...
    mkdir logs
    echo ✅ Created logs directory.
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env file with your MongoDB URI and JWT secret
echo 2. Start MongoDB if not already running
echo 3. Run 'npm run seed' to add sample data (optional)
echo 4. Run 'npm run dev' to start the development server
echo.
echo The server will be available at http://localhost:5000
pause