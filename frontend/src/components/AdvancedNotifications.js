import React, { useState, useEffect } from 'react';
import { 
  Bell, BellRing, X, Check, Trash2, Volume2, VolumeX,
  Phone, PhoneCall, Users, MessageSquare, DollarSign,
  AlertTriangle, CheckCircle, Info, Heart, Zap, Clock,
  Settings, Filter, MoreHorizontal, Archive, Star
} from 'lucide-react';

const AdvancedNotifications = ({ 
  isOpen, 
  onClose, 
  darkMode = false, 
  t = {},
  notifications = [],
  setNotifications = () => {}
}) => {
  const [filter, setFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Archive notification
  const archiveNotification = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, archived: true } : notif
    ));
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    const icons = {
      missed_call: Phone,
      incoming_call: PhoneCall,
      voicemail: Volume2,
      lead: Users,
      message: MessageSquare,
      deal: DollarSign,
      task: CheckCircle,
      system: Info,
      warning: AlertTriangle,
      achievement: Star,
      reminder: Clock
    };
    return icons[type] || Bell;
  };

  // Get notification color
  const getNotificationColor = (type, priority = 'medium') => {
    const colors = {
      missed_call: 'text-red-500 bg-red-100 dark:bg-red-900/20',
      incoming_call: 'text-green-500 bg-green-100 dark:bg-green-900/20',
      voicemail: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
      lead: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
      message: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20',
      deal: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      task: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
      system: 'text-gray-500 bg-gray-100 dark:bg-gray-700',
      warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
      achievement: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      reminder: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
    };
    return colors[type] || 'text-gray-500 bg-gray-100 dark:bg-gray-700';
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    if (filter === 'archived') return notif.archived;
    if (filter === 'important') return notif.priority === 'high';
    return !notif.archived; // 'all' but exclude archived
  });

  // Format time
  const formatTime = (date) => {
    if (typeof date === 'string') return date;
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'עכשיו';
    if (minutes < 60) return `${minutes} דק׳`;
    if (hours < 24) return `${hours} שעות`;
    return `${days} ימים`;
  };

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      
      {/* Notifications Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md lg:absolute lg:top-12 lg:right-0 lg:h-auto lg:max-h-96
        ${darkMode ? 'bg-gray-900' : 'bg-white'}
        border-l border-gray-200 dark:border-gray-700 lg:border lg:rounded-xl lg:shadow-2xl
        flex flex-col overflow-hidden
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BellRing className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              התראות
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title={soundEnabled ? 'בטל צלילים' : 'הפעל צלילים'}
            >
              {soundEnabled ? 
                <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" /> :
                <VolumeX className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              }
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {[
            { id: 'all', label: 'הכל', count: notifications.filter(n => !n.archived).length },
            { id: 'unread', label: 'לא נקרא', count: unreadCount },
            { id: 'important', label: 'חשוב', count: notifications.filter(n => n.priority === 'high').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'text-blue-600 bg-white dark:bg-gray-900 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              סמן הכל כנקרא
            </button>
            <button
              onClick={() => setNotifications([])}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              מחק הכל
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                אין התראות
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                {filter === 'unread' ? 'כל ההתראות נקראו' :
                 filter === 'important' ? 'אין התראות חשובות' :
                 'אין התראות כרגע'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClasses = getNotificationColor(notification.type, notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${colorClasses} flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {notification.priority === 'high' && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(notification.time)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-3">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              סמן כנקרא
                            </button>
                          )}
                          <button
                            onClick={() => archiveNotification(notification.id)}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                          >
                            ארכיב
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 dark:text-red-400 hover:underline"
                          >
                            מחק
                          </button>
                        </div>
                        
                        {/* Call to action for specific notification types */}
                        {notification.type === 'missed_call' && (
                          <div className="flex gap-2 mt-3">
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                              <Phone className="w-3 h-3" />
                              התקשר חזרה
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                              <MessageSquare className="w-3 h-3" />
                              שלח הודעה
                            </button>
                          </div>
                        )}
                        
                        {notification.type === 'lead' && (
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 mt-3">
                            <Users className="w-3 h-3" />
                            צפה בליד
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              הגדרות התראות
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">צלילי התראה</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">התראות דסקטופ</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">התראות שיחות החמיצות</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">התראות לידים חדשים</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedNotifications;