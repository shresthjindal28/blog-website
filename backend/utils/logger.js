/**
 * Custom logging utility for consistent and secure logging
 */

// Sensitive fields that should be masked in logs
const SENSITIVE_FIELDS = [
  'password', 
  'token', 
  'secret', 
  'jwt', 
  'auth', 
  'cookie', 
  'session',
  'ssn', 
  'credit', 
  'card', 
  'social', 
  'security', 
  'access_token',
  'accessToken',
  'refresh_token',
  'refreshToken',
  'private',
  'authorization'
];

// Check if a string contains sensitive information
const containsSensitiveInfo = (key = '') => {
  const lowercasedKey = key.toLowerCase();
  return SENSITIVE_FIELDS.some(field => lowercasedKey.includes(field));
};

/**
 * Sanitize an object by masking sensitive data
 * @param {Object} obj - The object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (!obj) return obj;
  if (typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  // Handle objects
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (containsSensitiveInfo(key)) {
      sanitized[key] = value ? '[REDACTED]' : value;
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

const logger = {
  info: (message, data = {}) => {
    const sanitizedData = sanitizeObject(data);
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message,
        ...sanitizedData
      })
    );
  },
  
  error: (message, error = {}) => {
    const sanitizedError = sanitizeObject(error);
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message,
        error: sanitizedError,
        stack: error.stack || 'No stack trace'
      })
    );
  },
  
  warn: (message, data = {}) => {
    const sanitizedData = sanitizeObject(data);
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message,
        ...sanitizedData
      })
    );
  },
  
  debug: (message, data = {}) => {
    // Only log in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      const sanitizedData = sanitizeObject(data);
      console.debug(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'DEBUG',
          message,
          ...sanitizedData
        })
      );
    }
  },
  
  // Special method for request logging with sanitization
  request: (req) => {
    if (process.env.NODE_ENV === 'production') return; // Skip in production
    
    const sanitizedReq = {
      method: req.method,
      url: req.originalUrl || req.url,
      params: sanitizeObject(req.params),
      query: sanitizeObject(req.query),
      body: sanitizeObject(req.body),
      headers: sanitizeObject(req.headers)
    };
    
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'REQUEST',
        ...sanitizedReq
      })
    );
  }
};

module.exports = logger; 