import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout for requests
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}: Success`);
    return response;
  },
  error => {
    if (error.response) {
      // Server responded with an error status code
      console.error(`Error ${error.response.status} from ${error.config?.url}: ${error.response.data.message || 'Unknown error'}`);
      
      // Handle 401 unauthorized errors (expired token)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error(`No response received for request to: ${error.config?.url}`);
    } else {
      // Something else caused the error
      console.error(`Error setting up request: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (data: { username?: string; avatarUrl?: string; email?: string; phoneNumber?: string }) => {
    const response = await api.put('/auth/update-profile', data);
    return response.data;
  },
  updateSettings: async (data: { darkMode?: boolean; emailNotifications?: boolean; language?: string }) => {
    const response = await api.put('/auth/update-settings', data);
    return response.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

export const blogService = {
  getAllBlogs: async () => {
    try {
      const response = await api.get('/blogs');
      return response.data;
    } catch (error) {
      console.error('Error fetching all blogs:', error);
      return [];
    }
  },
  getMyBlogs: async () => {
    try {
      const response = await api.get('/blogs/my-blogs');
      return response.data;
    } catch (error) {
      console.error('Error fetching my blogs:', error);
      return [];
    }
  },
  getBlogById: async (id: string) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog with ID ${id}:`, error);
      throw error;
    }
  },
  createBlog: async (blogData: { title: string; content: string; tags: string[] }) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },
  updateBlog: async (id: string, blogData: { title: string; content: string; tags: string[] }) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },
  deleteBlog: async (id: string) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
  likeBlog: async (id: string) => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },
  addComment: async (id: string, text: string) => {
    const response = await api.post(`/blogs/${id}/comments`, { text });
    return response.data;
  },
  deleteComment: async (blogId: string, commentId: string) => {
    const response = await api.delete(`/blogs/${blogId}/comments/${commentId}`);
    return response.data;
  },
};

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response) {
    // The server responded with an error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // The request was made but no response was received
    return 'Could not connect to the server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request
    return error.message || 'An unexpected error occurred';
  }
};

export default api; 