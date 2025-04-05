const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please provide a valid email'
    ],
    index: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        // Allow empty string or valid phone format
        return v === '' || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  avatarUrl: {
    type: String,
    default: 'avatar1.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'ja'],
      default: 'en'
    }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Add this to avoid returning the version key in queries
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true, versionKey: false }
});

// Create index for frequently queried fields
UserSchema.index({ createdAt: -1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt with cost factor 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Update passwordChangedAt if password is changed (but not on new user)
    if (this.isModified('password') && !this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // -1s to ensure token is created after password change
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Method to generate JWT
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// Method to check if password was changed after token was issued
UserSchema.methods.passwordChangedAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema); 