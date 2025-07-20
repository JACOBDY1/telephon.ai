import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, DollarSign, TrendingUp, Star, Target,
  Plus, Edit, Trash2, Search, Filter, BarChart3, Zap,
  ShoppingCart, Timer, User, Calendar, Award, AlertTriangle,
  CheckCircle, Eye, Heart, ThumbsUp, MessageSquare, Phone,
  Sparkles, Gift, Coffee, Scissors, Crown, Diamond
} from 'lucide-react';

const ProductServiceManager = ({ darkMode = false, t = {}, user }) => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [serviceAnalytics, setServiceAnalytics] = useState({});
  const [intelligentSuggestions, setIntelligentSuggestions] = useState([]);
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    loadServiceProductData();
  }, []);

  const loadServiceProductData = () => {
    // Time-based Services Catalog
    setServices([
      {
        id: 's1',
        name: 'תספורת נשים קלאסית',
        category: 'hair_cut',
        duration: 45,
        basePrice: 180,
        difficulty: 'בסיסי',
        popularity: 95,
        profitMargin: 85,
        recommendedProducts: ['p1', 'p2', 'p3'],
        skillsRequired: ['תספורת בסיסית'],
        averageRating: 4.8,
        bookingsThisMonth: 68,
        revenueThisMonth: 12240,
        seasonality: 'כל השנה',
        clientRetention: 92,
        upsellOpportunity: 'צביעה, טיפולי שיער'
      },
      {
        id: 's2', 
        name: 'צביעה מלאה מקצועית',
        category: 'coloring',
        duration: 120,
        basePrice: 420,
        difficulty: 'מתקדם',
        popularity: 78,
        profitMargin: 65,
        recommendedProducts: ['p4', 'p5', 'p6', 'p7'],
        skillsRequired: ['צביעה מתקדמת', 'עבודה עם כימיקלים'],
        averageRating: 4.9,
        bookingsThisMonth: 32,
        revenueThisMonth: 13440,
        seasonality: 'פחות בקיץ',
        clientRetention: 88,
        upsellOpportunity: 'תספורת, טיפולי שיער'
      },
      {
        id: 's3',
        name: 'טיפול פנים מרגיע',
        category: 'facial',
        duration: 60,
        basePrice: 280,
        difficulty: 'בינוני',
        popularity: 85,
        profitMargin: 75,
        recommendedProducts: ['p8', 'p9', 'p10'],
        skillsRequired: ['טיפולי עור', 'עיסוי פנים'],
        averageRating: 4.7,
        bookingsThisMonth: 45,
        revenueThisMonth: 12600,
        seasonality: 'גבוה בחורף',
        clientRetention: 85,
        upsellOpportunity: 'מסאז גוף, טיפולים נוספים'
      },
      {
        id: 's4',
        name: 'מניקור + פדיקור VIP',
        category: 'nails',
        duration: 90,
        basePrice: 220,
        difficulty: 'בינוני',
        popularity: 80,
        profitMargin: 80,
        recommendedProducts: ['p11', 'p12', 'p13'],
        skillsRequired: ['טיפוח ציפורניים', 'אומנות ציפורניים'],
        averageRating: 4.6,
        bookingsThisMonth: 38,
        revenueThisMonth: 8360,
        seasonality: 'גבוה לפני חגים',
        clientRetention: 75,
        upsellOpportunity: 'ציפוי ג׳ל, עיצוב מיוחד'
      }
    ]);

    // Product Inventory
    setProducts([
      {
        id: 'p1',
        name: 'שמפו מקצועי קראטין',
        category: 'hair_care',
        price: 85,
        cost: 32,
        margin: 62,
        stock: 15,
        minStock: 5,
        averageSalesPerMonth: 25,
        compatibleServices: ['s1', 's2'],
        sellProbability: 85,
        description: 'שמפו מקצועי לשיער פגום ויבש',
        supplier: 'חברת יופי בע״מ',
        lastRestocked: '2024-01-15',
        expiryDate: '2025-12-31'
      },
      {
        id: 'p2',
        name: 'מסכה מזינה לשיער',
        category: 'hair_care', 
        price: 120,
        cost: 45,
        margin: 63,
        stock: 8,
        minStock: 3,
        averageSalesPerMonth: 18,
        compatibleServices: ['s1', 's2'],
        sellProbability: 70,
        description: 'מסכה עמוקה לשיער צבוע ופגום',
        supplier: 'חברת יופי בע״מ',
        lastRestocked: '2024-01-10',
        expiryDate: '2025-06-30'
      },
      {
        id: 'p8',
        name: 'קרם לחות פנים premium',
        category: 'skincare',
        price: 150,
        cost: 55,
        margin: 63,
        stock: 12,
        minStock: 4,
        averageSalesPerMonth: 22,
        compatibleServices: ['s3'],
        sellProbability: 90,
        description: 'קרם לחות למי פנים יבש ורגיש',
        supplier: 'דרמה-קוסמטיקס',
        lastRestocked: '2024-01-18',
        expiryDate: '2026-01-15'
      },
      {
        id: 'p9',
        name: 'סרום נגד הזדקנות',
        category: 'skincare',
        price: 220,
        cost: 85,
        margin: 61,
        stock: 6,
        minStock: 2,
        averageSalesPerMonth: 12,
        compatibleServices: ['s3'],
        sellProbability: 65,
        description: 'סרום מתקדם עם ויטמין C וחומצה היאלורונית',
        supplier: 'דרמה-קוסמטיקס',
        lastRestocked: '2024-01-12',
        expiryDate: '2025-08-20'
      }
    ]);

    // Service Analytics
    setServiceAnalytics({
      totalRevenue: 46640,
      totalBookings: 183,
      averageServicePrice: 255,
      mostPopularService: 's1',
      highestRevenueService: 's2',
      averageRating: 4.75,
      clientRetentionRate: 85,
      upsellSuccessRate: 42
    });

    // AI-powered Suggestions
    setIntelligentSuggestions([
      {
        type: 'inventory_alert',
        priority: 'high',
        message: 'מלאי מסכה מזינה לשיער (8 יח׳) מתחת לרף המינימום',
        action: 'הזמן 20 יחידות נוספות',
        impact: 'מניעת אובדן מכירות פוטנציאליות'
      },
      {
        type: 'service_optimization',
        priority: 'medium', 
        message: 'צביעה מלאה מניבה הכי הרבה רווח (₪13,440 החודש) - הוסף יותר זמנים',
        action: 'הוסף 2 מגמות צביעה נוספות השבוע',
        impact: '+₪840 הכנסה צפויה'
      },
      {
        type: 'product_promotion',
        priority: 'low',
        message: 'סרום נגד הזדקנות נמכר פחות (12/חודש) למרות מרווח גבוה',
        action: 'הצע הנחה 15% או חבילה משולבת',
        impact: '+30% מכירות צפויות'
      },
      {
        type: 'cross_sell',
        priority: 'medium',
        message: 'לקוחות תספורת (95% פופולריות) יכולים להזמין גם טיפול פנים',
        action: 'הצע חבילה משולבת: תספורת + פנים',
        impact: '+25% הכנסה ממוצעת לכל לקוח'
      }
    ]);

    // Inventory Status
    setInventory({
      totalValue: 4580,
      totalItems: 78,
      lowStockItems: 3,
      outOfStockItems: 0,
      fastMovingItems: ['p1', 'p8'],
      slowMovingItems: ['p9'],
      monthlyTurnover: 42
    });
  };

  const ServiceCard = ({ service }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {service.name}
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{service.duration} דק׳</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">₪{service.basePrice}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{service.averageRating}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          service.difficulty === 'בסיסי' ? 'bg-green-100 text-green-800' :
          service.difficulty === 'בינוני' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {service.difficulty}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{service.bookingsThisMonth}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">הזמנות החודש</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">₪{service.revenueThisMonth.toLocaleString()}</div>
          <div className="text-xs text-green-700 dark:text-green-300">הכנסה החודש</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">פופולריות</span>
          <span className="font-medium">{service.popularity}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${service.popularity}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">שמירת לקוחות</span>
          <span className="font-medium text-green-600">{service.clientRetention}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 bg-green-500 rounded-full"
            style={{ width: `${service.clientRetention}%` }}
          ></div>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>אופציות שדרוג:</strong> {service.upsellOpportunity}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>עונתיות:</strong> {service.seasonality}
        </p>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {product.description}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          product.stock <= product.minStock ? 'bg-red-100 text-red-800' :
          product.stock <= product.minStock * 2 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {product.stock} יח׳
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-lg font-bold text-green-600">₪{product.price}</div>
          <div className="text-xs text-green-700 dark:text-green-300">מחיר מכירה</div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{product.margin}%</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">רווח</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{product.sellProbability}%</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">הסתברות מכירה</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">מכירות חודשיות</span>
          <span className="font-medium">{product.averageSalesPerMonth} יח׳</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">ספק</span>
          <span className="font-medium text-gray-900 dark:text-white">{product.supplier}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">תאריך תפוגה</span>
          <span className="font-medium">{new Date(product.expiryDate).toLocaleDateString('he-IL')}</span>
        </div>
      </div>

      {product.stock <= product.minStock && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              מלאי נמוך! יש להזמין {product.minStock * 3} יחידות
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const AnalyticsDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border text-center`}>
        <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-3" />
        <div className="text-3xl font-bold text-gray-900 dark:text-white">₪{serviceAnalytics.totalRevenue?.toLocaleString()}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">סה״כ הכנסות החודש</div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border text-center`}>
        <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-3" />
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{serviceAnalytics.totalBookings}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">סה״כ הזמנות</div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border text-center`}>
        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{serviceAnalytics.averageRating}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">דירוג ממוצע</div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border text-center`}>
        <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-3" />
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{serviceAnalytics.upsellSuccessRate}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">הצלחת שדרוגים</div>
      </div>
    </div>
  );

  const IntelligentSuggestions = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-blue-500" />
        המלצות חכמות למיטוב
      </h3>
      
      <div className="space-y-4">
        {intelligentSuggestions.map((suggestion, index) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 ${
            suggestion.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
            suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
            'border-green-500 bg-green-50 dark:bg-green-900/20'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  {suggestion.message}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>פעולה מומלצת:</strong> {suggestion.action}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>השפעה צפויה:</strong> {suggestion.impact}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {suggestion.priority === 'high' ? 'דחוף' :
                 suggestion.priority === 'medium' ? 'בינוני' : 'נמוך'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 lg:p-6`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🛍️ ניהול מוצרים ושירותים חכם
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ניהול מתקדם של שירותים מבוססי זמן, מוצרים, מלאי והמלצות חכמות
        </p>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Intelligent Suggestions */}
      <div className="mb-6">
        <IntelligentSuggestions />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'services'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Timer className="w-5 h-5 inline ml-2" />
          שירותים מבוססי זמן ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Package className="w-5 h-5 inline ml-2" />
          מוצרים ומלאי ({products.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductServiceManager;