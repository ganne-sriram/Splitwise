# 🪟 Splitwise - Complete Windows Setup Guide

## 📋 Project Overview

**Splitwise** is a full-stack expense sharing application similar to the popular Splitwise app. It allows users to create groups, add expenses, and automatically split costs among group members.

### 🏗️ **Architecture**
- **Frontend**: Angular 18 + TypeScript + TailwindCSS
- **Backend**: FastAPI + Python + SQLAlchemy
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based with bcrypt password hashing

### ✨ **Core Features**
- 🔐 User registration and login with JWT authentication
- 👥 Create and manage expense groups
- 💰 Add expenses with automatic splitting among participants
- 📊 Dashboard with balance summaries and recent expenses
- 🧾 Settlement tracking between users
- 📈 Analytics framework (ready for charts implementation)

---

## 🛠️ **Windows Prerequisites**

### **Required Software**

#### 1. **Node.js (v18 or higher)**
```powershell
# Download from official website
https://nodejs.org/en/download/

# Or using Chocolatey (if installed)
choco install nodejs

# Or using Winget
winget install OpenJS.NodeJS
```

#### 2. **Python (v3.12 or higher)**
```powershell
# Download from official website
https://www.python.org/downloads/

# Or using Chocolatey
choco install python

# Or using Winget
winget install Python.Python.3.12
```

#### 3. **Poetry (Python Package Manager)**
```powershell
# Install using PowerShell (Recommended)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# Or using pip
pip install poetry

# Add Poetry to PATH (if not automatically added)
# Add this to your PATH: %APPDATA%\Python\Scripts
```

#### 4. **Git**
```powershell
# Download from official website
https://git-scm.com/download/win

# Or using Chocolatey
choco install git

# Or using Winget
winget install Git.Git
```

#### 5. **Visual Studio Code (Recommended)**
```powershell
# Download from official website
https://code.visualstudio.com/

# Or using Chocolatey
choco install vscode

# Or using Winget
winget install Microsoft.VisualStudioCode
```

---

## 🚀 **Installation Steps**

### **Step 1: Clone the Repository**

```powershell
# Open PowerShell or Command Prompt
# Navigate to your desired directory
cd C:\Projects  # or wherever you want to store the project

# Clone the repository
git clone https://github.com/ganne-sriram/Splitwise.git
cd Splitwise
```

### **Step 2: Backend Setup (FastAPI)**

```powershell
# Navigate to backend directory
cd splitwise-backend

# Verify Poetry installation
poetry --version

# Install Python dependencies
poetry install

# Create environment file
copy .env.example .env
# Edit .env file with your configuration (see Environment Configuration section below)

# Activate virtual environment (optional, for manual commands)
poetry shell
```

### **Step 3: Frontend Setup (Angular)**

```powershell
# Navigate to frontend directory (from project root)
cd ..\splitwise-frontend

# Verify Node.js and npm installation
node --version
npm --version

# Install Node.js dependencies
npm install

# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli
```

### **Step 4: Environment Configuration**

#### **Backend Configuration (.env file)**
Create or edit `splitwise-backend\.env`:

```env
# Database Configuration
DATABASE_URL=sqlite:///./splitwise.db

# Security Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production-windows
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
HOST=127.0.0.1
PORT=8000
```

#### **Frontend Configuration**
Edit `splitwise-frontend\src\environments\environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000'
};
```

---

## 🏃‍♂️ **Running the Application**

### **Option 1: Automated Startup (Recommended)**

```powershell
# From project root directory
npm run dev
```

This will start both backend and frontend servers simultaneously.

### **Option 2: Manual Startup**

#### **Start Backend Server**
```powershell
# Terminal 1: Backend
cd splitwise-backend
poetry run fastapi dev app/main.py
```

#### **Start Frontend Server**
```powershell
# Terminal 2: Frontend (new PowerShell window)
cd splitwise-frontend
npm start
```

### **Access the Application**
- **Frontend**: http://localhost:4200
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

---

## 🧪 **Testing the Application**

### **Complete User Flow Test**

1. **Registration**
   - Open http://localhost:4200
   - Click "Don't have an account? Sign up"
   - Fill in: Name, Email, Phone, Password
   - Click "Sign Up"

2. **Login**
   - Use your registration credentials
   - Click "Sign In"
   - Should redirect to dashboard

