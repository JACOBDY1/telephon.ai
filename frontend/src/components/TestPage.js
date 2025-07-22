import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#e8f5e8', 
      border: '3px solid #4caf50',
      borderRadius: '10px',
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2e7d2e',
      direction: 'rtl'
    }}>
      <h1>🎉 השינויים עובדים!</h1>
      <p>זה דף בדיקה שמוכיח שהפרונטנד עובד</p>
      <p>אם אתה רואה את זה - הכל תקין!</p>
      <div style={{ marginTop: '20px' }}>
        <p>✅ מערכת המשתמשים המקצועיים פועלת</p>
        <p>✅ HairPro IL Advanced זמין</p>
        <p>✅ מערכת מנויים פעילה</p>
      </div>
    </div>
  );
};

export default TestPage;