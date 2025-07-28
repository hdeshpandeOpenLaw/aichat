#!/bin/bash

echo "🚀 Starting OpenLaw AI Application..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $1 is already in use"
        return 0
    else
        echo "❌ Port $1 is not in use"
        return 1
    fi
}

# Check if Flask backend is running
if ! check_port 8000; then
    echo "📡 Starting Flask backend..."
    cd "$(dirname "$0")"
    python run_flask.py &
    FLASK_PID=$!
    echo "Flask backend started with PID: $FLASK_PID"
    sleep 3
else
    echo "Flask backend is already running on port 8000"
fi

# Check if React frontend is running
if ! check_port 3000; then
    echo "⚛️  Starting React frontend..."
    cd openlaw-frontend
    npm start &
    REACT_PID=$!
    echo "React frontend started with PID: $REACT_PID"
else
    echo "React frontend is already running on port 3000"
fi

echo ""
echo "🎉 OpenLaw AI Application is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait 