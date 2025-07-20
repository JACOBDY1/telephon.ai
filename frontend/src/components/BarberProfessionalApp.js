import React, { useState, useEffect, useRef } from 'react';
import { 
  Scissors, Calendar, Target, Gift, Users, Clock, 
  DollarSign, Star, TrendingUp, Phone, MessageSquare,
  CheckCircle, Plus, Edit, Camera, Share2, Settings,
  Coffee, Heart, Award, Zap, Timer, BarChart3, Search, 
  User, Package, Scale, Bell, AlertCircle, Check, Activity, 
  Smartphone, Wifi, X, Edit2, Save, RefreshCw, FileText, 
  Download, Upload, Printer, Home, Minus, ChevronLeft, 
  ChevronRight, ChevronUp, ChevronDown, Filter, Calendar as CalendarIcon,
  Palette, Beaker, Droplets, Weight, PieChart, LineChart,
  ShoppingCart, CreditCard, UserPlus, MapPin, Mail
} from 'lucide-react';

// מאגר צבעים מתקדם לסלון שיער
const colorDatabase = {
  schwarzkopf: {
    name: "שוורצקוף",
    logo: "🎨",
    series: {
      igoraRoyal: {
        name: "IGORA ROYAL",
        description: "צבע קבוע מקצועי עם כיסוי של עד 100% שיער לבן",
        colors: [
          { code: "1-0", name: "שחור", base: 1, primary: 0, secondary: 0, hex: "#1a1a1a", price: 28 },
          { code: "3-0", name: "חום כהה", base: 3, primary: 0, secondary: 0, hex: "#3e2723", price: 28 },
          { code: "4-0", name: "חום בינוני", base: 4, primary: 0, secondary: 0, hex: "#5d4037", price: 28 },
          { code: "5-0", name: "חום בהיר", base: 5, primary: 0, secondary: 0, hex: "#6d4c41", price: 28 },
          { code: "6-0", name: "בלונד כהה", base: 6, primary: 0, secondary: 0, hex: "#8d6e63", price: 28 },
          { code: "7-0", name: "בלונד בינוני", base: 7, primary: 0, secondary: 0, hex: "#a1887f", price: 28 },
          { code: "8-0", name: "בלונד בהיר", base: 8, primary: 0, secondary: 0, hex: "#bcaaa4", price: 28 },
          { code: "9-0", name: "בלונד בהיר מאוד", base: 9, primary: 0, secondary: 0, hex: "#d7ccc8", price: 28 },
          { code: "10-0", name: "בלונד פלטינה", base: 10, primary: 0, secondary: 0, hex: "#efebe9", price: 32 },
          { code: "4-65", name: "חום בינוני שוקולד נחושת", base: 4, primary: 6, secondary: 5, hex: "#6d4c41", price: 30 },
          { code: "5-88", name: "חום בהיר אדום אינטנסיבי", base: 5, primary: 8, secondary: 8, hex: "#8e5a4a", price: 30 },
          { code: "6-12", name: "בלונד כהה אפרפר פנינה", base: 6, primary: 1, secondary: 2, hex: "#9e9e9e", price: 30 },
          { code: "7-31", name: "בלונד בינוני מט זהוב", base: 7, primary: 3, secondary: 1, hex: "#c9a961", price: 30 },
          { code: "8-77", name: "בלונד בהיר נחושת אינטנסיבי", base: 8, primary: 7, secondary: 7, hex: "#d4a574", price: 32 },
          { code: "9-55", name: "בלונד בהיר מאוד מהגוני אינטנסיבי", base: 9, primary: 5, secondary: 5, hex: "#c8928a", price: 32 }
        ],
        mixing: "1:1 עם חמצן",
        timing: "30-45 דקות",
        developer: [
          { vol: "10vol (3%)", description: "טון על טון או כהייה", price: 0.05 },
          { vol: "20vol (6%)", description: "כיסוי שיער לבן, הבהרה 1-2 טונים", price: 0.05 },
          { vol: "30vol (9%)", description: "הבהרה 2-3 טונים", price: 0.06 },
          { vol: "40vol (12%)", description: "הבהרה 3-4 טונים", price: 0.07 }
        ]
      }
    }
  },
  loreal: {
    name: "לוריאל פרופסיונל",
    logo: "✨",
    series: {
      majirel: {
        name: "MAJIREL",
        description: "צבע קבוע עם טכנולוגיית Ionène G + Incell",
        colors: [
          { code: "1", name: "שחור", hex: "#000000", price: 32 },
          { code: "3", name: "חום כהה", hex: "#3e2723", price: 32 },
          { code: "4", name: "חום בינוני", hex: "#5d4037", price: 32 },
          { code: "5", name: "חום בהיר", hex: "#6d4c41", price: 32 },
          { code: "6", name: "בלונד כהה", hex: "#8d6e63", price: 32 },
          { code: "7", name: "בלונד", hex: "#a1887f", price: 32 },
          { code: "8", name: "בלונד בהיר", hex: "#bcaaa4", price: 32 },
          { code: "9", name: "בלונד בהיר מאוד", hex: "#d7ccc8", price: 32 }
        ]
      }
    }
  }
};

