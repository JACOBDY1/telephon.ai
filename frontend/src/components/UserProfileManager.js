import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Settings, CreditCard, Shield, Bell, 
  Globe, Palette, Users, Crown, Package, Check, X, 
  AlertCircle, Star, Zap, Coffee, Briefcase
} from 'lucide-react';

const UserProfileManager = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    preferences: {}
  });

  useEffect(() => {
    loadUserData();
    loadSubscriptionPlans();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
        setProfileForm({
          full_name: userData.full_name || '',
          phone: userData.phone || '',
          email: userData.email || '',
          preferences: userData.preferences || {}
        });
      }

      // Load subscription data
      const subResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/subscription/current`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData.subscription);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptionPlans = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/subscription/plans`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptionPlans(data.plans);
      }
    } catch (error) {
      console.error('Error loading subscription plans:', error);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/profile/advanced`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserProfile(updatedUser);
        alert('הפרופיל עודכן בהצלחה!');
      } else {
        alert('שגיאה בעדכון הפרופיל');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('שגיאה בעדכון הפרופיל');
    } finally {
      setSaving(false);
    }
  };

  const upgradePlan = async (planId) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          plan_id: planId,
          payment_method: 'credit_card' 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        alert('המנוי שודרג בהצלחה!');
      } else {
        alert('שגיאה בשדרוג המנוי');
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('שגיאה בשדרוג המנוי');
    } finally {
      setSaving(false);
    }
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free_trial': return <Coffee className="w-5 h-5" />;
      case 'basic': return <Package className="w-5 h-5" />;
      case 'professional': return <Crown className="w-5 h-5" />;
      case 'enterprise': return <Briefcase className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trial': return 'text-blue-600 bg-blue-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען נתוני משתמש...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                שלום, {userProfile?.full_name || 'משתמש'}!
              </h1>
              <p className="text-gray-600">
                ניהול פרופיל אישי ומנוי - {userProfile?.user_type === 'professional' ? 'בעל מקצוע' : 'משתמש רגיל'}
              </p>
            </div>
            {subscription && (
              <div className="mr-auto">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.plan_name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" dir="ltr">
              {[
                { id: 'profile', name: 'פרופיל אישי', icon: User },
                { id: 'subscription', name: 'ניהול מנוי', icon: CreditCard },
                { id: 'preferences', name: 'העדפות', icon: Settings },
                { id: 'security', name: 'אבטחה', icon: Shield }
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 ${
                    activeTab === id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">פרטים אישיים</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    אימייל
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סוג משתמש
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {userProfile?.user_type === 'professional' ? 'בעל מקצוע' : 
                     userProfile?.user_type === 'therapist' ? 'מטפל' :
                     userProfile?.user_type === 'consultant' ? 'יועץ' :
                     userProfile?.user_type === 'barber' ? 'ספר' : 'לקוח'}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={updateProfile}
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'שומר...' : 'שמור שינויים'}
                </button>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">ניהול מנוי</h2>
              
              {/* Current Subscription */}
              {subscription && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getPlanIcon(subscription.plan_id)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {subscription.plan_name}
                        </h3>
                        <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusColor(subscription.status)}`}>
                          {subscription.status === 'active' ? 'פעיל' :
                           subscription.status === 'trial' ? 'ניסיון' : 'לא פעיל'}
                        </p>
                      </div>
                    </div>
                    {subscription.end_date && (
                      <div className="text-left">
                        <p className="text-sm text-gray-600">תוקף עד:</p>
                        <p className="font-semibold">
                          {new Date(subscription.end_date).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    )}
                  </div>

                  {subscription.features && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">תכונות כלולות:</p>
                      <div className="flex flex-wrap gap-2">
                        {subscription.features.map((feature, index) => (
                          <span key={index} className="bg-white bg-opacity-60 px-3 py-1 rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Available Plans */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">תכניות זמינות</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`border rounded-lg p-6 ${
                        subscription?.plan_id === plan.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getPlanIcon(plan.id)}
                          <h4 className="text-lg font-semibold">{plan.name}</h4>
                        </div>
                        {plan.id === 'professional' && (
                          <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                            מומלץ לספרים
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      
                      <div className="text-2xl font-bold mb-4">
                        {plan.price === 0 ? (
                          <span className="text-green-600">חינם</span>
                        ) : (
                          <>
                            <span>₪{plan.price}</span>
                            <span className="text-sm font-normal text-gray-500">/חודש</span>
                          </>
                        )}
                      </div>

                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {subscription?.plan_id === plan.id ? (
                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-center font-medium">
                          תכנית נוכחית
                        </div>
                      ) : (
                        <button
                          onClick={() => upgradePlan(plan.id)}
                          disabled={saving}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {saving ? 'משדרג...' : 'בחר תכנית'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">העדפות משתמש</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline ml-2" />
                      שפה
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                      <option value="he">עברית</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Palette className="w-4 h-4 inline ml-2" />
                      ערכת נושא
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                      <option value="light">בהיר</option>
                      <option value="dark">כהה</option>
                      <option value="auto">אוטומטי</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <Bell className="w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">התראות אימייל</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm font-medium text-gray-700">התראות דחופות</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm font-medium text-gray-700">עדכונים שבועיים</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  שמור העדפות
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">אבטחה והגנה</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">שינוי סיסמה</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        סיסמה נוכחית
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        סיסמה חדשה
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        אישור סיסמה חדשה
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
                      עדכן סיסמה
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">הגדרות אבטחה</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm font-medium text-gray-700">התחברות דו-שלבית</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm font-medium text-gray-700">התראות התחברות חשודה</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileManager;