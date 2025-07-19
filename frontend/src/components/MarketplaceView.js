import React from 'react';
import { Bot, BarChart, Workflow, Star, Link } from 'lucide-react';

const MarketplaceView = ({ darkMode, t, marketplaceItems }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.marketplace} - חנות דיגיטלית מתקדמת</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
            <option value="all">כל הקטגוריות</option>
            <option value="plugins">פלאגינים</option>
            <option value="analytics">אנליטיקות</option>
            <option value="automation">אוטומציה</option>
          </select>
        </div>
      </div>

      {/* Marketplace Hero */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
          src="https://images.unsplash.com/photo-1677693972403-db681288b5da"
          alt="Digital Marketplace"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-2">מרקטפלייס של TelephonyAI</h2>
            <p className="text-lg">פלאגינים, כלים ושירותים להרחבת הפלטפורמה</p>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceItems.map((item) => (
          <div key={item.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border hover:shadow-lg transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {item.category === 'plugins' && <Bot className="w-6 h-6 text-blue-600" />}
                {item.category === 'analytics' && <BarChart className="w-6 h-6 text-blue-600" />}
                {item.category === 'automation' && <Workflow className="w-6 h-6 text-blue-600" />}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{item.rating}</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              תוסף מתקדם לשיפור הפונקציונליות של המערכת
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-600">${item.price}</span>
              <span className="text-sm text-gray-500">{item.installs.toLocaleString()} התקנות</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              התקן עכשיו
            </button>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border mt-8`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">קטגוריות פופולריות</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'פלאגינים', icon: Bot, count: 15 },
            { name: 'אנליטיקות', icon: BarChart, count: 8 },
            { name: 'אוטומציה', icon: Workflow, count: 12 },
            { name: 'אינטגרציות', icon: Link, count: 20 }
          ].map((category) => (
            <div key={category.name} className="text-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <category.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-gray-900 dark:text-white">{category.name}</p>
              <p className="text-sm text-gray-500">{category.count} פריטים</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceView;