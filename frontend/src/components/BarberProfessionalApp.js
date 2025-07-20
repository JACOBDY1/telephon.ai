import React, { useState, useEffect } from 'react';
import { 
  Scissors, Calendar, Target, Gift, Users, Clock, 
  DollarSign, Star, TrendingUp, Phone, MessageSquare,
  CheckCircle, Plus, Edit, Camera, Share2, Settings,
  Coffee, Heart, Award, Zap, Timer, BarChart3, Search,
  User, Package, Scale, Bell, AlertCircle, Check, Activity,
  PieChart, Droplets, Beaker, Weight, X, ChevronDown,
  Filter, Mail, MapPin, CreditCard
} from 'lucide-react';

// שעון פעילות צף מתקדם
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
          <button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Timer className="w-6 h-6" />
          </button>
        ) : (
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
  const [currentClient, setCurrentClient] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  
  // נתונים מתקדמים לHairPro IL Advanced
  const [todayStats, setTodayStats] = useState({});
  const [dailyGoals, setDailyGoals] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});

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
    // נתונים סטטיסטיים מתקדמים של HairPro IL Advanced
    setTodayStats({
      appointmentsCompleted: 8,
      totalRevenue: 1420,
      tips: 180,
      averageService: 178,
      workingHours: 6.5,
      customerSatisfaction: 4.9,
      newCustomers: 3,
      repeatCustomers: 5,
      colorUsed: 245, // גרם
      wastePercentage: 12,
      efficiency: 88
    });

    // יעדים יומיים מתקדמים
    setDailyGoals({
      appointments: { current: 8, target: 12, percentage: 67 },
      revenue: { current: 1420, target: 1800, percentage: 79 },
      tips: { current: 180, target: 250, percentage: 72 },
      newCustomers: { current: 3, target: 4, percentage: 75 },
      satisfaction: { current: 4.9, target: 4.5, percentage: 109 },
      colorEfficiency: { current: 88, target: 85, percentage: 103 },
      wasteReduction: { current: 12, target: 15, percentage: 80 }
    });

    // לקוחות עם כרטיסי כימיה מתקדמים
    setClients([
      {
        id: 1,
        name: 'שרה כהן',
        phone: '050-1234567',
        email: 'sarah@example.com',
        photo: null,
        birthDate: '1985-03-15',
        hairProfile: {
          naturalColor: 'חום כהה 4',
          currentColor: 'בלונד בהיר 8.3',
          hairType: 'חלק, דק',
          scalpCondition: 'רגיל'
        },
        chemistryCard: {
          allergies: ['PPD - פניל דיאמין'],
          sensitivities: ['אמוניה חזקה'],
          skinTest: {
            date: '2024-01-10',
            result: 'שלילי'
          }
        },
        history: [
          {
            id: 1,
            date: '2024-01-15',
            service: 'צביעה + תספורת',
            cost: 380,
            satisfaction: 5
          }
        ],
        metrics: {
          totalVisits: 12,
          totalSpent: 4250,
          lastVisit: '2024-01-15',
          loyaltyScore: 95
        }
      }
    ]);

    // תורים מתקדמים עם פרטי לקוחות
    setTodayAppointments([
      {
        id: 1,
        time: '09:00',
        clientId: 1,
        clientName: 'שרה כהן',
        service: 'צביעה + תספורת',
        price: 380,
        duration: 120,
        status: 'completed',
        tip: 50,
        notes: 'לקוחה VIP, מעדיפה בלונדים',
        satisfaction: 5,
        allergies: ['PPD'],
        lastColor: 'בלונד בהיר 8.3'
      },
      {
        id: 2,
        time: '11:30',
        clientName: 'רחל אברהם',
        service: 'צביעת שורשים',
        price: 250,
        duration: 90,
        status: 'completed',
        tip: 30,
        satisfaction: 4
      },
      {
        id: 3,
        time: '14:00',
        clientName: 'מירי לוי',
        service: 'גוונים',
        price: 280,
        duration: 75,
        status: 'in-progress',
        notes: 'לקוחה חדשה, רוצה שינוי דרמטי'
      },
      {
        id: 4,
        time: '15:30',
        clientName: 'יעל כהן',
        service: 'תספורת + פן',
        price: 180,
        duration: 60,
        status: 'upcoming',
        notes: 'תספורת לאירוע מיוחד'
      }
    ]);

    // מלאי חכם
    setInventory([
      {
        id: 1,
        product: 'שוורצקוף איגורא 6-0',
        quantity: 12,
        minStock: 5,
        pricePerUnit: 28,
        dailyUsage: 2.5,
        daysLeft: Math.floor(12 / 2.5)
      },
      {
        id: 2,
        product: 'לוריאל מג\'ירל 8.3',
        quantity: 8,
        minStock: 5,
        pricePerUnit: 32,
        dailyUsage: 1.8,
        daysLeft: Math.floor(8 / 1.8)
      }
    ]);

    // נתוני אנליטיקה
    setAnalyticsData({
      colorUsage: {
        'בלונדים': 45,
        'חומים': 35,
        'שחורים': 12,
        'אדומים': 8
      },
      wasteReduction: 22,
      efficiency: 88,
      revenue: {
        daily: 1420,
        weekly: 8640,
        monthly: 36800
      },
      trends: {
        popularColors: ['8.3', '7.0', '6.0', '5.52'],
        peakHours: ['10:00-12:00', '14:00-16:00']
      }
    });

    // התראות
    setNotifications([
      {
        id: 1,
        type: 'warning',
        title: 'מלאי נמוך',
        message: 'לוריאל מג\'ירל 8.3 - נותרו 3 שפופרות'
      },
      {
        id: 2,
        type: 'success', 
        title: 'לקוחה מרוצה',
        message: 'שרה כהן נתנה דירוג 5 כוכבים'
      }
    ]);
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const startAppointment = (appointmentId) => {
    const appointment = todayAppointments.find(apt => apt.id === appointmentId);
    setTodayAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'in-progress', actualStartTime: currentTime.toLocaleTimeString() }
        : apt
    ));
    setWorkStatus('working');
    setCurrentClient(appointment);
    
    addNotification({
      type: 'info',
      title: 'טיפול החל',
      message: `התחלת טיפול ל-${appointment?.clientName}`
    });
  };

  const completeAppointment = (appointmentId, tip = 0, satisfaction = 5) => {
    const appointment = todayAppointments.find(apt => apt.id === appointmentId);
    
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
    setCurrentClient(null);
    
    // עדכון סטטיסטיקות
    setTodayStats(prev => ({
      ...prev,
      appointmentsCompleted: prev.appointmentsCompleted + 1,
      totalRevenue: prev.totalRevenue + (appointment?.price || 0),
      tips: prev.tips + tip
    }));

    addNotification({
      type: 'success',
      title: 'טיפול הושלם',
      message: `טיפול ל-${appointment?.clientName} הושלם בהצלחה`
    });
  };

  // Dashboard View
  const DashboardView = () => (
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
              <h1 className="text-lg font-bold text-gray-900">HairPro IL Advanced</h1>
              <p className="text-xs text-gray-500">מערכת ניהול מתקדמת לסלון</p>
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
        {activeView === 'appointments' && <DashboardView />}
        {activeView === 'clients' && <div className="text-center py-12"><Users className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">רשימת לקוחות בפיתוח...</p></div>}
        {activeView === 'stats' && <div className="text-center py-12"><Target className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">סטטיסטיקות בפיתוח...</p></div>}
      </div>

      {/* Navigation */}
      <Navigation />
      
      {/* Floating Activity Clock */}
      <FloatingActivityClock 
        workStatus={workStatus}
        currentClient={currentClient}
        onStatusChange={setWorkStatus}
      />
    </div>
  );
};

export default BarberProfessionalApp;