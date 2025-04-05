const { getRedisClient } = require('../config/db');

/**
 * Middleware for caching responses
 * @param {Number} duration - Cache duration in seconds
 */
const cache = (duration = 60) => {
  return async (req, res, next) => {
    // Skip caching for non-GET methods or authenticated requests
    if (req.method !== 'GET' || req.header('Authorization')) {
      return next();
    }

    const redisClient = getRedisClient();
    if (!redisClient || !redisClient.isReady) {
      return next(); // Skip caching if Redis is not available
    }

    // Create a unique key based on the request URL
    const key = `cache:${req.originalUrl || req.url}`;

    try {
      // Try to get cached response
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        // Return cached response
        const parsedResponse = JSON.parse(cachedResponse);
        return res.status(200).json(parsedResponse);
      }

      // If no cache, intercept the response to store it
      const originalSend = res.send;
      res.send = function(body) {
        // Only cache successful responses
        if (res.statusCode === 200) {
          // Don't try/catch as we don't want to block the response
          // if caching fails
          redisClient.set(key, body, { EX: duration })
            .catch(err => console.error('Redis cache error:', err));
        }
        originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Continue without caching
    }
  };
};

module.exports = cache; 