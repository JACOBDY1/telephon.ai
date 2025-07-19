import React, { useState } from 'react';
import { 
  CreditCard, 
  Package, 
  Check, 
  X, 
  Crown, 
  Shield, 
  Zap, 
  Calendar,
  Download,
  Users,
  Phone,
  BarChart3,
  Settings,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionManager = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('professional'); // Mock current plan
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = {
    basic: {
      name: 'בסיסי',
      price: { monthly: 99, yearly: 990 },
      color: 'gray',
      icon: Package,
      description: 'מושלם למשתמש יחיד או עסק קטן',
      features: [
        'עד 5 משתמשים',
        '1,000 שיחות חודש',
        'CRM בסיסי',
        'דוחות בסיסיים',
        'תמיכה באימייל',
        'מודולים: 5',
        'שטח אחסון: 10GB'
      ],
      limitations: [
        'ללא AI מתקדם',
        'ללא אוטומציות',
        'ללא אינטגרציות מתקדמות'
      ]
    },
    professional: {
      name: 'מקצועי',
      price: { monthly: 299, yearly: 2990 },
      color: 'blue',
      icon: Zap,
      description: 'האידיאלי לעסקים גדלים וצוותים',
      popular: true,
      features: [
        'עד 25 משתמשים',
        '10,000 שיחות חודש',
        'CRM מתקדם',
        'דוחות מפורטים ואנליטיקס',
        'תמיכה טלפונית',
        'מודולים: 15',
        'שטח אחסון: 100GB',
        'אוטומציות בסיסיות',
        'אינטגרציות WhatsApp'
      ],
      limitations: [
        'AI מוגבל',
        'ללא קול-טקסט מתקדם'
      ]
    },
    premium: {
      name: 'פרימיום',
      price: { monthly: 599, yearly: 5990 },
      color: 'purple',
      icon: Crown,
      description: 'הכל מה שצריך לארגון מתקדם',
      features: [
        'עד 100 משתמשים',
        'שיחות ללא הגבלה',
        'CRM מלא עם AI',
        'אנליטיקס מתקדם בזמן אמת',
        'תמיכה מועדפת 24/7',
        'מודולים: 30',
        'שטח אחסון: 500GB',
        'כל האוטומציות',
        'כל האינטגרציות',
        'AI מלא - תמלול וניתוח',
        'דוחות מותאמים אישית'
      ],
      limitations: []
    },
    enterprise: {
      name: 'ארגוני',
      price: { monthly: 999, yearly: 9990 },
      color: 'green',
      icon: Shield,
      description: 'פתרון מלא לארגונים גדולים',
      enterprise: true,
      features: [
        'משתמשים ללא הגבלה',
        'כל התכונות',
        'תמיכה ייעודית',
        'מנהל חשבון אישי',
        'הטמעה וחדרים',
        'אבטחה מתקדמת',
        'אחסון ללא הגבלה',
        'API מלא',
        'התאמות אישיות',
        'SLA מובטח',
        'גיבויים יומיים',
        'ניהול מרובה-ארגוני'
      ],
      limitations: []
    }
  };

  const currentPlanData = plans[currentPlan];
  const yearlyDiscount = 17; // 17% discount for yearly

  const calculateSavings = (plan) => {
    const monthly = plan.price.monthly * 12;
    const yearly = plan.price.yearly;
    return monthly - yearly;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const PlanCard = ({ planKey, plan, isCurrent }) => (
    <div className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
      isCurrent 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        : plan.popular 
        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="w-4 h-4 ml-1" />
            הכי פופולרי
          </span>
        </div>
      )}

      {plan.enterprise && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
            <Crown className="w-4 h-4 ml-1" />
            ארגוני
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          plan.color === 'gray' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
          plan.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
          plan.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
          'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
        }`}>
          <plan.icon className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly / 12)}
            </span>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">/חודש</div>
              {billingCycle === 'yearly' && (
                <div className="text-xs text-green-600 dark:text-green-400">חיסכון של {yearlyDiscount}%</div>
              )}
            </div>
          </div>
          
          {billingCycle === 'yearly' && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {formatPrice(plan.price.yearly)} לשנה
              <span className="block text-green-600 dark:text-green-400">
                חסכון של {formatPrice(calculateSavings(plan))}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm">
            <Check className="w-4 h-4 text-green-500 ml-3 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </div>
        ))}
        
        {plan.limitations.map((limitation, index) => (
          <div key={index} className="flex items-center text-sm">
            <X className="w-4 h-4 text-red-500 ml-3 flex-shrink-0" />
            <span className="text-gray-500 dark:text-gray-400 line-through">{limitation}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (!isCurrent) {
            setSelectedPlan(planKey);
            setShowUpgradeModal(true);
          }
        }}
        disabled={isCurrent}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isCurrent 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            : plan.popular
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            : `bg-${plan.color}-600 text-white hover:bg-${plan.color}-700`
        }`}
      >
        {isCurrent ? 'החבילה הנוכחית' : `עבור ל${plan.name}`}
      </button>
    </div>
  );

  const UsageStats = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">שימוש חודשי</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">2,847</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">שיחות</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            28% מ-10,000
          </div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">משתמשים</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            48% מ-25
          </div>
        </div>
        
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">67GB</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">אחסון</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            67% מ-100GB
          </div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Download className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">מודולים</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            53% מ-15
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">ניהול מנוי</h1>
        <p className="text-green-100">נהל את החבילה והתשלומים שלך</p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">החבילה הנוכחית</h2>
          <div className="flex items-center gap-2">
            <currentPlanData.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-600 dark:text-blue-400">{currentPlanData.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">מחיר חודשי</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(currentPlanData.price.monthly)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">מחזור החיוב הבא</div>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">סטטוס</div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">פעיל</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <UsageStats />

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            חודשי
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly' 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <span>שנתי</span>
            <span className="mr-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              חסכון {yearlyDiscount}%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(plans).map(([planKey, plan]) => (
          <PlanCard 
            key={planKey} 
            planKey={planKey} 
            plan={plan} 
            isCurrent={planKey === currentPlan} 
          />
        ))}
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">אמצעי תשלום</h3>
          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
            עדכן
          </button>
        </div>
        
        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
            VISA
          </div>
          <div className="mr-4">
            <div className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4532</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">תוקף: 12/26</div>
          </div>
          <div className="mr-auto">
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              שדרג ל{plans[selectedPlan].name}
            </h3>
            
            <div className="mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">מחיר חודשי חדש:</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(plans[selectedPlan].price.monthly)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                יחויב החל מהחודש הבא
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentPlan(selectedPlan);
                  setShowUpgradeModal(false);
                  setSelectedPlan(null);
                }}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                אשר שדרוג
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedPlan(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                בטל
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;