import React from 'react';

const AnalyticsView = ({ darkMode, t, realtimeAnalytics, connectionStatus }) => {
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.analytics} - {t.realTime}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">ניתוח רגשות מ-API</h3>
            <span>{getStatusIcon(connectionStatus.checkcall)}</span>
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
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">נייטרלי</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">שלילי</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">10%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">סטטיסטיקות שיחות</h3>
            <span>{getStatusIcon(connectionStatus.masterpbx)}</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">שיחות כולל השבוע</span>
              <span className="text-2xl font-bold text-blue-600">247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">זמן שיחה ממוצע</span>
              <span className="text-2xl font-bold text-green-600">5:23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">שיעור המרה</span>
              <span className="text-2xl font-bold text-purple-600">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">לידים חדשים</span>
              <span className="text-2xl font-bold text-orange-600">15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">שפות שיחות</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">עברית</span>
              <span className="text-sm font-semibold">60%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">אנגלית</span>
              <span className="text-sm font-semibold">25%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">ערבית</span>
              <span className="text-sm font-semibold">15%</span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">שעות שיא</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">09:00-12:00</span>
              <span className="text-sm font-semibold">45%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">14:00-17:00</span>
              <span className="text-sm font-semibold">35%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">אחרות</span>
              <span className="text-sm font-semibold">20%</span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">מקורות לידים</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">אתר</span>
              <span className="text-sm font-semibold">40%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Google Ads</span>
              <span className="text-sm font-semibold">30%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">המלצות</span>
              <span className="text-sm font-semibold">30%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;