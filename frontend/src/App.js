import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import CRMManager from './components/CRMManager';
import WebDialer from './components/WebDialer';
import SubscriptionManager from './components/SubscriptionManager';
import axios from 'axios';

// Import components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CRMView from './components/CRMView';
import AttendanceView from './components/AttendanceView';
import MarketplaceView from './components/MarketplaceView';
import CallsView from './components/CallsView';
import ContactsView from './components/ContactsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';

// Import advanced components
import AutomationCenter from './components/AutomationCenter';
import CallFlowCanvas from './components/CallFlowCanvas';
import DocumentGenerator from './components/DocumentGenerator';
import AIAnalytics from './components/AIAnalytics';
import MessagingCenter from './components/MessagingCenter';

const MainApp = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('he');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [crmData, setCrmData] = useState({ leads: [], deals: [], tasks: [] });
  const [attendanceData, setAttendanceData] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [learningModules, setLearningModules] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({ checkcall: true, masterpbx: true });

  // Languages configuration
  const languages = {
    he: { name: 'עברית', flag: '🇮🇱' },
    en: { name: 'English', flag: '🇺🇸' },
    ar: { name: 'العربية', flag: '🇸🇦' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    fr: { name: 'Français', flag: '🇫🇷' },
    es: { name: 'Español', flag: '🇪🇸' },
    it: { name: 'Italiano', flag: '🇮🇹' }
  };

  // Translations
  const translations = {
    he: {
      dashboard: 'דשבורד',
      calls: 'שיחות',
      contacts: 'אנשי קשר',
      crm: 'CRM',
      attendance: 'נוכחות',
      analytics: 'אנליטיקס',
      marketplace: 'חנות',
      learning: 'למידה',
      settings: 'הגדרות',
      automations: 'אוטומציות',
      callFlows: 'זרימות שיחה',
      documents: 'מסמכים',
      aiAnalytics: 'AI אנליטיקס',
      messaging: 'מרכז הודעות',
      webDialer: 'חייגן Web',
      modules: 'מנהל מודולים',
      subscription: 'ניהול מנוי',
      profile: 'פרופיל',
      account: 'חשבון',
      notifications: 'התראות',
      search: 'חיפוש...',
      activeCalls: 'שיחות פעילות',
      recentCalls: 'שיחות אחרונות',
      tutorials: 'מדריכים'
    },
    en: {
      dashboard: 'Dashboard',
      calls: 'Calls',
      contacts: 'Contacts',
      crm: 'CRM',
      attendance: 'Attendance',
      analytics: 'Analytics',
      marketplace: 'Marketplace',
      learning: 'Learning',
      settings: 'Settings',
      automations: 'Automations',
      callFlows: 'Call Flows',
      documents: 'Documents',
      aiAnalytics: 'AI Analytics',
      messaging: 'Messaging Center',
      webDialer: 'Web Dialer',
      modules: 'Module Manager',
      profile: 'Profile',
      account: 'Account',
      notifications: 'Notifications',
      search: 'Search...',
      activeCalls: 'Active Calls',
      recentCalls: 'Recent Calls',
      tutorials: 'Tutorials'
    }
  };

  const t = translations[language] || translations.he;

  // Load initial data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
      setupNotifications();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      // Load CRM data
      const [leadsRes, dealsRes, tasksRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crm/leads`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crm/deals`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crm/tasks`)
      ]);

      setCrmData({
        leads: leadsRes.data,
        deals: dealsRes.data,
        tasks: tasksRes.data
      });

      // Mock data for other sections
      setAttendanceData([
        { id: 1, name: 'יואב כהן', status: 'present', time: '09:00' },
        { id: 2, name: 'שרה לוי', status: 'absent', time: '-' },
        { id: 3, name: 'דוד אברמוביץ', status: 'present', time: '08:45' },
        { id: 4, name: 'רחל מזרחי', status: 'late', time: '09:30' }
      ]);

      setAutomationRules([
        { id: 1, name: 'ברכה אוטומטית', active: true },
        { id: 2, name: 'העברה לשירות לקוחות', active: false },
        { id: 3, name: 'שליחת SMS אחרי שיחה', active: true }
      ]);

      setLearningModules([
        { id: 1, title: 'תחילת עבודה עם המערכת', completed: true },
        { id: 2, title: 'שימוש במערכת CRM', completed: false },
        { id: 3, title: 'אוטומציות מתקדמות', completed: false }
      ]);

    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const setupNotifications = () => {
    // Mock notifications - in real app this would come from WebSocket or API
    setNotifications([
      { 
        id: 1, 
        title: 'ליד חדש התקבל', 
        message: 'יואב כהן מעוניין במערכת טלפוניה מתקדמת לחברתו', 
        time: '5 דקות', 
        read: false,
        type: 'info'
      },
      { 
        id: 2, 
        title: 'עסקה נסגרה בהצלחה', 
        message: 'עסקה עם דוד אברמוביץ הושלמה בסכום של ₪18,000', 
        time: '1 שעה', 
        read: true,
        type: 'success'
      },
      { 
        id: 3, 
        title: 'משימה דחופה', 
        message: 'התקשרות לרחל מזרחי עד 17:00 - עדיפות גבוהה', 
        time: '2 שעות', 
        read: false,
        type: 'warning'
      },
      { 
        id: 4, 
        title: 'שיחה החמיצה', 
        message: 'שיחה לא נענתה מ+972-50-123-4567 - יש לחזור', 
        time: '30 דקות', 
        read: false,
        type: 'warning'
      },
      { 
        id: 5, 
        title: 'דוח חודשי מוכן', 
        message: 'דוח הפעילות החודשי זמין לצפייה והורדה', 
        time: '3 שעות', 
        read: true,
        type: 'info'
      }
    ]);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        { title: 'ליד חדש', message: 'לקוח פוטנציאלי נרשם לניוזלטר', type: 'info' },
        { title: 'שיחה הסתיימה', message: 'שיחה בת 12 דקות הסתיימה', type: 'success' },
        { title: 'מערכת מעודכנת', message: 'עדכון אבטחה הותקן בהצלחה', type: 'success' },
        { title: 'תזכורת', message: 'פגישה מתקרבת עם צוות המכירות', type: 'warning' }
      ];

      const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      
      setNotifications(prev => [{
        id: Date.now(),
        title: randomNotification.title,
        message: randomNotification.message,
        time: 'כעת',
        read: false,
        type: randomNotification.type
      }, ...prev.slice(0, 9)]); // Keep only last 10 notifications

    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'calls': return <CallsView />;
      case 'contacts': return <ContactsView />;
      case 'crm': return <CRMManager />;
      case 'attendance': return <AttendanceView />;
      case 'analytics': return <AnalyticsView />;
      case 'marketplace': return <MarketplaceView />;
      case 'learning': return <div>Learning modules coming soon...</div>;
      case 'automations': return <AutomationCenter darkMode={darkMode} t={t} />;
      case 'callFlows': return <CallFlowCanvas darkMode={darkMode} t={t} />;
      case 'documents': return <DocumentGenerator darkMode={darkMode} t={t} />;
      case 'aiAnalytics': return <AIAnalytics darkMode={darkMode} t={t} />;
      case 'messaging': return <MessagingCenter darkMode={darkMode} t={t} />;
      case 'webDialer': return <WebDialer darkMode={darkMode} t={t} />;
      case 'modules': return <ModuleManager darkMode={darkMode} t={t} />;
      case 'subscription': return <SubscriptionManager />;
      case 'profile': return <UserProfile />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <div className="lg:flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 transition-transform lg:translate-x-0 lg:static lg:inset-0`}>
          <Sidebar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            t={t}
            crmData={crmData}
            attendanceData={attendanceData}
            automationRules={automationRules}
            learningModules={learningModules}
            connectionStatus={connectionStatus}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            language={language}
            setLanguage={setLanguage}
            languages={languages}
            t={t}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            notifications={notifications}
            setNotifications={setNotifications}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderActiveTab()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;