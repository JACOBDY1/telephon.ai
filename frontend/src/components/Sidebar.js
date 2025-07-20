import React, { useState, useEffect } from 'react';
import { Phone, BarChart3, Users2, UserCheck, TrendingUp, Workflow, ShoppingCart, BookOpen, Settings, Menu, X, FileText, Palette, Brain, MessageSquare, PhoneCall, Puzzle, User2, CreditCard, Smartphone, Scissors, Zap } from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen = false, 
  setSidebarOpen = () => {}, 
  darkMode = false, 
  activeTab = 'dashboard', 
  setActiveTab = () => {}, 
  t = { dashboard: 'דשבורד' }, 
  crmData = { leads: [], deals: [], tasks: [] }, 
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

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && sidebarOpen ? 'translate-x-0' : ''}
        ${isMobile && !sidebarOpen ? '-translate-x-full' : ''}
        ${!isMobile ? 'translate-x-0' : ''}
        top-0 left-0 z-50 w-80 h-full
        ${darkMode ? 'bg-gray-900' : 'bg-white'} 
        border-r border-gray-200 dark:border-gray-700 
        transition-transform duration-300 ease-in-out
        flex flex-col overflow-hidden
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  TelephonyAI
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  AI-Powered Platform
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

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 lg:space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: t.dashboard },
            { id: 'calls', icon: Phone, label: t.calls },
            { id: 'webDialer', icon: PhoneCall, label: t.webDialer, badge: 'Web' },
            { id: 'crm', icon: Users2, label: t.crm, badge: crmData.leads.length },
            { id: 'attendance', icon: UserCheck, label: t.attendance, badge: attendanceData.filter(a => a.status === 'present').length },
            { id: 'analytics', icon: TrendingUp, label: t.analytics },
            { id: 'aiAnalytics', icon: Brain, label: t.aiAnalytics, badge: 'AI' },
            { id: 'automations', icon: Workflow, label: t.automations, badge: automationRules.filter(r => r.active).length },
            { id: 'messaging', icon: MessageSquare, label: t.messaging, badge: '💬' },
            { id: 'callFlows', icon: Palette, label: t.callFlows, badge: 'מתקדם' },
            { id: 'documents', icon: FileText, label: t.documents, badge: 'חדש' },
            { id: 'modules', icon: Puzzle, label: t.modules, badge: 'חדש' },
            { id: 'mobileApp', icon: Smartphone, label: t.mobileApp, badge: 'PWA' },
            { id: 'providerSystem', icon: Scissors, label: t.providerSystem, badge: '🎯' },
            { id: 'workflowSystem', icon: Zap, label: t.workflowSystem, badge: '⚡' },
            { id: 'subscription', icon: CreditCard, label: t.subscription, badge: '💳' },
            { id: 'marketplace', icon: ShoppingCart, label: t.marketplace, badge: 'NEW' },
            { id: 'learning', icon: BookOpen, label: t.learning, badge: learningModules.length },
            { id: 'profile', icon: User2, label: t.profile, badge: '🔑' },
            { id: 'settings', icon: Settings, label: t.settings }
          ].map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => handleMenuClick(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 lg:py-3 rounded-lg transition-colors relative text-sm lg:text-base ${
                activeTab === id 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <Icon className="w-5 h-5" />
              {sidebarOpen && (
                <>
                  <span className="truncate">{label}</span>
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
              <span>{getStatusIcon(connectionStatus.checkcall)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">MasterPBX</span>
              <span>{getStatusIcon(connectionStatus.masterpbx)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-300">Backend</span>
              <span>{getStatusIcon(connectionStatus.backend)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;