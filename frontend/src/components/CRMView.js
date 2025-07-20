import React from 'react';
import { Plus, DollarSign, Target, CheckSquare, TrendingUp, Filter, BarChart, User } from 'lucide-react';

const CRMView = ({ darkMode, t, crmData = { leads: [], deals: [], tasks: [] }, openModal = () => {}, startCall = () => {} }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.crm} - מערכת ניהול מתקדמת</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => openModal('newLead')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newLead}</span>
          </button>
          <button 
            onClick={() => openModal('newDeal')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>{t.newDeal}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">לידים פעילים</p>
              <p className="text-3xl font-bold text-blue-600">{crmData?.leads?.length || 0}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">עסקאות פתוחות</p>
              <p className="text-3xl font-bold text-green-600">{crmData?.deals?.length || 0}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">משימות היום</p>
              <p className="text-3xl font-bold text-orange-600">{crmData?.tasks?.filter(t => t.status === 'pending').length || 0}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ערך כולל עסקאות</p>
              <p className="text-3xl font-bold text-purple-600">₪{crmData.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.leads}</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {crmData.leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{lead.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{lead.company}</p>
                    <p className="text-xs text-gray-500">מקור: {lead.source}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      lead.status === 'חם' ? 'bg-red-100 text-red-800' : 
                      lead.status === 'חמים' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₪{lead.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex mt-3 space-x-2">
                  <button 
                    onClick={() => startCall(lead)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-3 rounded text-sm"
                  >
                    התקשר
                  </button>
                  <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-1 px-3 rounded text-sm">
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.deals}</h3>
            <BarChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {crmData.deals.map((deal) => (
              <div key={deal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{deal.name}</h4>
                  <span className="text-sm font-bold text-green-600">₪{deal.value.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">לקוח: {deal.client}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">שלב: {deal.stage}</span>
                  <span className="text-xs text-gray-500">{deal.probability}% סיכוי</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${deal.probability}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border mt-8`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t.tasks}</h3>
        <div className="space-y-3">
          {crmData.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={task.status === 'completed'} 
                  className="w-4 h-4" 
                />
                <div>
                  <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">תאריך יעד: {task.due}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                task.priority === 'גבוה' ? 'bg-red-100 text-red-800' :
                task.priority === 'בינוני' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRMView;