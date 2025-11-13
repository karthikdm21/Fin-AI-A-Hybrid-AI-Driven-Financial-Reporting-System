# FinAI Backend Server

Node.js backend server that acts as a bridge between the ML service and frontend.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration
Create a `.env` file in the server directory:
```bash
PORT=3001
ML_SERVICE_URL=http://localhost:5000
NODE_ENV=development
```

### 3. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Checks
- `GET /api/health` - Backend server health
- `GET /api/ml-health` - ML service health check

### Data Endpoints
- `GET /api/companies` - List all companies
- `GET /api/company/:ticker` - Get specific company details
- `GET /api/anomalies` - Get anomaly detection results
- `GET /api/summary` - Get overall summary statistics

## Architecture

The backend server:
1. **Proxies API requests** to the ML service (Python Flask)
2. **Serves the frontend** (React app) from the dist folder
3. **Handles CORS** and security headers
4. **Provides error handling** and logging

## Dependencies

- **Express.js** - Web framework
- **Axios** - HTTP client for ML service communication
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logging
- **Dotenv** - Environment variable management

## Port Configuration

- **Backend Server**: 3001 (configurable via PORT env var)
- **ML Service**: 5000 (configurable via ML_SERVICE_URL env var)
- **Frontend**: Served from backend server at port 3001
