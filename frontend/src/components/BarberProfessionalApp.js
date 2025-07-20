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
  
  // רכיבים חדשים ל-HairPro Advanced
  const [weeklyCalendar, setWeeklyCalendar] = useState({});
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [reports, setReports] = useState({});
  const [isScaleConnected, setIsScaleConnected] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // day, week, month
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // דוחות וניתוחים מתקדמים
  const [analyticsData, setAnalyticsData] = useState({
    colorUsage: {},
    wasteReduction: 0,
    efficiency: 0,
    clientSatisfaction: 0,
    revenue: {
      daily: 0,
      weekly: 0,
      monthly: 0
    }
  });

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
    // נתונים סטטיסטיים מתקדמים
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

    // לקוחות מתקדמים עם כרטיס כימיה
    setClients([
      {
        id: 1,
        name: 'שרה כהן',
        phone: '050-1234567',
        email: 'sarah@example.com',
        photo: null,
        birthDate: '1985-03-15',
        address: 'תל אביב, ישראל',
        registrationDate: '2023-06-15',
        hairProfile: {
          naturalColor: 'חום כהה 4',
          currentColor: 'בלונד בהיר 8.3',
          hairType: 'חלק, דק',
          scalpCondition: 'רגיל',
          porosity: 'נמוכה',
          elasticity: 'טובה',
          density: 'בינונית'
        },
        chemistryCard: {
          allergies: ['PPD - פניל דיאמין'],
          sensitivities: ['אמוניה חזקה'],
          previousReactions: 'אדמומיות קלה עם שוורצקוף 6.0',
          skinTest: {
            date: '2024-01-10',
            result: 'שלילי',
            testedProduct: 'לוריאל מג\'ירל 8.3'
          },
          preferredBrands: ['לוריאל', 'וולה'],
          avoidBrands: ['שוורצקוף איגורה']
        },
        preferences: {
          colorStyle: 'בלונדים טבעיים',
          maintenanceLevel: 'בינונית',
          budget: 'גבוה',
          appointmentTime: 'בוקר',
          stylist: 'מיכל לוי'
        },
        history: [
          {
            id: 1,
            date: '2024-01-15',
            service: 'צביעה + תספורת',
            formula: {
              colors: [
                { brand: 'loreal', code: '8.3', weight: 40, actualWeight: 42 },
                { brand: 'loreal', code: '9.0', weight: 20, actualWeight: 19 }
              ],
              developer: '20vol',
              processingTime: 35,
              totalCost: 28.50
            },
            beforePhoto: null,
            afterPhoto: null,
            duration: 120,
            cost: 380,
            tip: 50,
            satisfaction: 5,
            stylist: 'מיכל לוי',
            notes: 'תוצאה מושלמת, הלקוחה מרוצה מאוד',
            nextAppointment: '2024-02-19'
          }
        ],
        metrics: {
          totalVisits: 12,
          totalSpent: 4250,
          averageSpent: 354,
          lastVisit: '2024-01-15',
          nextRecommended: '2024-02-19',
          loyaltyScore: 95,
          referrals: 2
        }
      },
      {
        id: 2,
        name: 'רחל אברהם',
        phone: '052-9876543',
        email: 'rachel@example.com',
        photo: null,
        birthDate: '1978-11-22',
        address: 'רמת גן, ישראל',
        registrationDate: '2023-04-10',
        hairProfile: {
          naturalColor: 'שחור 1',
          currentColor: 'חום ערמוני 5.52',
          hairType: 'מתולתל, עבה',
          scalpCondition: 'שמני',
          porosity: 'גבוהה',
          elasticity: 'חלשה',
          density: 'עבה'
        },
        chemistryCard: {
          allergies: [],
          sensitivities: ['ריחות חזקים'],
          previousReactions: 'אין',
          skinTest: {
            date: '2023-04-08',
            result: 'שלילי',
            testedProduct: 'שוורצקוף איגורה 5.52'
          },
          preferredBrands: ['שוורצקוף', 'ולה'],
          avoidBrands: []
        },
        history: [
          {
            id: 1,
            date: '2024-01-20',
            service: 'צביעה',
            formula: {
              colors: [
                { brand: 'schwarzkopf', code: '5-52', weight: 60, actualWeight: 58 }
              ],
              developer: '20vol',
              processingTime: 40,
              totalCost: 32.50
            },
            duration: 90,
            cost: 320,
            tip: 30,
            satisfaction: 4,
            stylist: 'דנה כהן'
          }
        ],
        metrics: {
          totalVisits: 8,
          totalSpent: 2890,
          averageSpent: 361,
          lastVisit: '2024-01-20',
          loyaltyScore: 78
        }
      }
    ]);

    // מלאי מתקדם
    setInventory([
      {
        id: 1,
        brand: 'schwarzkopf',
        product: 'IGORA ROYAL 6-0',
        category: 'color',
        quantity: 12,
        minStock: 5,
        maxStock: 20,
        unit: 'tubes',
        pricePerUnit: 28,
        supplier: 'ספק מרכזי',
        lastOrdered: '2024-01-10',
        usage: {
          daily: 2.5,
          weekly: 17.5,
          monthly: 75
        },
        expiryDate: '2025-06-15',
        location: 'מדף A-2'
      },
      {
        id: 2,
        brand: 'loreal',
        product: 'MAJIREL 8.3',
        category: 'color',
        quantity: 8,
        minStock: 5,
        maxStock: 15,
        unit: 'tubes',
        pricePerUnit: 32,
        supplier: 'ספק מרכזי',
        lastOrdered: '2024-01-05',
        usage: {
          daily: 1.8,
          weekly: 12.6,
          monthly: 54
        },
        expiryDate: '2025-04-20'
      },
      {
        id: 3,
        product: 'חמצן 20vol',
        category: 'developer',
        quantity: 2000,
        minStock: 1000,
        maxStock: 5000,
        unit: 'ml',
        pricePerUnit: 0.05,
        supplier: 'ספק מרכזי',
        usage: {
          daily: 150,
          weekly: 1050,
          monthly: 4500
        }
      }
    ]);

    // פורמולות שמורות
    setFormulas([
      {
        id: 1,
        name: 'בלונד זהוב קלאסי',
        clientId: 1,
        colors: [
          { brand: 'loreal', code: '8.3', weight: 40 },
          { brand: 'loreal', code: '9.0', weight: 20 }
        ],
        developer: '20vol',
        processingTime: 35,
        notes: 'מושלם לשיער דק',
        successRate: 95,
        lastUsed: '2024-01-15',
        category: 'בלונדים'
      }
    ]);

    // תורים לשבוע
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
        phone: '050-1234567',
        allergies: ['PPD'],
        lastColor: 'בלונד בהיר 8.3'
      },
      {
        id: 2,
        time: '11:30',
        clientId: 2,
        clientName: 'רחל אברהם',
        service: 'צביעת שורשים',
        price: 250,
        duration: 90,
        status: 'completed',
        tip: 30,
        notes: 'שיער מתולתל, זקוק לטיפול מיוחד',
        satisfaction: 4,
        phone: '052-9876543'
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
      clientSatisfaction: 4.8,
      revenue: {
        daily: 1420,
        weekly: 8640,
        monthly: 36800
      },
      trends: {
        popularColors: ['8.3', '7.0', '6.0', '5.52'],
        peakHours: ['10:00-12:00', '14:00-16:00'],
        seasonalDemand: 'גוונים חמים לחורף'
      }
    });

    // התראות
    setNotifications([
      {
        id: 1,
        type: 'warning',
        title: 'מלאי נמוך',
        message: 'לוריאל מג\'ירל 8.3 - נותרו 3 שפופרות',
        time: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: 2,
        type: 'success',
        title: 'לקוחה מרוצה',
        message: 'שרה כהן נתנה דירוג 5 כוכבים',
        time: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 3,
        type: 'info',
        title: 'תזכורת',
        message: 'יעל כהן מגיעה בעוד 15 דקות',
        time: new Date(Date.now() - 2 * 60 * 1000)
      }
    ]);
  };

  // פונקציות עזר מתקדמות
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      time: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const connectScale = () => {
    setIsScaleConnected(true);
    addNotification({
      type: 'success',
      title: 'משקל מחובר',
      message: 'המשקל הדיגיטלי חובר בהצלחה'
    });

    // סימולציית קריאות משקל
    const interval = setInterval(() => {
      setCurrentWeight(prev => {
        const variation = (Math.random() - 0.5) * 2;
        return Math.max(0, Math.round((prev + variation) * 10) / 10);
      });
    }, 500);

    return () => clearInterval(interval);
  };

  const calculateColorCost = (formula) => {
    let totalCost = 0;
    formula.colors?.forEach(color => {
      // Simplified cost calculation without database
      const basePrice = 30; // Average price per tube
      totalCost += (color.weight / 60) * basePrice;
    });
    return totalCost.toFixed(2);
  };

  const predictInventoryNeeds = (product) => {
    const dailyUsage = product.usage.daily;
    const currentStock = product.quantity;
    const daysUntilEmpty = Math.floor(currentStock / dailyUsage);
    
    if (daysUntilEmpty <= 3) {
      return { urgency: 'critical', message: 'הזמנה דחופה נדרשת' };
    } else if (daysUntilEmpty <= 7) {
      return { urgency: 'warning', message: 'מומלץ להזמין בקרוב' };
    } else {
      return { urgency: 'good', message: `מספיק ל-${daysUntilEmpty} ימים` };
    }
  };

  const generateWeeklyReport = () => {
    return {
      totalRevenue: analyticsData.revenue.weekly,
      totalClients: todayAppointments.length * 5, // הערכה לשבוע
      colorEfficiency: analyticsData.efficiency,
      wasteReduction: analyticsData.wasteReduction,
      topColors: analyticsData.trends.popularColors,
      clientSatisfaction: analyticsData.clientSatisfaction,
      recommendations: [
        'המשך להשתמש בפורמולות הצלחה',
        'הזמן מלאי צבעים פופולריים',
        'התמקד בלקוחות VIP לשיפור רווחיות'
      ]
    };
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

  const completeAppointment = (appointmentId, tip = 0, satisfaction = 5, formula = null) => {
    const appointment = todayAppointments.find(apt => apt.id === appointmentId);
    
    setTodayAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            status: 'completed', 
            tip, 
            satisfaction,
            formula,
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

    // עדכון נתוני לקוח
    if (appointment?.clientId && formula) {
      setClients(prev => prev.map(client => 
        client.id === appointment.clientId
          ? {
              ...client,
              history: [
                ...client.history,
                {
                  id: client.history.length + 1,
                  date: new Date().toISOString().split('T')[0],
                  service: appointment.service,
                  formula,
                  duration: appointment.duration,
                  cost: appointment.price,
                  tip,
                  satisfaction,
                  stylist: 'מיכל לוי' // או הספר הנוכחי
                }
              ],
              metrics: {
                ...client.metrics,
                totalVisits: client.metrics.totalVisits + 1,
                totalSpent: client.metrics.totalSpent + appointment.price,
                lastVisit: new Date().toISOString().split('T')[0]
              }
            }
          : client
      ));
    }

    addNotification({
      type: 'success',
      title: 'טיפול הושלם',
      message: `טיפול ל-${appointment?.clientName} הושלם בהצלחה`
    });
  };

  // דשבורד מתקדם של HairPro IL Advanced
  const AdvancedDashboard = () => (
    <div className="space-y-6">
      {/* כותרת מתקדמת */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">HairPro IL Advanced 💇‍♀️</h1>
            <p className="text-blue-100 mt-1">מערכת ניהול מתקדמת לסלון שיער</p>
            <p className="text-blue-200 text-sm">{currentTime.toLocaleDateString('he-IL')} • {currentTime.toLocaleTimeString('he-IL')}</p>
          </div>
          <div className="text-left">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-medium ${
              workStatus === 'working' ? 'bg-green-500' : 
              workStatus === 'break' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}>
              <Scissors className="w-5 h-5 ml-2" />
              {workStatus === 'working' ? 'עובד עם לקוח' : 
               workStatus === 'break' ? 'בהפסקה' : 'מוכן ללקוח הבא'}
            </div>
            {currentClient && (
              <div className="mt-2 text-center">
                <div className="text-sm opacity-80">לקוח נוכחי:</div>
                <div className="font-semibold">{currentClient.clientName}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* כרטיסי סטטיסטיקות מתקדמים */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'לקוחות היום', 
            value: todayStats.appointmentsCompleted, 
            icon: Users, 
            color: 'bg-gradient-to-br from-blue-400 to-blue-600',
            suffix: 'טיפולים',
            change: '+12%',
            changeType: 'positive'
          },
          { 
            title: 'הכנסות היום', 
            value: `₪${todayStats.totalRevenue?.toLocaleString()}`, 
            icon: DollarSign, 
            color: 'bg-gradient-to-br from-green-400 to-green-600',
            change: '+8%',
            changeType: 'positive'
          },
          { 
            title: 'יעילות צבע', 
            value: `${todayStats.efficiency}%`, 
            icon: Droplets, 
            color: 'bg-gradient-to-br from-purple-400 to-purple-600',
            change: '+5%',
            changeType: 'positive'
          },
          { 
            title: 'שביעות רצון', 
            value: `${todayStats.customerSatisfaction}`, 
            icon: Star, 
            color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
            suffix: '⭐',
            change: '+2%',
            changeType: 'positive'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.change && (
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 inline ml-1" />
                  {stat.change}
                </div>
              )}
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

      {/* יעדים יומיים מתקדמים */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-green-500" />
          יעדים יומיים - HairPro Advanced
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(dailyGoals).map(([key, goal]) => (
            <div key={key} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {key === 'appointments' ? '🧑‍🦱 טיפולים' :
                   key === 'revenue' ? '💰 הכנסות' :
                   key === 'tips' ? '🎁 טיפים' :
                   key === 'newCustomers' ? '👥 לקוחות חדשים' :
                   key === 'satisfaction' ? '⭐ שביעות רצון' :
                   key === 'colorEfficiency' ? '🎨 יעילות צבע' :
                   key === 'wasteReduction' ? '♻️ הפחתת בזבוז' : key}
                </span>
                <div className="text-sm text-gray-600 font-semibold">
                  {typeof goal.current === 'number' && goal.current < 10 ? goal.current : 
                   typeof goal.current === 'string' ? goal.current : goal.current}
                  /{goal.target}
                  {key === 'satisfaction' && ' ⭐'}
                  {key === 'colorEfficiency' && '%'}
                  {key === 'wasteReduction' && '%'}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    goal.percentage >= 100 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    goal.percentage >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    goal.percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className={`font-medium ${
                  goal.percentage >= 100 ? 'text-green-600' :
                  goal.percentage >= 80 ? 'text-blue-600' :
                  goal.percentage >= 60 ? 'text-orange-600' : 'text-red-600'
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

      {/* גרף צריכת צבעים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            צריכת צבעים היום
          </h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.colorUsage).map(([color, percentage]) => (
              <div key={color} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{color}</span>
                  <span className="text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      color === 'בלונדים' ? 'bg-yellow-400' :
                      color === 'חומים' ? 'bg-amber-600' :
                      color === 'שחורים' ? 'bg-gray-800' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            תובנות עסקיות
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">חיסכון בצבע</span>
              </div>
              <span className="text-green-600 font-bold">{analyticsData.wasteReduction}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">יעילות כללית</span>
              </div>
              <span className="text-blue-600 font-bold">{analyticsData.efficiency}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">צבע פופולרי</span>
              </div>
              <span className="text-purple-600 font-bold">{analyticsData.trends.popularColors[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* כפתורי פעולה מהירה */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveView('calendar')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Calendar className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">יומן שבועי</div>
            <div className="text-sm opacity-80">ניהול תורים</div>
          </div>
        </button>
        <button
          onClick={() => setActiveView('clients')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Users className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">לקוחות VIP</div>
            <div className="text-sm opacity-80">כרטיסי כימיה</div>
          </div>
        </button>
        <button
          onClick={() => setActiveView('formula')}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Beaker className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">פורמולות</div>
            <div className="text-sm opacity-80">שקילה דיגיטלית</div>
          </div>
        </button>
        <button
          onClick={() => setActiveView('inventory')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Package className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">מלאי חכם</div>
            <div className="text-sm opacity-80">חיזוי AI</div>
          </div>
        </button>
      </div>
    </div>
  );

  // Dashboard View הקלאסי (מתוחזק לתאימות)
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