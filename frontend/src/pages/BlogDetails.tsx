import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ChatBubbleLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import CommentItem from '../components/CommentItem';
import LikeButton from '../components/LikeButton';

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
    avatarUrl: string;
  };
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogById(id!);
        setBlog(data);
        // Check if current user has liked this blog
        setIsLiked(data.likes.some((likeId: string) => likeId === user?.id));
      } catch (error) {
        toast.error('Failed to load blog');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user?.id, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like posts');
      navigate('/login');
      return;
    }

    try {
      const updatedBlog = await blogService.likeBlog(id!);
      setBlog(updatedBlog);
      setIsLiked(updatedBlog.likes.some((likeId: string) => likeId === user?.id));
      
      if (isLiked) {
        toast.success('Like removed');
      } else {
        toast.success('Blog liked!');
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to comment');
      navigate('/login');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedBlog = await blogService.addComment(id!, comment);
      setBlog(updatedBlog);
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const updatedBlog = await blogService.deleteComment(id!, commentId);
      setBlog(updatedBlog);
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleDelete = async () => {
    if (!blog || blog.author._id !== user?.id) return;

    try {
      await blogService.deleteBlog(id!);
      toast.success('Blog deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
          {user?.id === blog.author._id && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/edit-blog/${id}`)}
                className="text-gray-600 hover:text-blue-600"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button onClick={handleDelete} className="text-gray-600 hover:text-red-600">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-6">
          <span>By {blog.author.username}</span>
          <span className="mx-2">•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4 mb-8 border-t pt-4">
          <LikeButton 
            isLiked={isLiked}
            likeCount={blog.likes.length}
            onLike={handleLike}
            size="lg"
          />
          <div className="flex items-center space-x-1 text-gray-500">
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span>{blog.comments.length}</span>
          </div>
        </div>

        {user && (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {comment.length}/500 characters
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSubmitting || !comment.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {blog.comments.length > 0 
              ? `Comments (${blog.comments.length})` 
              : 'No comments yet. Be the first to comment!'}
          </h3>
          
          {blog.comments.length > 0 ? (
            <div className="space-y-3">
              {blog.comments.map((comment) => (
                <CommentItem 
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  canDelete={
                    !!user && (user.id === comment.user._id || user.id === blog.author._id)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {!user ? (
                <p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-blue-500 hover:underline"
                  >
                    Log in
                  </button> to leave a comment
                </p>
              ) : null}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetails; 