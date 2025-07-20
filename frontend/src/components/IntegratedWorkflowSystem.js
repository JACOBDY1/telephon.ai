import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, User, Package, Target, TrendingUp, 
  Plus, Edit, Trash2, CheckCircle, AlertCircle, Star,
  Timer, ShoppingCart, DollarSign, Award, Zap, Bell,
  BookOpen, Coffee, Scissors, Sparkles, Heart, Gift,
  BarChart3, PieChart, Activity, Users, PhoneCall,
  MapPin, Camera, MessageSquare, ThumbsUp, ArrowRight,
  Play
} from 'lucide-react';

const IntegratedWorkflowSystem = ({ darkMode = false, t = {}, user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workStatus, setWorkStatus] = useState('out'); // out, in, break, busy
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [serviceProducts, setServiceProducts] = useState([]);
  const [intelligentRecommendations, setIntelligentRecommendations] = useState([]);
  const [realTimeGoals, setRealTimeGoals] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Load integrated data
    loadIntegratedWorkflowData();
    
    return () => clearInterval(timer);
  }, []);

  const loadIntegratedWorkflowData = () => {
    // Attendance tracking
    setAttendanceData({
      clockInTime: '08:30',
      totalWorkHours: 7.5,
      breakMinutes: 45,
      activeServiceTime: 6.2, // זמן עבודה אקטיבי עם לקוחות
      preparationTime: 1.3, // זמן הכנה
      productiveTasks: 12,
      completedAppointments: 8,
      currentRevenue: 2400
    });

    // Today's schedule with time-based services
    setTodaySchedule([
      {
        id: 1,
        time: '09:00-09:45',
        duration: 45,
        clientName: 'שרה כהן',
        service: 'תספורת נשים',
        serviceType: 'hair_cut',
        price: 180,
        status: 'completed',
        productsSold: [
          { id: 'p1', name: 'שמפו מקצועי', price: 85, margin: 45 },
          { id: 'p2', name: 'מסכה מזינה', price: 65, margin: 35 }
        ],
        tip: 25,
        satisfaction: 5,
        notes: 'לקוחה קבועה, מרוצה מהתוצאה',
        nextAppointment: '2024-02-15',
        referralPotential: 'high'
      },
      {
        id: 2, 
        time: '10:00-11:30',
        duration: 90,
        clientName: 'רחל לוי',
        service: 'צביעה + תספורת',
        serviceType: 'coloring',
        price: 420,
        status: 'completed',
        productsSold: [
          { id: 'p3', name: 'צבע מקצועי', price: 120, margin: 60 },
          { id: 'p4', name: 'טריטמנט לשיער צבוע', price: 95, margin: 50 }
        ],
        tip: 50,
        satisfaction: 5,
        notes: 'מזמינה חברה לפעם הבאה',
        referralPotential: 'confirmed'
      },
      {
        id: 3,
        time: '12:00-12:30', 
        duration: 30,
        clientName: 'מיכל דוד',
        service: 'תיקון גבות',
        serviceType: 'eyebrows',
        price: 80,
        status: 'completed',
        productsSold: [],
        tip: 10,
        satisfaction: 4,
        notes: 'לא קנתה מוצרים - הציע בפעם הבאה',
        missedOpportunity: 'eyebrow_serum'
      },
      {
        id: 4,
        time: '14:00-15:00',
        duration: 60,
        clientName: 'דנה גרין',
        service: 'עיסוי פנים',
        serviceType: 'facial',
        price: 250,
        status: 'in-progress',
        recommendedProducts: [
          { id: 'p5', name: 'קרם לחות פנים', price: 120, probability: 85 },
          { id: 'p6', name: 'סרום נגד הזדקנות', price: 180, probability: 70 }
        ],
        tip: 0,
        notes: 'לקוחה חדשה - הזדמנות למכירה'
      },
      {
        id: 5,
        time: '15:30-16:15',
        duration: 45,
        clientName: 'יעל כהן',
        service: 'מניקור',
        serviceType: 'manicure', 
        price: 120,
        status: 'upcoming',
        recommendedProducts: [
          { id: 'p7', name: 'קרם ידיים מקצועי', price: 45, probability: 90 },
          { id: 'p8', name: 'שמן קוטיקולות', price: 35, probability: 75 }
        ],
        tip: 0,
        notes: 'לקוחה קבועה - בדרך כלל קונה מוצרים'
      }
    ]);

    // Service-Product catalog
    setServiceProducts([
      {
        serviceType: 'hair_cut',
        name: 'תספורת',
        basePrice: 180,
        duration: 45,
        recommendedProducts: [
          { name: 'שמפו מקצועי', price: 85, sellProbability: 80 },
          { name: 'מסכה מזינה', price: 65, sellProbability: 60 },
          { name: 'שמן מגן לשיער', price: 75, sellProbability: 45 }
        ]
      },
      {
        serviceType: 'coloring',
        name: 'צביעה',
        basePrice: 350,
        duration: 120,
        recommendedProducts: [
          { name: 'טריטמנט לשיער צבוע', price: 95, sellProbability: 90 },
          { name: 'שמפו לשיער צבוע', price: 85, sellProbability: 85 },
          { name: 'מסכה לשיער צבוע', price: 110, sellProbability: 70 }
        ]
      },
      {
        serviceType: 'facial',
        name: 'טיפול פנים',
        basePrice: 250,
        duration: 60,
        recommendedProducts: [
          { name: 'קרם לחות פנים', price: 120, sellProbability: 85 },
          { name: 'סרום נגד הזדקנות', price: 180, sellProbability: 70 },
          { name: 'מסכת פנים ביתית', price: 55, sellProbability: 60 }
        ]
      }
    ]);

    // Real-time goal tracking
    setRealTimeGoals({
      timeEfficiency: {
        target: 85, // אחוז זמן פרודקטיבי
        current: 88,
        status: 'above_target'
      },
      serviceRevenue: {
        target: 2200,
        current: 1050, // עד עכשיו
        projected: 2400, // צפי לסוף היום
        status: 'on_track'
      },
      productSales: {
        target: 500,
        current: 365,
        projected: 580,
        status: 'above_target'
      },
      customerSatisfaction: {
        target: 4.5,
        current: 4.8,
        status: 'excellent'
      },
      tips: {
        target: 250,
        current: 85,
        projected: 190,
        status: 'slightly_behind'
      }
    });

    // AI-powered recommendations
    setIntelligentRecommendations([
      {
        type: 'product_opportunity',
        priority: 'high',
        message: 'דנה גרין (14:00) - לקוחה חדשה לטיפול פנים. הצלחה 85% למכירת קרם לחות',
        action: 'הכן המלצה על קרם פנים',
        potentialRevenue: 120
      },
      {
        type: 'upsell_opportunity', 
        priority: 'medium',
        message: 'יעל כהן (15:30) - לקוחה קבועה למניקור. הוסף טיפול פדיקור (+60 דק, +180₪)',
        action: 'הצע שדרוג לטיפול כפול',
        potentialRevenue: 180
      },
      {
        type: 'time_optimization',
        priority: 'low',
        message: 'יש לך 15 דקות פנויות בין 16:15-16:30. נצל לארגון או מכירת מוצרים טלפונית',
        action: 'התקשר ללקוחה מאתמול'
      }
    ]);
  };

  const handleClockInOut = () => {
    const newStatus = workStatus === 'out' ? 'in' : 'out';
    setWorkStatus(newStatus);
    
    if (newStatus === 'in') {
      // התחל יום עבודה
      console.log(`התחלת משמרת בשעה ${currentTime.toLocaleTimeString('he-IL')}`);
    } else {
      // סיום יום עבודה - חישוב סיכום
      const dailySummary = calculateDailySummary();
      console.log('סיכום יום:', dailySummary);
    }
  };

  const calculateDailySummary = () => {
    const completedAppointments = todaySchedule.filter(apt => apt.status === 'completed');
    const totalServiceRevenue = completedAppointments.reduce((sum, apt) => sum + apt.price, 0);
    const totalProductRevenue = completedAppointments.reduce((sum, apt) => 
      sum + apt.productsSold?.reduce((pSum, product) => pSum + product.price, 0) || 0, 0);
    const totalTips = completedAppointments.reduce((sum, apt) => sum + (apt.tip || 0), 0);
    
    return {
      appointments: completedAppointments.length,
      serviceRevenue: totalServiceRevenue,
      productRevenue: totalProductRevenue,
      tips: totalTips,
      totalRevenue: totalServiceRevenue + totalProductRevenue + totalTips,
      averageSatisfaction: completedAppointments.reduce((sum, apt) => sum + (apt.satisfaction || 0), 0) / completedAppointments.length
    };
  };

  const startAppointment = (appointmentId) => {
    setWorkStatus('busy');
    setSelectedAppointment(appointmentId);
    
    // Update appointment status
    setTodaySchedule(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'in-progress', actualStartTime: currentTime.toLocaleTimeString('he-IL') }
        : apt
    ));
  };

  const completeAppointment = (appointmentId, completionData) => {
    setWorkStatus('in');
    setSelectedAppointment(null);
    
    setTodaySchedule(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            status: 'completed',
            actualEndTime: currentTime.toLocaleTimeString('he-IL'),
            ...completionData
          }
        : apt
    ));
  };

  const WorkStatusCard = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">מעקב זמן עבודה</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          workStatus === 'in' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          workStatus === 'busy' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          workStatus === 'break' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {workStatus === 'in' ? '🟢 זמין' : 
           workStatus === 'busy' ? '🔵 עם לקוח' :
           workStatus === 'break' ? '🟡 בהפסקה' : '🔴 לא במשמרת'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{currentTime.toLocaleTimeString('he-IL')}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">זמן נוכחי</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{attendanceData.totalWorkHours}h</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">סה״כ עבודה</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{attendanceData.activeServiceTime}h</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">זמן עם לקוחות</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{attendanceData.completedAppointments}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">טיפולים הושלמו</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClockInOut}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            workStatus === 'out' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <Clock className="w-5 h-5 inline ml-2" />
          {workStatus === 'out' ? 'כניסה למשמרת' : 'יציאה ממשמרת'}
        </button>
        
        {workStatus !== 'out' && (
          <button
            onClick={() => setWorkStatus(workStatus === 'break' ? 'in' : 'break')}
            className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium"
          >
            {workStatus === 'break' ? 'חזרה מהפסקה' : 'יציאה להפסקה'}
          </button>
        )}
      </div>
    </div>
  );

  const TodayScheduleCard = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        לוח זמנים היום - {currentTime.toLocaleDateString('he-IL')}
      </h3>
      
      <div className="space-y-4">
        {todaySchedule.map((appointment) => (
          <div key={appointment.id} className={`border rounded-lg p-4 ${
            appointment.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border-green-200' :
            appointment.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' :
            appointment.status === 'upcoming' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' :
            'bg-gray-50 dark:bg-gray-700 border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-500' :
                    appointment.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {appointment.clientName}
                  </h4>
                  <span className="text-sm text-gray-500">{appointment.time}</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    {appointment.duration} דק׳
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-2">{appointment.service}</p>
                
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-green-600 font-medium">₪{appointment.price}</span>
                  {appointment.tip > 0 && (
                    <span className="text-purple-600 font-medium">+₪{appointment.tip} טיפ</span>
                  )}
                  {appointment.satisfaction && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{appointment.satisfaction}</span>
                    </div>
                  )}
                </div>
                
                {/* Products Section */}
                {appointment.productsSold && appointment.productsSold.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                      מוצרים שנמכרו:
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {appointment.productsSold.map((product, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{product.name}</span>
                          <span className="text-green-600 font-medium">₪{product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Recommended Products */}
                {appointment.recommendedProducts && appointment.recommendedProducts.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                      מוצרים מומלצים למכירה:
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {appointment.recommendedProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{product.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">₪{product.price}</span>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">
                              {product.probability}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {appointment.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    📝 {appointment.notes}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-2 ml-4">
                {appointment.status === 'upcoming' && (
                  <button 
                    onClick={() => startAppointment(appointment.id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    התחל
                  </button>
                )}
                
                {appointment.status === 'in-progress' && (
                  <button 
                    onClick={() => completeAppointment(appointment.id, { satisfaction: 5, tip: 30 })}
                    className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" />
                    סיים
                  </button>
                )}
                
                {appointment.status === 'completed' && appointment.referralPotential && (
                  <button className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    חבר
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RealTimeGoalsCard = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        יעדים בזמן אמת - התקדמות לייב
      </h3>
      
      <div className="space-y-4">
        {Object.entries(realTimeGoals).map(([key, goal]) => {
          const isProjected = goal.projected !== undefined;
          const currentValue = isProjected ? goal.projected : goal.current;
          const percentage = Math.round((currentValue / goal.target) * 100);
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {key === 'timeEfficiency' ? '🎯 יעילות זמן' :
                   key === 'serviceRevenue' ? '💇 הכנסות מטיפולים' :
                   key === 'productSales' ? '🛍️ מכירות מוצרים' :
                   key === 'customerSatisfaction' ? '⭐ שביעות רצון' :
                   key === 'tips' ? '💝 טיפים' : key}
                </span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {typeof goal.current === 'number' ? 
                      (key === 'customerSatisfaction' ? goal.current.toFixed(1) : 
                       key === 'timeEfficiency' ? `${goal.current}%` : 
                       `₪${goal.current.toLocaleString()}`) : goal.current}
                    {isProjected && (
                      <span className="text-blue-600 ml-1">
                        → {typeof goal.projected === 'number' ? 
                          (key === 'timeEfficiency' ? `${goal.projected}%` : `₪${goal.projected.toLocaleString()}`) 
                          : goal.projected}
                      </span>
                    )}
                  </span>
                  <div className="text-xs text-gray-500">
                    יעד: {typeof goal.target === 'number' ? 
                      (key === 'customerSatisfaction' ? goal.target.toFixed(1) :
                       key === 'timeEfficiency' ? `${goal.target}%` : 
                       `₪${goal.target.toLocaleString()}`) : goal.target}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    percentage >= 100 ? 'bg-green-500' :
                    percentage >= 80 ? 'bg-blue-500' :
                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className={`font-medium ${
                  goal.status === 'excellent' || goal.status === 'above_target' ? 'text-green-600' :
                  goal.status === 'on_track' ? 'text-blue-600' :
                  goal.status === 'slightly_behind' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {goal.status === 'excellent' ? '🏆 מעולה' :
                   goal.status === 'above_target' ? '📈 מעל היעד' :
                   goal.status === 'on_track' ? '✅ במסלול' :
                   goal.status === 'slightly_behind' ? '⚠️ מעט מתחת' : '🔻 מתחת ליעד'}
                </span>
                <span className="text-gray-500">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* AI Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              המלצות חכמות לשיפור יעדים
            </h4>
            <div className="space-y-2">
              {intelligentRecommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded border-l-4 ${
                  rec.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {rec.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{rec.action}</span>
                    {rec.potentialRevenue && (
                      <span className="text-xs font-medium text-green-600">
                        +₪{rec.potentialRevenue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 lg:p-6`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ⚡ מערכת זמן-מוצר-יעדים משולבת
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ניהול חכם של זמן, שירותים, מוצרים ויעדים בזמן אמת
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WorkStatusCard />
        <RealTimeGoalsCard />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TodayScheduleCard />
      </div>
    </div>
  );
};

export default IntegratedWorkflowSystem;