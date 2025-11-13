const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ML Service configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mlServiceUrl: ML_SERVICE_URL
  });
});

// Proxy endpoints to ML service
app.get('/api/companies', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/companies`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    res.status(500).json({
      error: 'Failed to fetch companies',
      details: error.message
    });
  }
});

app.get('/api/company/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const response = await axios.get(`${ML_SERVICE_URL}/api/company/${ticker}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching company ${req.params.ticker}:`, error.message);
    if (error.response?.status === 404) {
      res.status(404).json({
        error: 'Company not found',
        details: error.message
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch company details',
        details: error.message
      });
    }
  }
});

app.get('/api/anomalies', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/anomalies`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching anomalies:', error.message);
    res.status(500).json({
      error: 'Failed to fetch anomalies',
      details: error.message
    });
  }
});

app.get('/api/summary', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/summary`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching summary:', error.message);
    res.status(500).json({
      error: 'Failed to fetch summary',
      details: error.message
    });
  }
});

app.get('/api/company/:ticker/summary', async (req, res) => {
  try {
    const { ticker } = req.params;
    const response = await axios.get(`${ML_SERVICE_URL}/api/company/${ticker}/summary`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error proxying company summary request for ${req.params.ticker}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch company summary data' });
  }
});

// ML Service health check
app.get('/api/ml-health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    res.json(response.data);
  } catch (error) {
    console.error('ML Service health check failed:', error.message);
    res.status(503).json({
      status: 'unhealthy',
      mlService: 'down',
      error: error.message
    });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FinAI Backend Server running on port ${PORT}`);
  console.log(`📊 ML Service URL: ${ML_SERVICE_URL}`);
  console.log(`🌐 Frontend will be served from: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
