import React from 'react';
import { Settings, User, Lock, Bell, Globe, Palette, Database, Zap } from 'lucide-react';

const SettingsView = ({ darkMode, t, language, setLanguage, languages }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.settings}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">פרופיל משתמש</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שם מלא</label>
              <input 
                type="text" 
                defaultValue="יוסי כהן" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">אימייל</label>
              <input 
                type="email" 
                defaultValue="yossi@company.com" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תפקיד</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>מנהל מכירות</option>
                <option>נציג מכירות</option>
                <option>מנהל</option>
                <option>אדמין</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language & Display */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 mr-2 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">שפה ותצוגה</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שפת ממשק</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(languages).map(([code, { name, flag }]) => (
                  <option key={code} value={code}>
                    {flag} {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">אזור זמן</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Asia/Jerusalem</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">פורמט תאריך</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center mb-4">
            <Lock className="w-5 h-5 mr-2 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">אבטחה</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
              שינוי סיסמה
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
              הפעל אימות דו-שלבי
            </button>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">התחברות אוטומטית</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 mr-2 text-yellow-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">התראות</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">שיחות חדשות</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">לידים חדשים</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">דוחות יומיים</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">עדכוני מערכת</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 mr-2 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">הגדרות API</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Checkcall API</label>
              <div className="flex">
                <input 
                  type="password" 
                  placeholder="API Key" 
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                  בדוק
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MasterPBX Token</label>
              <div className="flex">
                <input 
                  type="password" 
                  placeholder="Token" 
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700">
                  בדוק
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 mr-2 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">ביצועים</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">רענון אוטומטי</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תדירות רענון (שניות)</label>
              <input 
                type="number" 
                defaultValue="30" 
                min="10" 
                max="300"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">מצב חיסכון בנתונים</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          שמור שינויים
        </button>
      </div>
    </div>
  );
};

export default SettingsView;