import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, Target, CheckSquare, TrendingUp, Filter, BarChart, User, Search, Download, SortAsc, SortDesc, Calendar, Phone, Mail, MessageSquare, Edit, Trash2, Eye } from 'lucide-react';

const CRMView = ({ darkMode, t, crmData = { leads: [], deals: [], tasks: [] }, openModal = () => {}, startCall = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeView, setActiveView] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);

  // Enhanced filtering and searching
  const filterLeads = (leads) => {
    let filtered = leads || [];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === selectedFilter);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  };

  const exportData = (type, data) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${type}_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} on:`, selectedItems);
    // In real app, this would call API endpoints
    setSelectedItems([]);
  };

  const toggleItemSelection = (id, type) => {
    const itemId = `${type}_${id}`;
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(item => item !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredLeads = filterLeads(crmData?.leads || []);
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

      {/* Enhanced Search & Filter Bar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border mb-6`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="חפש לידים, עסקאות או משימות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="חם">חם</option>
              <option value="חמים">חמים</option>
              <option value="קר">קר</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="name">שם</option>
              <option value="company">חברה</option>
              <option value="value">ערך</option>
              <option value="status">סטטוס</option>
            </select>

            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>

            <button
              onClick={() => exportData('leads', filteredLeads)}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ייצא</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedItems.length} פריטים נבחרו
            </span>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              מחק הכל
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              ייצא נבחרים
            </button>
            <button
              onClick={() => setSelectedItems([])}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              בטל בחירה
            </button>
          </div>
        )}
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
              <p className="text-3xl font-bold text-orange-600">{(crmData?.tasks || []).filter(t => t.status === 'pending').length}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ערך כולל עסקאות</p>
              <p className="text-3xl font-bold text-purple-600">₪{((crmData?.deals || []).reduce((sum, deal) => sum + (deal?.value || 0), 0)).toLocaleString()}</p>
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
            {(crmData?.leads || []).map((lead) => (
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
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₪{(lead.value || 0).toLocaleString()}</p>
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
            {(crmData?.deals || []).map((deal) => (
              <div key={deal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{deal.name}</h4>
                  <span className="text-sm font-bold text-green-600">₪{(deal.value || 0).toLocaleString()}</span>
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
          {(crmData?.tasks || []).map((task) => (
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