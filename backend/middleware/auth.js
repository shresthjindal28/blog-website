const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    // Get user ID - handle both old and new token formats
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    // Find user and attach to request
    // Don't include sensitive fields
    const user = await User.findById(userId).select('-password -__v');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', { message: error.message });
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 