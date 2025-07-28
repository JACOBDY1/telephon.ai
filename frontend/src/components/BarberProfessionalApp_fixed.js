import React, { useState, useEffect } from 'react';
import { 
  Home, Package, Users, BarChart3, Settings, DollarSign, Activity,
  Scissors, Timer, Star, Gift, Target, Calendar, Plus, Search, User,
  Phone, Mail, Palette, AlertCircle, Edit, CheckCircle, Bell, X,
  Droplets, TrendingUp, PieChart, Beaker, MessageCircle, Share2
} from 'lucide-react';

import AdvancedFormulaManager from './AdvancedFormulaManager';

const BarberProfessionalApp = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workStatus, setWorkStatus] = useState('ready');
  const [currentClient, setCurrentClient] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  
  // מערכת פופ-אפים
  const [showClientModal, setShowClientModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);  
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // מערכת נתונים מקיפה - עכשיו לכל המשתמשים
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
  
  // מערכת זמן ונוכחות - לכל המשתמשים
  const [workTime, setWorkTime] = useState({
    startTime: null,
    endTime: null,
    totalHours: 0,
    breakTime: 0,
    isActive: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      <div className="sticky top-0 bg-white shadow-sm border-b px-4 py-3 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HairPro IL Advanced</h1>
              <p className="text-xs text-gray-500">מערכת ניהול מתקדמת לסלון שיער - לכל המשתמשים</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Target className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 pb-20">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Scissors className="w-8 h-8" />
                HairPro IL Advanced - דאשבורד מתקדם 🎯
              </h1>
              <p className="text-blue-100 mt-1">מערכת יעדים וטיפים מתקדמת לכל המשתמשים</p>
            </div>

            {/* כרטיסי מידע מהיר */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">לקוחות היום</div>
                    <div className="text-xl font-bold">8</div>
                    <div className="text-xs text-green-600">+2 מאתמול</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">הכנסות היום</div>
                    <div className="text-xl font-bold">₪2,340</div>
                    <div className="text-xs text-green-600">יעד: ₪1,500</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border">
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

              <div className="bg-white rounded-xl p-4 shadow-lg border">
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
                        <p className="text-2xl font-bold text-green-600">₪890</p>
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
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    שתף באינסטגרם
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    שלח לביקורת Google
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    בקש משוב
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    עדכן יעדים לפי יومן
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
            
            <AdvancedFormulaManager user={user} />
          </div>
        )}

        {activeView === 'colors' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Palette className="w-8 h-8" />
                מאגר צבעים מקצועי 🎨
              </h1>
              <p className="text-purple-100 mt-1">127 צבעים מ-3 מותגים מקצועיים</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <p className="text-gray-600 text-center">מאגר הצבעים המקצועי זמין לכל המשתמשים</p>
            </div>
          </div>
        )}

        {activeView === 'clients' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-2xl">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="w-8 h-8" />
                ניהול לקוחות 👥
              </h1>
              <p className="text-blue-100 mt-1">מערכת CRM מתקדמת לניהול לקוחות</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <p className="text-gray-600 text-center">מערכת ניהול הלקוחות זמינה לכל המשתמשים</p>
            </div>
          </div>
        )}

        {activeView === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Package className="w-8 h-8" />
                ניהול מלאי 📦
              </h1>
              <p className="text-indigo-100 mt-1">מערכת מלאי חכמה עם ניבוי AI</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <p className="text-gray-600 text-center">מערכת המלאי זמינה לכל המשתמשים</p>
            </div>
          </div>
        )}
      </div>

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

      {/* שעון צף קטן ופשוט */}
      <div className="fixed bottom-20 right-4 z-40">
        <div className="bg-white rounded-xl shadow-lg p-3 w-16 h-16 flex items-center justify-center">
          <div className="text-center">
            <Timer className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <div className="text-xs text-gray-600">
              {workTime.isActive ? 'פעיל' : 'מוכן'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberProfessionalApp;