import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Language names in their native language
const languageNames: { [key: string]: string } = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語'
};

interface LanguageIndicatorProps {
  className?: string;
}

const LanguageIndicator: React.FC<LanguageIndicatorProps> = ({ className = '' }) => {
  const { language } = useTheme();
  
  return (
    <div className={`text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ${className}`}>
      {languageNames[language] || 'English'}
    </div>
  );
};

export default LanguageIndicator; 