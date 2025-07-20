import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUp, ArrowDown, BarChart3, 
  PieChart, Activity, DollarSign, Users, Phone, Target,
  Calendar, Clock, Star, Award, Zap, ThumbsUp, Eye,
  MessageSquare, PhoneCall, UserPlus, ShoppingCart
} from 'lucide-react';

const AdvancedDashboard = ({ darkMode = false, t = {} }) => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [dashboardData, setDashboardData] = useState({});
  const [liveUpdates, setLiveUpdates] = useState({});

  useEffect(() => {
    loadDashboardData();
    
    // Simulate live updates
    const interval = setInterval(() => {
      setLiveUpdates(prev => ({
        ...prev,
        activeCalls: Math.floor(Math.random() * 20) + 5,
        onlineAgents: Math.floor(Math.random() * 15) + 10,
        waitingQueue: Math.floor(Math.random() * 8) + 2
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [timeFilter]);

  const loadDashboardData = () => {
    // Comprehensive dashboard metrics
    setDashboardData({
      kpis: {
        totalRevenue: { value: 87650, change: 12.5, period: 'החודש' },
        totalCalls: { value: 2347, change: 8.3, period: 'השבוע' },
        newLeads: { value: 156, change: -3.2, period: 'השבוע' },
        conversionRate: { value: 23.8, change: 5.7, period: 'החודש' },
        avgCallDuration: { value: 4.2, change: 2.1, period: 'השבוע' },
        customerSatisfaction: { value: 4.7, change: 0.3, period: 'החודש' }
      },
      realTimeStats: {
        activeCalls: 12,
        onlineAgents: 8,
        waitingQueue: 3,
        peakHourCalls: 45,
        currentResponseTime: 15
      },
      callAnalytics: {
        hourlyDistribution: [
          { hour: '08:00', calls: 15, answered: 14 },
          { hour: '09:00', calls: 28, answered: 26 },
          { hour: '10:00', calls: 35, answered: 33 },
          { hour: '11:00', calls: 42, answered: 40 },
          { hour: '12:00', calls: 38, answered: 35 },
          { hour: '13:00', calls: 25, answered: 24 },
          { hour: '14:00', calls: 33, answered: 31 },
          { hour: '15:00', calls: 41, answered: 39 },
          { hour: '16:00', calls: 37, answered: 35 }
        ],
        callOutcomes: [
          { type: 'נענו', count: 156, percentage: 78 },
          { type: 'לא נענו', count: 28, percentage: 14 },
          { type: 'עסוק', count: 16, percentage: 8 }
        ]
      },
      topPerformers: [
        { name: 'יואב כהן', calls: 45, deals: 8, satisfaction: 4.9 },
        { name: 'רחל לוי', calls: 38, deals: 6, satisfaction: 4.8 },
        { name: 'דוד אברהם', calls: 42, deals: 7, satisfaction: 4.7 }
      ],
      recentActivities: [
        { 
          id: 1, 
          type: 'call_completed', 
          message: 'שיחה עם יואב כהן הושלמה (8 דקות)', 
          time: '5 דקות', 
          agent: 'רחל לוי'
        },
        { 
          id: 2, 
          type: 'lead_created', 
          message: 'ליד חדש נוצר מהאתר - דוד מזרחי', 
          time: '12 דקות', 
          source: 'Website'
        },
        { 
          id: 3, 
          type: 'deal_closed', 
          message: 'עסקה נסגרה בסכום ₪15,000', 
          time: '25 דקות', 
          agent: 'יואב כהן'
        },
        { 
          id: 4, 
          type: 'appointment_scheduled', 
          message: 'פגישה נקבעה עם מיכל דוד ליום חמישי', 
          time: '1 שעה', 
          agent: 'רחל לוי'
        }
      ]
    });
  };

  const KPICard = ({ title, value, change, period, icon: Icon, color, format = 'number' }) => {
    if (!value && value !== 0) return null;
    
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {format === 'currency' ? `₪${value.toLocaleString()}` : 
             format === 'percentage' ? `${value}%` :
             format === 'rating' ? `${value}⭐` :
             format === 'duration' ? `${value} דק׳` :
             value.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{period}</p>
        </div>
      </div>
    );
  };

  const RealTimeWidget = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-green-500" />
        סטטיסטיקות בזמן אמת
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{liveUpdates.activeCalls || dashboardData.realTimeStats?.activeCalls}</div>
          <div className="text-sm text-green-700 dark:text-green-300">שיחות פעילות</div>
        </div>
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{liveUpdates.onlineAgents || dashboardData.realTimeStats?.onlineAgents}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">נציגים מחוברים</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{liveUpdates.waitingQueue || dashboardData.realTimeStats?.waitingQueue}</div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">בתור המתנה</div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {dashboardData.realTimeStats?.currentResponseTime}s
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">זמן מענה ממוצע</div>
        </div>
      </div>
    </div>
  );

  const CallDistributionChart = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">התפלגות שיחות יומית</h3>
      <div className="space-y-3">
        {dashboardData.callAnalytics?.hourlyDistribution?.map((data, index) => {
          const percentage = (data.calls / 45) * 100; // Max calls = 45
          const answerRate = (data.answered / data.calls) * 100;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-16 text-sm text-gray-600 dark:text-gray-400">{data.hour}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{data.calls} שיחות</span>
                  <span className={`text-xs ${answerRate > 85 ? 'text-green-600' : answerRate > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {answerRate.toFixed(0)}% נענו
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full relative"
                    style={{ width: `${percentage}%` }}
                  >
                    <div 
                      className="absolute top-0 right-0 h-2 bg-green-500 rounded-r-full"
                      style={{ width: `${answerRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TopPerformersWidget = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-500" />
        מובילים השבוע
      </h3>
      <div className="space-y-4">
        {dashboardData.topPerformers?.map((performer, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">{performer.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {performer.calls} שיחות • {performer.deals} עסקאות • {performer.satisfaction}⭐
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RecentActivitiesWidget = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">פעילות אחרונה</h3>
      <div className="space-y-3">
        {dashboardData.recentActivities?.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className={`p-2 rounded-full ${
              activity.type === 'call_completed' ? 'bg-green-100 text-green-600' :
              activity.type === 'lead_created' ? 'bg-blue-100 text-blue-600' :
              activity.type === 'deal_closed' ? 'bg-purple-100 text-purple-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {activity.type === 'call_completed' ? <PhoneCall className="w-4 h-4" /> :
               activity.type === 'lead_created' ? <UserPlus className="w-4 h-4" /> :
               activity.type === 'deal_closed' ? <ShoppingCart className="w-4 h-4" /> :
               <Calendar className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{activity.time}</span>
                {activity.agent && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">• {activity.agent}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            דשבורד מתקדם 📊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            מעקב מתקדם על כל הנתונים החשובים בזמן אמת
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['היום', 'השבוע', 'החודש'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === period.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="סה״כ הכנסות"
          value={dashboardData.kpis?.totalRevenue?.value}
          change={dashboardData.kpis?.totalRevenue?.change}
          period={dashboardData.kpis?.totalRevenue?.period}
          icon={DollarSign}
          color="bg-green-500"
          format="currency"
        />
        <KPICard 
          title="סה״כ שיחות"
          value={dashboardData.kpis?.totalCalls?.value}
          change={dashboardData.kpis?.totalCalls?.change}
          period={dashboardData.kpis?.totalCalls?.period}
          icon={Phone}
          color="bg-blue-500"
        />
        <KPICard 
          title="לידים חדשים"
          value={dashboardData.kpis?.newLeads?.value}
          change={dashboardData.kpis?.newLeads?.change}
          period={dashboardData.kpis?.newLeads?.period}
          icon={UserPlus}
          color="bg-purple-500"
        />
        <KPICard 
          title="שיעור המרה"
          value={dashboardData.kpis?.conversionRate?.value}
          change={dashboardData.kpis?.conversionRate?.change}
          period={dashboardData.kpis?.conversionRate?.period}
          icon={Target}
          color="bg-orange-500"
          format="percentage"
        />
        <KPICard 
          title="משך שיחה ממוצע"
          value={dashboardData.kpis?.avgCallDuration?.value}
          change={dashboardData.kpis?.avgCallDuration?.change}
          period={dashboardData.kpis?.avgCallDuration?.period}
          icon={Clock}
          color="bg-indigo-500"
          format="duration"
        />
        <KPICard 
          title="שביעות רצון"
          value={dashboardData.kpis?.customerSatisfaction?.value}
          change={dashboardData.kpis?.customerSatisfaction?.change}
          period={dashboardData.kpis?.customerSatisfaction?.period}
          icon={Star}
          color="bg-yellow-500"
          format="rating"
        />
      </div>

      {/* Real-time Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeWidget />
        <CallDistributionChart />
      </div>

      {/* Performance & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPerformersWidget />
        <RecentActivitiesWidget />
      </div>
    </div>
  );
};

export default AdvancedDashboard;