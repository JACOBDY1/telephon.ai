import React from 'react';
import { Phone, BarChart3, Users2, UserCheck, TrendingUp, Workflow, ShoppingCart, BookOpen, Settings, Menu, X, FileText, Palette, Brain, MessageSquare } from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  activeTab, 
  setActiveTab, 
  t, 
  crmData, 
  attendanceData, 
  automationRules, 
  learningModules,
  connectionStatus 
}) => {
  const getStatusIcon = (status) => {
    const icons = {
      'connected': '🟢',
      'disconnected': '🔴',
      'checking': '🟡'
    };
    return icons[status] || '⚪';
  };

  return (
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
            { id: 'callFlows', icon: Palette, label: t.callFlows, badge: 'מתקדם' },
            { id: 'documents', icon: FileText, label: t.documents, badge: 'חדש' },
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