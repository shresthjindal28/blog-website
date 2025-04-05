import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || 'avatar1.png');
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const avatars = [
    'avatar1.png', 
    'avatar2.png', 
    'avatar3.png', 
    'avatar4.png', 
    'avatar5.png', 
    'avatar6.png'
  ];

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Phone validation (optional)
    if (phoneNumber && !/^[\d\s+()-]{10,15}$/.test(phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    try {
      await updateProfile({
        username,
        email,
        phoneNumber,
        avatarUrl: selectedAvatar
      });
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="relative w-full md:w-auto flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 mb-4 md:mb-0 md:mr-8">
            <img 
              src={`/${selectedAvatar}`} 
              alt="User avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-1/2 md:right-0 transform translate-x-1/2 md:translate-x-0 md:-right-2">
            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-full shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <button 
                        onClick={() => {
                          setIsEditing(true);
                          setIsSettingsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Edit Profile
                      </button>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        onClick={() => setIsSettingsOpen(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full md:pl-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Avatar
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {avatars.map((avatar) => (
                    <div 
                      key={avatar} 
                      onClick={() => handleAvatarChange(avatar)}
                      className={`cursor-pointer w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 ${
                        selectedAvatar === avatar ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img 
                        src={`/${avatar}`} 
                        alt={`Avatar option ${avatar}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h1>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              {user.phoneNumber && <p className="text-gray-600 dark:text-gray-300">{user.phoneNumber}</p>}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 