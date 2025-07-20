import React, { useState, useEffect } from 'react';
import { 
  UserCheck, UserX, Users2, Activity, User, MoreVertical, 
  Calendar, Clock, MapPin, Phone, MessageSquare, Award,
  TrendingUp, Filter, Search, Download, Bell, Star,
  CheckCircle, XCircle, AlertTriangle, BookOpen, Target, Plus
} from 'lucide-react';

const AttendanceView = ({ darkMode = false, t = {}, attendanceData = [] }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  
  // Real data states
  const [employees, setEmployees] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load real data from API
  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch employees
      const employeesResponse = await fetch(`${backendUrl}/attendance/employees`, { headers });
      const employeesData = await employeesResponse.json();
      
      // Fetch bookings for today
      const today = new Date().toISOString().split('T')[0];
      const bookingsResponse = await fetch(`${backendUrl}/bookings?date=${today}`, { headers });
      const bookingsData = await bookingsResponse.json();
      
      // Fetch booking leads
      const leadsResponse = await fetch(`${backendUrl}/booking-leads`, { headers });
      const leadsData = await leadsResponse.json();
      
      // Fetch dashboard data
      const dashboardResponse = await fetch(`${backendUrl}/attendance/dashboard`, { headers });
      const dashboardDataResponse = await dashboardResponse.json();

      setEmployees(employeesData);
      setBookings(bookingsData);
      setLeads(leadsData);
      setDashboardData(dashboardDataResponse);
      
    } catch (err) {
      console.error('Error loading attendance data:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${backendUrl}/attendance/checkin/${employeeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadAttendanceData(); // Refresh data
        alert('העובד נרשם בהצלחה!');
      } else {
        alert('שגיאה ברישום העובד');
      }
    } catch (err) {
      console.error('Error checking in:', err);
      alert('שגיאה ברישום העובד');
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${backendUrl}/attendance/checkout/${employeeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadAttendanceData(); // Refresh data
        alert('העובד יצא בהצלחה!');
      } else {
        alert('שגיאה ביציאת העובד');
      }
    } catch (err) {
      console.error('Error checking out:', err);
      alert('שגיאה ביציאת העובד');
    }
  };

  const handleBookingCreate = async (bookingData) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${backendUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        await loadAttendanceData(); // Refresh data
        setShowBookingModal(false);
        alert('הבוקינג נוצר בהצלחה!');
      } else {
        alert('שגיאה ביצירת הבוקינג');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('שגיאה ביצירת הבוקינג');
    }
  };

  const filterEmployees = (employeesList) => {
    let filtered = employeesList || [];
    
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(emp => emp.attendance_status === selectedFilter);
    }
    
    return filtered;
  };

  const getTodayBookings = (employeeId) => {
    return bookings.filter(booking => 
      booking.employee_id === employeeId && 
      booking.date === new Date().toISOString().split('T')[0]
    );
  };

  const getEmployeeLeads = (employeeId) => {
    return leads.filter(lead => lead.assigned_to === employeeId);
  };

  const handleLeadPopup = (lead) => {
    setSelectedEmployee(lead);
    setShowLeadPopup(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">טוען נתוני נוכחות...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={loadAttendanceData}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  const filteredEmployees = filterEmployees(employees);
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