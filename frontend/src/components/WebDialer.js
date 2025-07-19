import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, Users, Clock, Settings } from 'lucide-react';

const WebDialer = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('dialer');

  // Mock contacts data
  useEffect(() => {
    setContacts([
      { id: '1', name: 'יואב כהן', number: '+972-50-111-2233', company: 'סטארט-אפ טכנולוגיה' },
      { id: '2', name: 'שרה לוי', number: '+972-54-444-5566', company: 'סוכנות שיווק דיגיטלי' },
      { id: '3', name: 'דוד אברמוביץ', number: '+972-52-777-8899', company: 'חברת בנייה משפחתית' },
      { id: '4', name: 'רחל מזרחי', number: '+972-58-123-9999', company: 'רשת מסעדות כשרות' },
    ]);

    setCallHistory([
      { id: '1', name: 'יואב כהן', number: '+972-50-111-2233', duration: '12:34', time: '10:30', type: 'outgoing' },
      { id: '2', name: 'שרה לוי', number: '+972-54-444-5566', duration: '8:12', time: '09:15', type: 'incoming' },
      { id: '3', name: 'רחל מזרחי', number: '+972-58-123-9999', duration: '15:45', time: '08:45', type: 'outgoing' },
    ]);
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isConnected && !isRinging) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, isRinging]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addDigit = (digit) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber(prev => prev + digit);
    }
  };

  const removeDigit = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const clearNumber = () => {
    setPhoneNumber('');
  };

  const makeCall = async (number = phoneNumber) => {
    if (!number) return;
    
    setIsRinging(true);
    setCallDuration(0);

    try {
      // Simulate calling API
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          caller_name: 'משתמש',
          caller_number: '+972-50-555-0001',
          callee_number: number,
          language: 'he'
        })
      });

      if (response.ok) {
        // Simulate connection after 3 seconds
        setTimeout(() => {
          setIsRinging(false);
          setIsConnected(true);
        }, 3000);
      }
    } catch (error) {
      console.error('Error making call:', error);
      setIsRinging(false);
    }
  };

  const endCall = async () => {
    setIsConnected(false);
    setIsRinging(false);
    
    // Add to call history
    const newCall = {
      id: Date.now().toString(),
      name: phoneNumber.startsWith('+972') ? 'לא ידוע' : phoneNumber,
      number: phoneNumber,
      duration: formatDuration(callDuration),
      time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      type: 'outgoing'
    };
    
    setCallHistory(prev => [newCall, ...prev]);
    setCallDuration(0);
    setPhoneNumber('');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const DialPad = () => (
    <div className="space-y-6">
      {/* Display */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
        <div className="text-2xl font-mono text-gray-800 dark:text-gray-200 min-h-[40px] flex items-center justify-center">
          {phoneNumber || 'הכנס מספר טלפון'}
        </div>
        {(isConnected || isRinging) && (
          <div className="mt-2">
            {isRinging ? (
              <div className="text-blue-600 dark:text-blue-400 animate-pulse">מתקשר...</div>
            ) : (
              <div className="text-green-600 dark:text-green-400">{formatDuration(callDuration)}</div>
            )}
          </div>
        )}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
          <button
            key={digit}
            onClick={() => addDigit(digit)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-xl font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors active:scale-95"
            disabled={isConnected || isRinging}
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={removeDigit}
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
          disabled={!phoneNumber || isConnected || isRinging}
        >
          ⌫
        </button>
        
        {!isConnected && !isRinging ? (
          <button
            onClick={() => makeCall()}
            className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-colors shadow-lg disabled:opacity-50"
            disabled={!phoneNumber}
          >
            <PhoneCall size={24} />
          </button>
        ) : (
          <button
            onClick={endCall}
            className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <PhoneOff size={24} />
          </button>
        )}

        <button
          onClick={clearNumber}
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
          disabled={!phoneNumber || isConnected || isRinging}
        >
          C
        </button>
      </div>

      {/* Call Controls */}
      {isConnected && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button
            onClick={toggleSpeaker}
            className={`p-3 rounded-full transition-colors ${
              isSpeakerOn ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      )}
    </div>
  );

  const ContactsList = () => (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">אנשי קשר</div>
      {contacts.map(contact => (
        <div key={contact.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{contact.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{contact.company}</div>
              <div className="text-sm text-gray-500 dark:text-gray-500">{contact.number}</div>
            </div>
            <button
              onClick={() => makeCall(contact.number)}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
              disabled={isConnected || isRinging}
            >
              <Phone size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const CallHistory = () => (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">היסטוריית שיחות</div>
      {callHistory.map(call => (
        <div key={call.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">{call.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-500">{call.number}</div>
              <div className="text-xs text-gray-400 dark:text-gray-600">
                {call.time} • {call.duration} • {call.type === 'incoming' ? 'נכנסת' : 'יוצאת'}
              </div>
            </div>
            <button
              onClick={() => makeCall(call.number)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              disabled={isConnected || isRinging}
            >
              <Phone size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold text-center">חייגן Web</h2>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-700">
        <button
          onClick={() => setActiveTab('dialer')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'dialer'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Phone className="inline-block ml-1" size={16} />
          <span className="hidden sm:inline">חייגן</span>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'contacts'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Users className="inline-block ml-1" size={16} />
          <span className="hidden sm:inline">אנשי קשר</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Clock className="inline-block ml-1" size={16} />
          <span className="hidden sm:inline">היסטוריה</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-b-lg min-h-[500px]">
        {activeTab === 'dialer' && <DialPad />}
        {activeTab === 'contacts' && <ContactsList />}
        {activeTab === 'history' && <CallHistory />}
      </div>
    </div>
  );
};

export default WebDialer;