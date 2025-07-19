import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Camera,
  Settings,
  Bell,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications ?? true,
    language: user?.preferences?.language || 'he',
    theme: user?.preferences?.theme || 'light',
    timezone: user?.preferences?.timezone || 'Asia/Jerusalem',
  });

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const updateData = {
      ...profileForm,
      preferences
    };

    const result = await updateProfile(updateData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'פרופיל עודכן בהצלחה!' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setProfileForm({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
    setPreferences({
      notifications: user?.preferences?.notifications ?? true,
      language: user?.preferences?.language || 'he',
      theme: user?.preferences?.theme || 'light',
      timezone: user?.preferences?.timezone || 'Asia/Jerusalem',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-red-100 text-red-800', text: 'מנהל מערכת' },
      manager: { color: 'bg-blue-100 text-blue-800', text: 'מנהל' },
      user: { color: 'bg-green-100 text-green-800', text: 'משתמש' },
    };
    return badges[role] || badges.user;
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.full_name || user?.username}</h1>
              <p className="text-blue-100 text-lg">@{user?.username}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(user?.role).color}`}>
                  <Shield size={14} className="inline ml-1" />
                  {getRoleBadge(user?.role).text}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 size={16} className="ml-2" />
                ערוך פרופיל
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  ) : (
                    <Save size={16} className="ml-2" />
                  )}
                  שמור
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <X size={16} className="ml-2" />
                  בטל
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">מידע אישי</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    שם מלא
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 ml-3" />
                      <span className="text-gray-900 dark:text-white">{user?.full_name || 'לא הוזן'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    אימייל
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400 ml-3" />
                    <span className="text-gray-900 dark:text-white">{user?.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  מספר טלפון
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="+972-50-123-4567"
                    />
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400 ml-3" />
                    <span className="text-gray-900 dark:text-white">{user?.phone || 'לא הוזן'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">העדפות</h2>
            
            <div className="space-y-6">
              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">התראות</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">קבל התראות על פעילות במערכת</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                    className="sr-only peer"
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 ml-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">שפה</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">שפת הממשק</div>
                  </div>
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  disabled={!isEditing}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white disabled:opacity-50"
                >
                  <option value="he">🇮🇱 עברית</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="ar">🇸🇦 العربية</option>
                </select>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  {preferences.theme === 'light' ? (
                    <Sun className="w-5 h-5 text-gray-400 ml-3" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-400 ml-3" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">תמה</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">מצב תצוגה</div>
                  </div>
                </div>
                <select
                  value={preferences.theme}
                  onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  disabled={!isEditing}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white disabled:opacity-50"
                >
                  <option value="light">בהיר</option>
                  <option value="dark">כהה</option>
                  <option value="system">אוטומטי</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">מידע חשבון</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">תאריך הצטרפות:</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 ml-1" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.created_at ? formatJoinDate(user.created_at) : 'לא ידוע'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">כניסה אחרונה:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.last_login ? formatJoinDate(user.last_login) : 'כעת'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">סטטוס:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  פעיל
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">פעולות מהירות</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Settings className="w-4 h-4 ml-2" />
                הגדרות מתקדמות
              </button>
              
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;