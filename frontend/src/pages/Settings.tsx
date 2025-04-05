import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/i18n';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, updateSettings, changePassword } = useAuth();
  const { darkMode, toggleDarkMode, language, setLanguage } = useTheme();
  const { t } = useTranslation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  // Update state when user loads
  useEffect(() => {
    if (user?.preferences) {
      setEmailNotifications(user.preferences.emailNotifications);
    }
  }, [user]);
  
  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        emailNotifications
      });
      toast.success('Settings saved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };
  
  if (!user) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">{t('common.settings')}</h1>
      
      <div className="space-y-4 md:space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6">
          <h2 className="text-md md:text-lg font-medium text-gray-900 dark:text-white mb-3 md:mb-4">{t('settings.appearance')}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-gray-700 dark:text-gray-300">{t('settings.darkMode')}</span>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('settings.darkMode.description')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6">
          <h2 className="text-md md:text-lg font-medium text-gray-900 dark:text-white mb-3 md:mb-4">{t('settings.notifications')}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-gray-700 dark:text-gray-300">{t('settings.emailNotifications')}</span>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t('settings.emailNotifications.description')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6">
          <h2 className="text-md md:text-lg font-medium text-gray-900 dark:text-white mb-3 md:mb-4">{t('settings.language')}</h2>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('settings.selectLanguage')}
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6">
          <h2 className="text-md md:text-lg font-medium text-gray-900 dark:text-white mb-3 md:mb-4">{t('settings.security')}</h2>
          
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
          >
            {showPasswordSection ? t('settings.hide') : t('settings.changePassword')}
            <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-5 w-5 transform transition-transform ${showPasswordSection ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showPasswordSection && (
            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.currentPassword')}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.newPassword')}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.confirmPassword')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('settings.updatePassword')}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('settings.saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 