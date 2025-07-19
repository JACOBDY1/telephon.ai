import React, { useState } from 'react';
import { 
  FileText, Download, Mail, Share, Plus, Edit, Trash2, Copy, 
  Search, Filter, Calendar, User, Building, DollarSign, 
  CheckCircle, Clock, AlertCircle, Eye, Settings
} from 'lucide-react';

const DocumentGenerator = ({ darkMode, t }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [documentData, setDocumentData] = useState({});
  const [generatedDocuments, setGeneratedDocuments] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // תבניות מסמכים
  const documentTemplates = [
    {
      id: 'quote',
      name: 'הצעת מחיר',
      description: 'הצעת מחיר מפורטת עם פירוט מוצרים ומחירים',
      icon: DollarSign,
      color: 'bg-green-100 text-green-800',
      fields: [
        { name: 'customerName', label: 'שם לקוח', type: 'text', required: true },
        { name: 'customerEmail', label: 'אימייל לקוח', type: 'email', required: true },
        { name: 'customerPhone', label: 'טלפון לקוח', type: 'tel', required: false },
        { name: 'company', label: 'חברה', type: 'text', required: false },
        { name: 'validUntil', label: 'תוקף עד', type: 'date', required: true },
        { name: 'products', label: 'מוצרים', type: 'array', required: true }
      ],
      template: `
        <div class="document">
          <h1>הצעת מחיר</h1>
          <div class="customer-info">
            <h2>פרטי לקוח</h2>
            <p><strong>שם:</strong> {customerName}</p>
            <p><strong>אימייל:</strong> {customerEmail}</p>
            <p><strong>טלפון:</strong> {customerPhone}</p>
            {company && <p><strong>חברה:</strong> {company}</p>}
          </div>
          <div class="products">
            <h2>פירוט מוצרים</h2>
            {products}
          </div>
          <p><strong>תוקף ההצעה:</strong> {validUntil}</p>
        </div>
      `
    },
    {
      id: 'contract',
      name: 'חוזה שירות',
      description: 'חוזה שירות סטנדרטי עם תנאים כלליים',
      icon: FileText,
      color: 'bg-blue-100 text-blue-800',
      fields: [
        { name: 'customerName', label: 'שם לקוח', type: 'text', required: true },
        { name: 'customerID', label: 'ת.ז. / ח.פ.', type: 'text', required: true },
        { name: 'serviceType', label: 'סוג שירות', type: 'select', options: ['תמיכה טכנית', 'ייעוץ', 'פיתוח', 'אחר'], required: true },
        { name: 'startDate', label: 'תאריך התחלה', type: 'date', required: true },
        { name: 'duration', label: 'משך החוזה (חודשים)', type: 'number', required: true },
        { name: 'monthlyFee', label: 'תשלום חודשי', type: 'number', required: true }
      ]
    },
    {
      id: 'invoice',
      name: 'חשבונית',
      description: 'חשבונית מס עם פירוט שירותים',
      icon: Building,
      color: 'bg-purple-100 text-purple-800',
      fields: [
        { name: 'invoiceNumber', label: 'מספר חשבונית', type: 'text', required: true },
        { name: 'customerName', label: 'שם לקוח', type: 'text', required: true },
        { name: 'customerAddress', label: 'כתובת לקוח', type: 'textarea', required: true },
        { name: 'issueDate', label: 'תאריך הנפקה', type: 'date', required: true },
        { name: 'dueDate', label: 'תאריך פרעון', type: 'date', required: true },
        { name: 'items', label: 'פריטים', type: 'array', required: true }
      ]
    },
    {
      id: 'report',
      name: 'דוח פעילות',
      description: 'דוח פעילות חודשי או שבועי',
      icon: CheckCircle,
      color: 'bg-orange-100 text-orange-800',
      fields: [
        { name: 'reportPeriod', label: 'תקופת הדוח', type: 'text', required: true },
        { name: 'totalCalls', label: 'סך שיחות', type: 'number', required: true },
        { name: 'avgCallDuration', label: 'משך שיחה ממוצע', type: 'text', required: true },
        { name: 'conversionRate', label: 'שיעור המרה', type: 'text', required: true },
        { name: 'topPerformers', label: 'מובילים', type: 'textarea', required: false }
      ]
    }
  ];

  // מסמכים שנוצרו לאחרונה
  const [recentDocuments] = useState([
    {
      id: 1,
      type: 'quote',
      name: 'הצעת מחיר - יוסי כהן',
      customer: 'יוסי כהן',
      created: '2024-01-15',
      status: 'sent',
      amount: '₪15,000'
    },
    {
      id: 2,
      type: 'contract',
      name: 'חוזה שירות - חברת ABC',
      customer: 'חברת ABC',
      created: '2024-01-14',
      status: 'signed',
      amount: '₪5,000/חודש'
    },
    {
      id: 3,
      type: 'invoice',
      name: 'חשבונית 2024-001',
      customer: 'דנה לוי',
      created: '2024-01-13',
      status: 'pending',
      amount: '₪3,200'
    }
  ]);

  // יצירת מסמך
  const generateDocument = () => {
    if (!selectedTemplate) return;

    const newDoc = {
      id: Date.now(),
      type: selectedTemplate.id,
      name: `${selectedTemplate.name} - ${documentData.customerName || 'לקוח חדש'}`,
      customer: documentData.customerName || 'לא צוין',
      created: new Date().toISOString().split('T')[0],
      status: 'draft',
      data: documentData
    };

    setGeneratedDocuments(prev => [newDoc, ...prev]);
    setShowPreview(false);
    setDocumentData({});
    setSelectedTemplate(null);
  };

  // רכיב טפסים דינמי
  const DynamicForm = () => {
    if (!selectedTemplate) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedTemplate.name}
          </h3>
          <button
            onClick={() => setSelectedTemplate(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4">
          {selectedTemplate.fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={documentData[field.name] || ''}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={field.required}
                />
              )}

              {field.type === 'email' && (
                <input
                  type="email"
                  value={documentData[field.name] || ''}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={field.required}
                />
              )}

              {field.type === 'tel' && (
                <input
                  type="tel"
                  value={documentData[field.name] || ''}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={field.required}
                />
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  value={documentData[field.name] || ''}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={field.required}
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  value={documentData[field.name] || ''}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={field.required}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={documentData[field.name] || ''}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-20"
                  required={field.required}
                />
              )}

              {field.type === 'select' && (
                <select
                  value={documentData[field.name] || ''}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={field.required}
                >
                  <option value="">בחר...</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </form>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            תצוגה מקדימה
          </button>
          <button
            onClick={generateDocument}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <FileText className="w-4 h-4 mr-1" />
            צור מסמך
          </button>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'sent': return <Mail className="w-3 h-3" />;
      case 'signed': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">מחולל מסמכים</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            צור הצעות מחיר, חוזים, חשבוניות ודוחות בקלות
          </p>
        </div>
      </div>

      {/* בחירת תבנית */}
      {!selectedTemplate && (
        <>
          {/* תבניות זמינות */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">תבניות זמינות</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {documentTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${template.color}`}>
                      <template.icon className="w-6 h-6" />
                    </div>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* מסמכים אחרונים */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">מסמכים אחרונים</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="חפש מסמכים..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">כל הסוגים</option>
                  <option value="quote">הצעות מחיר</option>
                  <option value="contract">חוזים</option>
                  <option value="invoice">חשבוניות</option>
                  <option value="report">דוחות</option>
                </select>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border overflow-hidden`}>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...recentDocuments, ...generatedDocuments].map(doc => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {doc.customer} • {doc.created}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusIcon(doc.status)}
                          <span className="mr-1">
                            {doc.status === 'draft' ? 'טיוטה' :
                             doc.status === 'sent' ? 'נשלח' :
                             doc.status === 'signed' ? 'חתום' : 'ממתין'}
                          </span>
                        </span>
                        
                        {doc.amount && (
                          <span className="font-semibold text-gray-900 dark:text-white">{doc.amount}</span>
                        )}
                        
                        <div className="flex space-x-1">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-800">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-purple-600 hover:text-purple-800">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-800">
                            <Share className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* טופס יצירת מסמך */}
      {selectedTemplate && <DynamicForm />}

      {/* תצוגה מקדימה */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-4xl mx-4 max-h-screen overflow-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">תצוגה מקדימה</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg p-8 bg-white text-black min-h-96">
              <div className="document-preview">
                <h1 className="text-2xl font-bold mb-6 text-center">{selectedTemplate?.name}</h1>
                
                {documentData.customerName && (
                  <div className="customer-section mb-6">
                    <h2 className="text-lg font-semibold mb-3">פרטי לקוח:</h2>
                    <p><strong>שם:</strong> {documentData.customerName}</p>
                    {documentData.customerEmail && <p><strong>אימייל:</strong> {documentData.customerEmail}</p>}
                    {documentData.customerPhone && <p><strong>טלפון:</strong> {documentData.customerPhone}</p>}
                    {documentData.company && <p><strong>חברה:</strong> {documentData.company}</p>}
                  </div>
                )}

                <div className="content-section">
                  {Object.entries(documentData).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <strong>{selectedTemplate?.fields.find(f => f.name === key)?.label}:</strong> {value}
                    </div>
                  ))}
                </div>

                <div className="footer mt-8 pt-4 border-t text-center text-sm text-gray-600">
                  מסמך נוצר ב-{new Date().toLocaleDateString('he-IL')} • TelephonyAI Platform
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                חזור לעריכה
              </button>
              <button
                onClick={generateDocument}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                צור מסמך
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGenerator;