const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');
const User = require('../models/User');

// @route   GET /api/blogs/test
// @desc    Test blogs API endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Blogs API is working!',
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/blogs
// @desc    Get all blogs
router.get('/', async (req, res) => {
  try {
    // Find all blogs, populate the author field with useful info, and sort by newest first
    const blogs = await Blog.find()
      .populate('author', 'username email avatarUrl')
      .populate('comments.user', 'username avatarUrl')
      .sort({ createdAt: -1 });
      
    // Add proper error handling if no blogs exist
    if (!blogs || blogs.length === 0) {
      return res.status(200).json([]);
    }
    
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/my-blogs
// @desc    Get all blogs for the authenticated user
router.get('/my-blogs', auth, async (req, res) => {
  try {
    // Find blogs by author ID and populate author details
    const blogs = await Blog.find({ author: req.user.userId })
      .populate('author', 'username email avatarUrl') // Populate author details
      .populate('comments.user', 'username avatarUrl') // Populate comment user details
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('title content tags likes comments createdAt updatedAt'); // Select specific fields

    if (!blogs) {
      return res.status(404).json({ message: 'No blogs found for this user' });
    }

    res.json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs. Please try again.' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get blog by ID or slug
router.get('/:id', async (req, res) => {
  try {
    let blog;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(req.params.id)
        .populate('author', 'username email avatarUrl')
        .populate('comments.user', 'username avatarUrl');
    } else {
      blog = await Blog.findOne({ slug: req.params.id })
        .populate('author', 'username email avatarUrl')
        .populate('comments.user', 'username avatarUrl');
    }
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const blog = new Blog({
      title,
      content,
      tags,
      author: req.user.userId
    });

    await blog.save();
    
    // Populate author info before sending back
    const populatedBlog = await Blog.findById(blog._id).populate('author', 'username email avatarUrl');
    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user has already liked the blog
    const likeIndex = blog.likes.findIndex(id => id.toString() === req.user.userId);
    
    if (likeIndex === -1) {
      // If not liked, add the like
      blog.likes.push(req.user.userId);
    } else {
      // If already liked, remove the like
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();
    
    // Return populated blog
    const populatedBlog = await Blog.findById(req.params.id)
      .populate('author', 'username email avatarUrl')
      .populate('comments.user', 'username avatarUrl');
      
    res.json(populatedBlog);
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ message: 'Error updating like', error: error.message });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Add the comment
    blog.comments.push({
      user: req.user.userId,
      text: text.trim(),
      createdAt: new Date()
    });

    await blog.save();
    
    // Return populated blog
    const populatedBlog = await Blog.findById(req.params.id)
      .populate('author', 'username email avatarUrl')
      .populate('comments.user', 'username avatarUrl');
      
    res.json(populatedBlog);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// New route: Delete a comment
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Find the comment
    const comment = blog.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if the user is the comment author or blog author
    if (comment.user.toString() !== req.user.userId && 
        blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Remove the comment
    comment.deleteOne();
    await blog.save();
    
    // Return populated blog
    const populatedBlog = await Blog.findById(req.params.id)
      .populate('author', 'username email avatarUrl')
      .populate('comments.user', 'username avatarUrl');
      
    res.json(populatedBlog);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

module.exports = router; 