import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/api';
import { toast } from 'react-toastify';

interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
}

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogById(id!);
        setBlog(data);
      } catch (error) {
        toast.error('Failed to load blog');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setSaving(true);
    try {
      await blogService.updateBlog(id!, {
        title: blog.title,
        content: blog.content,
        tags: blog.tags,
      });
      toast.success('Blog updated successfully');
      navigate(`/blogs/${id}`);
    } catch (error) {
      toast.error('Failed to update blog');
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={blog.tags.join(', ')}
            onChange={(e) =>
              setBlog({
                ...blog,
                tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., technology, programming, web"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/blogs/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog; 