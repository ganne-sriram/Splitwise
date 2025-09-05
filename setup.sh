#!/bin/bash

echo "🚀 Splitwise Local Setup Script"
echo "================================"

if [ ! -d "splitwise-backend" ] || [ ! -d "splitwise-frontend" ]; then
    echo "❌ Error: Please run this script from the Splitwise root directory"
    exit 1
fi

echo "📦 Setting up Backend (FastAPI)..."
cd splitwise-backend

if ! command -v poetry &> /dev/null; then
    echo "📥 Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
fi

echo "📦 Installing Python dependencies..."
poetry install

if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
DATABASE_URL=sqlite:///./splitwise.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
    echo "✅ Created .env file with default settings"
fi

cd ..

echo "🎨 Setting up Frontend (Angular)..."
cd splitwise-frontend

if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js v18 or higher"
    exit 1
fi

echo "📦 Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd splitwise-backend"
echo "   poetry run fastapi dev app/main.py"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd splitwise-frontend"
echo "   npm start"
echo ""
echo "3. Open your browser and navigate to:"
echo "   http://localhost:4200"
echo ""
echo "📚 API Documentation will be available at:"
echo "   http://127.0.0.1:8000/docs"
echo ""
echo "🎉 Happy coding!"