3. **Create a Group**
   - Click "View Groups" from dashboard
   - Click "Create Group"
   - Fill in group details (e.g., "Trip to NYC", "Weekend expenses")
   - Click "Create Group"

4. **Add Expenses**
   - Navigate to "Expenses" page
   - Click "Add Expense"
   - Fill in: Description, Amount, Category, Select Group
   - Click "Add Expense"
   - Verify expense appears in group expenses list

5. **Verify Dashboard**
   - Return to dashboard
   - Check balance summaries and recent expenses

---

## 🔧 **Development Commands**

### **Backend Commands**
```powershell
# Start development server
cd splitwise-backend
poetry run fastapi dev app/main.py

# Run with specific host/port
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Install new dependencies
poetry add package-name

# Update dependencies
poetry update

# Activate virtual environment
poetry shell

# Run Python scripts
poetry run python script.py
```

### **Frontend Commands**
```powershell
# Start development server
cd splitwise-frontend
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Install new dependencies
npm install package-name

# Update dependencies
npm update
```

### **Root Directory Commands**
```powershell
# Install all dependencies
npm run install:backend
npm run install:frontend

# Start both servers
npm run dev

# Build frontend
npm run build
```

---

## 🐛 **Windows-Specific Troubleshooting**

### **Common Issues & Solutions**

#### **1. PowerShell Execution Policy Error**
```powershell
# Error: "execution of scripts is disabled on this system"
# Solution: Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **2. Poetry Not Found**
```powershell
# Add Poetry to PATH manually
# Add this path to your system PATH:
# %APPDATA%\Python\Scripts

# Or reinstall Poetry
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

#### **3. Node.js/npm Issues**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### **4. Python Path Issues**
```powershell
# Check Python installation
python --version
python -m pip --version

# If multiple Python versions, use specific version
py -3.12 -m pip install poetry
```

#### **5. Port Already in Use**
```powershell
# Check what's using port 8000
netstat -ano | findstr :8000

# Kill process using port (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use different ports in configuration
```

#### **6. CORS Issues**
- Ensure backend is running on 127.0.0.1:8000
- Ensure frontend is running on localhost:4200
- Check that both servers are accessible

#### **7. Database Issues**
```powershell
# Delete SQLite database to reset
Remove-Item splitwise-backend\splitwise.db

# Restart backend server to recreate database
```

### **Windows-Specific File Path Issues**
```powershell
# Use forward slashes in configuration files
# Good: "sqlite:///./splitwise.db"
# Avoid: "sqlite:\\\.\\splitwise.db"

# Use proper Windows paths in scripts
# PowerShell: cd .\splitwise-backend
# Command Prompt: cd splitwise-backend
```

---

## 📁 **Project Structure**

```
Splitwise/
├── README.md                           # Main project documentation
├── WINDOWS_SETUP_GUIDE.md             # This guide
├── TROUBLESHOOTING.md                  # General troubleshooting
├── IMPLEMENTATION_SUMMARY.md           # Technical implementation details
├── setup.sh                           # Linux/Mac setup script
├── package.json                       # Root package.json with scripts
├── splitwise-backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── core/                      # Configuration and security
│   │   ├── database/                  # Database configuration
│   │   ├── models/                    # SQLAlchemy ORM models
│   │   ├── routers/                   # API route handlers
│   │   ├── schemas/                   # Pydantic validation schemas
│   │   └── main.py                    # FastAPI application entry
│   ├── .env                          # Environment variables
│   ├── pyproject.toml                 # Poetry dependencies
│   └── splitwise.db                   # SQLite database (auto-created)
└── splitwise-frontend/                # Angular TypeScript frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/            # Angular components
    │   │   ├── services/              # HTTP services
    │   │   ├── models/                # TypeScript interfaces
    │   │   ├── guards/                # Route protection
    │   │   └── interceptors/          # HTTP interceptors
    │   └── environments/              # Environment configurations
    ├── tailwind.config.js             # TailwindCSS configuration
    └── package.json                   # Node.js dependencies
```

---

## 🔒 **Security Configuration**

### **Environment Variables**
```env
# Backend (.env)
SECRET_KEY=generate-a-strong-secret-key-for-jwt-tokens
DATABASE_URL=sqlite:///./splitwise.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### **JWT Token Management**
- Tokens are automatically stored in browser localStorage
- Tokens expire after 30 minutes (configurable)
- Automatic token attachment to API requests via HTTP interceptor

### **Password Security**
- Passwords are hashed using bcrypt
- No plain text password storage
- Secure authentication flow

---

## 🚀 **Production Deployment**

### **Backend Deployment**
```powershell
# Build for production
cd splitwise-backend

