# Troubleshooting Guide

## Common Setup Issues

### 1. Poetry Not Found
**Error**: `poetry: command not found`

**Solution**:
```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Add to PATH (add this to your ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.local/bin:$PATH"

# Reload your shell
source ~/.bashrc  # or source ~/.zshrc
```

### 2. Node.js Version Issues
**Error**: `Node.js version not supported`

**Solution**:
```bash
# Install Node.js v18+ using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 3. Python Version Issues
**Error**: `Python 3.12 not found`

**Solution**:
```bash
# Install Python 3.12 using pyenv
curl https://pyenv.run | bash
pyenv install 3.12.0
pyenv global 3.12.0
```

## Runtime Issues

### 1. Backend Won't Start
**Error**: `ModuleNotFoundError` or import errors

**Solutions**:
```bash
# Ensure you're in the virtual environment
cd splitwise-backend
poetry shell

# Reinstall dependencies
poetry install

# Check Python path
poetry run python -c "import sys; print(sys.path)"
```

### 2. Frontend Build Errors
**Error**: TailwindCSS or Angular build issues

**Solutions**:
```bash
cd splitwise-frontend

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TailwindCSS version
npm list tailwindcss

# Rebuild with verbose output
npm run build -- --verbose
```

### 3. Database Connection Issues
**Error**: `Database connection failed`

**Solutions**:
```bash
# Check .env file exists
ls -la splitwise-backend/.env

# Verify DATABASE_URL format
# For SQLite: sqlite:///./splitwise.db
# For PostgreSQL: postgresql://user:password@localhost/dbname

# Check database file permissions (SQLite)
ls -la splitwise-backend/splitwise.db
```

### 4. CORS Errors
**Error**: `Access to fetch at 'http://127.0.0.1:8000' from origin 'http://localhost:4200' has been blocked by CORS policy`

**Solutions**:
1. Verify backend CORS configuration in `app/main.py`
2. Check that frontend is making requests to the correct backend URL
3. Ensure both servers are running on expected ports

### 5. Authentication Issues
**Error**: `401 Unauthorized` or token-related errors

**Solutions**:
```bash
# Check SECRET_KEY in .env
cat splitwise-backend/.env | grep SECRET_KEY

# Verify JWT token format in browser developer tools
# Application > Local Storage > Check for 'token'

# Test authentication endpoint directly
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Development Issues

### 1. Hot Reload Not Working
**Frontend**:
```bash
# Restart with polling
ng serve --poll=2000
```

**Backend**:
```bash
# Use uvicorn directly with reload
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. TypeScript Errors
**Error**: Type-related compilation errors

**Solutions**:
```bash
cd splitwise-frontend

# Check TypeScript version
npx tsc --version

# Run type checking
npx tsc --noEmit

# Update Angular CLI
npm install -g @angular/cli@latest
```

### 3. Import/Export Issues
**Error**: Module import errors

**Solutions**:
1. Check file paths and extensions
2. Verify exports in index files
3. Ensure proper TypeScript configuration

## Performance Issues

### 1. Slow Backend Response
**Solutions**:
- Check database query performance
- Enable FastAPI debug mode
- Monitor database connections

### 2. Slow Frontend Loading
**Solutions**:
- Enable Angular production build
- Check bundle size with `npm run build -- --stats-json`
- Implement lazy loading for routes

## Testing Issues

### 1. Backend Tests Failing
```bash
cd splitwise-backend

# Install test dependencies
poetry install --with dev

# Run tests with verbose output
poetry run pytest -v

# Run specific test file
poetry run pytest tests/test_auth.py -v
```

### 2. Frontend Tests Failing
```bash
cd splitwise-frontend

# Run tests
npm test

# Run tests with coverage
npm run test -- --code-coverage

# Run e2e tests
npm run e2e
```

## Environment-Specific Issues

### 1. Windows-Specific Issues
- Use PowerShell or WSL2 for better compatibility
- Check file path separators (use forward slashes)
- Ensure proper line endings (LF vs CRLF)

### 2. macOS-Specific Issues
- Install Xcode command line tools: `xcode-select --install`
- Use Homebrew for package management
- Check Python installation with `which python3`

### 3. Linux-Specific Issues
- Install build essentials: `sudo apt-get install build-essential`
- Check Python development headers: `sudo apt-get install python3-dev`
- Verify Node.js installation: `sudo apt-get install nodejs npm`

## Getting Help

### 1. Check Logs
**Backend logs**:
```bash
# FastAPI logs are printed to console
# Check for error messages and stack traces
```

**Frontend logs**:
```bash
# Check browser developer console
# Network tab for API request/response details
```

### 2. Debug Mode
**Backend**:
```python
# Add to main.py for more detailed error messages
app = FastAPI(debug=True)
```

**Frontend**:
```bash
# Run in development mode with source maps
ng serve --source-map
```

### 3. Useful Commands
```bash
# Check all running processes
ps aux | grep -E "(fastapi|node|ng)"

# Check port usage
netstat -tulpn | grep -E "(8000|4200)"

# Check system resources
top
df -h
```

### 4. Reset Everything
If all else fails, start fresh:
```bash
# Backend
cd splitwise-backend
rm -rf .venv
poetry install

# Frontend
cd splitwise-frontend
rm -rf node_modules package-lock.json
npm install

# Database (if using SQLite)
rm splitwise-backend/splitwise.db
```

## Contact & Support

For additional help:
1. Check the main README.md for setup instructions
2. Review the API documentation at http://127.0.0.1:8000/docs
3. Check browser developer tools for client-side errors
4. Review server logs for backend issues
