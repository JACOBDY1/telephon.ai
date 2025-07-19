import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Building, 
  User,
  Calendar,
  DollarSign,
  Target,
  Clock,
  CheckSquare,
  X,
  Save
} from 'lucide-react';
import axios from 'axios';

const CRMManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leads');
  const [data, setData] = useState({
    leads: [],
    deals: [],
    tasks: []
  });
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/crm/${activeTab}`);
      setData(prev => ({ ...prev, [activeTab]: response.data }));
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const handleAdd = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/crm/${activeTab}`, formData);
      setData(prev => ({ 
        ...prev, 
        [activeTab]: [response.data, ...prev[activeTab]] 
      }));
      setShowAddModal(false);
    } catch (error) {
      console.error(`Error adding ${activeTab}:`, error);
    }
  };

  // Update item
  const handleUpdate = async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE}/crm/${activeTab}/${id}`, formData);
      setData(prev => ({ 
        ...prev, 
        [activeTab]: prev[activeTab].map(item => 
          item.id === id ? response.data : item
        )
      }));
      setEditingItem(null);
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/crm/${activeTab}/${id}`);
      setData(prev => ({ 
        ...prev, 
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
    }
  };

  // Filter data based on search
  const filteredData = data[activeTab].filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.title?.toLowerCase().includes(searchLower) ||
      item.company?.toLowerCase().includes(searchLower) ||
      item.phone?.includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchLower)
    );
  });

  const AddEditModal = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState(
      item || getDefaultFormData()
    );

    function getDefaultFormData() {
      switch (activeTab) {
        case 'leads':
          return {
            name: '',
            phone: '',
            email: '',
            company: '',
            source: 'website',
            priority: 'medium',
            notes: '',
            estimated_value: ''
          };
        case 'deals':
          return {
            title: '',
            description: '',
            amount: '',
            currency: 'ILS',
            probability: 50,
            expected_close_date: '',
            notes: ''
          };
        case 'tasks':
          return {
            title: '',
            description: '',
            type: 'call',
            priority: 'medium',
            due_date: '',
            notes: ''
          };
        default:
          return {};
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const renderFormFields = () => {
      switch (activeTab) {
        case 'leads':
          return (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">טלפון *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+972-50-123-4567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">חברה</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מקור</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="website">אתר</option>
                    <option value="call">שיחה</option>
                    <option value="referral">המלצה</option>
                    <option value="marketing">שיווק</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">נמוכה</option>
                    <option value="medium">בינונית</option>
                    <option value="high">גבוהה</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ערך משוער (₪)</label>
                  <input
                    type="number"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({...formData, estimated_value: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">הערות</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
            </>
          );

        case 'deals':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">כותרת העסקה *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סכום *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מטבע</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ILS">₪ שקל</option>
                    <option value="USD">$ דולר</option>
                    <option value="EUR">€ יורו</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הסתברות (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תאריך סגירה צפוי</label>
                <input
                  type="date"
                  value={formData.expected_close_date ? formData.expected_close_date.split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, expected_close_date: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">הערות</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
            </>
          );

        case 'tasks':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">כותרת המשימה *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סוג</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="call">שיחה</option>
                    <option value="email">אימייל</option>
                    <option value="meeting">פגישה</option>
                    <option value="follow_up">מעקב</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">נמוכה</option>
                    <option value="medium">בינונית</option>
                    <option value="high">גבוהה</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תאריך יעד</label>
                <input
                  type="datetime-local"
                  value={formData.due_date ? formData.due_date.slice(0, 16) : ''}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">הערות</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {item ? 'ערוך' : 'הוסף'} {activeTab === 'leads' ? 'ליד' : activeTab === 'deals' ? 'עסקה' : 'משימה'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {renderFormFields()}

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4 inline ml-2" />
                  {item ? 'עדכן' : 'הוסף'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  בטל
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderItemCard = (item) => {
    switch (activeTab) {
      case 'leads':
        return (
          <div key={item.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.company}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority === 'high' ? 'גבוה' : item.priority === 'medium' ? 'בינוני' : 'נמוך'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                  item.status === 'qualified' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status === 'new' ? 'חדש' : 
                   item.status === 'contacted' ? 'נוצר קשר' :
                   item.status === 'qualified' ? 'מוכשר' : item.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone size={16} className="ml-2" />
                {item.phone}
              </div>
              {item.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail size={16} className="ml-2" />
                  {item.email}
                </div>
              )}
              {item.estimated_value && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign size={16} className="ml-2" />
                  ₪{item.estimated_value.toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                נוצר: {new Date(item.created_at).toLocaleDateString('he-IL')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'deals':
        return (
          <div key={item.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.stage === 'proposal' ? 'bg-blue-100 text-blue-800' :
                item.stage === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
                item.stage === 'closed_won' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.stage === 'proposal' ? 'הצעה' :
                 item.stage === 'negotiation' ? 'משא ומתן' :
                 item.stage === 'closed_won' ? 'נסגר בהצלחה' : 'נסגר ללא הצלחה'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <DollarSign size={16} className="ml-2" />
                {item.amount.toLocaleString()} {item.currency}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Target size={16} className="ml-2" />
                הסתברות: {item.probability}%
              </div>
              {item.expected_close_date && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={16} className="ml-2" />
                  תאריך סגירה: {new Date(item.expected_close_date).toLocaleDateString('he-IL')}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                נוצר: {new Date(item.created_at).toLocaleDateString('he-IL')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div key={item.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority === 'high' ? 'גבוה' : item.priority === 'medium' ? 'בינוני' : 'נמוך'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'pending' ? 'בהמתנה' : 
                   item.status === 'completed' ? 'הושלמה' : 'בוטלה'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckSquare size={16} className="ml-2" />
                סוג: {item.type === 'call' ? 'שיחה' : 
                      item.type === 'email' ? 'אימייל' :
                      item.type === 'meeting' ? 'פגישה' : 'מעקב'}
              </div>
              {item.due_date && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={16} className="ml-2" />
                  תאריך יעד: {new Date(item.due_date).toLocaleDateString('he-IL')}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                נוצר: {new Date(item.created_at).toLocaleDateString('he-IL')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">ניהול CRM</h1>
        <p className="text-purple-100">נהל את הלידים, העסקאות והמשימות שלך</p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'leads', label: 'לידים', icon: User },
            { key: 'deals', label: 'עסקאות', icon: DollarSign },
            { key: 'tasks', label: 'משימות', icon: CheckSquare }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} className="ml-2" />
              {label}
              <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full mr-2">
                {data[key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`חיפוש ${activeTab === 'leads' ? 'לידים' : activeTab === 'deals' ? 'עסקאות' : 'משימות'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus size={16} className="ml-2" />
            הוסף {activeTab === 'leads' ? 'ליד' : activeTab === 'deals' ? 'עסקה' : 'משימה'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm ? 'לא נמצאו תוצאות' : `אין ${activeTab === 'leads' ? 'לידים' : activeTab === 'deals' ? 'עסקאות' : 'משימות'} עדיין`}
            </div>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                הוסף את הראשון
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(renderItemCard)}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddEditModal
          onSave={(data) => handleAdd(data)}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingItem && (
        <AddEditModal
          item={editingItem}
          onSave={(data) => handleUpdate(editingItem.id, data)}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default CRMManager;