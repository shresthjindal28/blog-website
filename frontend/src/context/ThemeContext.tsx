import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateSettings } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguageState] = useState('en');

  // Initialize preferences from user data or system preference
  useEffect(() => {
    if (user?.preferences) {
      setDarkMode(user.preferences.darkMode);
      setLanguageState(user.preferences.language);
    } else {
      // Check system preference for dark mode as fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      
      // Check browser language as fallback
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'es', 'fr', 'de', 'ja'];
      if (supportedLangs.includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, [user]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply language attribute
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    
    // If user is logged in, save preference to database
    if (user) {
      try {
        await updateSettings({ darkMode: newValue });
      } catch (error) {
        console.error('Error updating dark mode preference:', error);
      }
    }
  };

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    
    // If user is logged in, save preference to database
    if (user) {
      try {
        await updateSettings({ language: lang });
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 