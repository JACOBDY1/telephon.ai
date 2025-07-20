import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, Target, Users, DollarSign, Star, Share2, 
  TrendingUp, Gift, MessageCircle, Camera, Link, QrCode,
  Award, Bell, CheckCircle, AlertTriangle, Zap, Trophy,
  ThumbsUp, Heart, Coffee, Scissors, Pill, UserCheck,
  Timer, MapPin, Phone, Mail, Instagram, Facebook,
  CreditCard, Banknote, Smartphone, Wallet, ArrowUp,
  TrendingDown, BarChart3, PieChart, Activity, Plus
} from 'lucide-react';

const ProviderManagementSystem = ({ darkMode = false, t = {}, user }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState('out'); // out, in, break
  const [dailyStats, setDailyStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [goals, setGoals] = useState({});
  const [referrals, setReferrals] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [tipJar, setTipJar] = useState({});
  const [socialLinks, setSocialLinks] = useState({});

  // Initialize provider data
  useEffect(() => {
    loadProviderData();
  }, [selectedDate]);

  const loadProviderData = () => {
    // Mock data - in real app would come from API
    setDailyStats({
      appointmentsCompleted: 8,
      appointmentsBooked: 12,
      revenue: 2400,
      tips: 280,
      productSales: 450,
      referralBonus: 150,
      satisfactionRating: 4.8,
      workHours: 7.5,
      breakTime: 1.0
    });

    setAppointments([
      {
        id: 1,
        clientName: 'שרה כהן',
        service: 'תספורת + צביעה',
        time: '09:00-11:00',
        price: 320,
        status: 'completed',
        rating: 5,
        tip: 50,
        products: [{ name: 'שמפו מקצועי', price: 85 }],
        notes: 'לקוחה מרוצה, חזרה בעוד חודש'
      },
      {
        id: 2,
        clientName: 'רחל לוי',
        service: 'מניקור + פדיקור',
        time: '11:30-12:30',
        price: 180,
        status: 'completed',
        rating: 4,
        tip: 20,
        products: [],
        notes: 'המליצה על חברה'
      },
      {
        id: 3,
        clientName: 'מיכל אברהם',
        service: 'יעוץ תזונה',
        time: '14:00-15:00',
        price: 250,
        status: 'upcoming',
        rating: null,
        tip: 0,
        products: [{ name: 'תוספי תזונה', price: 120, recommended: true }],
        notes: 'לקוחה חדשה - לברר אלרגיות'
      }
    ]);

    setGoals({
      daily: {
        appointments: { target: 10, current: 8, percentage: 80 },
        revenue: { target: 2500, current: 2400, percentage: 96 },
        tips: { target: 300, current: 280, percentage: 93 },
        newClients: { target: 2, current: 1, percentage: 50 },
        satisfaction: { target: 4.5, current: 4.8, percentage: 107 }
      },
      weekly: {
        appointments: { target: 60, current: 52, percentage: 87 },
        revenue: { target: 15000, current: 14200, percentage: 95 },
        referrals: { target: 5, current: 3, percentage: 60 }
      },
      monthly: {
        newClients: { target: 40, current: 35, percentage: 88 },
        revenue: { target: 60000, current: 58500, percentage: 98 },
        satisfaction: { target: 4.6, current: 4.8, percentage: 104 }
      }
    });

    setReferrals([
      {
        id: 1,
        referrerName: 'שרה כהן',
        newClientName: 'ליאת מזרחי',
        serviceBooked: 'תספורת',
        commission: 50,
        status: 'completed',
        date: '2024-01-18'
      },
      {
        id: 2,
        referrerName: 'רחל לוי', 
        newClientName: 'דנה גרין',
        serviceBooked: 'מניקור',
        commission: 30,
        status: 'pending',
        date: '2024-01-19'
      }
    ]);

    setTipJar({
      totalToday: 280,
      averagePerService: 35,
      satisfactionCorrelation: 95,
      paymentMethods: {
        cash: 120,
        card: 80,
        digital: 80
      },
      topTippers: [
        { name: 'שרה כהן', amount: 50, frequency: 'חודשי' },
        { name: 'מיכל דוד', amount: 40, frequency: 'שבועי' }
      ]
    });

    setSocialLinks({
      instagram: { followers: 2450, engagement: 8.5, storiesViewed: 340 },
      facebook: { followers: 1200, engagement: 5.2, postsReach: 890 },
      whatsapp: { contacts: 450, messagesDaily: 25 },
      website: { visits: 120, bookings: 8, conversion: 6.7 }
    });
  };

  const handleClockInOut = () => {
    const newStatus = attendanceStatus === 'out' ? 'in' : 'out';
    setAttendanceStatus(newStatus);
    console.log(`${newStatus === 'in' ? 'נכניסה' : 'יציאה'} נרשמה בשעה ${new Date().toLocaleTimeString('he-IL')}`);
  };

  const generateSocialLink = (platform) => {
    const baseUrl = 'https://booking.telephonyai.com';
    const providerCode = user?.id || 'demo123';
    const encodedLink = `${baseUrl}/book/${providerCode}?ref=${platform}`;
    
    return {
      link: encodedLink,
      qrCode: `${baseUrl}/qr/${providerCode}?ref=${platform}`,
      story: `ספרת מקצועית מרוצה להזמין אותך! 💇‍♀️✨ זמני תור: ${encodedLink}`
    };
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Time Clock */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">שעון נוכחות</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            attendanceStatus === 'in' ? 'bg-green-100 text-green-800' :
            attendanceStatus === 'break' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {attendanceStatus === 'in' ? '✅ במשמרת' : 
             attendanceStatus === 'break' ? '⏸️ בהפסקה' : '🔴 לא במשמרת'}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-mono text-gray-900 dark:text-white">
              {new Date().toLocaleTimeString('he-IL')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {dailyStats.workHours}h עבודה | {dailyStats.breakTime}h הפסקות
            </div>
          </div>
          <button
            onClick={handleClockInOut}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              attendanceStatus === 'out' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Clock className="w-5 h-5 inline ml-2" />
            {attendanceStatus === 'out' ? 'כניסה למשמרת' : 'יציאה ממשמרת'}
          </button>
        </div>
      </div>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'טיפולים היום', value: `${dailyStats.appointmentsCompleted}/${dailyStats.appointmentsBooked}`, icon: Calendar, color: 'blue' },
          { title: 'הכנסות היום', value: `₪${dailyStats.revenue?.toLocaleString()}`, icon: DollarSign, color: 'green' },
          { title: 'טיפים היום', value: `₪${dailyStats.tips}`, icon: Gift, color: 'purple' },
          { title: 'דירוג שביעות רצון', value: `${dailyStats.satisfactionRating}⭐`, icon: Star, color: 'yellow' }
        ].map((stat, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals Progress */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          יעדים יומיים - Z Score היום
        </h3>
        <div className="space-y-4">
          {Object.entries(goals?.daily || {}).map(([key, goal]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {key === 'appointments' ? 'טיפולים' :
                     key === 'revenue' ? 'הכנסות' :
                     key === 'tips' ? 'טיפים' :
                     key === 'newClients' ? 'לקוחות חדשים' :
                     key === 'satisfaction' ? 'שביעות רצון' : key}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {goal?.current || 0}/{goal?.target || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      (goal?.percentage || 0) >= 100 ? 'bg-green-500' :
                      (goal?.percentage || 0) >= 80 ? 'bg-blue-500' :
                      (goal?.percentage || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(goal?.percentage || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                goal.percentage >= 100 ? 'bg-green-100 text-green-800' :
                goal.percentage >= 80 ? 'bg-blue-100 text-blue-800' :
                goal.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {goal.percentage}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Daily Z Score Recommendation */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                המלצה להשגת יעד היום
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                נותרו לך 2 טיפולים להשגת יעד יומי. המלץ על מוצרי טיפוח ללקוח הבא לשיפור ההכנסות. 
                הדירוג שלך מעולה - המשך כך! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TodaySchedule = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          לוח יומי - {new Date(selectedDate).toLocaleDateString('he-IL')}
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-500' :
                    appointment.status === 'in-progress' ? 'bg-blue-500' :
                    appointment.status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {appointment.clientName}
                  </h4>
                  <span className="text-sm text-gray-500">{appointment.time}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-2">{appointment.service}</p>
                
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-green-600 font-medium">₪{appointment.price}</span>
                  {appointment.tip > 0 && (
                    <span className="text-purple-600 font-medium">+₪{appointment.tip} טיפ</span>
                  )}
                  {appointment.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{appointment.rating}</span>
                    </div>
                  )}
                </div>
                
                {appointment.products.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מוצרים:</p>
                    {appointment.products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {product.name} {product.recommended && '(מומלץ)'}
                        </span>
                        <span className="text-green-600">₪{product.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {appointment.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    📝 {appointment.notes}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {appointment.status === 'upcoming' && (
                  <>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      התחל טיפול
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      התקשר ללקוח
                    </button>
                  </>
                )}
                {appointment.status === 'completed' && appointment.rating < 5 && (
                  <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                    בקש חוות דעת
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SocialSharing = () => {
    const [selectedPlatform, setSelectedPlatform] = useState('instagram');
    const linkData = generateSocialLink(selectedPlatform);

    return (
      <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            שיתוף בכל הקידות וקבלת לקוחות
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink', stats: socialLinks.instagram },
              { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue', stats: socialLinks.facebook },
              { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'green', stats: socialLinks.whatsapp },
              { id: 'website', name: 'Website', icon: Link, color: 'gray', stats: socialLinks.website }
            ].map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedPlatform === platform.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <platform.icon className={`w-6 h-6 mx-auto mb-2 text-${platform.color}-600`} />
                <div className="text-sm font-medium text-gray-900 dark:text-white">{platform.name}</div>
                {platform.stats && (
                  <div className="text-xs text-gray-500 mt-1">
                    {platform.stats.followers || platform.stats.contacts || platform.stats.visits} עוקבים
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              לינק מקודד עבור {selectedPlatform}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={linkData.link}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(linkData.link)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  העתק
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" />
                  צור QR Code
                </button>
                <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4" />
                  צור סטורי
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            סטטיסטיקות רשתות חברתיות
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{socialLinks.instagram?.storiesViewed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">צפיות בסטורי השבוע</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">הזמנות מרשתות חברתיות</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TipJarSystem = () => (
    <div className="space-y-6">
      {/* Tip Jar Overview */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🎯 מערכת טיפים אישית
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">₪{tipJar.totalToday}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">טיפים היום</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">₪{tipJar.averagePerService}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">ממוצע לטיפול</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">{tipJar.satisfactionCorrelation}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">מתאמן עם שביעות רצון</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">אמצעי תשלום מקובלים</h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              { method: 'מזומן', amount: tipJar.paymentMethods.cash, icon: Banknote, color: 'green' },
              { method: 'כרטיס אשראי', amount: tipJar.paymentMethods.card, icon: CreditCard, color: 'blue' },
              { method: 'דיגיטלי', amount: tipJar.paymentMethods.digital, icon: Smartphone, color: 'purple' }
            ].map((payment, index) => (
              <div key={index} className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <payment.icon className={`w-6 h-6 mx-auto mb-2 text-${payment.color}-600`} />
                <div className="font-medium">₪{payment.amount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{payment.method}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tippers */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">לקוחות מעניקי טיפים מובילים</h4>
          <div className="space-y-2">
            {tipJar.topTippers.map((tipper, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{tipper.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{tipper.frequency}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">₪{tipper.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automated Survey System */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🤖 אוטומציית סקר שביעות רצון
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-300">שליחה אוטומטית לאחר טיפול</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">סקר + בקשה לדירוג גוגל + אפשרות טיפ</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-300">אינטגרציה עם Google Reviews</h4>
              <p className="text-sm text-green-800 dark:text-green-200">לקוחות מרוצים מועברים לדירוג אוטומטי</p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-purple-900 dark:text-purple-300">מערכת תגמול נאמנות</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">לקוחות חוזרים מקבלים הטבות מיוחדות</p>
            </div>
            <div className="text-2xl">🎁</div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      {/* Provider Rating & Reviews */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          ביקורות ודירוג הספר
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-500 mb-2">4.8</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-6 h-6 ${star <= 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">מתוך 127 ביקורות</div>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded-full"
                    style={{ 
                      width: `${rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 2 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {rating === 5 ? 99 : rating === 4 ? 19 : rating === 3 ? 6 : rating === 2 ? 3 : 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border text-center`}>
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">לקוחות חוזרים</div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border text-center`}>
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">89%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">המלצות לחברים</div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border text-center`}>
          <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">12 דק'</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">זמן תגובה ממוצע</div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          מגמת הכנסות חודשית
        </h3>
        <div className="h-64 flex items-end justify-around border-b border-gray-200 dark:border-gray-700">
          {[65, 78, 85, 92, 88, 95, 98].map((height, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="bg-blue-500 w-8 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול'][index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 lg:p-6`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 מערכת הספר/מטפל החכמה
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          מכונת עבודה מושלמת לכל מי שמוכר שירות מבוסס זמן
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton id="dashboard" label="דשבורד" icon={BarChart3} active={activeView === 'dashboard'} onClick={setActiveView} />
        <TabButton id="schedule" label="לוח יומי" icon={Calendar} active={activeView === 'schedule'} onClick={setActiveView} />
        <TabButton id="goals" label="יעדים" icon={Target} active={activeView === 'goals'} onClick={setActiveView} />
        <TabButton id="social" label="שיתוף חברתי" icon={Share2} active={activeView === 'social'} onClick={setActiveView} />
        <TabButton id="tips" label="מערכת טיפים" icon={Gift} active={activeView === 'tips'} onClick={setActiveView} />
        <TabButton id="analytics" label="אנליטיקס" icon={TrendingUp} active={activeView === 'analytics'} onClick={setActiveView} />
      </div>

      {/* Main Content */}
      <div>
        {activeView === 'dashboard' && <DashboardOverview />}
        {activeView === 'schedule' && <TodaySchedule />}
        {activeView === 'social' && <SocialSharing />}
        {activeView === 'tips' && <TipJarSystem />}
        {activeView === 'analytics' && <AnalyticsView />}
      </div>
    </div>
  );
};

export default ProviderManagementSystem;