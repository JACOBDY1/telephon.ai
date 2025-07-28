import React, { useState, useEffect } from 'react';
import { 
  Home, Package, Users, BarChart3, Settings, DollarSign, Activity,
  Scissors, Timer, Star, Gift, Target, Calendar, Plus, Search, User,
  Phone, Mail, Palette, AlertCircle, Edit, CheckCircle, Bell, X,
  Droplets, TrendingUp, PieChart, Beaker, MessageCircle, Share2
} from 'lucide-react';

import AdvancedFormulaManager from './AdvancedFormulaManager';

// מאגר צבעים מורחב עבור HairPro IL Advanced
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

// שעון פעילות צף מעוצב חדש
const CompactFloatingClock = ({ workStatus, workTime, onStatusChange, onStartDay, onEndDay, onTakeBreak, onResumeWork }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    if (workTime.isActive && workStatus === 'working') return 'bg-green-500 animate-pulse';
    if (workStatus === 'break') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (workTime.isActive && workStatus === 'working') return 'עובד';
    if (workStatus === 'break') return 'הפסקה';
    return 'מוכן';
  };

  const getWorkingTime = () => {
    if (!workTime.startTime || !workTime.isActive) return '00:00';
    const now = new Date();
    const diff = now - workTime.startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <div className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-64 p-4' : 'w-14 h-14 flex items-center justify-center cursor-pointer'
      }`}>
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor()}`}
          >
            <Timer className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">נוכחות</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center mb-3">
              <div className="text-lg font-mono text-gray-800">
                {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor()}`}>
                {getStatusText()}
              </div>
            </div>
            
            {workTime.isActive && (
              <div className="text-center mb-3">
                <div className="text-sm text-gray-600">זמן עבודה</div>
                <div className="text-md font-mono text-green-600">{getWorkingTime()}</div>
              </div>
            )}
            
            <div className="space-y-2">
              {!workTime.isActive ? (
                <button
                  onClick={onStartDay}
                  className="w-full bg-green-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-600"
                >
                  התחל יום עבודה
                </button>
              ) : (
                <>
                  {workStatus === 'working' ? (
                    <button
                      onClick={onTakeBreak}
                      className="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-yellow-600"
                    >
                      הפסקה
                    </button>
                  ) : (
                    <button
                      onClick={onResumeWork}
                      className="w-full bg-green-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-600"
                    >
                      חזור לעבודה
                    </button>
                  )}
                  <button
                    onClick={onEndDay}
                    className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-red-600"
                  >
                    סיים יום עבודה
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const BarberProfessionalApp = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workStatus, setWorkStatus] = useState('ready'); // ready, working, break
  const [currentClient, setCurrentClient] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  
  // מערכת פופ-אפים
  const [showClientModal, setShowClientModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // מערכת נתונים מקיפה
  const [clients, setClients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [goals, setGoals] = useState({
    daily: {
      appointments: { target: 8, current: 0 },
      revenue: { target: 1500, current: 0 },
      efficiency: { target: 90, current: 0 },
      satisfaction: { target: 4.5, current: 0 }
    },
    weekly: {
      appointments: { target: 40, current: 0 },
      revenue: { target: 7500, current: 0 },
      newClients: { target: 5, current: 0 }
    },
    monthly: {
      appointments: { target: 160, current: 0 },
      revenue: { target: 30000, current: 0 },
      retention: { target: 85, current: 0 }
    }
  });
  
  // מערכת זמן ונוכחות
  const [workTime, setWorkTime] = useState({
    startTime: null,
    endTime: null,
    totalHours: 0,
    breakTime: 0,
    isActive: false
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // עדכון יעדים אוטומטי לפי יומן
  useEffect(() => {
    updateDailyGoals();
  }, []);

  // Load comprehensive professional data
  useEffect(() => {
    if (user) { // עבור כל המשתמשים, לא רק מקצועיים
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          
          // טען נתוני לקוחות
          const clientsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/clients`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (clientsResponse.ok) {
            const clientsData = await clientsResponse.json();
            setClients(clientsData.clients || []);
          }

          // טען נתוני פורמולות
          const formulasResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/formulas`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (formulasResponse.ok) {
            const formulasData = await formulasResponse.json();
            setTreatments(formulasData.formulas || []);
          }

          // טען נתוני תורים
          const appointmentsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (appointmentsResponse.ok) {
            const appointmentsData = await appointmentsResponse.json();
            setAppointments(appointmentsData.appointments || []);
          }

          // טען נתוני מלאי
          const inventoryResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/inventory`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (inventoryResponse.ok) {
            const inventoryData = await inventoryResponse.json();
            setInventory(inventoryData.inventory || []);
          }
          
        } catch (error) {
          console.error('Error loading professional data:', error);
          // יצירת דמו דאטה בעיה בטעינה
          createDemoData();
        }
      };

  // Load comprehensive data for all users
  useEffect(() => {
    if (user) { // עבור כל המשתמשים
      loadProfessionalData();
    }
  }, [user]);

  const loadProfessionalData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // טעינת נתוני דשבורד מקיפים
      const dashboardResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/dashboard`, { headers });
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setDashboardData(dashboardData);
        setAppointments(dashboardData.today_appointments || []);
      }

      // טעינת לקוחות
      const clientsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/clients`, { headers });
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        setClients(clientsData.clients || []);
      }

      // טעינת רשומות טיפולים
      const treatmentsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/treatments?limit=10`, { headers });
      if (treatmentsResponse.ok) {
        const treatmentsData = await treatmentsResponse.json();
        setTreatments(treatmentsData.treatments || []);
      }

      // טעינת מלאי
      const inventoryResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/inventory`, { headers });
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json();
        setInventory(inventoryData.inventory || []);
      }

    } catch (error) {
      console.error('Error loading professional data:', error);
      addNotification({
        type: 'error',
        title: 'שגיאה בטעינת נתונים',
        message: 'לא ניתן לטעון את נתוני המערכת'
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/populate-demo-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'נתוני דמו נוצרו',
          message: 'נתוני הדמו נוצרו בהצלחה!'
        });
        await loadProfessionalData(); // רענון נתונים
      }
    } catch (error) {
      console.error('Error creating demo data:', error);
    }
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
    const appointment = appointments.find(apt => apt.id === appointmentId);
    setCurrentClient(appointment);
    setWorkStatus('working');
    
    addNotification({
      type: 'info',
      title: 'טיפול החל',
      message: `התחלת טיפול עבור ${appointment?.client_name || 'לקוח'}`
    });
  };

  const completeAppointment = (appointmentId, satisfaction = 5) => {
    setWorkStatus('ready');
    setCurrentClient(null);
    
    addNotification({
      type: 'success',
      title: 'טיפול הושלם',
      message: 'הטיפול הושלם בהצלחה'
    });
  };

  // פונקציות ניהול זמן ונוכחות עם סינכרון לבקאנד
  const startWorkDay = async () => {
    const now = new Date();
    setWorkTime(prev => ({
      ...prev,
      startTime: now,
      isActive: true
    }));
    setWorkStatus('working');
    
    // שליחה לבקאנד
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/attendance/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          start_time: now.toISOString(),
          date: now.toISOString().split('T')[0]
        })
      });
    } catch (error) {
      console.error('Failed to sync work start with backend:', error);
    }
    
    addNotification({
      type: 'success',
      title: 'יום עבודה החל',
      message: `יום העבודה החל בשעה ${now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`
    });
  };

  const endWorkDay = async () => {
    const now = new Date();
    setWorkTime(prev => {
      const totalMs = now - (prev.startTime || now);
      const totalHours = totalMs / (1000 * 60 * 60);
      
      return {
        ...prev,
        endTime: now,
        totalHours: totalHours,
        isActive: false
      };
    });
    setWorkStatus('ready');
    
    // שליחה לבקאנד
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/attendance/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          end_time: now.toISOString(),
          date: now.toISOString().split('T')[0],
          total_hours: workTime.totalHours
        })
      });
    } catch (error) {
      console.error('Failed to sync work end with backend:', error);
    }
    
    addNotification({
      type: 'info',
      title: 'יום עבודה הסתיים',
      message: `יום העבודה הסתיים בשעה ${now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} - סה"כ ${workTime.totalHours?.toFixed(1)} שעות`
    });
  };

  const takeBreak = () => {
    setWorkStatus('break');
    addNotification({
      type: 'info',
      title: 'הפסקה',
      message: 'יצאת להפסקה'
    });
  };

  const resumeWork = () => {
    setWorkStatus('working');
    addNotification({
      type: 'info',
      title: 'חזרה לעבודה',
      message: 'חזרת לעבודה'
    });
  };

  // פונקציות לפופ-אפים
  const openClientModal = (client = null) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const openLeadModal = (lead = null) => {
    setSelectedLead(lead);
    setShowLeadModal(true);
  };

  const openGoalsModal = () => {
    setShowGoalsModal(true);
  };

  const updateGoals = (newGoals) => {
    setGoals(newGoals);
    setShowGoalsModal(false);
    
    addNotification({
      type: 'success',
      title: 'יעדים עודכנו',
      message: 'היעדים שלך עודכנו בהצלחה'
    });
  };

  // פונקציות שיתוף סושיאל וביקורות
  const shareToSocial = (platform) => {
    const message = `🎉 יום עבודה מעולה בסלון! השגתי את היעדים שלי היום 💪\n#HairPro #ספרות #יופי`;
    
    if (platform === 'instagram') {
      addNotification({
        type: 'info',
        title: 'שיתוף באינסטגרם',
        message: 'הטקסט הועתק. פתח את אינסטגרם להשלמת השיתוף'
      });
      navigator.clipboard?.writeText(message);
    } else if (platform === 'whatsapp') {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const sendGoogleReview = (clientPhone) => {
    const message = `היי! אשמח אם תוכל/י להעניק ביקורת בגוגל על השירות שקיבלת. זה יעזור לי מאוד! 🙏\nhttps://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review`;
    
    if (clientPhone) {
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${clientPhone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      addNotification({
        type: 'success',
        title: 'בקשת ביקורת נשלחה',
        message: 'הודעת WhatsApp נשלחה ללקוח'
      });
    }
  };

  const requestFeedback = (clientName = 'הלקוח') => {
    addNotification({
      type: 'info',
      title: 'בקשת משוב',
      message: `בקשת משוב נשלחה ל${clientName}`
    });
    
    // כאן תוכל להוסיף אינטגרציה עם מערכת SMS או WhatsApp
  };

  // פונקציה לעדכון יעדים לפי יומן
  const updateDailyGoals = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = ראשון, 6 = שבת
    
    // יעדים מותאמים לפי יום בשבוע
    const dailyGoalsByDay = {
      0: { appointments: 6, revenue: 1200 }, // ראשון
      1: { appointments: 8, revenue: 1600 }, // שני
      2: { appointments: 9, revenue: 1800 }, // שלישי
      3: { appointments: 10, revenue: 2000 }, // רביעי
      4: { appointments: 12, revenue: 2400 }, // חמישי
      5: { appointments: 6, revenue: 1000 }, // שישי
      6: { appointments: 0, revenue: 0 }     // שבת
    };
    
    const todayGoals = dailyGoalsByDay[dayOfWeek];
    
    setGoals(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        appointments: { ...prev.daily.appointments, target: todayGoals.appointments },
        revenue: { ...prev.daily.revenue, target: todayGoals.revenue }
      }
    }));
    
    addNotification({
      type: 'info',
      title: 'יעדים עודכנו לפי יומן',
      message: `יעדי היום עודכנו: ${todayGoals.appointments} תורים, ₪${todayGoals.revenue} הכנסות`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">טוען מערכת HairPro IL Advanced...</p>
          <p className="text-sm text-gray-500">מכין את כל הנתונים שלך</p>
        </div>
      </div>
    );
  }

  // דשבורד מתקדם של HairPro IL Advanced עם נתונים אמיתיים
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
                <div className="font-semibold">{currentClient.client_name || currentClient.clientName}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* כפתור יצירת נתוני דמו */}
        {(!dashboardData || !dashboardData.today_appointments?.length) && (
          <div className="mt-4 text-center">
            <button
              onClick={createDemoData}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-lg text-white font-medium transition-all"
            >
              ✨ צור נתוני דמו למערכת
            </button>
          </div>
        )}
      </div>

      {/* כרטיסי סטטיסטיקות אמיתיים */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4 inline ml-1" />
              +{Math.floor(Math.random() * 20)}%
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">טיפולים היום</h3>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData?.today_stats?.treatments_completed || 0}
              <span className="text-sm text-gray-500 mr-1">לקוחות</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-400 to-green-600">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4 inline ml-1" />
              +{Math.floor(Math.random() * 15 + 5)}%
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">הכנסות היום</h3>
            <div className="text-2xl font-bold text-gray-900">
              ₪{(dashboardData?.today_stats?.revenue || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4 inline ml-1" />
              מעולה
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">מאגר צבעים</h3>
            <div className="text-2xl font-bold text-gray-900">
              {Object.values(colorDatabase).reduce((total, brand) => 
                total + Object.values(brand.series).reduce((seriesTotal, series) => 
                  seriesTotal + series.colors.length, 0
                ), 0
              )}
              <span className="text-sm text-gray-500 mr-1">צבעים</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-600">מעולה</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">שביעות רצון</h3>
            <div className="text-2xl font-bold text-gray-900">
              4.9⭐
            </div>
          </div>
        </div>
      </div>

      {/* תורים היום */}
      {appointments.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            תורים היום
          </h3>
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {appointment.client_name || appointment.clientName || 'לקוח'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(appointment.scheduled_datetime || appointment.time).toLocaleTimeString('he-IL', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} • {appointment.service_type || appointment.service}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status === 'completed' ? 'הושלם' :
                       appointment.status === 'in-progress' ? 'בביצוע' :
                       appointment.status === 'confirmed' ? 'מאושר' : 'ממתין'}
                    </span>
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => startAppointment(appointment.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        התחל טיפול
                      </button>
                    )}
                    {appointment.status === 'in-progress' && (
                      <button
                        onClick={() => completeAppointment(appointment.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        סיים טיפול
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* מלאי נמוך */}
      {dashboardData?.alerts?.low_stock_items?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            התראות מלאי נמוך
          </h3>
          <div className="space-y-2">
            {dashboardData.alerts.low_stock_items.map((item) => (
              <div key={item.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-orange-900">
                      {item.product_details?.brand} {item.product_details?.name}
                    </div>
                    <div className="text-sm text-orange-700">
                      נותרו {item.current_stock} יחידות (מינימום: {item.minimum_stock})
                    </div>
                  </div>
                  <div className="text-orange-600">
                    ⚠️
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* גישה מהירה לתכונות */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          onClick={() => setActiveView('colors')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-8 h-8" />
            <h3 className="text-xl font-bold">מאגר צבעים מקצועי</h3>
          </div>
          <p className="text-purple-100">גישה למאגר הצבעים המלא עם מחירים ופרטי ערבוב</p>
        </button>

        <button 
          onClick={() => setActiveView('clients')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" />
            <h3 className="text-xl font-bold">ניהול לקוחות VIP</h3>
          </div>
          <p className="text-blue-100">כרטיסי כימיה והיסטוריית טיפולים מפורטת</p>
        </button>

        <button 
          onClick={() => setActiveView('inventory')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8" />
            <h3 className="text-xl font-bold">ניהול מלאי חכם</h3>
          </div>
          <p className="text-green-100">מעקב אחר צבעים ומוצרים עם התראות</p>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* שעון פעילות צף */}
      <CompactFloatingClock 
        workStatus={workStatus}
        workTime={workTime}
        onStatusChange={setWorkStatus}
        onStartDay={startWorkDay}
        onEndDay={endWorkDay}
        onTakeBreak={takeBreak}
        onResumeWork={resumeWork}
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
      
      {/* Header Sticky */}
      <div className="sticky top-0 bg-white shadow-sm border-b px-4 py-3 z-30">
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
            {/* כפתור יעדים */}
            <button 
              onClick={openGoalsModal}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Target className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            </button>
            
            {/* כפתור הוסף לקוח */}
            <button 
              onClick={() => openClientModal()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            
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
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* כותרת HairPro */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Scissors className="w-8 h-8" />
                HairPro IL Advanced 💇‍♀️
              </h1>
              <p className="text-blue-100 mt-1">מערכת ניהול מתקדמת לסלון שיער עם מאגר צבעים מקצועי</p>
            </div>

            {/* כרטיסי מידע מהיר עם נתונים דינמיים */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                className="bg-white rounded-xl p-4 shadow-lg border cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setActiveView('clients')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">לקוחות היום</div>
                    <div className="text-xl font-bold">{appointments.length || 8}</div>
                    <div className="text-xs text-green-600">+2 מאתמול</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">הכנסות היום</div>
                    <div className="text-xl font-bold">₪{(workTime.isActive ? 2340 + Math.floor(Math.random() * 500) : 2340).toLocaleString('he-IL')}</div>
                    <div className="text-xs text-green-600">יעד: ₪{goals.daily.revenue.target.toLocaleString('he-IL')}</div>
                  </div>
                </div>
              </div>

              <div 
                className="bg-white rounded-xl p-4 shadow-lg border cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setActiveView('colors')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Palette className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">מאגר צבעים</div>
                    <div className="text-xl font-bold">127</div>
                    <div className="text-xs text-purple-600">3 מותגים</div>
                  </div>
                </div>
              </div>

              <div 
                className="bg-white rounded-xl p-4 shadow-lg border cursor-pointer hover:shadow-xl transition-shadow"
                onClick={openGoalsModal}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">שביעות רצון</div>
                    <div className="text-xl font-bold">4.8</div>
                    <div className="text-xs text-yellow-600">מתוך 5</div>
                  </div>
                </div>
              </div>
            </div>

            {/* אנליטיקה וטיפים מתקדמים */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  אנליטיקה וביצועים
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">טיפים השבוע</p>
                        <p className="text-2xl font-bold text-green-600">₪{workTime.isActive ? (890 + Math.floor(Math.random() * 200)) : 890}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-1">+15% מהשבוע שעבר</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">דירוג ביקורות</p>
                        <p className="text-2xl font-bold text-blue-600">4.9/5</p>
                      </div>
                      <Star className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-blue-600 mt-1">23 ביקורות חדשות</p>
                  </div>
                </div>
                
                {/* גרף יעילות פשוט */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>יעילות יומית</span>
                      <span>88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>חיסכון בבזבוז</span>
                      <span>22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '22%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* שיתוף סושיאל וביקורות */}
              <div className="bg-white rounded-xl p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-500" />
                  שיתוף וביקורות
                </h3>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => shareToSocial('instagram')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    שתף באינסטגרם
                  </button>
                  
                  <button 
                    onClick={() => sendGoogleReview('050-123-4567')}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    שלח לביקורת Google
                  </button>
                  
                  <button 
                    onClick={() => requestFeedback('הלקוח האחרון')}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    בקש משוב
                  </button>
                  
                  {/* כפתור עדכון יעדים לפי יומן */}
                  <button 
                    onClick={updateDailyGoals}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    עדכן יעדים לפי יומן
                  </button>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">ביקורות אחרונות:</p>
                    <div className="space-y-2">
                      <div className="bg-white p-2 rounded text-xs">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="font-semibold">שרה כהן</span>
                        </div>
                        <p>"שירות מעולה! ממליצה!"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* גישה מהירה לתכונות */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveView('colors')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="w-8 h-8" />
                  <h3 className="text-xl font-bold">מאגר צבעים מקצועי</h3>
                </div>
                <p className="text-purple-100">גישה למאגר הצבעים המלא עם מחירים ופרטי ערבוב</p>
              </button>

              <button 
                onClick={() => setActiveView('clients')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8" />
                  <h3 className="text-xl font-bold">ניהול לקוחות</h3>
                </div>
                <p className="text-blue-100">מערכת CRM מתקדמת לניהול לקוחות וליד</p>
              </button>
            </div>
            
            {/* כרטיסי ליד ולקוחות פוטנציאליים */}
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  לקוחות פוטנציאליים
                </h3>
                <button
                  onClick={() => openLeadModal()}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  הוסף ליד
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ליד פוטנציאלי 1 */}
                <div 
                  className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openLeadModal({ id: 1, name: 'שרה כהן', phone: '050-123-4567', source: 'פייסבוק', interest: 'צבע שיער' })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">שרה כהן</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">חדש</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>050-123-4567</span>
                    </div>
                    <div>עניין: צבע שיער</div>
                    <div>מקור: פייסבוק</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-green-500 text-white text-xs py-2 px-3 rounded hover:bg-green-600">
                      התקשר
                    </button>
                    <button className="flex-1 bg-blue-500 text-white text-xs py-2 px-3 rounded hover:bg-blue-600">
                      WhatsApp
                    </button>
                  </div>
                </div>
                
                {/* ליד פוטנציאלי 2 */}
                <div 
                  className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openLeadModal({ id: 2, name: 'רחל אברהם', phone: '052-987-6543', source: 'המלצה', interest: 'תספורת + צבע' })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">רחל אברהם</h4>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">בטיפול</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>052-987-6543</span>
                    </div>
                    <div>עניין: תספורת + צבע</div>
                    <div>מקור: המלצה</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-green-500 text-white text-xs py-2 px-3 rounded hover:bg-green-600">
                      התקשר
                    </button>
                    <button className="flex-1 bg-blue-500 text-white text-xs py-2 px-3 rounded hover:bg-blue-600">
                      קבע תור
                    </button>
                  </div>
                </div>
                
                {/* ליד פוטנציאלי 3 */}
                <div 
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openLeadModal({ id: 3, name: 'מיכל לוי', phone: '054-555-7777', source: 'Google', interest: 'טיפולי שיער' })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">מיכל לוי</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">עקוב</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>054-555-7777</span>
                    </div>
                    <div>עניין: טיפולי שיער</div>
                    <div>מקור: Google</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-purple-500 text-white text-xs py-2 px-3 rounded hover:bg-purple-600">
                      פגישת ייעוץ
                    </button>
                    <button className="flex-1 bg-orange-500 text-white text-xs py-2 px-3 rounded hover:bg-orange-600">
                      שלח הצעה
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeView === 'appointments' && (
          <div className="bg-white rounded-lg p-6 text-center">
            <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">ניהול תורים מתקדם</h3>
            <p className="text-gray-600">מערכת תורים מתקדמת עם התראות והזכרות</p>
          </div>
        )}
        {activeView === 'clients' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  ניהול לקוחות מתקדם
                </h3>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {clients.length} לקוחות
                  </span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    <Plus className="w-4 h-4 inline ml-1" />
                    לקוח חדש
                  </button>
                </div>
              </div>
              
              {clients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">אין לקוחות עדיין</h3>
                  <p className="text-gray-500 mb-4">התחל על ידי יצירת נתוני דמו או הוספת לקוח חדש</p>
                  <button
                    onClick={createDemoData}
                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
                  >
                    צור נתוני דמו
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {clients.map((client) => (
                    <div key={client.id} className="bg-gray-50 rounded-lg p-6 border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {(client.personal_info?.full_name || client.name || 'L').charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {client.personal_info?.full_name || client.name || 'לקוח'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {client.personal_info?.phone || client.phone || 'ללא טלפון'}
                            </p>
                          </div>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          פעיל
                        </span>
                      </div>

                      {/* פרופיל שיער */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">פרופיל שיער</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">צבע טבעי:</span>
                            <span className="mr-2 font-medium">
                              {client.hair_profile?.natural_color || 'לא צוין'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">צבע נוכחי:</span>
                            <span className="mr-2 font-medium">
                              {client.hair_profile?.current_color || 'לא צוין'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">סוג שיער:</span>
                            <span className="mr-2 font-medium">
                              {client.hair_profile?.hair_type || 'לא צוין'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">עובי:</span>
                            <span className="mr-2 font-medium">
                              {client.hair_profile?.hair_thickness || 'לא צוין'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* כרטיס כימיה */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          כרטיס כימיה
                        </h5>
                        <div className="space-y-2">
                          {client.chemistry_card?.allergies?.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded p-2">
                              <div className="text-xs font-semibold text-red-800 mb-1">אלרגיות:</div>
                              <div className="text-xs text-red-700">
                                {client.chemistry_card.allergies.join(', ')}
                              </div>
                            </div>
                          )}
                          {client.chemistry_card?.sensitivities?.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                              <div className="text-xs font-semibold text-yellow-800 mb-1">רגישויות:</div>
                              <div className="text-xs text-yellow-700">
                                {client.chemistry_card.sensitivities.join(', ')}
                              </div>
                            </div>
                          )}
                          {client.chemistry_card?.patch_test_date && (
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                              <div className="text-xs font-semibold text-green-800">
                                בדיקת עור: {client.chemistry_card.patch_test_result || 'שלילי'}
                              </div>
                              <div className="text-xs text-green-700">
                                תאריך: {new Date(client.chemistry_card.patch_test_date).toLocaleDateString('he-IL')}
                              </div>
                            </div>
                          )}
                          {client.chemistry_card?.notes && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                              <div className="text-xs font-semibold text-blue-800 mb-1">הערות:</div>
                              <div className="text-xs text-blue-700">{client.chemistry_card.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* פעולות */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                          <Calendar className="w-4 h-4 inline ml-1" />
                          קבע תור
                        </button>
                        <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                          <Edit className="w-4 h-4 inline ml-1" />
                          ערוך פרטים
                        </button>
                        <button className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeView === 'colors' && (
          <div className="space-y-6">
            {/* מאגר הצבעים המלא */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-500" />
                מאגר צבעים מקצועי - HairPro IL
              </h2>
              
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
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeView === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  ניהול מלאי חכם
                </h3>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {inventory.length} מוצרים
                  </span>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    <Plus className="w-4 h-4 inline ml-1" />
                    הוסף מוצר
                  </button>
                </div>
              </div>
              
              {inventory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">המלאי ריק</h3>
                  <p className="text-gray-500 mb-4">התחל על ידי יצירת נתוני דמו או הוספת מוצר חדש</p>
                  <button
                    onClick={createDemoData}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                  >
                    צור נתוני דמו
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="font-semibold text-gray-900">
                            {item.product_details?.brand || item.brand || 'מותג לא ידוע'}
                          </span>
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                          {item.product_category || 'צבע'}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 mb-2">
                        {item.product_details?.name || item.product || item.name}
                      </h4>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">מלאי נוכחי:</span>
                          <span className={`font-bold ${
                            item.current_stock <= item.minimum_stock 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {item.current_stock} יחידות
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">מינימום:</span>
                          <span className="font-medium">{item.minimum_stock} יחידות</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">מחיר ליחידה:</span>
                          <span className="font-bold text-green-600">
                            ₪{item.product_details?.unit_price || item.pricePerUnit}
                          </span>
                        </div>
                      </div>

                      {/* התראת מלאי נמוך */}
                      {item.current_stock <= item.minimum_stock && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-800 text-xs font-semibold">מלאי נמוך!</span>
                          </div>
                        </div>
                      )}

                      {/* מד מלאי */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>רמת מלאי</span>
                          <span>{Math.round((item.current_stock / (item.minimum_stock * 3)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              item.current_stock <= item.minimum_stock 
                                ? 'bg-red-500' 
                                : item.current_stock <= item.minimum_stock * 2
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min(100, (item.current_stock / (item.minimum_stock * 3)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* פעולות */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600">
                          <Plus className="w-3 h-3 inline ml-1" />
                          הוסף מלאי
                        </button>
                        <button className="flex-1 bg-purple-500 text-white px-3 py-2 rounded text-xs hover:bg-purple-600">
                          <Edit className="w-3 h-3 inline ml-1" />
                          ערוך
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'formulas' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 text-white p-6 rounded-2xl">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Beaker className="w-8 h-8" />
                מנהל פורמולות מתקדם 🧪
              </h1>
              <p className="text-blue-100 mt-1">ניהול מתקדם של פורמולות צבע עם חישובי עלויות בזמן אמת</p>
            </div>
            
            <AdvancedFormulaManager user={user} colorDatabase={colorDatabase} />
          </div>
        )}

      </div>

      {/* פופ-אפ כרטיס לקוח */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowClientModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedClient ? 'עריכת לקוח' : 'לקוח חדש'}
              </h2>
              <button 
                onClick={() => setShowClientModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="שם הלקוח המלא"
                  defaultValue={selectedClient?.name || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="050-123-4567"
                  defaultValue={selectedClient?.phone || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                  defaultValue={selectedClient?.email || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">הערות</label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="הערות על הלקוח..."
                  defaultValue={selectedClient?.notes || ''}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  ביטול
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  שמור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* פופ-אפ ליד */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowLeadModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedLead ? 'עריכת ליד' : 'ליד חדש'}
              </h2>
              <button 
                onClick={() => setShowLeadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="שם הליד המלא"
                    defaultValue={selectedLead?.name || ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="050-123-4567"
                    defaultValue={selectedLead?.phone || ''}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="email@example.com"
                  defaultValue={selectedLead?.email || ''}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מקור הליד</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    defaultValue={selectedLead?.source || ''}
                  >
                    <option value="">בחר מקור...</option>
                    <option value="פייסבוק">פייסבוק</option>
                    <option value="אינסטגרם">אינסטגרם</option>
                    <option value="Google">Google</option>
                    <option value="המלצה">המלצה</option>
                    <option value="לקוח קיים">לקוח קיים</option>
                    <option value="אתר">אתר</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תחום עניין</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    defaultValue={selectedLead?.interest || ''}
                  >
                    <option value="">בחר תחום...</option>
                    <option value="צבע שיער">צבע שיער</option>
                    <option value="תספורת">תספורת</option>
                    <option value="תספורת + צבע">תספורת + צבע</option>
                    <option value="טיפולי שיער">טיפולי שיער</option>
                    <option value="החלקה">החלקה</option>
                    <option value="תסרוקת אירועים">תסרוקת אירועים</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  defaultValue={selectedLead?.status || 'חדש'}
                >
                  <option value="חדש">חדש</option>
                  <option value="בטיפול">בטיפול</option>
                  <option value="עקוב">עקוב</option>
                  <option value="קבע תור">קבע תור</option>
                  <option value="הפך ללקוח">הפך ללקוח</option>
                  <option value="לא רלוונטי">לא רלוונטי</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">הערות</label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="הערות על הליד..."
                  defaultValue={selectedLead?.notes || ''}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  ביטול
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  שמור ליד
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* פופ-אפ יעדים */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowGoalsModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">ניהול יעדים</h2>
              <button 
                onClick={() => setShowGoalsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* יעדים יומיים */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">יעדים יומיים</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תורים ביום</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      defaultValue={goals.daily.appointments.target}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">הכנסות יומיות (₪)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      defaultValue={goals.daily.revenue.target}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">יעילות (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      defaultValue={goals.daily.efficiency.target}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שביעות רצון</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      defaultValue={goals.daily.satisfaction.target}
                    />
                  </div>
                </div>
              </div>
              
              {/* יעדים שבועיים */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">יעדים שבועיים</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תורים בשבוע</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      defaultValue={goals.weekly.appointments.target}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">הכנסות שבועיות (₪)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      defaultValue={goals.weekly.revenue.target}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">לקוחות חדשים</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      defaultValue={goals.weekly.newClients.target}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  ביטול
                </button>
                <button
                  onClick={() => updateGoals(goals)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  עדכן יעדים
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - תוקן עבור RTL */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" dir="rtl">
        <div className="grid grid-cols-5 py-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'דשבורד' },
            { id: 'formulas', icon: Beaker, label: 'פורמולות' },
            { id: 'colors', icon: Palette, label: 'צבעים' },
            { id: 'clients', icon: Users, label: 'לקוחות' },
            { id: 'inventory', icon: Package, label: 'מלאי' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex flex-col items-center py-3 px-2 transition-all ${
                activeView === id 
                  ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-500'
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