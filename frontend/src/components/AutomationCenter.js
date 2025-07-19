import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Play, Pause, MessageSquare, Mail, Phone, 
  Settings, Bot, Zap, Clock, Target, Activity, Send, Users,
  Calendar, AlertCircle, CheckCircle, Filter, Search
} from 'lucide-react';

const AutomationCenter = ({ darkMode, t }) => {
  const [activeAutomation, setActiveAutomation] = useState(null);
  const [showNewAutomation, setShowNewAutomation] = useState(false);
  const [automationFilter, setAutomationFilter] = useState('all');

  // מערכת אוטומציות מתקדמת
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'SMS אוטומטי ללידים חדשים',
      type: 'sms',
      active: true,
      triggers: 15,
      success_rate: 85,
      template: 'שלום {name}, תודה על פנייתך! נציג יחזור אליך בקרוב.',
      conditions: ['new_lead', 'source_website'],
      actions: ['send_sms', 'create_task', 'notify_agent'],
      last_run: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: 'WhatsApp מעקב אחר שיחות לא נענו',
      type: 'whatsapp',
      active: true,
      triggers: 8,
      success_rate: 92,
      template: 'היי! ראיתי שניסיתי להתקשר אליך. איך אוכל לעזור? 😊',
      conditions: ['missed_call', 'duration_0'],
      actions: ['send_whatsapp', 'schedule_callback'],
      last_run: '2024-01-15 13:45'
    },
    {
      id: 3,
      name: 'אימייל סיכום שיחה אוטומטי',
      type: 'email',
      active: false,
      triggers: 0,
      success_rate: 78,
      template: 'סיכום השיחה: {transcription_summary}',
      conditions: ['call_ended', 'duration_min_2'],
      actions: ['send_email', 'save_summary'],
      last_run: '2024-01-14 16:20'
    },
    {
      id: 4,
      name: 'הפניה חכמה לפי שעות',
      type: 'routing',
      active: true,
      triggers: 42,
      success_rate: 96,
      template: '',
      conditions: ['working_hours', 'agent_available'],
      actions: ['route_call', 'play_message'],
      last_run: '2024-01-15 14:55'
    },
    {
      id: 5,
      name: 'דוח יומי למנהלים',
      type: 'report',
      active: true,
      triggers: 1,
      success_rate: 100,
      template: 'דוח יומי: {total_calls} שיחות, {conversion_rate}% המרה',
      conditions: ['daily_18:00'],
      actions: ['generate_report', 'send_email_managers'],
      last_run: '2024-01-14 18:00'
    }
  ]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'routing': return <Phone className="w-4 h-4" />;
      case 'report': return <Activity className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sms': return 'bg-blue-100 text-blue-800';
      case 'whatsapp': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      case 'routing': return 'bg-orange-100 text-orange-800';
      case 'report': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAutomations = automations.filter(automation => {
    if (automationFilter === 'all') return true;
    if (automationFilter === 'active') return automation.active;
    if (automationFilter === 'inactive') return !automation.active;
    return automation.type === automationFilter;
  });

  const toggleAutomation = (id) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id ? { ...automation, active: !automation.active } : automation
    ));
  };

  const NewAutomationModal = () => {
    const [newAutomation, setNewAutomation] = useState({
      name: '',
      type: 'sms',
      template: '',
      conditions: [],
      actions: []
    });

    if (!showNewAutomation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-2xl mx-4`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">אוטומציה חדשה</h3>
            <button 
              onClick={() => setShowNewAutomation(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                שם האוטומציה
              </label>
              <input
                type="text"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="לדוגמה: SMS ברכה ללקוחות חדשים"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                סוג אוטומציה
              </label>
              <select
                value={newAutomation.type}
                onChange={(e) => setNewAutomation({...newAutomation, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="routing">הפניית שיחות</option>
                <option value="report">דוחות</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                תבנית הודעה
              </label>
              <textarea
                value={newAutomation.template}
                onChange={(e) => setNewAutomation({...newAutomation, template: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-20"
                placeholder="שלום {name}, תודה על..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  תנאי הפעלה
                </label>
                <div className="space-y-1">
                  {['ליד חדש', 'שיחה לא נענתה', 'שיחה הסתיימה', 'שעות עבודה'].map(condition => (
                    <label key={condition} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  פעולות
                </label>
                <div className="space-y-1">
                  {['שלח הודעה', 'צור משימה', 'התראה לנציג', 'יצירת דוח'].map(action => (
                    <label key={action} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowNewAutomation(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              onClick={() => {
                // כאן יהיה הקוד ליצירת האוטומציה
                setShowNewAutomation(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              צור אוטומציה
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">מרכז אוטומציות מתקדם</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            נהל אוטומציות חכמות עבור SMS, WhatsApp, אימיילים ועוד
          </p>
        </div>
        <button 
          onClick={() => setShowNewAutomation(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>אוטומציה חדשה</span>
        </button>
      </div>

      {/* סטטיסטיקות מתקדמות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">אוטומציות פעילות</p>
              <p className="text-3xl font-bold text-green-600">
                {automations.filter(a => a.active).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">הודעות שנשלחו היום</p>
              <p className="text-3xl font-bold text-blue-600">
                {automations.reduce((sum, a) => sum + a.triggers, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">שיעור הצלחה ממוצע</p>
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(automations.reduce((sum, a) => sum + a.success_rate, 0) / automations.length)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">זמן חיסכון שבועי</p>
              <p className="text-3xl font-bold text-orange-600">8.4h</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* מסננים ובחירות */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש אוטומציות..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={automationFilter}
            onChange={(e) => setAutomationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">כל האוטומציות</option>
            <option value="active">פעילות</option>
            <option value="inactive">לא פעילות</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="routing">הפניות</option>
            <option value="report">דוחות</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredAutomations.length} אוטומציות
          </span>
        </div>
      </div>

      {/* רשימת אוטומציות */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAutomations.map((automation) => (
          <div key={automation.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border hover:shadow-lg transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getTypeIcon(automation.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{automation.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(automation.type)}`}>
                    {automation.type}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAutomation(automation.id)}
                  className={`p-2 rounded-lg ${automation.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  {automation.active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {automation.template && (
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3`}>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">תבנית:</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {automation.template}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{automation.triggers}</p>
                  <p className="text-xs text-gray-500">הפעלות</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{automation.success_rate}%</p>
                  <p className="text-xs text-gray-500">הצלחה</p>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center ${automation.active ? 'text-green-600' : 'text-red-600'}`}>
                    {automation.active ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                    <span className="text-xs">{automation.active ? 'פעיל' : 'כבוי'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-gray-500">הפעלה אחרונה: {automation.last_run}</span>
                <div className="flex space-x-1">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewAutomationModal />
    </div>
  );
};

export default AutomationCenter;