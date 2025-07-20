import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageSquare, Users, BarChart3, Settings, Menu, 
  Bell, Search, Home, Calendar, Map, Camera, Mic, Wifi, 
  Battery, Signal, Download, Share, Star, Heart, Zap
} from 'lucide-react';

const MobileApp = ({ darkMode = false, t = {}, user }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    // PWA Install prompt detection
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Battery API
    const handleBatteryChange = (battery) => {
      setBatteryLevel(Math.floor(battery.level * 100));
    };

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Battery API (experimental)
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.floor(battery.level * 100));
        battery.addEventListener('levelchange', () => handleBatteryChange(battery));
      });
    }

    // Mock quick actions
    setQuickActions([
      { id: 'call', title: 'חיוג מהיר', icon: Phone, color: 'bg-green-500', action: () => setActiveTab('dialer') },
      { id: 'contacts', title: 'אנשי קשר', icon: Users, color: 'bg-blue-500', action: () => setActiveTab('contacts') },
      { id: 'crm', title: 'CRM', icon: BarChart3, color: 'bg-purple-500', action: () => setActiveTab('crm') },
      { id: 'calendar', title: 'יומן', icon: Calendar, color: 'bg-orange-500', action: () => console.log('Calendar') }
    ]);

    // Mock notifications
    setNotifications([
      { id: 1, title: 'שיחה החמיצה', message: 'מיואב כהן - לחץ להתקשר חזרה', time: '5 דק׳', type: 'missed_call' },
      { id: 2, title: 'פגישה מתקרבת', message: 'פגישה עם לקוח בעוד שעה', time: '1 שעה', type: 'meeting' },
      { id: 3, title: 'ליד חדש', message: 'לקוח פוטנציאלי נרשם לניוזלטר', time: '2 שעות', type: 'lead' }
    ]);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallApp = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setInstallPrompt(null);
        setShowInstallBanner(false);
      });
    }
  };

  const StatusBar = () => (
    <div className="flex items-center justify-between px-4 py-1 bg-black text-white text-sm">
      <div className="flex items-center gap-1">
        <span>09:41</span>
        {!isOnline && <span className="text-red-400">לא מחובר</span>}
      </div>
      <div className="flex items-center gap-1">
        <Signal className="w-3 h-3" />
        <Wifi className={`w-3 h-3 ${isOnline ? 'text-white' : 'text-red-400'}`} />
        <div className="flex items-center">
          <Battery className="w-4 h-4" />
          <span className="text-xs ml-1">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );

  const InstallBanner = () => {
    if (!showInstallBanner) return null;

    return (
      <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">התקן את האפליקציה</p>
          <p className="text-sm opacity-90">קבל גישה מהירה ופיצ'רים נוספים</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowInstallBanner(false)}
            className="px-3 py-1 text-sm border border-white/30 rounded"
          >
            אחר כך
          </button>
          <button 
            onClick={handleInstallApp}
            className="px-3 py-1 text-sm bg-white text-blue-500 rounded font-medium"
          >
            התקן
          </button>
        </div>
      </div>
    );
  };

  const QuickActionGrid = () => (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">פעולות מהירות</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`${action.color} text-white p-6 rounded-2xl shadow-lg active:scale-95 transition-transform`}
          >
            <action.icon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">{action.title}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const NotificationsList = () => (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        התראות אחרונות
      </h3>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {notification.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  {notification.message}
                </p>
              </div>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MobileDialer = () => (
    <div className="p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-2xl font-mono text-gray-800 dark:text-gray-200 min-h-[40px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            הכנס מספר טלפון
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
            <button
              key={digit}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl p-4 text-xl font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-95"
            >
              {digit}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-green-500 text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform">
            <Phone className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {[
          { id: 'home', icon: Home, label: 'בית' },
          { id: 'dialer', icon: Phone, label: 'חייגן' },
          { id: 'contacts', icon: Users, label: 'אנשי קשר' },
          { id: 'crm', icon: BarChart3, label: 'CRM' },
          { id: 'settings', icon: Settings, label: 'הגדרות' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="pb-20">
            <QuickActionGrid />
            <NotificationsList />
          </div>
        );
      case 'dialer':
        return (
          <div className="pb-20">
            <MobileDialer />
          </div>
        );
      case 'contacts':
        return (
          <div className="p-4 pb-20">
            <h2 className="text-xl font-bold mb-4">אנשי קשר</h2>
            <p className="text-gray-600">רשימת אנשי קשר תופיע כאן...</p>
          </div>
        );
      case 'crm':
        return (
          <div className="p-4 pb-20">
            <h2 className="text-xl font-bold mb-4">CRM נייד</h2>
            <p className="text-gray-600">ניהול לקוחות נייד...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 pb-20">
            <h2 className="text-xl font-bold mb-4">הגדרות</h2>
            <p className="text-gray-600">הגדרות אפליקציה...</p>
          </div>
        );
      default:
        return <div>תוכן לא נמצא</div>;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar />
      <InstallBanner />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            TelephonyAI
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MobileApp;