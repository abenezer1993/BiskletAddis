import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
    { code: 'or', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹' }
  ];

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // Show a brief notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    notification.textContent = `Language changed to ${languages.find(l => l.code === newLanguage)?.nativeName}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
        title="Select Language / ቋንቋ ይምረጡ / Afaan Filachuu"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
      <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
    </div>
  );
};

export default LanguageSelector;