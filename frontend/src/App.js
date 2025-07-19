import React, { useState, useEffect } from 'react';
import './App.css';
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

// Import new advanced components
import AutomationCenter from './components/AutomationCenter';
import CallFlowCanvas from './components/CallFlowCanvas';
import DocumentGenerator from './components/DocumentGenerator';
import AIAnalytics from './components/AIAnalytics';
import MessagingCenter from './components/MessagingCenter';

// Import additional components for advanced features
import { 
  Plus, Edit, Trash2, Play, BookOpen, FileText, CheckCircle, Clock, Zap, Target, Activity, Workflow,
  Phone, PhoneCall, Search, RefreshCw, Bell, User, ChevronDown, Menu, X, BarChart3, Users2, 
  UserCheck, TrendingUp, ShoppingCart, Settings, Mic, Volume2, Filter, BarChart, CheckSquare, 
  DollarSign, UserX, MoreVertical, Bot, Star, Link, Wifi, WifiOff, AlertCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const App = () => {
  // Main state
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('he');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // API Data state
  const [realCallData, setRealCallData] = useState([]);
  const [checkcallData, setCheckcallData] = useState([]);
  const [masterpbxData, setMasterpbxData] = useState([]);
  const [realtimeAnalytics, setRealtimeAnalytics] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({
    checkcall: 'checking',
    masterpbx: 'checking',
    backend: 'checking'
  });

  // Advanced features state
  const [crmData, setCrmData] = useState({
    leads: [],
    contacts: [],
    deals: [],
    tasks: []
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [learningModules, setLearningModules] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);

  // Language and translations
  const languages = {
    he: { name: 'עברית', flag: '🇮🇱' },
    en: { name: 'English', flag: '🇺🇸' },
    ar: { name: 'العربية', flag: '🇸🇦' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    fr: { name: 'Français', flag: '🇫🇷' },
    es: { name: 'Español', flag: '🇪🇸' },
    it: { name: 'Italiano', flag: '🇮🇹' }
  };

  const translations = {
    he: {
      dashboard: 'לוח בקרה',
      calls: 'שיחות',
      contacts: 'אנשי קשר',
      analytics: 'אנליטיקס',
      settings: 'הגדרות',
      crm: 'CRM',
      attendance: 'נוכחות עובדים',
      marketplace: 'מרקטפלייס',
      learning: 'למידה',
      automations: 'אוטומציות',
      callFlows: 'זרימות שיחות',
      documents: 'מחולל מסמכים',
      aiAnalytics: 'ניתוח AI',
      messaging: 'מרכז הודעות',
      search: 'חיפוש...',
      activeCalls: 'שיחות פעילות',
      recentCalls: 'שיחות אחרונות',
      totalCalls: 'סה״כ שיחות',
      completedDeals: 'עסקאות שנסגרו',
      averageCallTime: 'זמן שיחה ממוצע',
      conversionRate: 'אחוז המרה',
      aiInsights: 'תובנות AI',
      salesPlaybook: 'מדריך מכירות',
      realTime: 'זמן אמת',
      loading: 'טוען...',
      connected: 'מחובר',
      disconnected: 'מנותק',
      checking: 'בודק...',
      leads: 'לידים',
      deals: 'עסקאות',
      tasks: 'משימות',
      newLead: 'ליד חדש',
      newDeal: 'עסקה חדשה',
      clockIn: 'כניסה',
      clockOut: 'יציאה',
      present: 'נוכח',
      absent: 'נעדר',
      plugins: 'פלאגינים',
      courses: 'קורסים',
      documentation: 'תיעוד',
      tutorials: 'מדריכים'
    },
    en: {
      dashboard: 'Dashboard',
      calls: 'Calls',
      contacts: 'Contacts',
      analytics: 'Analytics', 
      settings: 'Settings',
      crm: 'CRM',
      attendance: 'Attendance',
      marketplace: 'Marketplace',
      learning: 'Learning',
      automations: 'Automations',
      callFlows: 'Call Flows',
      documents: 'Documents',
      aiAnalytics: 'AI Analytics',
      messaging: 'Messaging',
      search: 'Search...',
      activeCalls: 'Active Calls',
      recentCalls: 'Recent Calls',
      totalCalls: 'Total Calls',
      completedDeals: 'Completed Deals',
      averageCallTime: 'Average Call Time',
      conversionRate: 'Conversion Rate',
      aiInsights: 'AI Insights',
      salesPlaybook: 'Sales Playbook',
      realTime: 'Real Time',
      loading: 'Loading...',
      connected: 'Connected',
      disconnected: 'Disconnected',
      checking: 'Checking...',
      leads: 'Leads',
      deals: 'Deals',
      tasks: 'Tasks',
      newLead: 'New Lead',
      newDeal: 'New Deal',
      clockIn: 'Clock In',
      clockOut: 'Clock Out',
      present: 'Present',
      absent: 'Absent',
      plugins: 'Plugins',
      courses: 'Courses',
      documentation: 'Documentation',
      tutorials: 'Tutorials'
    }
  };

  const t = translations[language] || translations.en;

  // Load advanced mock data
  const loadAdvancedData = async () => {
    // Mock CRM data
    setCrmData({
      leads: [
        { id: 1, name: 'יוסי כהן', company: 'חברת טכנולוגיה', status: 'חם', value: 50000, source: 'אתר' },
        { id: 2, name: 'Sarah Miller', company: 'Tech Corp', status: 'קר', value: 25000, source: 'Google Ads' },
        { id: 3, name: 'Ahmed Hassan', company: 'Digital Solutions', status: 'חם', value: 75000, source: 'המלצה' }
      ],
      deals: [
        { id: 1, name: 'עסקת תוכנה', client: 'יוסי כהן', value: 50000, stage: 'משא ומתן', probability: 75 },
        { id: 2, name: 'Software License', client: 'Sarah Miller', value: 25000, stage: 'proposal', probability: 50 }
      ],
      tasks: [
        { id: 1, title: 'התקשר ליוסי', due: '2024-01-20', priority: 'גבוה', status: 'pending' },
        { id: 2, title: 'שלח הצעת מחיר', due: '2024-01-21', priority: 'בינוני', status: 'completed' }
      ]
    });

    // Mock attendance data
    setAttendanceData([
      { id: 1, name: 'דנה לוי', status: 'present', checkIn: '08:30', department: 'מכירות' },
      { id: 2, name: 'מיכל שמש', status: 'present', checkIn: '09:00', department: 'תמיכה' },
      { id: 3, name: 'רון כהן', status: 'absent', checkIn: null, department: 'פיתוח' }
    ]);

    // Mock marketplace items
    setMarketplaceItems([
      { id: 1, name: 'CRM Integration Plugin', price: 299, category: 'plugins', rating: 4.8, installs: 1250 },
      { id: 2, name: 'Advanced Analytics', price: 199, category: 'analytics', rating: 4.6, installs: 890 },
      { id: 3, name: 'WhatsApp Automation', price: 149, category: 'automation', rating: 4.9, installs: 2100 }
    ]);

    // Mock learning modules
    setLearningModules([
      { id: 1, title: 'מדריך למתחילים', duration: '45 דקות', progress: 100, type: 'tutorial' },
      { id: 2, title: 'שילוב APIs מתקדם', duration: '2 שעות', progress: 60, type: 'course' },
      { id: 3, title: 'תיעוד מלא', duration: 'קריאה', progress: 0, type: 'documentation' }
    ]);

    // Mock automation rules
    setAutomationRules([
      { id: 1, name: 'SMS אוטומטי ללידים חדשים', active: true, triggers: 3 },
      { id: 2, name: 'העברת שיחות לפי שעות', active: true, triggers: 15 },
      { id: 3, name: 'דוח יומי למנהל', active: false, triggers: 0 }
    ]);
  };

  // Load real data from APIs
  const loadRealData = async () => {
    setLoading(true);
    try {
      // Check backend health
      const healthResponse = await axios.get(`${API}/health`);
      setConnectionStatus(prev => ({ ...prev, backend: healthResponse.data.status === 'healthy' ? 'connected' : 'disconnected' }));

      // Load Checkcall data
      try {
        const checkcallResponse = await axios.get(`${API}/integrations/checkcall/calls`);
        if (checkcallResponse.data.status === 'success') {
          setCheckcallData(checkcallResponse.data.data || []);
          setConnectionStatus(prev => ({ ...prev, checkcall: 'connected' }));
        } else {
          setConnectionStatus(prev => ({ ...prev, checkcall: 'disconnected' }));
        }
      } catch (error) {
        console.warn('Checkcall API error:', error);
        setConnectionStatus(prev => ({ ...prev, checkcall: 'disconnected' }));
      }

      // Load MasterPBX data
      try {
        const masterpbxResponse = await axios.get(`${API}/integrations/masterpbx/calllog`);
        if (masterpbxResponse.data.status === 'success') {
          setMasterpbxData(masterpbxResponse.data.data || []);
          setConnectionStatus(prev => ({ ...prev, masterpbx: 'connected' }));
        } else {
          setConnectionStatus(prev => ({ ...prev, masterpbx: 'disconnected' }));
        }
      } catch (error) {
        console.warn('MasterPBX API error:', error);
        setConnectionStatus(prev => ({ ...prev, masterpbx: 'disconnected' }));
      }

      // Load real-time analytics
      try {
        const analyticsResponse = await axios.get(`${API}/analytics/realtime`);
        setRealtimeAnalytics(analyticsResponse.data);
      } catch (error) {
        console.warn('Analytics API error:', error);
      }

      // Load regular calls data
      const callsResponse = await axios.get(`${API}/calls`);
      setRealCallData(callsResponse.data || []);

      // Load advanced data
      await loadAdvancedData();

    } catch (error) {
      console.error('Error loading data:', error);
      setConnectionStatus(prev => ({ ...prev, backend: 'disconnected' }));
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle hooks
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    loadRealData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadRealData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Call functions
  const startCall = (contact) => {
    setCurrentCall(contact);
    setIsCallActive(true);
    setActiveTab('calls');
  };

  const endCall = () => {
    setCurrentCall(null);
    setIsCallActive(false);
  };

  // Modal functions
  const openModal = (modalType, data = null) => {
    setActiveModal({ type: modalType, data });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Status icon helper function
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-3 h-3 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-3 h-3 text-red-500" />;
      case 'checking':
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} ${darkMode ? 'bg-gray-900' : 'bg-white'} border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                TelephonyAI
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: t.dashboard },
            { id: 'calls', icon: Phone, label: t.calls },
            { id: 'crm', icon: Users2, label: t.crm, badge: crmData.leads.length },
            { id: 'attendance', icon: UserCheck, label: t.attendance, badge: attendanceData.filter(a => a.status === 'present').length },
            { id: 'analytics', icon: TrendingUp, label: t.analytics },
            { id: 'automations', icon: Workflow, label: t.automations, badge: automationRules.filter(r => r.active).length },
            { id: 'marketplace', icon: ShoppingCart, label: t.marketplace, badge: 'NEW' },
            { id: 'learning', icon: BookOpen, label: t.learning, badge: learningModules.length },
            { id: 'settings', icon: Settings, label: t.settings }
          ].map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative ${
                activeTab === id 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <Icon className="w-5 h-5" />
              {sidebarOpen && (
                <>
                  <span>{label}</span>
                  {badge && (
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                      badge === 'NEW' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Connection Status */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">מצב חיבורים</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">Checkcall</span>
              {getStatusIcon(connectionStatus.checkcall)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">MasterPBX</span>
              {getStatusIcon(connectionStatus.masterpbx)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">Backend</span>
              {getStatusIcon(connectionStatus.backend)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Header = () => (
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

  // Enhanced CRM View
  const CRMView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.crm} - מערכת ניהול מתקדמת</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => openModal('newLead')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newLead}</span>
          </button>
          <button 
            onClick={() => openModal('newDeal')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>{t.newDeal}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">לידים פעילים</p>
              <p className="text-3xl font-bold text-blue-600">{crmData.leads.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">עסקאות פתוחות</p>
              <p className="text-3xl font-bold text-green-600">{crmData.deals.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">משימות היום</p>
              <p className="text-3xl font-bold text-orange-600">{crmData.tasks.filter(t => t.status === 'pending').length}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ערך כולל עסקאות</p>
              <p className="text-3xl font-bold text-purple-600">₪{crmData.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.leads}</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {crmData.leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{lead.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{lead.company}</p>
                    <p className="text-xs text-gray-500">מקור: {lead.source}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      lead.status === 'חם' ? 'bg-red-100 text-red-800' : 
                      lead.status === 'חמים' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₪{lead.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex mt-3 space-x-2">
                  <button 
                    onClick={() => startCall(lead)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-3 rounded text-sm"
                  >
                    התקשר
                  </button>
                  <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-1 px-3 rounded text-sm">
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.deals}</h3>
            <BarChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {crmData.deals.map((deal) => (
              <div key={deal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{deal.name}</h4>
                  <span className="text-sm font-bold text-green-600">₪{deal.value.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">לקוח: {deal.client}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">שלב: {deal.stage}</span>
                  <span className="text-xs text-gray-500">{deal.probability}% סיכוי</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${deal.probability}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border mt-8`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t.tasks}</h3>
        <div className="space-y-3">
          {crmData.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={task.status === 'completed'} 
                  className="w-4 h-4" 
                />
                <div>
                  <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">תאריך יעד: {task.due}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                task.priority === 'גבוה' ? 'bg-red-100 text-red-800' :
                task.priority === 'בינוני' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Employee Attendance View
  const AttendanceView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.attendance} - מערכת נוכחות מתקדמת</h1>
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>{t.clockIn}</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <UserX className="w-4 h-4" />
            <span>{t.clockOut}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">נוכחים היום</p>
              <p className="text-3xl font-bold text-green-600">{attendanceData.filter(a => a.status === 'present').length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">חסרים היום</p>
              <p className="text-3xl font-bold text-red-600">{attendanceData.filter(a => a.status === 'absent').length}</p>
            </div>
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">סה״כ עובדים</p>
              <p className="text-3xl font-bold text-blue-600">{attendanceData.length}</p>
            </div>
            <Users2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">אחוז נוכחות</p>
              <p className="text-3xl font-bold text-purple-600">{Math.round((attendanceData.filter(a => a.status === 'present').length / attendanceData.length) * 100)}%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border`}>
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">רשימת עובדים</h3>
        </div>
        <div className="divide-y">
          {attendanceData.map((employee) => (
            <div key={employee.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {employee.checkIn || 'לא נכנס'}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.status === 'present' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {employee.status === 'present' ? t.present : t.absent}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Calendar Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border mt-8`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">לוח פגישות ובוקינג</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <div key={day} className="text-center p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded cursor-pointer">
              <span className="text-sm">{day}</span>
              {day % 5 === 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Marketplace View
  const MarketplaceView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.marketplace} - חנות דיגיטלית מתקדמת</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
            <option value="all">כל הקטגוריות</option>
            <option value="plugins">פלאגינים</option>
            <option value="analytics">אנליטיקות</option>
            <option value="automation">אוטומציה</option>
          </select>
        </div>
      </div>

      {/* Marketplace Hero */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
          src="https://images.unsplash.com/photo-1677693972403-db681288b5da"
          alt="Digital Marketplace"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-2">מרקטפלייס של TelephonyAI</h2>
            <p className="text-lg">פלאגינים, כלים ושירותים להרחבת הפלטפורמה</p>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceItems.map((item) => (
          <div key={item.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border hover:shadow-lg transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {item.category === 'plugins' && <Bot className="w-6 h-6 text-blue-600" />}
                {item.category === 'analytics' && <BarChart className="w-6 h-6 text-blue-600" />}
                {item.category === 'automation' && <Workflow className="w-6 h-6 text-blue-600" />}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{item.rating}</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              תוסף מתקדם לשיפור הפונקציונליות של המערכת
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-600">${item.price}</span>
              <span className="text-sm text-gray-500">{item.installs.toLocaleString()} התקנות</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              התקן עכשיו
            </button>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border mt-8`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">קטגוריות פופולריות</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'פלאגינים', icon: Bot, count: 15 },
            { name: 'אנליטיקות', icon: BarChart3, count: 8 },
            { name: 'אוטומציה', icon: Workflow, count: 12 },
            { name: 'אינטגרציות', icon: Link, count: 20 }
          ].map((category) => (
            <div key={category.name} className="text-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <category.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-gray-900 dark:text-white">{category.name}</p>
              <p className="text-sm text-gray-500">{category.count} פריטים</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Learning Center View
  const LearningView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.learning} - מרכז למידה</h1>
        <div className="flex space-x-2">
          <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">כל התוכן</option>
            <option value="tutorial">מדריכים</option>
            <option value="course">קורסים</option>
            <option value="documentation">תיעוד</option>
          </select>
        </div>
      </div>

      {/* Learning Hero */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
          alt="Learning Dashboard"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-900/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-2">למד וגדל עם TelephonyAI</h2>
            <p className="text-lg">מדריכים, קורסים ותיעוד מלא למיצוי מלא של הפלטפורמה</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">קורסים שהושלמו</p>
              <p className="text-3xl font-bold text-green-600">{learningModules.filter(m => m.progress === 100).length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">קורסים פעילים</p>
              <p className="text-3xl font-bold text-blue-600">{learningModules.filter(m => m.progress > 0 && m.progress < 100).length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">שעות למידה</p>
              <p className="text-3xl font-bold text-purple-600">12.5</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {learningModules.map((module) => (
          <div key={module.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{module.duration}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{module.progress}%</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-4">
                {module.type === 'tutorial' && <Play className="w-5 h-5 text-blue-600" />}
                {module.type === 'course' && <BookOpen className="w-5 h-5 text-blue-600" />}
                {module.type === 'documentation' && <FileText className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              {module.progress === 0 ? 'התחל' : module.progress === 100 ? 'סקור שוב' : 'המשך'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Automations View
  const AutomationsView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.automations} - מערכת אוטומציות מתקדמת</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>אוטומציה חדשה</span>
        </button>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">אוטומציות פעילות</p>
              <p className="text-3xl font-bold text-green-600">{automationRules.filter(r => r.active).length}</p>
            </div>
            <Zap className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">הפעלות היום</p>
              <p className="text-3xl font-bold text-blue-600">{automationRules.reduce((sum, rule) => sum + rule.triggers, 0)}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">זמן חיסכון</p>
              <p className="text-3xl font-bold text-purple-600">4.2h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">שיעור הצלחה</p>
              <p className="text-3xl font-bold text-orange-600">97%</p>
            </div>
            <Target className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border`}>
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">כללי אוטומציה</h3>
        </div>
        <div className="divide-y">
          {automationRules.map((rule) => (
            <div key={rule.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{rule.name}</h4>
                    <p className="text-sm text-gray-500">{rule.triggers} הפעלות השבוע</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${rule.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {rule.active ? 'פעיל' : 'כבוי'}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.dashboard}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          ברוך הבא לפלטפורמת הטלפוניה המבוססת על AI - {t.realTime}
        </p>
      </div>

      {loading && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div className="flex items-center">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mr-2" />
            <span className="text-blue-800 dark:text-blue-200">{t.loading}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-8 relative rounded-xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbW11bmljYXRpb258ZW58MHx8fHwxNzUyOTMwMjAxfDA&ixlib=rb-4.1.0&q=85"
          alt="Modern Business Communication"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">פלטפורמת טלפוניה חכמה</h2>
            <p className="text-xl mb-6">תמלולים, ניתוח רגשות ותובנות מתקדמות</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                התחל עכשיו
              </button>
              <button onClick={loadRealData} className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                רענן נתונים
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats from APIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: t.totalCalls, 
            value: realtimeAnalytics?.checkcall_data?.total_calls || realCallData.length || '0',
            icon: Phone, 
            color: 'blue',
            source: 'Checkcall'
          },
          { 
            title: t.activeCalls, 
            value: realtimeAnalytics?.active_calls || '0',
            icon: PhoneCall, 
            color: 'green',
            source: 'MasterPBX'
          },
          { 
            title: t.averageCallTime, 
            value: '5:23', 
            icon: Clock, 
            color: 'purple',
            source: 'Analytics'
          },
          { 
            title: 'Checkcall נתונים', 
            value: checkcallData.length || '0',
            icon: BarChart3, 
            color: 'orange',
            source: 'Real API'
          }
        ].map((stat, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.source}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">נתוני Checkcall</h3>
            {getStatusIcon(connectionStatus.checkcall)}
          </div>
          {checkcallData.length > 0 ? (
            <div className="space-y-3">
              {checkcallData.slice(0, 5).map((call, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {call.caller_name || call.caller || 'לקוח'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {call.caller_id || call.number || 'לא זמין'}
                      </p>
                      {call.transcription && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {call.transcription.substring(0, 50)}...
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {call.duration || 'N/A'}
                      </p>
                      {call.sentiment && (
                        <span className={`inline-block w-3 h-3 rounded-full mt-1 ${
                          call.sentiment === 'positive' ? 'bg-green-500' : 
                          call.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {connectionStatus.checkcall === 'disconnected' ? 'שגיאה בחיבור ל-Checkcall' : 'טוען נתוני Checkcall...'}
            </p>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">נתוני MasterPBX</h3>
            {getStatusIcon(connectionStatus.masterpbx)}
          </div>
          {masterpbxData.length > 0 ? (
            <div className="space-y-3">
              {masterpbxData.slice(0, 5).map((call, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {call.caller || 'מתקשר'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        → {call.callee || 'נמען'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {call.duration ? `${call.duration}s` : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {call.status || 'לא ידוע'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {connectionStatus.masterpbx === 'disconnected' ? 'שגיאה בחיבור ל-MasterPBX' : 'טוען נתוני MasterPBX...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const CallsView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.calls}</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>שיחה חדשה</span>
        </button>
      </div>

      {/* Active Call Interface */}
      {isCallActive && currentCall && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{currentCall.caller_name || currentCall.caller}</h3>
            <p className="text-gray-600 dark:text-gray-300">{currentCall.caller_number || currentCall.number}</p>
            <p className="text-green-600 font-semibold">00:02:15</p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              <Mic className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={endCall}
              className="p-3 bg-red-500 rounded-full hover:bg-red-600 text-white"
            >
              <Phone className="w-5 h-5 transform rotate-45" />
            </button>
          </div>

          {/* Real-time transcription */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">תמלול בזמן אמת:</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {currentCall.transcription || "שלום, אני מעוניין לקבל מידע נוסף על המוצרים החדשים שלכם..."}
            </p>
          </div>
        </div>
      )}

      {/* Real Calls List */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">רשימת שיחות אמיתית</h3>
            <div className="flex space-x-2">
              {getStatusIcon(connectionStatus.checkcall)}
              {getStatusIcon(connectionStatus.masterpbx)}
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {realCallData.length > 0 ? realCallData.map((call) => (
            <div key={call.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{call.caller_name || 'לקוח'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{call.caller_number}</p>
                    {call.transcription && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{call.transcription.substring(0, 50)}...</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-white">{call.duration || 'N/A'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{call.status}</p>
                  {call.sentiment && (
                    <span className={`inline-block w-3 h-3 rounded-full mt-1 ${
                      call.sentiment === 'positive' ? 'bg-green-500' : 
                      call.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">טוען שיחות...</p>
              {loading && <RefreshCw className="w-6 h-6 animate-spin mx-auto mt-2 text-gray-400" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ContactsView = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.contacts}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(realCallData.length > 0 ? realCallData : [
                  {id: 1, caller_name: "יוסי כהן", caller_number: "+972-50-123-4567"},
                  {id: 2, caller_name: "Sarah Johnson", caller_number: "+1-555-987-6543"},
                  {id: 3, caller_name: "Ahmed Al-Hassan", caller_number: "+971-50-765-4321"}
                ]).map((contact) => (
                  <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{contact.caller_name || contact.caller}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{contact.caller_number || contact.number}</p>
                      <button
                        onClick={() => startCall(contact)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        התקשר
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sales Playbook */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit`}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">מדריך מכירות מתקדם</h3>
            
            <div className="space-y-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg">
                  זיהוי ראשוני
                </h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">תקציב</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">מה התקציב המיועד לפתרון?</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">לוחות זמנים</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">מתי אתם מתכננים להטמיע?</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 bg-green-100 dark:bg-green-900 px-3 py-2 rounded-lg">
                  ניתוח צרכים
                </h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">פתרון נוכחי</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">איך אתם מנהלים כרגע?</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">נקודות כאב</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">מה האתגרים העיקריים?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.analytics} - {t.realTime}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">ניתוח רגשות מ-API</h3>
            {getStatusIcon(connectionStatus.checkcall)}
          </div>
          <div className="space-y-4">
            {realtimeAnalytics?.checkcall_data?.sentiment_breakdown ? (
              Object.entries(realtimeAnalytics.checkcall_data.sentiment_breakdown).map(([sentiment, count]) => (
                <div key={sentiment} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{sentiment}</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      sentiment === 'positive' ? 'bg-green-500' : 
                      sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} style={{width: `${(count / Object.values(realtimeAnalytics.checkcall_data.sentiment_breakdown).reduce((a,b) => a+b, 1)) * 100}%`}}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                </div>
              ))
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">חיובי</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-16"></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">ניטרלי</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-8"></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">שלילי</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full w-4"></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">10%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">תובנות AI בזמן אמת</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📈 {realtimeAnalytics ? `נתונים אמיתיים: ${realtimeAnalytics.total_calls_today} שיחות היום` : 'טוען נתונים אמיתיים...'}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                🎯 {connectionStatus.checkcall === 'connected' ? 'מחובר ל-Checkcall API בהצלחה' : 'בודק חיבור ל-Checkcall...'}
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                ⏰ {connectionStatus.masterpbx === 'connected' ? 'MasterPBX API פעיל' : 'MasterPBX - בבדיקה...'}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                🔄 עדכון אוטומטי כל 30 שניות
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.settings}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">הגדרות כלליות</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שפת ממשק</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                {Object.entries(languages).map(([code, { name, flag }]) => (
                  <option key={code} value={code}>{flag} {name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">מצב לילה</span>
              </label>
            </div>

            <div className="mt-4">
              <button 
                onClick={loadRealData}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {t.loading}
                  </div>
                ) : (
                  'רענן את כל הנתונים'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">הגדרות API</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מצב עדכון אוטומטי</label>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">עדכון כל 30 שניות</span>
              </div>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">התראות על שיחות חדשות</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">תמלול אוטומטי</span>
              </label>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">מצב חיבורים</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Checkcall API</span>
                <span className="text-xs text-gray-500">office@day-1.co.il</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(connectionStatus.checkcall)}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  connectionStatus.checkcall === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : connectionStatus.checkcall === 'disconnected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {connectionStatus.checkcall === 'connected' ? t.connected : 
                   connectionStatus.checkcall === 'disconnected' ? t.disconnected : t.checking}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">MasterPBX</span>
                <span className="text-xs text-gray-500">day1@woopress.ippbx</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(connectionStatus.masterpbx)}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  connectionStatus.masterpbx === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : connectionStatus.masterpbx === 'disconnected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {connectionStatus.masterpbx === 'connected' ? t.connected : 
                   connectionStatus.masterpbx === 'disconnected' ? t.disconnected : t.checking}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Backend Server</span>
                <span className="text-xs text-gray-500">FastAPI</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(connectionStatus.backend)}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  connectionStatus.backend === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : connectionStatus.backend === 'disconnected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {connectionStatus.backend === 'connected' ? t.connected : 
                   connectionStatus.backend === 'disconnected' ? t.disconnected : t.checking}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Analytics Summary */}
      {realtimeAnalytics && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-8`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">סיכום נתונים בזמן אמת</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{realtimeAnalytics.total_calls_today}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">שיחות היום</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{realtimeAnalytics.active_calls}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">שיחות פעילות</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{realtimeAnalytics.checkcall_data.total_calls}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">סה״כ Checkcall</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{new Date(realtimeAnalytics.timestamp).toLocaleTimeString('he-IL')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">עדכון אחרון</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'calls': return <CallsView />;
      case 'contacts': return <ContactsView />;
      case 'crm': return <CRMView />;
      case 'attendance': return <AttendanceView />;
      case 'analytics': return <AnalyticsView />;
      case 'marketplace': return <MarketplaceView />;
      case 'learning': return <LearningView />;
      case 'automations': return <AutomationCenter darkMode={darkMode} t={t} />;
      case 'callFlows': return <CallFlowCanvas darkMode={darkMode} t={t} />;
      case 'documents': return <DocumentGenerator darkMode={darkMode} t={t} />;
      case 'aiAnalytics': return <AIAnalytics darkMode={darkMode} t={t} currentCall={currentCall} isCallActive={isCallActive} />;
      case 'messaging': return <MessagingCenter darkMode={darkMode} t={t} />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;