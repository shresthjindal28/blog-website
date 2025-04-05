import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../utils/i18n';
import LanguageIndicator from './LanguageIndicator';
import { 
  UserCircleIcon, 
  PlusIcon, 
  HomeIcon, 
  BookOpenIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BlogApp
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 mr-2 text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{t('common.home')}</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-blog"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('common.create')}</span>
                </Link>
                <Link
                  to="/my-blogs"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('common.blogs')}</span>
                </Link>
                
                <LanguageIndicator className="hidden sm:block" />
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                >
                  {darkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>
                
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                      {user?.avatarUrl ? (
                        <img 
                          src={`/${user.avatarUrl}`} 
                          alt={`${user.username}'s avatar`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-full w-full text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                    <span className="hidden sm:inline text-gray-600 dark:text-gray-300 font-medium">{user?.username}</span>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {t('common.profile')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {t('common.settings')}
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              logout();
                              setDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {t('common.logout')}
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <LanguageIndicator className="hidden sm:block" />
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                >
                  {darkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-200 shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-2"
          ref={mobileMenuRef}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
            >
              <HomeIcon className="h-5 w-5" />
              <span>{t('common.home')}</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>{t('common.create')}</span>
                </Link>
                <Link
                  to="/my-blogs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  <span>{t('common.blogs')}</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>{t('common.profile')}</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span>{t('common.settings')}</span>
                </Link>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <LanguageIndicator />
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full space-x-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-3 py-2 rounded-md text-base font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>{t('common.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <LanguageIndicator />
                </div>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 