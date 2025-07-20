import React, { useState, useEffect } from 'react';
import { Phone, BarChart3, Users2, UserCheck, TrendingUp, Workflow, ShoppingCart, BookOpen, Settings, Menu, X, FileText, Palette, Brain, MessageSquare, PhoneCall, Puzzle, User2, CreditCard, Smartphone, Scissors, Zap } from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen = false, 
  setSidebarOpen = () => {}, 
  darkMode = false, 
  activeTab = 'dashboard', 
  setActiveTab = () => {},
  t = {},
  crmData = { leads: [] }, 
  attendanceData = [], 
  automationRules = [], 
  learningModules = [],
  connectionStatus = { checkcall: true, masterpbx: true }
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true); // Always open on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Close sidebar when clicking on mobile menu items
  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'connected': '🟢',
      'disconnected': '🔴',
      'checking': '🟡'
    };
    return icons[status] || '⚪';
  };

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: t.dashboard || 'דשבורד', badge: '' },
    { id: 'calls', icon: PhoneCall, label: t.calls || 'שיחות', badge: '' },
    { id: 'contacts', icon: Users2, label: t.contacts || 'אנשי קשר', badge: '' },
    { id: 'crm', icon: Users2, label: t.crm || 'CRM', badge: crmData?.leads?.length > 0 ? `${crmData.leads.length}` : '' },
    { id: 'attendance', icon: UserCheck, label: t.attendance || 'נוכחות', badge: attendanceData?.length > 0 ? `${attendanceData.length}` : '' },
    { id: 'analytics', icon: TrendingUp, label: t.analytics || 'אנליטיקס', badge: '' },
    { id: 'marketplace', icon: ShoppingCart, label: t.marketplace || 'חנות', badge: 'חדש' },
    { id: 'automations', icon: Workflow, label: t.automations || 'אוטומציות', badge: automationRules?.length > 0 ? `${automationRules.length}` : '' },
    { id: 'callFlows', icon: Workflow, label: t.callFlows || 'זרימות שיחה', badge: '' },
    { id: 'documents', icon: FileText, label: t.documents || 'מסמכים', badge: '' },
    { id: 'aiAnalytics', icon: Brain, label: t.aiAnalytics || 'AI אנליטיקס', badge: '🤖' },
    { id: 'messaging', icon: MessageSquare, label: t.messaging || 'מרכז הודעות', badge: '' },
    { id: 'webDialer', icon: Phone, label: t.webDialer || 'חייגן Web', badge: '' },
    { id: 'modules', icon: Puzzle, label: t.modules || 'מנהל מודולים', badge: '' },
    { id: 'subscription', icon: CreditCard, label: t.subscription || 'ניהול מנוי', badge: 'Pro' },
    { id: 'profile', icon: User2, label: t.profile || 'פרופיל', badge: '' },
    { id: 'notifications', icon: Palette, label: t.notifications || 'התראות', badge: '' },
    { id: 'mobileApp', icon: Smartphone, label: t.mobileApp || 'אפליקציית מובייל', badge: '📱' },
    { id: 'providerSystem', icon: Scissors, label: t.providerSystem || 'מערכת ספרים/מטפלים', badge: '✂️' },
    { id: 'workflowSystem', icon: Zap, label: t.workflowSystem || 'זמן-מוצר-יעדים משולב', badge: '⚡' },
    { id: 'settings', icon: Settings, label: t.settings || 'הגדרות', badge: '' }
  ];

  return (
    <div dir="rtl">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - RTL Support */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && sidebarOpen ? 'translate-x-0' : ''}
        ${isMobile && !sidebarOpen ? 'translate-x-full' : ''}
        ${!isMobile ? 'translate-x-0' : ''}
        top-0 right-0 z-50 w-80 h-full
        ${darkMode ? 'bg-gray-900' : 'bg-white'} 
        border-l border-gray-200 dark:border-gray-700 
        transition-transform duration-300 ease-in-out
        flex flex-col overflow-hidden
        shadow-xl
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  TelephonyAI
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  פלטפורמה מבוססת AI
                </div>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map(({ id, icon: Icon, label, badge }) => (
              <button
                key={id}
                onClick={() => handleMenuClick(id)}
                className={`w-full flex items-center space-x-reverse space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-right group ${
                  activeTab === id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-all ${
                  activeTab === id ? 'text-white' : 'group-hover:scale-110'
                }`} />
                <span className="flex-1 font-medium">{label}</span>
                {badge && (
                  <span className={`px-2 py-1 text-xs rounded-full font-medium transition-all ${
                    activeTab === id
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer Status */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400">מחובר</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date().toLocaleTimeString('he-IL')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">CheckCall</span>
                <span>{getStatusIcon(connectionStatus?.checkcall)}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">MasterPBX</span>
                <span>{getStatusIcon(connectionStatus?.masterpbx)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;