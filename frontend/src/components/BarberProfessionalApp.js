import React, { useState, useEffect } from 'react';
import { 
  Home, Package, Users, BarChart3, Settings, DollarSign, Activity,
  Scissors, Timer, Star, Gift, Target, Calendar, Plus, Search, User,
  Phone, Mail, Palette, AlertCircle, Edit, CheckCircle, Bell, X,
  Droplets, TrendingUp, PieChart, Beaker
} from 'lucide-react';

// מאגר צבעים מורחב
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
      },
      igoraAbsolutes: {
        name: "IGORA ABSOLUTES",
        description: "צבע מיוחד לשיער בוגר עם Pro-Age Complex",
        colors: [
          { code: "4-60", name: "חום בינוני שוקולד טבעי", hex: "#5d4037", price: 35 },
          { code: "5-50", name: "חום בהיר זהב טבעי", hex: "#8d6e63", price: 35 },
          { code: "6-70", name: "בלונד כהה נחושת טבעי", hex: "#a1887f", price: 35 },
          { code: "7-10", name: "בלונד בינוני אפרפר טבעי", hex: "#b0bec5", price: 35 },
          { code: "8-60", name: "בלונד בהיר שוקולד טבעי", hex: "#bcaaa4", price: 35 },
          { code: "9-40", name: "בלונד בהיר מאוד בז' טבעי", hex: "#e0d4c8", price: 35 }
        ],
        mixing: "1:1 עם חמצן 9% בלבד",
        timing: "45 דקות",
        features: ["100% כיסוי שיער לבן", "פורמולה דלת ריח", "Pro-Age Complex"]
      }
    }
  },
  indola: {
    name: "אינדולה",
    logo: "🌈",
    series: {
      pcc: {
        name: "Permanent Caring Color",
        description: "צבע קבוע עם קומפלקס טיפולי",
        colors: [
          { code: "1.0", name: "שחור", hex: "#000000", price: 22 },
          { code: "2.0", name: "חום כהה מאוד", hex: "#2e1a1a", price: 22 },
          { code: "3.0", name: "חום כהה", hex: "#3e2723", price: 22 },
          { code: "4.0", name: "חום בינוני", hex: "#5d4037", price: 22 },
          { code: "5.0", name: "חום בהיר", hex: "#6d4c41", price: 22 },
          { code: "6.0", name: "בלונד כהה", hex: "#8d6e63", price: 22 },
          { code: "7.0", name: "בלונד בינוני", hex: "#a1887f", price: 22 },
          { code: "8.0", name: "בלונד בהיר", hex: "#bcaaa4", price: 22 },
          { code: "9.0", name: "בלונד בהיר מאוד", hex: "#d7ccc8", price: 22 },
          { code: "10.0", name: "בלונד פלטינה", hex: "#f5f5f5", price: 25 }
        ],
        mixing: "1:1 עם Cream Developer",
        timing: "30-35 דקות",
        features: ["מולקולות מיקרו-צבע", "חומצות אמינו", "עד 100% כיסוי"]
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
          { code: "9", name: "בלונד בהיר מאוד", hex: "#d7ccc8", price: 32 },
          { code: "10", name: "בלונד בהיר במיוחד", hex: "#f5f5f5", price: 35 }
        ],
        mixing: "1:1.5 עם Oxydant Crème",
        timing: "35 דקות",
        features: ["כיסוי מושלם", "צבע עמיד", "טיפול בשיער"]
      }
    }
  }
};

