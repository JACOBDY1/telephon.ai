import React from 'react';
import { RefreshCw, Phone, PhoneCall, Clock, BarChart3, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';

const Dashboard = ({ 
  loading, 
  realtimeAnalytics, 
  realCallData, 
  checkcallData, 
  masterpbxData, 
  connectionStatus, 
  loadRealData, 
  darkMode, 
  t 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
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
};

export default Dashboard;