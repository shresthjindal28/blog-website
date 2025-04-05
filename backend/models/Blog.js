const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    maxlength: [50000, 'Content cannot exceed 50,000 characters']
  },
  summary: {
    type: String,
    maxlength: [200, 'Summary cannot exceed 200 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featuredImage: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  meta: {
    description: String,
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true, versionKey: false }
});

// Create indexes for performance
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ 'comments.user': 1 });

// Create text index for search functionality
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Generate slug before saving
blogSchema.pre('save', function(next) {
  // Only update slug if title was changed (or is new)
  if (this.isModified('title')) {
    // Generate slug from title
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Ensure uniqueness by appending timestamp if needed
    if (!this.isNew) {
      this.slug = `${this.slug}-${Date.now().toString().slice(-4)}`;
    }
  }
  
  // Update summary if content was changed
  if (this.isModified('content') && !this.summary) {
    // Create summary from content
    this.summary = this.content
      .replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
      .slice(0, 197) + '...';
  }
  
  // Always update the updatedAt field
  this.updatedAt = Date.now();
  next();
});

// Static method to get popular posts
blogSchema.statics.getPopularPosts = function(limit = 5) {
  return this.find({ status: 'published' })
    .sort({ viewCount: -1, likes: -1 })
    .limit(limit)
    .populate('author', 'username avatarUrl');
};

// Virtual field for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual field for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Method to check if a user has liked this blog
blogSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(id => id.toString() === userId.toString());
};

module.exports = mongoose.model('Blog', blogSchema); 