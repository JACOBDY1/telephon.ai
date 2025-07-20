import React, { useState, useEffect } from 'react';
import { 
  Search, X, User, Phone, MessageSquare, FileText, 
  Calendar, Users, DollarSign, Clock, ArrowRight,
  Command, Filter, History, Sparkles, Zap
} from 'lucide-react';

const GlobalSearch = ({ isOpen, onClose, darkMode = false, t = {} }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Sample search data - in real app would come from API
  const searchData = [
    // Contacts
    { 
      type: 'contact', 
      id: 'c1', 
      title: 'יואב כהן', 
      subtitle: 'לקוח VIP - 050-1234567', 
      description: 'מנהל IT בחברת הטכנולוגיה המתקדמת',
      lastContact: '2 דקות',
      tags: ['VIP', 'חם', 'IT']
    },
    { 
      type: 'contact', 
      id: 'c2', 
      title: 'רחל מזרחי', 
      subtitle: 'פרוספקט - 054-9876543', 
      description: 'מעוניינת במערכת טלפוניה לעסק קטן',
      lastContact: '1 שעה',
      tags: ['פרוספקט', 'עסק קטן']
    },
    // Calls
    { 
      type: 'call', 
      id: 'call1', 
      title: 'שיחה יוצאת ליואב כהן', 
      subtitle: '8 דקות - הושלמה', 
      description: 'דיון על שדרוג המערכת לגרסה Enterprise',
      timestamp: '14:30',
      tags: ['הושלמה', 'enterprise']
    },
    // CRM
    { 
      type: 'lead', 
      id: 'l1', 
      title: 'ליד חדש - דוד אברהם', 
      subtitle: 'עסקה פוטנציאלית ₪45,000', 
      description: 'מעוניין במערכת PBX עם 50 שלוחות',
      priority: 'גבוה',
      tags: ['חדש', 'PBX', 'גבוה']
    },
    // Documents  
    { 
      type: 'document', 
      id: 'd1', 
      title: 'הצעת מחיר - חברת ABC', 
      subtitle: 'PDF - עודכן היום', 
      description: 'הצעה מלאה למערכת טלפוניה עם 100 שלוחות',
      size: '2.4 MB',
      tags: ['הצעה', 'PDF']
    },
    // Tasks
    { 
      type: 'task', 
      id: 't1', 
      title: 'מעקב עם מיכל דוד', 
      subtitle: 'דחוף - תאריך יעד: היום', 
      description: 'בדיקת סטטוס החלטה על הצעת המחיר',
      dueDate: 'היום 17:00',
      tags: ['דחוף', 'מעקב']
    },
    // Settings
    { 
      type: 'setting', 
      id: 's1', 
      title: 'הגדרות חיוג יוצא', 
      subtitle: 'PBX Configuration', 
      description: 'קביעת כללי חיוג וחסימות',
      location: 'הגדרות > מערכת PBX',
      tags: ['PBX', 'חיוג']
    }
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      setResults(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleResultClick = (result) => {
    // Add to search history
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    
    // Handle navigation based on result type
    console.log('Navigating to:', result);
    
    // Close search
    onClose();
    setQuery('');
  };

  const getResultIcon = (type) => {
    const icons = {
      contact: User,
      call: Phone,
      lead: Users,
      document: FileText,
      task: Clock,
      setting: Zap
    };
    return icons[type] || Search;
  };

  const getResultColor = (type) => {
    const colors = {
      contact: 'text-blue-600',
      call: 'text-green-600', 
      lead: 'text-purple-600',
      document: 'text-orange-600',
      task: 'text-red-600',
      setting: 'text-gray-600'
    };
    return colors[type] || 'text-gray-600';
  };

  const getResultBadge = (type) => {
    const badges = {
      contact: 'אנשי קשר',
      call: 'שיחות',
      lead: 'לידים', 
      document: 'מסמכים',
      task: 'משימות',
      setting: 'הגדרות'
    };
    return badges[type] || type;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4">
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
          {/* Search Header */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="חפש בכל מקום... (Ctrl+K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ml-2"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Content */}
          <div className="max-h-96 overflow-y-auto">
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">מחפש...</span>
              </div>
            )}

            {/* Results */}
            {!loading && query && results.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  נמצאו {results.length} תוצאות
                </div>
                {results.map((result, index) => {
                  const Icon = getResultIcon(result.type);
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${getResultColor(result.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            {getResultBadge(result.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {result.subtitle}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                          {result.description}
                        </p>
                        {result.tags && (
                          <div className="flex gap-1 mt-2">
                            {result.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!loading && query && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  לא נמצאו תוצאות
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  נסה לחפש במילים אחרות או בדוק את הכתיב
                </p>
              </div>
            )}

            {/* Search History & Shortcuts */}
            {!query && (
              <div className="py-4">
                {searchHistory.length > 0 && (
                  <div className="mb-4">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      חיפושים אחרונים
                    </div>
                    {searchHistory.map((historyItem, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(historyItem)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <History className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{historyItem}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    קיצורי דרך
                  </div>
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">כל אנשי הקשר</span>
                      <div className="ml-auto text-xs text-gray-400">⌘+U</div>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">היסטוריית שיחות</span>
                      <div className="ml-auto text-xs text-gray-400">⌘+H</div>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 dark:text-gray-300">AI Analytics</span>
                      <div className="ml-auto text-xs text-gray-400">⌘+A</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Footer */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>Enter</span>
                <span>לפתיחה</span>
              </div>
              <div className="flex items-center gap-1">
                <span>↑↓</span>
                <span>ניווט</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Powered by TelephonyAI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;