import React from 'react';
import { Search, RefreshCw, Bell, User, ChevronDown, Menu, Sun, Moon } from 'lucide-react';

const Header = ({ 
  darkMode, 
  setDarkMode, 
  searchTerm, 
  setSearchTerm, 
  language, 
  setLanguage, 
  languages, 
  t,
  notifications = [],
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:px-6 lg:py-4`}>
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Search - hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t?.search || 'חיפוש...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile search button */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Language selector - simplified on mobile */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-2 lg:px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            {Object.entries(languages).map(([code, { name, flag }]) => (
              <option key={code} value={code}>
                <span className="hidden sm:inline">{flag} </span>{name}
              </option>
            ))}
          </select>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* User menu - simplified on mobile */}
          <div className="relative">
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300 hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;