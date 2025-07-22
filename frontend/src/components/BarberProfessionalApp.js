import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Package, Scale, Camera, Clock, Home, Settings, ChevronRight, Plus, Minus, AlertCircle, Check, TrendingUp, DollarSign, Users, Calendar, Bell, BarChart3, Activity, Smartphone, Wifi, X, Edit2, Save, RefreshCw, FileText, Download, Upload, Share2, Printer } from 'lucide-react';

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

// רכיב התראות
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

// רכיב דשבורד מתקדם
const Dashboard = ({ data }) => {
  const [timeRange, setTimeRange] = useState('today');
  
  const stats = {
    today: {
      revenue: 3840,
      clients: 12,
      colorUsed: 245,
      efficiency: 92
    },
    week: {
      revenue: 18500,
      clients: 58,
      colorUsed: 1230,
      efficiency: 89
    },
    month: {
      revenue: 74200,
      clients: 234,
      colorUsed: 4920,
      efficiency: 87
    }
  };
  
  const currentStats = stats[timeRange];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">לוח בקרה</h2>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="today">היום</option>
          <option value="week">השבוע</option>
          <option value="month">החודש</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">הכנסות</p>
              <p className="text-3xl font-bold">₪{currentStats.revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+15% מהתקופה הקודמת</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">לקוחות</p>
              <p className="text-3xl font-bold">{currentStats.clients}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            <span>ממוצע 3.2 לקוחות לשעה</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">צבע בשימוש</p>
              <p className="text-3xl font-bold">{currentStats.colorUsed}g</p>
            </div>
            <Package className="w-12 h-12 text-purple-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>חיסכון של 22% בבזבוז</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">יעילות</p>
              <p className="text-3xl font-bold">{currentStats.efficiency}%</p>
            </div>
            <Activity className="w-12 h-12 text-orange-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" />
            <span>מעל היעד ב-7%</span>
          </div>
        </div>
      </div>
      
      {/* גרף ביצועים */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">ביצועי עובדים - היום</h3>
        <div className="space-y-4">
          {[
            { name: 'שרה כהן', clients: 5, revenue: 1250, efficiency: 95 },
            { name: 'מיכל לוי', clients: 4, revenue: 980, efficiency: 88 },
            { name: 'דנה ברק', clients: 3, revenue: 810, efficiency: 92 }
          ].map((employee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{employee.name}</span>
                  <span className="text-sm text-gray-600">
                    {employee.clients} לקוחות | ₪{employee.revenue}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${employee.efficiency}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// רכיב ניהול פורמולה מתקדם עם שקילה
const AdvancedFormulaManager = ({ client, onSave, onNotification }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isWeighing, setIsWeighing] = useState(false);
  const [formula, setFormula] = useState({
    colors: [],
    developer: '',
    totalWeight: 0,
    actualWeight: 0,
    waste: 0,
    cost: 0,
    notes: '',
    processTime: 0
  });
  
  const [currentColor, setCurrentColor] = useState({
    brand: '',
    series: '',
    code: '',
    weight: 0,
    actualWeight: 0
  });
  
  const [savedFormulas, setSavedFormulas] = useState([
    { 
      id: 1, 
      name: 'בלונד זהוב קלאסי', 
      colors: [
        { brand: 'schwarzkopf', code: '8-3', weight: 40 },
        { brand: 'schwarzkopf', code: '9-0', weight: 20 }
      ],
      developer: '20vol',
      totalWeight: 60
    }
  ]);

  // סימולציה של חיבור למשקל Bluetooth
  const connectScale = () => {
    setIsConnected(true);
    onNotification({
      type: 'success',
      title: 'משקל מחובר',
      message: 'המשקל חובר בהצלחה'
    });
    
    // סימולציה של קריאת משקל
    const interval = setInterval(() => {
      if (isWeighing) {
        setCurrentWeight(prev => {
          const newWeight = prev + (Math.random() * 5);
          return Math.round(newWeight * 10) / 10;
        });
      }
    }, 500);
    
    return () => clearInterval(interval);
  };

  const startWeighing = () => {
    setIsWeighing(true);
    setCurrentWeight(0);
  };

  const stopWeighing = () => {
    setIsWeighing(false);
    setCurrentColor(prev => ({ ...prev, actualWeight: currentWeight }));
  };

  const addColor = () => {
    if (currentColor.brand && currentColor.series && currentColor.code && currentColor.actualWeight > 0) {
      const colorInfo = colorDatabase[currentColor.brand].series[currentColor.series].colors.find(
        c => c.code === currentColor.code
      );
      
      const colorCost = (currentColor.actualWeight / 60) * colorInfo.price; // עלות לגרם
      
      setFormula(prev => ({
        ...prev,
        colors: [...prev.colors, { ...currentColor, cost: colorCost }],
        totalWeight: prev.totalWeight + currentColor.actualWeight,
        cost: prev.cost + colorCost
      }));
      
      setCurrentColor({ brand: '', series: '', code: '', weight: 0, actualWeight: 0 });
      setCurrentWeight(0);
    }
  };

  const calculateWaste = () => {
    const plannedWeight = formula.colors.reduce((sum, color) => sum + color.weight, 0);
    const actualWeight = formula.colors.reduce((sum, color) => sum + color.actualWeight, 0);
    return actualWeight - plannedWeight;
  };

  const saveFormula = () => {
    const completeFormula = {
      ...formula,
      date: new Date().toISOString(),
      clientId: client.id,
      waste: calculateWaste(),
      efficiency: formula.totalWeight > 0 ? 
        Math.round((formula.totalWeight - calculateWaste()) / formula.totalWeight * 100) : 100
    };
    
    onSave(completeFormula);
    
    onNotification({
      type: 'success',
      title: 'פורמולה נשמרה',
      message: `עלות: ₪${formula.cost.toFixed(2)} | יעילות: ${completeFormula.efficiency}%`
    });
  };

  const loadSavedFormula = (savedFormula) => {
    const colors = savedFormula.colors.map(color => {
      const brand = Object.entries(colorDatabase).find(([key, b]) => key === color.brand);
      const series = brand && Object.entries(brand[1].series).find(([key, s]) => 
        s.colors.some(c => c.code === color.code)
      );
      
      return {
        ...color,
        series: series ? series[0] : '',
        actualWeight: 0
      };
    });
    
    setFormula(prev => ({
      ...prev,
      colors,
      developer: savedFormula.developer,
      totalWeight: savedFormula.totalWeight
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">ניהול פורמולה מתקדם - {client.name}</h3>
        <div className="flex items-center gap-4">
          {!isConnected ? (
            <button
              onClick={connectScale}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Wifi className="w-4 h-4" />
              חבר משקל
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="font-semibold">משקל מחובר</span>
            </div>
          )}
        </div>
      </div>
      
      {/* פורמולות שמורות */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">פורמולות שמורות</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {savedFormulas.map(saved => (
            <button
              key={saved.id}
              onClick={() => loadSavedFormula(saved)}
              className="text-right p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="font-semibold">{saved.name}</div>
              <div className="text-sm text-gray-600">{saved.totalWeight}g</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* מד משקל דיגיטלי */}
      {isConnected && (
        <div className="mb-6 bg-gray-900 text-green-400 rounded-lg p-6 text-center">
          <div className="text-5xl font-mono font-bold">{currentWeight.toFixed(1)}g</div>
          <div className="mt-2 flex justify-center gap-4">
            {!isWeighing ? (
              <button
                onClick={startWeighing}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                התחל שקילה
              </button>
            ) : (
              <button
                onClick={stopWeighing}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                עצור שקילה
              </button>
            )}
            <button
              onClick={() => setCurrentWeight(0)}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              אפס
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <select
            className="border rounded-lg p-2"
            value={currentColor.brand}
            onChange={(e) => setCurrentColor(prev => ({ ...prev, brand: e.target.value, series: '', code: '' }))}
          >
            <option value="">בחר חברה</option>
            {Object.entries(colorDatabase).map(([key, brand]) => (
              <option key={key} value={key}>{brand.name}</option>
            ))}
          </select>
          
          <select
            className="border rounded-lg p-2"
            value={currentColor.series}
            onChange={(e) => setCurrentColor(prev => ({ ...prev, series: e.target.value, code: '' }))}
            disabled={!currentColor.brand}
          >
            <option value="">בחר סדרה</option>
            {currentColor.brand && Object.entries(colorDatabase[currentColor.brand].series).map(([key, series]) => (
              <option key={key} value={key}>{series.name}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <select
            className="border rounded-lg p-2"
            value={currentColor.code}
            onChange={(e) => setCurrentColor(prev => ({ ...prev, code: e.target.value }))}
            disabled={!currentColor.series}
          >
            <option value="">בחר צבע</option>
            {currentColor.brand && currentColor.series && 
              colorDatabase[currentColor.brand].series[currentColor.series].colors.map(color => (
                <option key={color.code} value={color.code}>
                  {color.code} - {color.name}
                </option>
              ))
            }
          </select>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="משקל מתוכנן (גרם)"
              className="border rounded-lg p-2 flex-1"
              value={currentColor.weight}
              onChange={(e) => setCurrentColor(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
            />
            <span className="text-sm text-gray-600">
              בפועל: {currentColor.actualWeight}g
            </span>
            <button
              onClick={addColor}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              disabled={!currentColor.actualWeight}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {formula.colors.length > 0 && (
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-700">צבעים בפורמולה:</h4>
            <div className="space-y-2">
              {formula.colors.map((color, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex-1">
                    <span className="font-semibold">
                      {colorDatabase[color.brand].name} - {color.code}
                    </span>
                    <div className="text-sm text-gray-600">
                      מתוכנן: {color.weight}g | בפועל: {color.actualWeight}g | 
                      הפרש: {(color.actualWeight - color.weight).toFixed(1)}g
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">₪{color.cost.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between font-bold">
                <span>סה"כ משקל:</span>
                <span>{formula.totalWeight.toFixed(1)} גרם</span>
              </div>
              <div className="flex justify-between font-bold text-green-600">
                <span>עלות כוללת:</span>
                <span>₪{formula.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>יעילות:</span>
                <span>{calculateWaste() > 0 ? 'בזבוז של' : 'חיסכון של'} {Math.abs(calculateWaste()).toFixed(1)}g</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <select
            className="w-full border rounded-lg p-2"
            value={formula.developer}
            onChange={(e) => setFormula(prev => ({ ...prev, developer: e.target.value }))}
          >
            <option value="">בחר חמצן</option>
            <option value="10vol">10vol (3%)</option>
            <option value="20vol">20vol (6%)</option>
            <option value="30vol">30vol (9%)</option>
            <option value="40vol">40vol (12%)</option>
          </select>
          
          <input
            type="number"
            placeholder="זמן תהליך (דקות)"
            className="w-full border rounded-lg p-2"
            value={formula.processTime}
            onChange={(e) => setFormula(prev => ({ ...prev, processTime: parseInt(e.target.value) || 0 }))}
          />
          
          <textarea
            placeholder="הערות"
            className="w-full border rounded-lg p-2"
            rows="3"
            value={formula.notes}
            onChange={(e) => setFormula(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={saveFormula}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
            disabled={formula.colors.length === 0}
          >
            <Save className="w-5 h-5" />
            שמור פורמולה
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// רכיב ניהול מלאי חכם
const SmartInventoryManager = ({ onNotification }) => {
  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      brand: 'schwarzkopf', 
      product: 'IGORA ROYAL 6-0', 
      quantity: 12, 
      min: 5, 
      max: 20,
      unit: 'שפופרות',
      avgUsage: 2.5,
      lastOrder: '2024-01-10',
      price: 28,
      supplier: 'ספק מרכזי'
    },
    { 
      id: 2, 
      brand: 'loreal', 
      product: 'MAJIREL 7.31', 
      quantity: 8, 
      min: 5, 
      max: 15,
      unit: 'שפופרות',
      avgUsage: 1.8,
      lastOrder: '2024-01-05',
      price: 32,
      supplier: 'ספק מרכזי'
    },
    { 
      id: 3, 
      brand: 'indola', 
      product: 'PCC 5.0', 
      quantity: 3, 
      min: 5, 
      max: 15,
      unit: 'שפופרות',
      avgUsage: 1.2,
      lastOrder: '2023-12-28',
      price: 22,
      supplier: 'ספק צפון'
    },
    { 
      id: 4, 
      brand: 'schwarzkopf', 
      product: 'חמצן 20vol', 
      quantity: 2000, 
      min: 1000, 
      max: 5000,
      unit: 'מ"ל',
      avgUsage: 150,
      lastOrder: '2024-01-15',
      price: 0.05,
      supplier: 'ספק מרכזי'
    },
  ]);
  
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  
  const updateQuantity = (id, change) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
    ));
  };
  
  const addToOrder = (item) => {
    const orderQuantity = item.max - item.quantity;
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {...i, orderQuantity: i.orderQuantity + orderQuantity} : i);
      }
      return [...prev, { ...item, orderQuantity }];
    });
  };
  
  const sendOrder = () => {
    const totalCost = orderItems.reduce((sum, item) => 
      sum + (item.orderQuantity * item.price), 0
    );
    
    onNotification({
      type: 'success',
      title: 'הזמנה נשלחה',
      message: `${orderItems.length} פריטים בסכום של ₪${totalCost.toFixed(2)}`
    });
    
    setOrderItems([]);
    setShowOrderForm(false);
  };
  
  const lowStockItems = inventory.filter(item => item.quantity <= item.min);
  const daysUntilEmpty = (item) => Math.floor(item.quantity / item.avgUsage);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">ניהול מלאי חכם</h3>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              ייבוא מלאי
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
              <Download className="w-4 h-4" />
              ייצוא דוח
            </button>
          </div>
        </div>
        
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">{lowStockItems.length} מוצרים במלאי נמוך!</span>
              </div>
              <button
                onClick={() => setShowOrderForm(true)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                הזמן עכשיו
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right pb-2">מוצר</th>
                <th className="text-center pb-2">כמות נוכחית</th>
                <th className="text-center pb-2">צפי ימים</th>
                <th className="text-center pb-2">ממוצע שימוש</th>
                <th className="text-center pb-2">מחיר יחידה</th>
                <th className="text-center pb-2">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => {
                const days = daysUntilEmpty(item);
                const isLow = item.quantity <= item.min;
                const isCritical = days <= 3;
                
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <div className="font-semibold">{item.product}</div>
                        <div className="text-sm text-gray-600">
                          {colorDatabase[item.brand]?.name || item.brand} | {item.supplier}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className={`font-bold text-lg ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500">{item.unit}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        מינימום: {item.min} | מקסימום: {item.max}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className={`font-semibold ${isCritical ? 'text-red-600' : days <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {days} ימים
                      </div>
                    </td>
                    <td className="text-center">
                      <div>{item.avgUsage} {item.unit}/יום</div>
                    </td>
                    <td className="text-center">
                      <div>₪{item.unit === 'מ"ל' ? (item.price * 1000).toFixed(2) + '/ליטר' : item.price}</div>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => addToOrder(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        הזמן
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* טופס הזמנה */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">טופס הזמנה</h3>
              <button
                onClick={() => setShowOrderForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {orderItems.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-semibold">{item.product}</div>
                        <div className="text-sm text-gray-600">{item.supplier}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={item.orderQuantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 0;
                            setOrderItems(prev => prev.map(i => 
                              i.id === item.id ? {...i, orderQuantity: newQuantity} : i
                            ));
                          }}
                          className="w-20 text-center border rounded px-2 py-1"
                        />
                        <span className="text-sm">{item.unit}</span>
                        <span className="font-semibold">₪{(item.orderQuantity * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold mb-4">
                    <span>סה"כ להזמנה:</span>
                    <span>₪{orderItems.reduce((sum, item) => sum + (item.orderQuantity * item.price), 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={sendOrder}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                      שלח הזמנה
                    </button>
                    <button
                      onClick={() => setShowOrderForm(false)}
                      className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">לא נבחרו מוצרים להזמנה</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// רכיב ניהול תורים וזמנים
const AppointmentScheduler = ({ onNotification }) => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      client: 'שרה כהן',
      service: 'צביעה + תספורת',
      stylist: 'מיכל לוי',
      time: '10:00',
      duration: 90,
      status: 'confirmed',
      notes: 'אלרגיה לאמוניה'
    },
    {
      id: 2,
      client: 'רחל ברק',
      service: 'גוונים',
      stylist: 'דנה כהן',
      time: '11:30',
      duration: 120,
      status: 'confirmed'
    },
    {
      id: 3,
      client: 'יעל גרין',
      service: 'צביעת שורשים',
      stylist: 'מיכל לוי',
      time: '14:00',
      duration: 60,
      status: 'pending'
    }
  ]);
  
  const timeSlots = [];
  for (let hour = 9; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  
  const stylists = ['מיכל לוי', 'דנה כהן', 'שרה ברק'];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">לוח זמנים - היום</h3>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            תור חדש
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="font-semibold text-gray-700">שעה</div>
        {stylists.map(stylist => (
          <div key={stylist} className="font-semibold text-gray-700 text-center">
            {stylist}
          </div>
        ))}
        
        {timeSlots.map(time => {
          const hour = parseInt(time.split(':')[0]);
          const isCurrentTime = hour === new Date().getHours();
          
          return (
            <React.Fragment key={time}>
              <div className={`text-sm py-2 ${isCurrentTime ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                {time}
              </div>
              {stylists.map(stylist => {
                const appointment = appointments.find(
                  apt => apt.stylist === stylist && apt.time === time
                );
                
                return (
                  <div key={`${time}-${stylist}`} className="relative">
                    {appointment && (
                      <div
                        className={`absolute inset-x-0 rounded-lg p-2 text-xs cursor-pointer hover:shadow-lg transition-shadow ${
                          appointment.status === 'confirmed' ? 'bg-blue-100 border-blue-300' : 
                          'bg-yellow-100 border-yellow-300'
                        } border`}
                        style={{
                          height: `${(appointment.duration / 30) * 40}px`,
                          zIndex: 10
                        }}
                      >
                        <div className="font-semibold">{appointment.client}</div>
                        <div>{appointment.service}</div>
                        {appointment.notes && (
                          <div className="text-red-600 font-semibold mt-1">
                            ⚠️ {appointment.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// רכיב ניהול לקוחות מתקדם
const AdvancedClientManager = ({ onSelectClient, onNotification }) => {
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: 'שרה כהן', 
      phone: '050-1234567', 
      email: 'sarah@example.com',
      currentColor: 'בלונד בהיר 8.3',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      totalSpent: 4250,
      visitCount: 12,
      allergies: [],
      preferences: 'מעדיפה צבעים ללא אמוניה',
      vip: true,
      history: [
        { 
          date: '2024-01-15', 
          service: 'צביעה + תספורת',
          color: 'בלונד בהיר 8.3',
          formula: { colors: [{ code: '8-3', weight: 60 }], developer: '20vol' },
          cost: 380,
          stylist: 'מיכל לוי',
          satisfaction: 5
        },
        { 
          date: '2023-12-10', 
          service: 'צביעת שורשים',
          color: 'בלונד בינוני 7.0',
          cost: 250,
          stylist: 'מיכל לוי',
          satisfaction: 5
        }
      ]
    },
    { 
      id: 2, 
      name: 'רחל לוי', 
      phone: '052-9876543',
      email: 'rachel@example.com',
      currentColor: 'חום ערמוני 5.52',
      lastVisit: '2024-01-20',
      nextAppointment: null,
      totalSpent: 2890,
      visitCount: 8,
      allergies: ['PPD'],
      preferences: 'רגישות לכימיקלים חזקים',
      vip: false,
      history: [
        { 
          date: '2024-01-20', 
          service: 'צביעה',
          color: 'חום ערמוני 5.52',
          cost: 320,
          stylist: 'דנה כהן',
          satisfaction: 4
        }
      ]
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVIP, setFilterVIP] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVIP = !filterVIP || client.vip;
    return matchesSearch && matchesVIP;
  });
  
  const calculateNextColorDate = (lastVisit) => {
    const last = new Date(lastVisit);
    const next = new Date(last);
    next.setDate(next.getDate() + 35); // 5 שבועות
    return next.toLocaleDateString('he-IL');
  };
  
  return (
    <div className="space-y-6">
      {/* חיפוש וסינון */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש לפי שם, טלפון או אימייל..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setFilterVIP(!filterVIP)}
            className={`px-4 py-2 rounded-lg ${filterVIP ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            VIP בלבד
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            לקוח חדש
          </button>
        </div>
      </div>
      
      {/* רשימת לקוחות */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredClients.map(client => (
          <div 
            key={client.id} 
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedClient(client)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800">{client.name}</h4>
                    {client.vip && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">VIP</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{client.phone} | {client.email}</p>
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500">ביקורים</div>
                <div className="font-bold">{client.visitCount}</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">צבע נוכחי:</span>
                <span className="font-semibold">{client.currentColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ביקור אחרון:</span>
                <span>{new Date(client.lastVisit).toLocaleDateString('he-IL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">מומלץ לצביעה:</span>
                <span className="text-orange-600 font-semibold">
                  {calculateNextColorDate(client.lastVisit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">סה"כ הוצאות:</span>
                <span className="font-bold">₪{client.totalSpent.toLocaleString()}</span>
              </div>
              
              {client.allergies.length > 0 && (
                <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                  ⚠️ אלרגיות: {client.allergies.join(', ')}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectClient(client);
                }}
                className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
              >
                צביעה חדשה
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNotification({
                    type: 'info',
                    title: 'תזכורת נשלחה',
                    message: `נשלחה תזכורת ל-${client.name}`
                  });
                }}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* פרטי לקוח מורחבים */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">כרטיס לקוח - {selectedClient.name}</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">פרטים אישיים</h4>
                <div className="space-y-1 text-sm">
                  <div>טלפון: {selectedClient.phone}</div>
                  <div>אימייל: {selectedClient.email}</div>
                  <div>לקוח מאז: {new Date(selectedClient.history[selectedClient.history.length - 1].date).toLocaleDateString('he-IL')}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">העדפות וטפסים</h4>
                <div className="space-y-1 text-sm">
                  <div>{selectedClient.preferences}</div>
                  {selectedClient.allergies.length > 0 && (
                    <div className="text-red-600 font-semibold">
                      אלרגיות: {selectedClient.allergies.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">היסטוריית טיפולים</h4>
              <div className="space-y-3">
                {selectedClient.history.map((record, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">
                        {new Date(record.date).toLocaleDateString('he-IL')} - {record.service}
                      </div>
                      <div className="text-sm text-gray-600">
                        {record.stylist}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">צבע:</span> {record.color}
                        {record.formula && (
                          <div className="mt-1 text-xs text-gray-500">
                            פורמולה: {record.formula.colors.map(c => c.code).join(' + ')}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div>₪{record.cost}</div>
                        {record.satisfaction && (
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < record.satisfaction ? 'text-yellow-500' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  onSelectClient(selectedClient);
                  setSelectedClient(null);
                }}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                צביעה חדשה
              </button>
              <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                ערוך פרטים
              </button>
              <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// אפליקציה ראשית משודרגת
export default function HairProILAdvanced() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTimers, setActiveTimers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // הוספת התראה
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now()
    };
    setNotifications(prev => [...prev, newNotification]);
    
    // הסרה אוטומטית אחרי 5 שניות
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };
  
  // הסרת התראה
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // הוספת טיימר
  const addTimer = (client, service, duration) => {
    const newTimer = {
      id: Date.now(),
      client: client.name,
      service,
      duration,
      startTime: new Date()
    };
    setActiveTimers(prev => [...prev, newTimer]);
    
    addNotification({
      type: 'info',
      title: 'טיימר הופעל',
      message: `${service} עבור ${client.name} - ${duration} דקות`
    });
  };
  
  const handleTimerComplete = (process) => {
    addNotification({
      type: 'success',
      title: 'תהליך הושלם',
      message: `${process.client} - ${process.service}`
    });
    setActiveTimers(prev => prev.filter(t => t.id !== process.id));
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
        
      case 'clients':
        return (
          <AdvancedClientManager 
            onSelectClient={setSelectedClient}
            onNotification={addNotification}
          />
        );
        
      case 'formula':
        return selectedClient ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdvancedFormulaManager 
              client={selectedClient}
              onSave={(formula) => {
                console.log('פורמולה נשמרה:', formula);
                if (formula.processTime > 0) {
                  addTimer(selectedClient, 'צביעה', formula.processTime);
                }
              }}
              onNotification={addNotification}
            />
            <div className="space-y-6">
              <AppointmentScheduler onNotification={addNotification} />
              {activeTimers.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">תהליכים פעילים</h3>
                  <div className="space-y-3">
                    {activeTimers.map(timer => (
                      <ProcessTimer 
                        key={timer.id} 
                        process={timer} 
                        onComplete={handleTimerComplete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">בחר לקוח</h3>
            <p className="text-gray-600 mb-4">עבור לכרטיסיית לקוחות ובחר לקוח לניהול פורמולה</p>
            <button
              onClick={() => setActiveTab('clients')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              לכרטיסיית לקוחות
            </button>
          </div>
        );
        
      case 'inventory':
        return <SmartInventoryManager onNotification={addNotification} />;
        
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">דוחות וניתוחים</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-6 border rounded-lg hover:bg-gray-50 text-right">
                <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-bold">דוח מכירות</h3>
                <p className="text-sm text-gray-600">ניתוח הכנסות לפי תקופה</p>
              </button>
              <button className="p-6 border rounded-lg hover:bg-gray-50 text-right">
                <Package className="w-8 h-8 text-green-500 mb-2" />
                <h3 className="font-bold">דוח מלאי</h3>
                <p className="text-sm text-gray-600">צריכה וחיסכון בחומרים</p>
              </button>
              <button className="p-6 border rounded-lg hover:bg-gray-50 text-right">
                <Users className="w-8 h-8 text-purple-500 mb-2" />
                <h3 className="font-bold">דוח לקוחות</h3>
                <p className="text-sm text-gray-600">התנהגות ומגמות</p>
              </button>
              <button className="p-6 border rounded-lg hover:bg-gray-50 text-right">
                <Activity className="w-8 h-8 text-orange-500 mb-2" />
                <h3 className="font-bold">דוח ביצועים</h3>
                <p className="text-sm text-gray-600">יעילות עובדים</p>
              </button>
              <button className="p-6 border rounded-lg hover:bg-gray-50 text-right">
                <TrendingUp className="w-8 h-8 text-red-500 mb-2" />
                <h3 className="font-bold">דוח מגמות</h3>
                <p className="text-sm text-gray-600">צבעים פופולריים</p>
              </button>
              <button className="p-6 border rounded-lg hover:bg-gray-50 text-right">
                <DollarSign className="w-8 h-8 text-yellow-500 mb-2" />
                <h3 className="font-bold">דוח רווחיות</h3>
                <p className="text-sm text-gray-600">רווח לפי שירות</p>
              </button>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">הגדרות מערכת</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">חיבורים וסנכרון</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-semibold">משקל Bluetooth</div>
                          <div className="text-sm text-gray-600">חבר משקל חכם למדידה מדויקת</div>
                        </div>
                      </div>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        חבר
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-semibold">אפליקציית מובייל</div>
                          <div className="text-sm text-gray-600">סנכרון עם אפליקציה לעובדים</div>
                        </div>
                      </div>
                      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        הורד
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-semibold">יומן Google</div>
                          <div className="text-sm text-gray-600">סנכרון תורים עם Google Calendar</div>
                        </div>
                      </div>
                      <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                        חבר
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">ניהול צוות</h3>
                  <div className="space-y-2">
                    {['מיכל לוי - מנהלת', 'דנה כהן - סטייליסטית בכירה', 'שרה ברק - סטייליסטית'].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-600" />
                          <span>{member}</span>
                        </div>
                        <button className="text-blue-500 hover:text-blue-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                      הוסף עובד חדש
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">גיבוי ואבטחה</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">גיבוי אוטומטי</div>
                        <div className="text-sm text-gray-600">גיבוי יומי בשעה 02:00</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                      גבה עכשיו
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* התראות */}
      <NotificationCenter 
        notifications={notifications} 
        onClose={removeNotification}
      />
      
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">HairPro IL Advanced 💇‍♀️</h1>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
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
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'clients' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Users className="w-4 h-4" />
              לקוחות
            </button>
            <button
              onClick={() => setActiveTab('formula')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'formula' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Scale className="w-4 h-4" />
              פורמולות
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Package className="w-4 h-4" />
              מלאי
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-2">HairPro IL Advanced</h4>
              <p className="text-sm text-gray-300">
                מערכת ניהול מתקדמת לסלון שיער - גרסה מקצועית
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">תכונות מתקדמות</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• שקילה דיגיטלית מדויקת</li>
                <li>• חישוב עלויות בזמן אמת</li>
                <li>• ניהול מלאי חכם</li>
                <li>• דוחות וניתוחים מתקדמים</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">תמיכה</h4>
              <p className="text-sm text-gray-300">
                טלפון: 1-800-HAIRPRO<br />
                support@hairpro.il<br />
                ימים א-ה 9:00-18:00
              </p>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400">
            © 2024 HairPro IL Advanced - פותח במיוחד עבור הסלונים המובילים בישראל
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