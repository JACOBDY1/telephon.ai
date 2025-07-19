import React from 'react';
import { User } from 'lucide-react';

const ContactsView = ({ darkMode, t, realCallData, startCall }) => {
  // Use real call data as contacts if available, otherwise use mock data
  const contacts = realCallData.length > 0 ? realCallData : [
    {id: 1, caller_name: "יוסי כהן", caller_number: "+972-50-123-4567"},
    {id: 2, caller_name: "Sarah Johnson", caller_number: "+1-555-987-6543"},
    {id: 3, caller_name: "Ahmed Al-Hassan", caller_number: "+971-50-765-4321"}
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.contacts}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{contact.caller_name || contact.caller}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{contact.caller_number || contact.number}</p>
                      <button
                        onClick={() => startCall(contact)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        התקשר
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sales Playbook */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit`}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">מדריך מכירות מתקדם</h3>
            
            <div className="space-y-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg">
                  זיהוי ראשוני
                </h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">תקציב</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">מה התקציב המיועד לפתרון?</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">לוחות זמנים</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">מתי אתם מתכננים להטמיע?</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 bg-green-100 dark:bg-green-900 px-3 py-2 rounded-lg">
                  ניתוח צרכים
                </h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">פתרון נוכחי</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">איך אתם מנהלים כרגע?</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">נקודות כאב</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">מה האתגרים העיקריים?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsView;