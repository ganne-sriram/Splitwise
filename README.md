# Splitwise - Expense Sharing Application

A modular expense sharing web application built with Angular (frontend) and FastAPI (backend), similar to Splitwise.

## 🏗️ Architecture Overview

### Backend (FastAPI + Python)
- **Framework**: FastAPI with Python 3.12
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: SQLAlchemy
- **Authentication**: JWT-based authentication
- **API Documentation**: Auto-generated with Swagger/OpenAPI

### Frontend (Angular + TypeScript)
- **Framework**: Angular 18+ with standalone components
- **Language**: TypeScript
- **Styling**: TailwindCSS v3.4.0
- **Architecture**: Service-based with dependency injection
- **Routing**: Protected routes with authentication guards

## 📋 Complete Implementation Summary

### Phase 1: Backend Development (FastAPI)

#### 1.1 Project Setup
- Created `splitwise-backend` directory
- Initialized Poetry project with Python dependencies
- Set up project structure with modular architecture

#### 1.2 Core Configuration
- **Environment Configuration** (`app/core/config.py`)
  - Database URL configuration
  - JWT secret key management
  - CORS settings
- **Environment Variables** (`.env`)
  - Database connection strings
  - Secret keys and tokens

#### 1.3 Database Models (`app/models/`)
- **User Model** (`user.py`): User authentication and profile data
- **Group Model** (`group.py`): Expense sharing groups
- **Expense Model** (`expense.py`): Individual expenses with participants
- **Settlement Model** (`settlement.py`): Balance settlements between users
- **Database Setup** (`app/database/database.py`): SQLAlchemy configuration

#### 1.4 Pydantic Schemas (`app/schemas/`)
- **User Schemas**: Registration, login, profile management
- **Group Schemas**: Group creation, member management
- **Expense Schemas**: Expense creation with participant splitting
- **Settlement Schemas**: Settlement tracking and recording

#### 1.5 Security & Authentication (`app/core/`)
- **Security Utils** (`security.py`): Password hashing, JWT token generation
- **Dependencies** (`dependencies.py`): Authentication middleware, user verification

#### 1.6 API Routers (`app/routers/`)
- **Authentication Router** (`auth.py`): Login, registration, token management
- **Users Router** (`users.py`): User profile management
- **Groups Router** (`groups.py`): Group CRUD operations, member management
- **Expenses Router** (`expenses.py`): Expense tracking, splitting logic
- **Settlements Router** (`settlements.py`): Balance settlement operations
- **Analytics Router** (`analytics.py`): Expense analytics and reporting

#### 1.7 Main Application (`app/main.py`)
- FastAPI app initialization
- Router registration
- CORS middleware configuration
- Database table creation

### Phase 2: Frontend Development (Angular)

#### 2.1 Project Setup
- Created Angular 18 application with `ng new`
- Configured standalone components architecture
- Set up TailwindCSS v3.4.0 with PostCSS

#### 2.2 Environment Configuration
- **Development Environment** (`src/environments/environment.ts`)
- **Production Environment** (`src/environments/environment.prod.ts`)
- API URL configuration for backend communication

#### 2.3 TypeScript Models (`src/app/models/`)
- **User Models** (`user.model.ts`): User interfaces, login/registration types
- **Group Models** (`group.model.ts`): Group data structures
- **Expense Models** (`expense.model.ts`): Expense types with categories
- **Settlement Models** (`settlement.model.ts`): Settlement tracking interfaces

#### 2.4 Services (`src/app/services/`)
- **Authentication Service** (`auth.service.ts`): Login, registration, token management
- **Group Service** (`group.service.ts`): Group CRUD operations
- **Expense Service** (`expense.service.ts`): Expense management
- **Settlement Service** (`settlement.service.ts`): Settlement operations
- **Analytics Service** (`analytics.service.ts`): Data analytics and charts

#### 2.5 Security & Guards
- **Auth Interceptor** (`src/app/interceptors/auth.interceptor.ts`): Automatic JWT token attachment
- **Auth Guard** (`src/app/guards/auth.guard.ts`): Route protection for authenticated users

#### 2.6 Components (`src/app/components/`)
- **Login Component** (`auth/login.component.ts`): User authentication
- **Register Component** (`auth/register.component.ts`): User registration
- **Dashboard Component** (`dashboard/dashboard.component.ts`): Main dashboard with balance summaries
- **Groups Component** (`groups/groups.component.ts`): Group management interface
- **Expenses Component** (`expenses/expenses.component.ts`): Expense tracking and creation

#### 2.7 Routing & Navigation
- **App Routes** (`src/app/app.routes.ts`): Protected routing configuration
- **App Config** (`src/app/app.config.ts`): HTTP client and interceptor setup

### Phase 3: Integration & Testing

#### 3.1 Frontend-Backend Integration
- CORS configuration for cross-origin requests
- HTTP client setup with automatic authentication
- Error handling and user feedback

#### 3.2 Authentication Flow Testing
- User registration functionality
- Login with JWT token generation
- Protected route access verification
- Dashboard data loading

#### 3.3 Bug Fixes & Improvements
- Fixed RouterModule import issue in login component
- Resolved TailwindCSS configuration conflicts
- Updated PostCSS configuration for proper styling

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.12 or higher)
- **Poetry** (Python package manager)
- **Git**

### Backend Setup (FastAPI)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Splitwise/splitwise-backend
   ```

2. **Install Python dependencies**
   ```bash
   # Install Poetry if not already installed
   curl -sSL https://install.python-poetry.org | python3 -

   # Install project dependencies
   poetry install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env file with your configuration
   nano .env
   ```

   **Required Environment Variables:**
   ```env
   DATABASE_URL=sqlite:///./splitwise.db
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Start the backend server**
   ```bash
   poetry run fastapi dev app/main.py
   ```

   The backend will be available at: `http://127.0.0.1:8000`
   API Documentation: `http://127.0.0.1:8000/docs`

### Frontend Setup (Angular)

1. **Navigate to frontend directory**
   ```bash
   cd ../splitwise-frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install TailwindCSS (if not already installed)**
   ```bash
   npm install -D tailwindcss@3.4.0 postcss autoprefixer
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The frontend will be available at: `http://localhost:4200`

### Database Setup

#### For Development (SQLite)
The application will automatically create a SQLite database file (`splitwise.db`) in the backend directory on first run.

#### For Production (PostgreSQL)
1. **Install PostgreSQL**
2. **Create database**
   ```sql
   CREATE DATABASE splitwise;
   CREATE USER splitwise_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE splitwise TO splitwise_user;
   ```
3. **Update .env file**
   ```env
   DATABASE_URL=postgresql://splitwise_user:your_password@localhost/splitwise
   ```

## 🧪 Testing the Application

### 1. Access the Application
- Open your browser and navigate to `http://localhost:4200`
- You should see the Splitwise login page

### 2. Create an Account
- Click "Don't have an account? Sign up"
- Fill in the registration form:
  - Full Name: Your Name
  - Email: your.email@example.com
  - Phone Number: (optional)
  - Password: your_password
- Click "Create account"

### 3. Login
- Use your email and password to log in
- You should be redirected to the dashboard

### 4. Test Core Features
- **Dashboard**: View balance summaries and quick actions
- **Groups**: Create and manage expense groups
- **Expenses**: Add expenses and split them among group members
- **Settlements**: Track and settle balances

## 🔧 Development Commands

### Backend Commands
```bash
# Start development server
poetry run fastapi dev app/main.py

# Run with auto-reload
poetry run uvicorn app.main:app --reload

# Access interactive API docs
# Visit: http://127.0.0.1:8000/docs
```

### Frontend Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm test
```

## 📁 Project Structure

```
Splitwise/
├── splitwise-backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── core/              # Configuration, security, dependencies
│   │   ├── database/          # Database configuration
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── routers/           # API route handlers
│   │   ├── schemas/           # Pydantic data validation schemas
│   │   └── main.py            # FastAPI application entry point
│   ├── .env                   # Environment variables
│   └── pyproject.toml         # Python dependencies
└── splitwise-frontend/        # Angular TypeScript frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Angular standalone components
    │   │   ├── services/      # HTTP services for API communication
    │   │   ├── models/        # TypeScript interfaces
    │   │   ├── guards/        # Route protection
    │   │   ├── interceptors/  # HTTP interceptors
    │   │   └── app.routes.ts  # Routing configuration
    │   └── environments/      # Environment configurations
    ├── tailwind.config.js     # TailwindCSS configuration
    ├── postcss.config.js      # PostCSS configuration
    └── package.json           # Node.js dependencies
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: Frontend route guards for authenticated access
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Comprehensive data validation with Pydantic

## 🚀 Production Deployment

### Backend Deployment
- Use `fastapi run` instead of `fastapi dev`
- Set up PostgreSQL database
- Configure environment variables for production
- Use a reverse proxy (nginx) for serving

### Frontend Deployment
- Build with `npm run build`
- Serve static files with nginx or similar
- Update API URLs in environment.prod.ts

## 🐛 Troubleshooting

### Common Issues

1. **"Don't have an account? Sign up" link not working**
   - **Solution**: Ensure RouterModule is imported in login component

2. **TailwindCSS styles not loading**
   - **Solution**: Check PostCSS configuration and TailwindCSS version compatibility

3. **CORS errors**
   - **Solution**: Verify CORS configuration in FastAPI main.py

4. **Database connection errors**
   - **Solution**: Check DATABASE_URL in .env file

5. **JWT token issues**
   - **Solution**: Verify SECRET_KEY in .env and token expiration settings

### Getting Help
- Check browser console for JavaScript errors
- Review FastAPI logs for backend issues
- Verify all environment variables are set correctly
- Ensure both servers are running on correct ports

## 📝 API Documentation

When the backend is running, visit `http://127.0.0.1:8000/docs` for interactive API documentation with Swagger UI.

### Key Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/me` - Get current user profile
- `POST /groups` - Create expense group
- `POST /expenses` - Add new expense
- `GET /analytics/expenses` - Get expense analytics

## 🎯 Next Steps

1. **Enhanced Features**
   - Real-time notifications
   - Mobile app development
   - Advanced analytics and charts
   - Email notifications for settlements

2. **Performance Optimization**
   - Database query optimization
   - Frontend lazy loading
   - Caching strategies

3. **Testing**
   - Unit tests for backend services
   - Frontend component testing
   - End-to-end testing with Cypress

4. **DevOps**
   - Docker containerization
   - CI/CD pipeline setup
   - Automated deployment
