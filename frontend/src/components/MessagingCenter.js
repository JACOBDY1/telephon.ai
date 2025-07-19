import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, Users, Bot, Clock, CheckCircle, 
  XCircle, AlertCircle, Phone, Mail, Image, Paperclip,
  Filter, Search, Plus, Edit, Trash2, Eye, Settings,
  Zap, Activity, TrendingUp, User, Calendar
} from 'lucide-react';

const MessagingCenter = ({ darkMode, t }) => {
  const [activeTab, setActiveTab] = useState('conversations');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // שיחות פעילות
  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: { name: 'יוסי כהן', phone: '+972-50-123-4567', avatar: null },
      platform: 'whatsapp',
      lastMessage: { text: 'תודה על השירות המעולה!', timestamp: '14:30', isRead: true, sender: 'customer' },
      status: 'active',
      unreadCount: 0,
      tags: ['לקוח VIP', 'עסקה פתוחה']
    },
    {
      id: 2,
      contact: { name: 'Sarah Miller', phone: '+1-555-987-6543', avatar: null },
      platform: 'sms',
      lastMessage: { text: 'מתי תוכל להתקשר אלי?', timestamp: '13:45', isRead: false, sender: 'customer' },
      status: 'pending',
      unreadCount: 2,
      tags: ['פרוספקט']
    },
    {
      id: 3,
      contact: { name: 'אחמד חסן', phone: '+971-50-765-4321', avatar: null },
      platform: 'whatsapp',
      lastMessage: { text: 'אני מעוניין בהצעת המחיר', timestamp: '12:20', isRead: false, sender: 'customer' },
      status: 'new',
      unreadCount: 1,
      tags: ['ליד חדש']
    }
  ]);

  // קמפיינים
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'ברכה ללקוחות חדשים',
      platform: 'whatsapp',
      status: 'active',
      sent: 145,
      delivered: 142,
      read: 128,
      replied: 34,
      created: '2024-01-15',
      schedule: 'מיידי',
      template: 'ברוכים הבאים! תודה על הצטרפותכם לשירותי {company_name}'
    },
    {
      id: 2,
      name: 'תזכורת פגישה',
      platform: 'sms',
      status: 'scheduled',
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      created: '2024-01-14',
      schedule: 'יומי ב-09:00',
      template: 'תזכורת: יש לך פגישה ב-{meeting_time} עם {agent_name}'
    },
    {
      id: 3,
      name: 'מבצע סוף שבוע',
      platform: 'whatsapp',
      status: 'completed',
      sent: 320,
      delivered: 315,
      read: 289,
      replied: 67,
      created: '2024-01-12',
      schedule: 'חד פעמי',
      template: '🎉 מבצע מיוחד! הנחה של 20% על כל השירותים'
    }
  ]);

  // תבניות הודעות
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'ברכה ראשונית',
      platform: 'whatsapp',
      category: 'ברכות',
      content: 'שלום {name}! תודה על פנייתך. נציג יחזור אליך בקרוב 😊',
      variables: ['name'],
      usage: 45
    },
    {
      id: 2,
      name: 'תזכורת תשלום',
      platform: 'sms',
      category: 'תזכורות',
      content: 'תזכורת: התשלום בסך {amount} ₪ יגיע לפירעון ב-{due_date}',
      variables: ['amount', 'due_date'],
      usage: 23
    },
    {
      id: 3,
      name: 'אישור פגישה',
      platform: 'whatsapp',
      category: 'פגישות',
      content: '✅ הפגישה שלך אושרה ל-{date} בשעה {time}. מקום: {location}',
      variables: ['date', 'time', 'location'],
      usage: 67
    }
  ]);

  const getPlatformIcon = (platform) => {
    return platform === 'whatsapp' ? 
      <MessageSquare className="w-4 h-4 text-green-600" /> :
      <MessageSquare className="w-4 h-4 text-blue-600" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity className="w-3 h-3" />;
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'new': return <AlertCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  // רכיב שיחה
  const ConversationView = () => {
    if (!selectedConversation) {
      return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border h-full flex items-center justify-center`}>
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              בחר שיחה
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              בחר שיחה מהרשימה כדי להתחיל לכתוב
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border flex flex-col h-full`}>
        {/* כותרת השיחה */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedConversation.contact.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(selectedConversation.platform)}
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedConversation.contact.phone}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* תגיות */}
          <div className="flex space-x-2 mt-2">
            {selectedConversation.tags.map((tag, index) => (
              <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* תוכן השיחה */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* הודעות לדוגמה */}
            <div className="flex justify-start">
              <div className="max-w-xs p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="text-sm text-gray-900 dark:text-white">שלום, אני מעוניין לקבל מידע על השירותים שלכם</p>
                <span className="text-xs text-gray-500 mt-1">12:30</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="max-w-xs p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                <p className="text-sm">שלום! בוודאי אשמח לעזור. איזה סוג שירות מעניין אותך?</p>
                <span className="text-xs opacity-75 mt-1">12:32</span>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-xs p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="text-sm text-gray-900 dark:text-white">{selectedConversation.lastMessage.text}</p>
                <span className="text-xs text-gray-500 mt-1">{selectedConversation.lastMessage.timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* אזור כתיבה */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="הקלד הודעה..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && newMessage && console.log('Send message:', newMessage)}
              />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Image className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                if (newMessage.trim()) {
                  console.log('Sending:', newMessage);
                  setNewMessage('');
                }
              }}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* תבניות מהירות */}
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={() => setNewMessage('תודה על פנייתך!')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200"
            >
              תודה על פנייתך
            </button>
            <button 
              onClick={() => setNewMessage('נציג יחזור אליך בקרוב')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200"
            >
              נציג יחזור אליך
            </button>
            <button 
              onClick={() => setNewMessage('האם יש עוד משהו שאוכל לעזור?')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200"
            >
              עוד עזרה?
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">מרכז הודעות מתקדם</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            נהל שיחות WhatsApp ו-SMS, קמפיינים ותבניות
          </p>
        </div>
        <button 
          onClick={() => setShowNewCampaign(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>קמפיין חדש</span>
        </button>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">שיחות פעילות</p>
              <p className="text-3xl font-bold text-green-600">{conversations.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">הודעות שנשלחו היום</p>
              <p className="text-3xl font-bold text-blue-600">
                {campaigns.reduce((sum, c) => sum + c.sent, 0)}
              </p>
            </div>
            <Send className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">שיעור תגובה</p>
              <p className="text-3xl font-bold text-purple-600">24%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">קמפיינים פעילים</p>
              <p className="text-3xl font-bold text-orange-600">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* טאבים */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'conversations', name: 'שיחות' },
              { id: 'campaigns', name: 'קמפיינים' },
              { id: 'templates', name: 'תבניות' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* תוכן לפי טאב */}
      {activeTab === 'conversations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* רשימת שיחות */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">שיחות</h3>
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="חיפוש שיחות..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {conversation.contact.name}
                            </h4>
                            {getPlatformIcon(conversation.platform)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {conversation.lastMessage.text}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage.timestamp}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center mt-1">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* תצוגת שיחה */}
          <div className="lg:col-span-2">
            <ConversationView />
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border`}>
          <div className="p-6">
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
                      {getPlatformIcon(campaign.platform)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="mr-1">
                          {campaign.status === 'active' ? 'פעיל' :
                           campaign.status === 'scheduled' ? 'מתוכנן' : 'הושלם'}
                        </span>
                      </span>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button className="p-2 text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{campaign.template}</p>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{campaign.sent}</p>
                      <p className="text-xs text-gray-500">נשלח</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{campaign.delivered}</p>
                      <p className="text-xs text-gray-500">נמסר</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{campaign.read}</p>
                      <p className="text-xs text-gray-500">נקרא</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{campaign.replied}</p>
                      <p className="text-xs text-gray-500">השיב</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>נוצר: {campaign.created}</span>
                    <span>לוח זמנים: {campaign.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(template.platform)}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {template.category}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{template.content}</p>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">משתנים:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{template.usage} שימושים</span>
                <div className="flex space-x-1">
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagingCenter;