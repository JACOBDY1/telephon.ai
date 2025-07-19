import React from 'react';
import { Search, RefreshCw, Bell, User, ChevronDown } from 'lucide-react';

const Header = ({ 
  darkMode, 
  setDarkMode, 
  searchTerm, 
  setSearchTerm, 
  language, 
  setLanguage, 
  languages, 
  loadRealData, 
  loading, 
  t 
}) => {
  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} border-b border-gray-200 dark:border-gray-700 px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={loadRealData}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Object.entries(languages).map(([code, { name, flag }]) => (
              <option key={code} value={code}>
                {flag} {name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;