// רכיב התראות חכם
const NotificationCenter = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-20 left-4 z-50 max-w-sm">
      {notifications.map((notification, index) => (
        <div 
          key={notification.id} 
          className={`mb-2 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            notification.type === 'error' ? 'bg-red-500' : 
            notification.type === 'warning' ? 'bg-yellow-500' : 
            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          } text-white`}
          style={{ 
            animation: 'slideIn 0.3s ease-out',
            animationDelay: `${index * 0.1}s`
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">{notification.title}</h4>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
            </div>
            <button 
              onClick={() => onClose(notification.id)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// רכיב שעון פעילות צף
const FloatingActivityClock = ({ workStatus, currentClient, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [workTime, setWorkTime] = useState(0);

  useEffect(() => {
    let interval;
    if (workStatus === 'working') {
      interval = setInterval(() => {
        setWorkTime(prev => prev + 1);
      }, 1000);
    } else if (workStatus === 'ready') {
      setWorkTime(0);
    }
    return () => clearInterval(interval);
  }, [workStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (workStatus) {
      case 'working': return 'bg-green-500';
      case 'break': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = () => {
    switch (workStatus) {
      case 'working': return 'עובד עם לקוח';
      case 'break': return 'בהפסקה';
      default: return 'מוכן ללקוח הבא';
    }
  };

  return (
    <div className={`fixed bottom-24 right-4 z-50 transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className={`${getStatusColor()} rounded-full shadow-lg text-white overflow-hidden`}>
        {!isExpanded ? (
          // צורה מצומצמת
          <button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Timer className="w-6 h-6" />
          </button>
        ) : (
          // צורה מורחבת
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Timer className="w-5 h-5" />
              <button
                onClick={() => setIsExpanded(false)}
                className="hover:bg-white/20 rounded p-1"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center mb-3">
              <div className="text-2xl font-mono font-bold">{formatTime(workTime)}</div>
              <div className="text-xs opacity-80">{getStatusText()}</div>
              {currentClient && (
                <div className="text-sm mt-1">{currentClient.name}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onStatusChange('working')}
                className={`px-2 py-1 text-xs rounded ${
                  workStatus === 'working' 
                    ? 'bg-white text-green-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                התחל עבודה
              </button>
              <button
                onClick={() => onStatusChange('break')}
                className={`px-2 py-1 text-xs rounded ${
                  workStatus === 'break' 
                    ? 'bg-white text-yellow-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                הפסקה
              </button>
            </div>
            
            <button
              onClick={() => onStatusChange('ready')}
              className="w-full mt-2 px-2 py-1 text-xs rounded bg-white/20 hover:bg-white/30"
            >
              סיים
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BarberProfessionalApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workStatus, setWorkStatus] = useState('ready'); // ready, working, break
  const [todayStats, setTodayStats] = useState({});
  const [dailyGoals, setDailyGoals] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load barber data
  useEffect(() => {
    loadBarberData();
  }, []);

  const loadBarberData = () => {
    // Today's statistics
    setTodayStats({
      appointmentsCompleted: 8,
      totalRevenue: 1420,
      tips: 180,
      averageService: 178,
      workingHours: 6.5,
      customerSatisfaction: 4.9,
      newCustomers: 3,
      repeatCustomers: 5
    });

    // Daily goals
    setDailyGoals({
      appointments: { current: 8, target: 12, percentage: 67 },
      revenue: { current: 1420, target: 1800, percentage: 79 },
      tips: { current: 180, target: 250, percentage: 72 },
      newCustomers: { current: 3, target: 4, percentage: 75 },
      satisfaction: { current: 4.9, target: 4.5, percentage: 109 }
    });

    // Today's appointments
    setTodayAppointments([
      {
        id: 1,
        time: '09:00',
        clientName: 'דוד כהן',
        service: 'תספורת + זקן',
        price: 120,
        duration: 45,
        status: 'completed',
        tip: 20,
        notes: 'לקוח קבוע, אוהב תספורת קצרה',
        satisfaction: 5,
        phone: '050-1234567'
      },
      {
        id: 2,
        time: '10:00',
        clientName: 'יואב מזרחי',
        service: 'תספורת VIP',
        price: 180,
        duration: 60,
        status: 'completed',
        tip: 30,
        notes: 'ביקש סטייל חדש, מרוצה מהתוצאה',
        satisfaction: 5,
        phone: '052-9876543'
      },
      {
        id: 3,
        time: '11:30',
        clientName: 'משה לוי',
        service: 'תספורת + שמפו',
        price: 140,
        duration: 50,
        status: 'completed',
        tip: 15,
        notes: 'שיער דק, זקוק לטיפוח מיוחד',
        satisfaction: 4,
        phone: '054-5555555'
      },
      {
        id: 4,
        time: '14:00',
        clientName: 'אבי דוד',
        service: 'גילוח מסורתי',
        price: 100,
        duration: 40,
        status: 'in-progress',
        tip: 0,
        notes: 'לקוח חדש, רוצה גילוח קלאסי',
        satisfaction: 0,
        phone: '053-7777777'
      },
      {
        id: 5,
        time: '15:00',
        clientName: 'רון אברהם',
        service: 'תספורת ילדים',
        price: 80,
        duration: 30,
        status: 'upcoming',
        tip: 0,
        notes: 'ילד בן 8, צריך סבלנות',
        satisfaction: 0,
        phone: '055-1111111'
      }
    ]);

    // Notifications
    setNotifications([
      {
        id: 1,
        message: 'רון אברהם מגיע בעוד 15 דקות',
        type: 'upcoming',
        time: '14:45'
      },
      {
        id: 2,
        message: 'הגעת ליעד הטיפים היומי! 🎉',
        type: 'achievement',
        time: '13:20'
      }
    ]);
  };

  const startAppointment = (appointmentId) => {
    setTodayAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'in-progress', actualStartTime: currentTime.toLocaleTimeString() }
        : apt
    ));
    setWorkStatus('working');
  };

  const completeAppointment = (appointmentId, tip = 0, satisfaction = 5) => {
    setTodayAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            status: 'completed', 
            tip, 
            satisfaction,
            actualEndTime: currentTime.toLocaleTimeString()
          }
        : apt
    ));
    setWorkStatus('ready');
    
    // Update stats
    setTodayStats(prev => ({
      ...prev,
      appointmentsCompleted: prev.appointmentsCompleted + 1,
      totalRevenue: prev.totalRevenue + (todayAppointments.find(a => a.id === appointmentId)?.price || 0),
      tips: prev.tips + tip
    }));
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">שלום, מאסטר ספר! ✂️</h1>
            <p className="text-blue-100">{currentTime.toLocaleDateString('he-IL')} • {currentTime.toLocaleTimeString('he-IL')}</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              workStatus === 'working' ? 'bg-green-500' : 
              workStatus === 'break' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}>
              <Scissors className="w-4 h-4 ml-2" />
              {workStatus === 'working' ? 'עובד עם לקוח' : 
               workStatus === 'break' ? 'בהפסקה' : 'מוכן ללקוח הבא'}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'לקוחות היום', 
            value: todayStats.appointmentsCompleted, 
            icon: Users, 
            color: 'bg-blue-500',
            suffix: 'לקוחות'
          },
          { 
            title: 'הכנסות היום', 
            value: `₪${todayStats.totalRevenue}`, 
            icon: DollarSign, 
            color: 'bg-green-500'
          },
          { 
            title: 'טיפים היום', 
            value: `₪${todayStats.tips}`, 
            icon: Gift, 
            color: 'bg-purple-500'
          },
          { 
            title: 'דירוג שביעות רצון', 
            value: `${todayStats.customerSatisfaction}`, 
            icon: Star, 
            color: 'bg-yellow-500',
            suffix: '⭐'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.suffix && <span className="text-sm text-gray-500 mr-1">{stat.suffix}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Goals Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          יעדים יומיים
        </h3>
        <div className="space-y-4">
          {Object.entries(dailyGoals).map(([key, goal]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {key === 'appointments' ? 'טיפולים' :
                   key === 'revenue' ? 'הכנסות' :
                   key === 'tips' ? 'טיפים' :
                   key === 'newCustomers' ? 'לקוחות חדשים' :
                   key === 'satisfaction' ? 'שביעות רצון' : key}
                </span>
                <div className="text-sm text-gray-600">
                  {typeof goal.current === 'number' && goal.current < 10 ? goal.current : 
                   typeof goal.current === 'string' ? goal.current : goal.current}
                  /{goal.target}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    goal.percentage >= 100 ? 'bg-green-500' :
                    goal.percentage >= 80 ? 'bg-blue-500' :
                    goal.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className={`font-medium ${
                  goal.percentage >= 100 ? 'text-green-600' :
                  goal.percentage >= 80 ? 'text-blue-600' :
                  goal.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {goal.percentage >= 100 ? '🎉 יעד הושג!' :
                   goal.percentage >= 80 ? '💪 כמעט שם!' :
                   goal.percentage >= 60 ? '⚡ בדרך!' : '🚀 בואו נתחיל!'}
                </span>
                <span className="text-gray-500">{goal.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveView('appointments')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all"
        >
          <Calendar className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">היומן שלי</div>
            <div className="text-sm opacity-80">ניהול תורים</div>
          </div>
        </button>
        <button
          onClick={() => setActiveView('clients')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all"
        >
          <Users className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">הלקוחות שלי</div>
            <div className="text-sm opacity-80">רשימת לקוחות</div>
          </div>
        </button>
      </div>
    </div>
  );

  // Appointments View
  const AppointmentsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">היומן שלי - היום</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          תור חדש
        </button>
      </div>

      <div className="space-y-4">
        {todayAppointments.map((appointment) => (
          <div key={appointment.id} className={`bg-white rounded-xl p-6 shadow-sm border-r-4 ${
            appointment.status === 'completed' ? 'border-green-500' :
            appointment.status === 'in-progress' ? 'border-blue-500' :
            'border-yellow-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-500' :
                    appointment.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <h3 className="text-xl font-semibold text-gray-900">{appointment.clientName}</h3>
                  <span className="text-sm text-gray-500">{appointment.time}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 mb-1">{appointment.service}</p>
                    <p className="text-lg font-bold text-green-600">₪{appointment.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">משך זמן: {appointment.duration} דק׳</p>
                    {appointment.tip > 0 && (
                      <p className="text-purple-600 font-medium">טיפ: ₪{appointment.tip}</p>
                    )}
                  </div>
                </div>
                
                {appointment.notes && (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg mb-4">
                    📝 {appointment.notes}
                  </p>
                )}
                
                {appointment.satisfaction > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">דירוג:</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${
                        i < appointment.satisfaction ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`} />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                {appointment.status === 'upcoming' && (
                  <button 
                    onClick={() => startAppointment(appointment.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Timer className="w-4 h-4" />
                    התחל
                  </button>
                )}
                
                {appointment.status === 'in-progress' && (
                  <button 
                    onClick={() => completeAppointment(appointment.id, 25, 5)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    סיים
                  </button>
                )}
                
                {appointment.phone && (
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    התקשר
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Navigation
  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="grid grid-cols-4 py-2">
        {[
          { id: 'dashboard', icon: BarChart3, label: 'דשבורד' },
          { id: 'appointments', icon: Calendar, label: 'יומן' },
          { id: 'clients', icon: Users, label: 'לקוחות' },
          { id: 'stats', icon: Target, label: 'סטטיסטיקות' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`flex flex-col items-center py-3 px-2 ${
              activeView === id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ספר פרו</h1>
              <p className="text-xs text-gray-500">מערכת ניהול לסלון</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="relative">
                <div className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </div>
              </div>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'appointments' && <AppointmentsView />}
        {activeView === 'clients' && <div className="text-center py-12"><Users className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">רשימת לקוחות בפיתוח...</p></div>}
        {activeView === 'stats' && <div className="text-center py-12"><Target className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">סטטיסטיקות בפיתוח...</p></div>}
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default BarberProfessionalApp;