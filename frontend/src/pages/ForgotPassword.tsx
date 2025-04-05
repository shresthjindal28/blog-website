import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
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
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      // For now, just simulate API call with a timeout
      // In a real app, you would call an endpoint like:
      // await axios.post(`${API_URL}/auth/forgot-password`, { email });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast.success('Reset link sent! Check your email inbox');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[30%] w-[80%] h-[80%] rounded-full opacity-30 blur-3xl bg-gradient-to-r from-teal-400 to-blue-500 animate-pulse-slow"></div>
        <div className="absolute -bottom-[30%] -right-[30%] w-[75%] h-[75%] rounded-full opacity-30 blur-3xl bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse-slower"></div>
      </div>
      
      <div 
        className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${darkMode ? 'bg-gray-800/70 shadow-gray-900/30' : 'bg-white/80 shadow-gray-200/50'}`}
      >
        <div className="text-center">
          <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-1 transition-colors animate-gradient`}>
            BlogApp
          </h1>
          <h2 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Reset Password
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isSuccess 
              ? "We've sent you an email with reset instructions" 
              : "Enter your email address and we'll send you a link to reset your password"}
          </p>
        </div>
        
        {isSuccess ? (
          <div className="mt-6 space-y-6">
            <div className="flex justify-center">
              <div className={`rounded-full p-3 ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Check your inbox for <span className="font-medium">{email}</span> and follow the instructions to reset your password.
            </p>
            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              If you don't see the email, check your spam folder or try again.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className={`block w-full text-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${darkMode 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                  : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form 
            className={`mt-8 space-y-6 transition-all duration-300 ${isSubmitting ? 'opacity-60' : 'opacity-100'}`}
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
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
                <span>{isSubmitting ? "Sending link..." : "Send Reset Link"}</span>
              </button>
            </div>
            
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Remember your password?{' '}
                <Link to="/login" className={`font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 