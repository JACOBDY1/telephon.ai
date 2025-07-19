import React, { useState, useEffect } from 'react';
import { 
  Brain, Mic, MicOff, Volume2, VolumeX, Bot, TrendingUp, 
  AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, 
  Clock, User, Phone, CheckCircle, XCircle, Zap
} from 'lucide-react';

const AIAnalytics = ({ darkMode, t, currentCall, isCallActive }) => {
  const [realTimeAnalysis, setRealTimeAnalysis] = useState({
    sentiment: 'neutral',
    confidence: 0,
    keywords: [],
    emotions: {},
    suggestions: [],
    riskLevel: 'low'
  });

  const [transcription, setTranscription] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // דמה של ניתוח AI בזמן אמת
  useEffect(() => {
    if (!isCallActive) return;

    const interval = setInterval(() => {
      // סימולציה של ניתוח AI בזמן אמת
      const sentiments = ['positive', 'negative', 'neutral'];
      const newSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      const keywords = [
        'מחיר', 'הנחה', 'תנאים', 'חוזה', 'משלוח', 'תמיכה',
        'איכות', 'מוצר', 'שירות', 'זמן', 'תשלום', 'הזמנה'
      ];
      
      const randomKeywords = keywords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const suggestions = {
        positive: [
          'הלקוח מרוצה - זה הזמן לסגור את העסקה',
          'הזכר את ההטבות הנוספות',
          'הציע אפשרות לשדרוג'
        ],
        negative: [
          'הלקוח מביע חוסר שביעות רצון - הקשב בעיון',
          'הציע פתרון אלטרנטיבי',
          'העבר למנהל אם נדרש'
        ],
        neutral: [
          'המשך בשיחה רגילה',
          'נסה לזהות צרכים נוספים',
          'שאל שאלות מפתח'
        ]
      };

      setRealTimeAnalysis({
        sentiment: newSentiment,
        confidence: Math.random() * 100,
        keywords: randomKeywords,
        emotions: {
          happiness: Math.random() * 100,
          anger: Math.random() * 30,
          surprise: Math.random() * 50,
          sadness: Math.random() * 20
        },
        suggestions: suggestions[newSentiment],
        riskLevel: newSentiment === 'negative' ? 'high' : newSentiment === 'positive' ? 'low' : 'medium'
      });

      // הוספת תמלול חדש
      const newTranscript = {
        id: Date.now(),
        speaker: Math.random() > 0.5 ? 'customer' : 'agent',
        text: 'טקסט תמלול לדוגמה...',
        timestamp: new Date().toLocaleTimeString(),
        sentiment: newSentiment
      };
      
      setTranscription(prev => [...prev.slice(-10), newTranscript]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isCallActive]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />;
      case 'negative': return <ThumbsDown className="w-4 h-4" />;
      case 'neutral': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (!isCallActive) {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <div className="text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ניתוח AI בזמן אמת
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            התחל שיחה כדי לראות ניתוח AI מתקדם
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ניתוח בזמן אמת */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            ניתוח AI בזמן אמת
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(realTimeAnalysis.riskLevel)}`}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {realTimeAnalysis.riskLevel === 'high' ? 'סיכון גבוה' : 
               realTimeAnalysis.riskLevel === 'medium' ? 'סיכון בינוני' : 'סיכון נמוך'}
            </div>
          </div>
        </div>

        {/* רגש כללי */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">רגש כללי</span>
            <span className="text-sm text-gray-500">{Math.round(realTimeAnalysis.confidence)}% ביטחון</span>
          </div>
          <div className={`inline-flex items-center px-3 py-2 rounded-lg ${getSentimentColor(realTimeAnalysis.sentiment)}`}>
            {getSentimentIcon(realTimeAnalysis.sentiment)}
            <span className="mr-2 font-medium">
              {realTimeAnalysis.sentiment === 'positive' ? 'חיובי' :
               realTimeAnalysis.sentiment === 'negative' ? 'שלילי' : 'נייטרלי'}
            </span>
          </div>
        </div>

        {/* מילות מפתח */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">מילות מפתח שזוהו</h4>
          <div className="flex flex-wrap gap-2">
            {realTimeAnalysis.keywords.map((keyword, index) => (
              <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* רגשות מפורטים */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">ניתוח רגשות מפורט</h4>
          <div className="space-y-2">
            {Object.entries(realTimeAnalysis.emotions).map(([emotion, value]) => (
              <div key={emotion} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {emotion === 'happiness' ? 'שמחה' :
                   emotion === 'anger' ? 'כעס' :
                   emotion === 'surprise' ? 'הפתעה' : 'עצב'}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{Math.round(value)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* המלצות AI */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Zap className="w-4 h-4 inline mr-1" />
            המלצות AI
          </h4>
          <div className="space-y-2">
            {realTimeAnalysis.suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* תמלול בזמן אמת */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            תמלול בזמן אמת
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`p-2 rounded-lg ${isListening ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <div className="flex items-center text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full mr-1 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              {isListening ? 'מקליט' : 'מושבת'}
            </div>
          </div>
        </div>

        <div className="h-80 overflow-y-auto space-y-3 mb-4">
          {transcription.map((item) => (
            <div key={item.id} className={`flex ${item.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${
                item.speaker === 'agent'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    {item.speaker === 'agent' ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <Phone className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {item.speaker === 'agent' ? 'נציג' : 'לקוח'}
                    </span>
                  </div>
                  <span className="text-xs opacity-75">{item.timestamp}</span>
                </div>
                <p className="text-sm">{item.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs ${getSentimentColor(item.sentiment)}`}>
                    {getSentimentIcon(item.sentiment)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* פקדי תמלול */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
              <Volume2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
              <VolumeX className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            <Clock className="w-3 h-3 inline mr-1" />
            משך שיחה: 03:42
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;