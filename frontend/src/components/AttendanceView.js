import React from 'react';
import { UserCheck, UserX, Users2, Activity, User, MoreVertical } from 'lucide-react';

const AttendanceView = ({ darkMode, t, attendanceData }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.attendance} - מערכת נוכחות מתקדמת</h1>
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>{t.clockIn}</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <UserX className="w-4 h-4" />
            <span>{t.clockOut}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">נוכחים היום</p>
              <p className="text-3xl font-bold text-green-600">{attendanceData.filter(a => a.status === 'present').length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">חסרים היום</p>
              <p className="text-3xl font-bold text-red-600">{attendanceData.filter(a => a.status === 'absent').length}</p>
            </div>
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">סה״כ עובדים</p>
              <p className="text-3xl font-bold text-blue-600">{attendanceData.length}</p>
            </div>
            <Users2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">אחוז נוכחות</p>
              <p className="text-3xl font-bold text-purple-600">{Math.round((attendanceData.filter(a => a.status === 'present').length / attendanceData.length) * 100)}%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border`}>
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">רשימת עובדים</h3>
        </div>
        <div className="divide-y">
          {attendanceData.map((employee) => (
            <div key={employee.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {employee.checkIn || 'לא נכנס'}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.status === 'present' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {employee.status === 'present' ? t.present : t.absent}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Calendar Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border mt-8`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">לוח פגישות ובוקינג</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <div key={day} className="text-center p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded cursor-pointer">
              <span className="text-sm">{day}</span>
              {day % 5 === 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;