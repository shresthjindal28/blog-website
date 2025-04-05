import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';
import { HeartIcon, ChatBubbleLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: any[];
  createdAt: string;
}

const MyBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const data = await blogService.getMyBlogs();
        setBlogs(data);
      } catch (error) {
        toast.error('Failed to load your blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        toast.success('Blog deleted successfully');
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Blog Posts</h1>
        <Link
          to="/create-blog"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't written any blogs yet.</p>
          <Link
            to="/create-blog"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Link to={`/blogs/${blog._id}`} className="block flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                      {blog.title}
                    </h2>
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <HeartIcon className="h-5 w-5 mr-1" />
                      <span>{blog.likes.length}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                      <span>{blog.comments.length}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {blog.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs; 