# Set production environment variables
# DATABASE_URL=postgresql://user:password@localhost/splitwise_prod
# SECRET_KEY=your-production-secret-key

# Install production dependencies only
poetry install --only=main

# Run with production server
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### **Frontend Deployment**
```powershell
# Build for production
cd splitwise-frontend
npm run build

# Output will be in dist/ folder
# Deploy dist/ contents to your web server
```

---

## 📊 **API Documentation**

### **Available Endpoints**

#### **Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### **Users**
- `GET /users/me` - Get current user profile

#### **Groups**
- `GET /groups/` - Get user's groups
- `POST /groups/` - Create new group
- `GET /groups/{group_id}` - Get group details
- `POST /groups/{group_id}/members/{user_id}` - Add group member
- `DELETE /groups/{group_id}/members/{user_id}` - Remove group member

#### **Expenses**
- `POST /expenses/` - Create new expense
- `GET /expenses/group/{group_id}` - Get group expenses
- `GET /expenses/{expense_id}` - Get expense details
- `GET /expenses/user/balances` - Get user balance summary

#### **Settlements**
- `POST /settlements/` - Create settlement
- `GET /settlements/user` - Get user settlements

#### **Analytics**
- `GET /analytics/expenses/category` - Expense analytics by category

### **Interactive API Documentation**
Visit http://127.0.0.1:8000/docs when the backend is running for interactive API documentation with Swagger UI.

---

## 🎯 **Next Steps**

### **Immediate Actions**
1. **Install Prerequisites**: Follow the prerequisites section
2. **Clone Repository**: Get the code from GitHub
3. **Setup Environment**: Configure both backend and frontend
4. **Test Application**: Run through the complete user flow
5. **Explore Features**: Try creating groups, adding expenses, etc.

### **Development Workflow**
1. **Make Changes**: Edit code in your preferred editor
2. **Test Locally**: Both servers support hot reload
3. **Commit Changes**: Use Git for version control
4. **Deploy**: Follow production deployment steps when ready

### **Customization Options**
- **Styling**: Modify TailwindCSS classes in components
- **Features**: Add new API endpoints and frontend components
- **Database**: Switch to PostgreSQL for production
- **Authentication**: Extend user profile fields
- **Analytics**: Implement charts and advanced reporting

---

## 📞 **Support & Resources**

### **Documentation**
- **Main README**: `/README.md` - Complete project overview
- **Troubleshooting**: `/TROUBLESHOOTING.md` - Common issues and solutions
- **Implementation**: `/IMPLEMENTATION_SUMMARY.md` - Technical details

### **Useful Commands Reference**
```powershell
# Quick start (from project root)
npm run dev

# Backend only
cd splitwise-backend && poetry run fastapi dev app/main.py

# Frontend only
cd splitwise-frontend && npm start

# Reset everything
Remove-Item -Recurse -Force splitwise-backend\.venv
Remove-Item -Recurse -Force splitwise-frontend\node_modules
Remove-Item splitwise-backend\splitwise.db
```

### **VS Code Extensions (Recommended)**
- **Python** - Python language support
- **Angular Language Service** - Angular development
- **Tailwind CSS IntelliSense** - TailwindCSS autocomplete
- **REST Client** - API testing
- **GitLens** - Enhanced Git capabilities

---

## ✅ **Verification Checklist**

After setup, verify these work:

- [ ] Backend server starts without errors (http://127.0.0.1:8000)
- [ ] Frontend server starts without errors (http://localhost:4200)
- [ ] API documentation accessible (http://127.0.0.1:8000/docs)
- [ ] User registration works
- [ ] User login works and redirects to dashboard
- [ ] Group creation works
- [ ] Expense creation works
- [ ] Navigation between pages works
- [ ] No console errors in browser developer tools

---

## 🎉 **Congratulations!**

You now have a fully functional Splitwise-like expense sharing application running on your Windows machine! The application includes user authentication, group management, expense tracking, and a modern responsive UI.

**Happy coding! 🚀**

---

*Last updated: September 5, 2025*
*Version: 1.0.0*
*Platform: Windows 10/11*
