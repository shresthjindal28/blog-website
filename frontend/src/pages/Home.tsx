import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { blogService, handleApiError } from '../services/api';
import { useTranslation } from '../utils/i18n';
import { useTheme } from '../context/ThemeContext';
import { HeartIcon, ChatBubbleLeftIcon, CalendarIcon, UserCircleIcon, MagnifyingGlassIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import HoverCard from '../components/HoverCard';
import { toast } from 'react-toastify';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  tags: string[];
  likes: string[];
  comments: any[];
  createdAt: string;
  coverImage?: string;
}

const Home = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlog, setFeaturedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching all blogs...');
        const data = await blogService.getAllBlogs();
        
        console.log('Blogs data received:', data);
        
        if (!data || data.length === 0) {
          console.log('No blogs found');
          setBlogs([]);
          setFeaturedBlog(null);
          setAllTags([]);
          return;
        }
        
        setBlogs(data);
        
        // Set featured blog (most liked or most recent)
        if (data.length > 0) {
          const sortedByLikes = [...data].sort((a, b) => b.likes.length - a.likes.length);
          setFeaturedBlog(sortedByLikes[0]);
        }
        
        // Extract all unique tags
        const tags = data.flatMap((blog: Blog) => blog.tags);
        setAllTags([...new Set(tags)] as string[]);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again later.');
        toast.error('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(document.documentElement.lang || 'en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || blog.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-4">
        <ExclamationCircleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('home.errorTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('home.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Parallax Effect */}
      <div 
        ref={heroRef}
        className="relative rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl"
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            transform: `translateY(${scrollY * 0.03}px)` 
          }}
        ></div>
        
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"
          style={{ 
            transform: `translateY(${scrollY * 0.05}px)` 
          }}
        ></div>
        
        {/* Floating shapes for visual interest */}
        <div
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/10"
          style={{ 
            transform: `translate(${scrollY * 0.1}px, ${scrollY * -0.05}px)`, 
            transition: 'transform 0.1s ease-out' 
          }}
        ></div>
        
        <div
          className="absolute bottom-20 left-[10%] w-24 h-24 rounded-full bg-purple-500/20"
          style={{ 
            transform: `translate(${scrollY * -0.08}px, ${scrollY * 0.04}px)`, 
            transition: 'transform 0.1s ease-out' 
          }}
        ></div>
        
        <div
          className="absolute top-1/3 left-[30%] w-16 h-16 rounded-full bg-blue-300/20"
          style={{ 
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.1}px)`, 
            transition: 'transform 0.1s ease-out' 
          }}
        ></div>
        
        <div className="relative z-20 p-8 md:p-12 flex flex-col h-full text-white">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ 
              transform: `translateY(${scrollY * -0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {t('home.welcome')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">BlogApp</span>
          </h1>
          <p 
            className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl"
            style={{ 
              transform: `translateY(${scrollY * -0.05}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {t('home.tagline')}
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 mt-auto"
            style={{ 
              transform: `translateY(${scrollY * -0.02}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-gray-100 transition-colors text-center"
            >
              {t('home.getStarted')}
            </Link>
            <Link
              to="/blogs"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/40 font-medium rounded-md hover:bg-white/30 transition-colors text-center"
            >
              {t('home.exploreBlogs')}
            </Link>
          </div>
        </div>
        <div className="h-72 md:h-96"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        
        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${!selectedTag 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            {t('home.allPosts')}
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${tag === selectedTag 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Blog */}
      {featuredBlog && !selectedTag && searchTerm === '' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('home.featured')}
          </h2>
          <HoverCard 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            delay={100}
          >
            <div className="md:flex">
              <div className="md:shrink-0 bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center w-full md:w-48 h-48">
                {featuredBlog.coverImage ? (
                  <img 
                    src={featuredBlog.coverImage} 
                    alt={featuredBlog.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 text-white/40">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col">
                <Link to={`/blogs/${featuredBlog._id}`} className="block">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400">
                    {featuredBlog.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {truncateText(featuredBlog.content, 250)}
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3 flex items-center justify-center">
                    {featuredBlog.author.avatarUrl ? (
                      <img src={featuredBlog.author.avatarUrl} alt={featuredBlog.author.username} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-full h-full text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{featuredBlog.author.username}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(featuredBlog.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <HeartIconSolid className="h-5 w-5 mr-1 text-red-500" />
                      <span>{featuredBlog.likes.length}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                      <span>{featuredBlog.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HoverCard>
        </div>
      )}

      {/* Blog Grid */}
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {selectedTag 
          ? `${t('home.postsTagged')} "${selectedTag}"`
          : searchTerm 
            ? `${t('home.searchResults')} "${searchTerm}"`
            : t('home.latestPosts')
        }
      </h2>

      {filteredBlogs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {t('home.noPostsFound')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog, index) => (
            <HoverCard
              key={blog._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              delay={100 * index}
            >
              <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                {blog.coverImage ? (
                  <img 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-white/40">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <Link to={`/blogs/${blog._id}`} className="block">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {truncateText(blog.content, 150)}
                </p>
                
                {blog.tags.length > 0 && (
                  <div className="mt-2 mb-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <UserCircleIcon className="h-4 w-4 mr-1" />
                    {blog.author.username}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{blog.likes.length}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{blog.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 