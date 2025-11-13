#!/bin/bash

echo "🚀 Starting FinAI System..."
echo "================================"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check ports
echo "🔍 Checking port availability..."
check_port 5000 || exit 1
check_port 3001 || exit 1

# Start ML Service (Python Flask)
echo ""
echo "🐍 Starting ML Service (Python Flask)..."
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "✅ ML Service dependencies installed"

# Start ML service in background
echo "🚀 Starting ML Service on port 5000..."
python app.py &
ML_PID=$!
cd ..

# Wait for ML service to start
echo "⏳ Waiting for ML service to start..."
sleep 10

# Check ML service health
echo "🔍 Checking ML service health..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ ML Service is running and healthy"
else
    echo "❌ ML Service failed to start"
    kill $ML_PID 2>/dev/null
    exit 1
fi

# Start Backend Server (Node.js)
echo ""
echo "🟢 Starting Backend Server (Node.js)..."
cd server

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=3001
ML_SERVICE_URL=http://localhost:5000
NODE_ENV=development
EOF
fi

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install
echo "✅ Backend dependencies installed"

# Start backend server in background
echo "🚀 Starting Backend Server on port 3001..."
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend server to start..."
sleep 5

# Check backend health
echo "🔍 Checking backend server health..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend Server is running and healthy"
else
    echo "❌ Backend Server failed to start"
    kill $ML_PID $BACKEND_PID 2>/dev/null
    exit 1
fi

# Build and start Frontend
echo ""
echo "⚛️  Building and starting Frontend..."
cd client
echo "📦 Installing frontend dependencies..."
npm install
echo "🔨 Building frontend..."
npm run build
echo "✅ Frontend built successfully"
cd ..

echo ""
echo "🎉 FinAI System is now running!"
echo "================================"
echo "📊 ML Service: http://localhost:5000"
echo "🟢 Backend API: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3001"
echo ""
echo "📋 Available endpoints:"
echo "   - /api/companies - List all companies"
echo "   - /api/company/:ticker - Company details"
echo "   - /api/anomalies - Anomaly detection results"
echo "   - /api/summary - Overall summary"
echo ""
echo "🛑 To stop the system, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down FinAI System..."
    kill $ML_PID $BACKEND_PID 2>/dev/null
    echo "✅ System stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT

# Keep script running
wait