export default function BarberProfessionalApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">הכנסות היום</p>
                  <p className="text-3xl font-bold">₪3,840</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">לקוחות היום</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">צבע בשימוש</p>
                  <p className="text-3xl font-bold">245g</p>
                </div>
                <Package className="w-12 h-12 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">יעילות</p>
                  <p className="text-3xl font-bold">92%</p>
                </div>
                <Activity className="w-12 h-12 text-orange-200" />
              </div>
            </div>
          </div>
        );

      case 'colors':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">מאגר צבעים מקצועי</h2>
              
              {Object.entries(colorDatabase).map(([brandKey, brand]) => (
                <div key={brandKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{brand.logo}</span>
                    <h3 className="text-xl font-bold text-gray-800">{brand.name}</h3>
                  </div>
                  
                  {Object.entries(brand.series).map(([seriesKey, series]) => (
                    <div key={seriesKey} className="mb-6 bg-gray-50 rounded-lg p-4">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700">{series.name}</h4>
                        <p className="text-sm text-gray-600">{series.description}</p>
                        
                        {series.features && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-600">תכונות מיוחדות:</p>
                            <ul className="text-xs text-gray-500 list-disc list-inside">
                              {series.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">ערבוב:</span> {series.mixing} | 
                          <span className="font-medium"> זמן פעולה:</span> {series.timing}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {series.colors.map((color, colorIndex) => (
                          <div 
                            key={colorIndex} 
                            className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div 
                                className="w-8 h-8 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{color.code}</div>
                                <div className="text-xs text-gray-600 truncate">{color.name}</div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-sm font-bold text-green-600">₪{color.price}</span>
                            </div>
                            
                            {color.base && (
                              <div className="text-xs text-gray-500 mt-1">
                                בסיס: {color.base}
                                {color.primary !== undefined && (
                                  <span> | רפלקס: {color.primary}{color.secondary !== undefined && `.${color.secondary}`}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {series.developer && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-700 mb-2">תכשירי פיתוח:</h5>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {series.developer.map((dev, devIndex) => (
                              <div key={devIndex} className="bg-white rounded-lg border p-2">
                                <div className="font-semibold text-sm">{dev.vol}</div>
                                <div className="text-xs text-gray-600">{dev.description}</div>
                                <div className="text-xs text-green-600 font-bold">₪{(dev.price * 1000).toFixed(0)}/ליטר</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-xl text-gray-600">מודול בפיתוח...</h3>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">HairPro IL Advanced 💇‍♀️</h1>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('he-IL')} | {new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex space-x-reverse space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Home className="w-4 h-4" />
              לוח בקרה
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'colors' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Package className="w-4 h-4" />
              מאגר צבעים
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'clients' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Users className="w-4 h-4" />
              לקוחות
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'reports' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <BarChart3 className="w-4 h-4" />
              דוחות
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Settings className="w-4 h-4" />
              הגדרות
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h4 className="font-bold mb-2">HairPro IL Advanced</h4>
            <p className="text-sm text-gray-300">
              מערכת ניהול מתקדמת לסלון שיער עם מאגר צבעים מקצועי מלא
            </p>
            <div className="text-center mt-4 text-sm text-gray-400">
              © 2024 HairPro IL Advanced - כולל {
                Object.values(colorDatabase).reduce((total, brand) => 
                  total + Object.values(brand.series).reduce((seriesTotal, series) => 
                    seriesTotal + series.colors.length, 0
                  ), 0
                )
              } צבעים מקצועיים מ-3 חברות מובילות
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
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

  // דשבורד מתקדם של HairPro IL Advanced
  const AdvancedDashboard = () => (
    <div className="space-y-6">
      {/* כותרת מתקדמת עם מיתוג HairPro IL Advanced */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Scissors className="w-8 h-8" />
              HairPro IL Advanced 💇‍♀️
            </h1>
            <p className="text-blue-100 mt-1">מערכת ניהול מתקדמת לסלון שיער עם שקילה דיגיטלית</p>
            <p className="text-blue-200 text-sm">{currentTime.toLocaleDateString('he-IL')} • {currentTime.toLocaleTimeString('he-IL')}</p>
          </div>
          <div className="text-left">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-medium ${
              workStatus === 'working' ? 'bg-green-500' : 
              workStatus === 'break' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}>
              <Timer className="w-5 h-5 ml-2" />
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

      {/* כרטיסי סטטיסטיקות מתקדמים עם נתוני HairPro */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'טיפולים היום', 
            value: todayStats.appointmentsCompleted || 0, 
            icon: Users, 
            color: 'bg-gradient-to-br from-blue-400 to-blue-600',
            suffix: 'לקוחות',
            change: '+12%',
            changeType: 'positive'
          },
          { 
            title: 'הכנסות היום', 
            value: `₪${(todayStats.totalRevenue || 0).toLocaleString()}`, 
            icon: DollarSign, 
            color: 'bg-gradient-to-br from-green-400 to-green-600',
            change: '+15%',
            changeType: 'positive'
          },
          { 
            title: 'יעילות צבע', 
            value: `${todayStats.efficiency || 0}%`, 
            icon: Droplets, 
            color: 'bg-gradient-to-br from-purple-400 to-purple-600',
            change: '+8%',
            changeType: 'positive'
          },
          { 
            title: 'שביעות רצון', 
            value: `${todayStats.customerSatisfaction || 0}`, 
            icon: Star, 
            color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
            suffix: '⭐',
            change: 'מעולה',
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

      {/* יעדים יומיים מתקדמים עם תכונות HairPro */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-green-500" />
          יעדים יומיים - HairPro IL Advanced
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
                  {goal?.current || 0}/{goal?.target || 0}
                  {key === 'satisfaction' && ' ⭐'}
                  {key === 'colorEfficiency' && '%'}
                  {key === 'wasteReduction' && '%'}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    (goal?.percentage || 0) >= 100 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    (goal?.percentage || 0) >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    (goal?.percentage || 0) >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${Math.min(goal?.percentage || 0, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className={`font-medium ${
                  (goal?.percentage || 0) >= 100 ? 'text-green-600' :
                  (goal?.percentage || 0) >= 80 ? 'text-blue-600' :
                  (goal?.percentage || 0) >= 60 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {(goal?.percentage || 0) >= 100 ? '🎉 יעד הושג!' :
                   (goal?.percentage || 0) >= 80 ? '💪 כמעט שם!' :
                   (goal?.percentage || 0) >= 60 ? '⚡ בדרך!' : '🚀 בואו נתחיל!'}
                </span>
                <span className="text-gray-500">{goal?.percentage || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* גרפים וניתוחים עסקיים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            צריכת צבעים - HairPro Analytics
          </h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.colorUsage || {}).map(([color, percentage]) => (
              <div key={color} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{color}</span>
                  <span className="text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      color === 'בלונדים' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      color === 'חומים' ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                      color === 'שחורים' ? 'bg-gradient-to-r from-gray-700 to-gray-900' :
                      'bg-gradient-to-r from-red-500 to-red-700'
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
            תובנות עסקיות - HairPro Smart
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">חיסכון בצבע</span>
              </div>
              <span className="text-green-600 font-bold">{analyticsData.wasteReduction || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">יעילות כללית</span>
              </div>
              <span className="text-blue-600 font-bold">{analyticsData.efficiency || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">צבע פופולרי</span>
              </div>
              <span className="text-purple-600 font-bold">
                {analyticsData.trends?.popularColors?.[0] || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">הכנסה חודשית</span>
              </div>
              <span className="text-orange-600 font-bold">
                ₪{(analyticsData.revenue?.monthly || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* כפתורי פעולה מהירה מתקדמים */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveView('calendar')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Calendar className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">יומן שבועי</div>
            <div className="text-sm opacity-80">תורים מתקדמים</div>
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
            <div className="font-semibold">פורמולות חכמות</div>
            <div className="text-sm opacity-80">שקילה דיגיטלית</div>
          </div>
        </button>
        <button
          onClick={() => setActiveView('inventory')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl flex items-center gap-3 hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Package className="w-8 h-8" />
          <div className="text-right">
            <div className="font-semibold">מלאי חכם AI</div>
            <div className="text-sm opacity-80">חיזוי אוטומטי</div>
          </div>
        </button>
      </div>
    </div>
  );

  // Dashboard View (מתוחזק לתאימות)
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
            value: todayStats.appointmentsCompleted || 0, 
            icon: Users, 
            color: 'bg-blue-500',
            suffix: 'לקוחות'
          },
          { 
            title: 'הכנסות היום', 
            value: `₪${(todayStats.totalRevenue || 0).toLocaleString()}`, 
            icon: DollarSign, 
            color: 'bg-green-500'
          },
          { 
            title: 'טיפים היום', 
            value: `₪${(todayStats.tips || 0).toLocaleString()}`, 
            icon: Gift, 
            color: 'bg-purple-500'
          },
          { 
            title: 'דירוג שביעות רצון', 
            value: `${todayStats.customerSatisfaction || 0}`, 
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
                   key === 'satisfaction' ? 'שביעות רצון' :
                   key === 'colorEfficiency' ? 'יעילות צבע' :
                   key === 'wasteReduction' ? 'הפחתת בזבוז' : key}
                </span>
                <div className="text-sm text-gray-600">
                  {goal?.current || 0}/{goal?.target || 0}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    (goal?.percentage || 0) >= 100 ? 'bg-green-500' :
                    (goal?.percentage || 0) >= 80 ? 'bg-blue-500' :
                    (goal?.percentage || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(goal?.percentage || 0, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className={`font-medium ${
                  (goal?.percentage || 0) >= 100 ? 'text-green-600' :
                  (goal?.percentage || 0) >= 80 ? 'text-blue-600' :
                  (goal?.percentage || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(goal?.percentage || 0) >= 100 ? '🎉 יעד הושג!' :
                   (goal?.percentage || 0) >= 80 ? '💪 כמעט שם!' :
                   (goal?.percentage || 0) >= 60 ? '⚡ בדרך!' : '🚀 בואו נתחיל!'}
                </span>
                <span className="text-gray-500">{goal?.percentage || 0}%</span>
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

  // רכיב ניהול לקוחות מתקדם עם כרטיסי כימיה
  const AdvancedClientsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-8 h-8 text-purple-600" />
          HairPro - ניהול לקוחות מתקדם
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש לקוחות..."
              className="pl-4 pr-10 py-2 border rounded-lg w-64"
            />
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            לקוחה חדשה
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
            {/* פרופיל לקוחה */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </div>
                </div>
              </div>
            </div>

            {/* פרופיל שיער */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                פרופיל שיער
              </h4>
              <div className="space-y-1 text-sm">
                <div>צבע טבעי: <span className="font-medium">{client.hairProfile?.naturalColor}</span></div>
                <div>צבע נוכחי: <span className="font-medium">{client.hairProfile?.currentColor}</span></div>
                <div>סוג שיער: <span className="font-medium">{client.hairProfile?.hairType}</span></div>
              </div>
            </div>

            {/* כרטיס כימיה */}
            {client.chemistryCard && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  כרטיס כימיה
                </h4>
                {client.chemistryCard.allergies?.length > 0 && (
                  <div className="text-sm text-red-600">
                    <strong>אלרגיות:</strong> {client.chemistryCard.allergies.join(', ')}
                  </div>
                )}
                {client.chemistryCard.sensitivities?.length > 0 && (
                  <div className="text-sm text-orange-600 mt-1">
                    <strong>רגישויות:</strong> {client.chemistryCard.sensitivities.join(', ')}
                  </div>
                )}
              </div>
            )}

            {/* מדדים */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{client.metrics?.totalVisits || 0}</div>
                <div className="text-xs text-blue-500">ביקורים</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₪{(client.metrics?.totalSpent || 0).toLocaleString()}</div>
                <div className="text-xs text-green-500">סה"כ הוצאות</div>
              </div>
            </div>

            {/* פעולות */}
            <div className="flex gap-2">
              <button
                onClick={() => startAppointment(client.id)}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                טיפול חדש
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                <Edit className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
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
      {/* שעון פעילות צף */}
      <FloatingActivityClock 
        workStatus={workStatus}
        currentClient={currentClient}
        onStatusChange={setWorkStatus}
      />
      
      {/* התראות */}
      {notifications.length > 0 && (
        <div className="fixed top-4 left-4 z-50 max-w-sm space-y-2">
          {notifications.slice(0, 3).map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg text-white transform transition-all ${
                notification.type === 'error' ? 'bg-red-500' : 
                notification.type === 'warning' ? 'bg-yellow-500' : 
                notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`}
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
                  onClick={() => setNotifications(prev => 
                    prev.filter(n => n.id !== notification.id)
                  )}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HairPro IL Advanced</h1>
              <p className="text-xs text-gray-500">מערכת ניהול מתקדמת לסלון שיער</p>
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
        {activeView === 'dashboard' && <AdvancedDashboard />}
        {activeView === 'appointments' && <AppointmentsView />}
        {activeView === 'clients' && <AdvancedClientsView />}
        {activeView === 'formula' && (
          <div className="text-center py-12">
            <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">פורמולות חכמות</h3>
            <p className="text-gray-600">שקילה דיגיטלית מתקדמת בפיתוח...</p>
          </div>
        )}
        {activeView === 'inventory' && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">מלאי חכם</h3>
            <p className="text-gray-600">ניהול מלאי עם AI בפיתוח...</p>
          </div>
        )}
        {activeView === 'stats' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">דוחות מתקדמים</h3>
            <p className="text-gray-600">אנליטיקה עסקית בפיתוח...</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 py-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'דשבורד' },
            { id: 'appointments', icon: Calendar, label: 'יומן' },
            { id: 'clients', icon: Users, label: 'לקוחות' },
            { id: 'stats', icon: Target, label: 'דוחות' }
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
    </div>
  );
};

export default BarberProfessionalApp;