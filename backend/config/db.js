const mongoose = require('mongoose');
const redis = require('redis');
const logger = require('../utils/logger');
let redisClient;

// Initialize Redis if in production
const initRedis = async () => {
  if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
    try {
      redisClient = redis.createClient({
        url: process.env.REDIS_URL,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
        }
      });
      
      redisClient.on('error', (err) => logger.error('Redis Client Error', err));
      await redisClient.connect();
      logger.info('Redis connected');
      return redisClient;
    } catch (error) {
      logger.error('Redis connection failed:', error);
      // Continue without Redis
      return null;
    }
  }
  return null;
};

const connectDB = async () => {
  try {
    // Initialize Redis first
    await initRedis();
    
    // Connect to MongoDB with improved settings
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 50,  // Increased for scalability
      minPoolSize: 10,  // Increased for scalability
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 30000,
      w: 'majority',    // Write concern for data durability
      readPreference: 'secondaryPreferred'  // Load balancing reads
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Don't exit the process, let it retry
    setTimeout(connectDB, 5000);
  }
};

// Export both the database connection and redis client
module.exports = connectDB;
module.exports.getRedisClient = () => redisClient; 