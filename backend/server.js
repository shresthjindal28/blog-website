const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { sanitizeInput, securityHeaders, payloadSizeLimit } = require('./middleware/security');
const logger = require('./utils/logger');

// Clustering for scalability
const numCPUs = os.cpus().length;

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  logger.info(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    // Replace the dead worker
    cluster.fork();
  });
} else {
  const app = express();

  // Connect to database
  connectDB();

  // Security middleware
  app.use(helmet());
  app.use(securityHeaders);
  
  // Compression for better performance
  app.use(compression());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later'
  });
  app.use('/api/', limiter);

  // Apply more restrictive rate limiting to authentication routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 login attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts, please try again later'
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(payloadSizeLimit);
  
  // Input sanitization
  app.use(sanitizeInput);
  
  // Request logging in development
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      logger.request(req);
      next();
    });
  }

  // Route handling
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/blogs', require('./routes/blogs'));
  app.use('/api/users', require('./routes/users'));

  // Simple test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    res.status(200).json({
      status: 'ok',
      server: 'running',
      pid: process.pid,
      database: dbStatus === 1 ? 'connected' : 'disconnected'
    });
  });

  // 404 handler
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'Resource not found'
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error('Server error', { error: err.message, path: req.path });
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', err);
    // Don't exit the process, let it continue running
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', err);
    
    // Give the server a grace period to finish existing requests
    // then shut down
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}, worker: ${process.pid}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error('Port in use', { port: PORT, error: error.message });
      process.exit(1);
    }
    throw error;
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('HTTP server closed');
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
} 