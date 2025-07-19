import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  Download, 
  Settings, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  CreditCard, 
  Package,
  Check,
  X,
  ExternalLink,
  Play
} from 'lucide-react';

const ModuleManager = () => {
  const [availableModules, setAvailableModules] = useState([]);
  const [installedModules, setInstalledModules] = useState([]);
  const [userPlan, setUserPlan] = useState('basic');
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    // Mock available modules data
    setAvailableModules([
      {
        id: 'advanced-ai',
        name: 'AI מתקדם',
        description: 'ניתוח סנטימנט בזמן אמת, זיהוי דוברים, והמלצות חכמות',
        version: '2.1.0',
        price: 299,
        currency: 'ILS',
        category: 'AI',
        rating: 4.8,
        downloads: 1542,
        features: ['זיהוי רגשות', 'תמלול מתקדם', 'המלצות AI', 'דוחות חכמים'],
        requiredPlan: 'premium',
        installed: false,
        developer: 'TelephonyAI Labs',
        screenshots: ['/api/placeholder/300/200'],
        compatibility: ['web', 'mobile', 'desktop']
      },
      {
        id: 'whatsapp-integration',
        name: 'אינטגרציית WhatsApp Business',
        description: 'שילוב מלא עם WhatsApp Business API לשיחות ושליחת הודעות',
        version: '1.5.2',
        price: 199,
        currency: 'ILS',
        category: 'Integration',
        rating: 4.6,
        downloads: 2341,
        features: ['שיחות WhatsApp', 'הודעות אוטומטיות', 'קבוצות', 'מדיה'],
        requiredPlan: 'professional',
        installed: true,
        developer: 'Meta Integration Team',
        screenshots: ['/api/placeholder/300/200'],
        compatibility: ['web', 'mobile']
      },
      {
        id: 'advanced-crm',
        name: 'CRM מתקדם',
        description: 'ניהול לקוחות מתקדם עם אוטומציות וניתוחים מפורטים',
        version: '3.0.1',
        price: 399,
        currency: 'ILS',
        category: 'CRM',
        rating: 4.9,
        downloads: 987,
        features: ['אוטומציות מכירות', 'ניתוחים מתקדמים', 'חזיות AI', 'דוחות מותאמים'],
        requiredPlan: 'enterprise',
        installed: false,
        developer: 'CRM Solutions Inc',
        screenshots: ['/api/placeholder/300/200'],
        compatibility: ['web', 'mobile', 'desktop']
      },
      {
        id: 'call-recording-plus',
        name: 'הקלטות מתקדמות',
        description: 'הקלטות איכותיות עם תמלול אוטומטי ואינדקס חכם',
        version: '1.8.0',
        price: 149,
        currency: 'ILS',
        category: 'Recording',
        rating: 4.7,
        downloads: 3215,
        features: ['הקלטה HD', 'תמלול מיידי', 'חיפוש בתוכן', 'גיבוי ענן'],
        requiredPlan: 'basic',
        installed: false,
        developer: 'RecordTech Ltd',
        screenshots: ['/api/placeholder/300/200'],
        compatibility: ['web', 'mobile', 'desktop']
      },
      {
        id: 'mobile-dialer',
        name: 'חייגן נייד מתקדם',
        description: 'אפליקציית חייגן מקצועית למובייל עם כל הפיצ\'רים',
        version: '2.3.0',
        price: 99,
        currency: 'ILS',
        category: 'Mobile',
        rating: 4.5,
        downloads: 5431,
        features: ['חייגן מתקדם', 'וידאו קולס', 'אנשי קשר חכמים', 'סינכרון'],
        requiredPlan: 'basic',
        installed: true,
        developer: 'Mobile Solutions',
        screenshots: ['/api/placeholder/300/200'],
        compatibility: ['mobile']
      },
      {
        id: 'analytics-dashboard',
        name: 'דשבורד אנליטיקס',
        description: 'דשבורד מתקדם לניתוח נתונים ודוחות מפורטים',
        version: '1.2.5',
        price: 249,
        currency: 'ILS',
        category: 'Analytics',
        rating: 4.4,
        downloads: 1876,
        features: ['דוחות מתקדמים', 'גרפים אינטראקטיביים', 'התראות', 'ייצוא נתונים'],
        requiredPlan: 'professional',
        installed: false,
        developer: 'Analytics Pro',
        screenshots: ['/api/placeholder/300/200'],
        compatibility: ['web', 'desktop']
      }
    ]);

    setInstalledModules([
      { id: 'whatsapp-integration', installedAt: new Date('2024-01-15'), status: 'active' },
      { id: 'mobile-dialer', installedAt: new Date('2024-01-10'), status: 'active' }
    ]);
  }, []);

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canInstallModule = (module) => {
    const planHierarchy = ['basic', 'professional', 'premium', 'enterprise'];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(module.requiredPlan);
    return userPlanIndex >= requiredPlanIndex;
  };

  const installModule = async (moduleId) => {
    try {
      // Simulate API call
      console.log('Installing module:', moduleId);
      
      // Update installed modules
      setInstalledModules(prev => [...prev, {
        id: moduleId,
        installedAt: new Date(),
        status: 'active'
      }]);

      // Update available modules to show as installed
      setAvailableModules(prev => prev.map(mod => 
        mod.id === moduleId ? { ...mod, installed: true } : mod
      ));
    } catch (error) {
      console.error('Error installing module:', error);
    }
  };

  const uninstallModule = async (moduleId) => {
    try {
      // Simulate API call
      console.log('Uninstalling module:', moduleId);
      
      // Remove from installed modules
      setInstalledModules(prev => prev.filter(mod => mod.id !== moduleId));

      // Update available modules to show as not installed
      setAvailableModules(prev => prev.map(mod => 
        mod.id === moduleId ? { ...mod, installed: false } : mod
      ));
    } catch (error) {
      console.error('Error uninstalling module:', error);
    }
  };

  const ModuleCard = ({ module, showActions = true }) => (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {module.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {module.description}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(module.requiredPlan)}`}>
                {module.requiredPlan}
              </span>
              <span className="text-gray-500 text-xs">v{module.version}</span>
            </div>
          </div>
          <div className="text-left ml-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₪{module.price}
            </div>
            <div className="text-xs text-gray-500">לחודש</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 text-yellow-400" size={16} />
            <span>{module.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download size={16} />
            <span>{module.downloads.toLocaleString()}</span>
          </div>
          <div className="text-xs">by {module.developer}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">תכונות עיקריות:</div>
          <div className="grid grid-cols-2 gap-1">
            {module.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Check size={14} className="text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">תואם עם:</div>
          <div className="flex gap-2">
            {module.compatibility.map((platform, index) => (
              <span key={index} className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                {platform === 'web' ? 'ווב' : platform === 'mobile' ? 'נייד' : 'דסקטופ'}
              </span>
            ))}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-3">
            {!module.installed ? (
              canInstallModule(module) ? (
                <button
                  onClick={() => installModule(module.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  התקן מודול
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed font-medium"
                >
                  דורש שדרוג חבילה
                </button>
              )
            ) : (
              <button
                onClick={() => uninstallModule(module.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                הסר מודול
              </button>
            )}
            <button className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              <ExternalLink size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const PlanSelector = () => (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">חבילה נוכחית</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { plan: 'basic', name: 'בסיסי', price: 99, modules: 5 },
          { plan: 'professional', name: 'מקצועי', price: 299, modules: 15 },
          { plan: 'premium', name: 'פרימיום', price: 599, modules: 30 },
          { plan: 'enterprise', name: 'ארגוני', price: 999, modules: 'ללא הגבלה' }
        ].map(planOption => (
          <div
            key={planOption.plan}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              userPlan === planOption.plan
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
            onClick={() => setUserPlan(planOption.plan)}
          >
            <div className="text-center">
              <div className="font-semibold text-gray-800 dark:text-gray-200">{planOption.name}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 my-2">₪{planOption.price}</div>
              <div className="text-sm text-gray-500">עד {planOption.modules} מודולים</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">מנהל המודולים</h1>
        <p className="text-purple-100">הרחב את המערכת שלך עם מודולים מתקדמים</p>
      </div>

      <PlanSelector />

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
        <div className="flex border-b border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 p-4 text-center font-medium transition-colors ${
              activeTab === 'available'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Package className="inline-block ml-2" size={20} />
            מודולים זמינים ({availableModules.length})
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`flex-1 p-4 text-center font-medium transition-colors ${
              activeTab === 'installed'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Check className="inline-block ml-2" size={20} />
            מותקנים ({installedModules.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableModules.map(module => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          )}

          {activeTab === 'installed' && (
            <div className="space-y-4">
              {installedModules.length === 0 ? (
                <div className="text-center py-12">
                  <Puzzle size={64} className="mx-auto text-gray-400 mb-4" />
                  <div className="text-gray-500 dark:text-gray-400">אין מודולים מותקנים</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {availableModules
                    .filter(module => module.installed)
                    .map(module => {
                      const installInfo = installedModules.find(inst => inst.id === module.id);
                      return (
                        <div key={module.id} className="relative">
                          <ModuleCard module={module} />
                          <div className="mt-2 text-sm text-gray-500">
                            הותקן ב: {installInfo?.installedAt.toLocaleDateString('he-IL')}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleManager;