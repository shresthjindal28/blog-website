/**
 * Collection of security middleware functions
 */

const sanitizeInput = (req, res, next) => {
  // Function to recursively sanitize an object
  const sanitizeObject = (obj) => {
    if (!obj) return obj;
    
    Object.keys(obj).forEach(key => {
      // Skip files or buffers
      if (Buffer.isBuffer(obj[key]) || 
          (obj[key] && typeof obj[key] === 'object' && obj[key].buffer instanceof ArrayBuffer)) {
        return;
      }
      
      if (typeof obj[key] === 'string') {
        // Basic XSS sanitization - Convert HTML entities
        obj[key] = obj[key]
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      } else if (obj[key] && typeof obj[key] === 'object') {
        // Recursively sanitize nested objects
        sanitizeObject(obj[key]);
      }
    });
    
    return obj;
  };
  
  // Sanitize request body, query, and params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  
  next();
};

// Add security headers
const securityHeaders = (req, res, next) => {
  // Prevent browsers from detecting the MIME type
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking by disabling iframe embedding
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict transport security: use HTTPS only
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'none';"
  );
  
  // No caching for API responses by default
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
};

// Limiting payload size to prevent DoS attacks
const payloadSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'], 10);
  
  // Limit to 1MB (can be adjusted)
  if (contentLength && contentLength > 1048576) {
    return res.status(413).json({
      message: 'Payload too large'
    });
  }
  
  next();
};

module.exports = {
  sanitizeInput,
  securityHeaders,
  payloadSizeLimit
}; 