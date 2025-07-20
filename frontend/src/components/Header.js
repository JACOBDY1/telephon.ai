import React, { useState, useEffect } from 'react';
import { Bell, Search, Globe, Moon, Sun, User, Settings, ChevronDown, Menu, X, Wifi, Battery, Signal } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ 
  darkMode = false, 
  setDarkMode = () => {}, 
  searchTerm = '', 
  setSearchTerm = () => {}, 
  language = 'he', 
  setLanguage = () => {}, 
  languages = { he: { name: 'עברית', flag: '🇮🇱' } }, 
  t = { search: 'חיפוש...' },
  notifications = [],
  setNotifications = () => {},
  sidebarOpen = true,
  setSidebarOpen = () => {}
}) => {
  const { user, logout } = useAuth();

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

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
                {flag} {name}
              </option>
            ))}
          </select>

          {/* Notifications */}
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
          />

          {/* User menu - simplified on mobile */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.full_name || user?.username}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === 'admin' ? 'מנהל מערכת' : user?.role === 'manager' ? 'מנהל' : 'משתמש'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300 hidden sm:block" />
            </button>

            {/* User dropdown menu */}
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">
                  {user?.full_name || user?.username}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </div>
              </div>
              <div className="py-2">
                <button 
                  className="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => window.location.hash = '#profile'}
                >
                  פרופיל
                </button>
                <button 
                  className="w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => window.location.hash = '#settings'}
                >
                  הגדרות
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button 
                  onClick={logout}
                  className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  התנתק
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;