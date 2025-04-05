import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { register } = useAuth();
  const { darkMode } = useTheme();

  // Trigger animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(username, email, password);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[30%] w-[80%] h-[80%] rounded-full opacity-30 blur-3xl bg-gradient-to-r from-blue-500 to-teal-400 animate-pulse-slow"></div>
        <div className="absolute -bottom-[30%] -left-[30%] w-[75%] h-[75%] rounded-full opacity-30 blur-3xl bg-gradient-to-r from-purple-600 to-pink-500 animate-pulse-slower"></div>
      </div>
      
      <div 
        className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${darkMode ? 'bg-gray-800/70 shadow-gray-900/30' : 'bg-white/80 shadow-gray-200/50'}`}
      >
        <div className="text-center">
          <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-1 transition-colors animate-gradient`}>
            BlogApp
          </h1>
          <h2 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create your account
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join our community of writers and readers
          </p>
        </div>
        
        <form 
          className={`mt-8 space-y-6 transition-all duration-300 ${isSubmitting ? 'opacity-60' : 'opacity-100'}`}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="relative group">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 peer ${username ? 'pt-6 pb-2' : ''} ${darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'}`}
                placeholder=" "
              />
              <label 
                htmlFor="username" 
                className={`absolute left-4 transition-all duration-200 ${username ? 'text-xs top-2' : 'text-base top-1/2 -translate-y-1/2'} peer-focus:text-xs peer-focus:top-2 ${darkMode 
                  ? 'text-gray-400 peer-focus:text-blue-400' 
                  : 'text-gray-500 peer-focus:text-blue-600'}`}
              >
                Username
              </label>
            </div>
            
            <div className="relative group">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 peer ${email ? 'pt-6 pb-2' : ''} ${darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'}`}
                placeholder=" "
              />
              <label 
                htmlFor="email" 
                className={`absolute left-4 transition-all duration-200 ${email ? 'text-xs top-2' : 'text-base top-1/2 -translate-y-1/2'} peer-focus:text-xs peer-focus:top-2 ${darkMode 
                  ? 'text-gray-400 peer-focus:text-blue-400' 
                  : 'text-gray-500 peer-focus:text-blue-600'}`}
              >
                Email address
              </label>
            </div>
            
            <div className="relative group">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 peer ${password ? 'pt-6 pb-2' : ''} ${darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'}`}
                placeholder=" "
              />
              <label 
                htmlFor="password" 
                className={`absolute left-4 transition-all duration-200 ${password ? 'text-xs top-2' : 'text-base top-1/2 -translate-y-1/2'} peer-focus:text-xs peer-focus:top-2 ${darkMode 
                  ? 'text-gray-400 peer-focus:text-blue-400' 
                  : 'text-gray-500 peer-focus:text-blue-600'}`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="relative group">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 peer ${confirmPassword ? 'pt-6 pb-2' : ''} ${darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'} ${password && confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder=" "
              />
              <label 
                htmlFor="confirmPassword" 
                className={`absolute left-4 transition-all duration-200 ${confirmPassword ? 'text-xs top-2' : 'text-base top-1/2 -translate-y-1/2'} peer-focus:text-xs peer-focus:top-2 ${darkMode 
                  ? 'text-gray-400 peer-focus:text-blue-400' 
                  : 'text-gray-500 peer-focus:text-blue-600'} ${password && confirmPassword && password !== confirmPassword ? 'text-red-500 peer-focus:text-red-500' : ''}`}
              >
                Confirm Password
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className={`h-4 w-4 rounded border-gray-300 ${darkMode ? 'bg-gray-700 text-blue-500' : 'bg-gray-100 text-blue-600'}`}
            />
            <label htmlFor="terms" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              I agree to the <a href="#" className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Terms of Service</a> and <a href="#" className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Privacy Policy</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg ${darkMode 
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              <span>{isSubmitting ? "Creating account..." : "Sign up"}</span>
            </button>
          </div>
          
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link to="/login" className={`font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 