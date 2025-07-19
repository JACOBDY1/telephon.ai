import React from 'react';
import { Phone, User, Mic, Volume2, RefreshCw } from 'lucide-react';

const CallsView = ({ 
  darkMode, 
  t, 
  isCallActive, 
  currentCall, 
  endCall, 
  realCallData, 
  connectionStatus, 
  loading 
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
              <span>{getStatusIcon(connectionStatus.checkcall)}</span>
              <span>{getStatusIcon(connectionStatus.masterpbx)}</span>
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
};

export default CallsView;