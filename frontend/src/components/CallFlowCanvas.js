import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Save, Download, Upload, Undo, Redo, Trash2, Copy, 
  Phone, MessageSquare, Play, Pause, Settings, Bot, Users,
  ArrowRight, ArrowDown, Circle, Square, Diamond, Star
} from 'lucide-react';

const CallFlowCanvas = ({ darkMode, t }) => {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [flowName, setFlowName] = useState('זרימת שיחות חדשה');
  const [showNodeProperties, setShowNodeProperties] = useState(false);

  // סוגי צמתים זמינים
  const nodeTypes = {
    start: { name: 'התחלה', icon: Play, color: 'bg-green-100 text-green-800', shape: 'circle' },
    call: { name: 'שיחה', icon: Phone, color: 'bg-blue-100 text-blue-800', shape: 'square' },
    message: { name: 'הודעה', icon: MessageSquare, color: 'bg-purple-100 text-purple-800', shape: 'square' },
    bot: { name: 'בוט AI', icon: Bot, color: 'bg-orange-100 text-orange-800', shape: 'diamond' },
    queue: { name: 'תור המתנה', icon: Users, color: 'bg-yellow-100 text-yellow-800', shape: 'square' },
    decision: { name: 'החלטה', icon: Diamond, color: 'bg-red-100 text-red-800', shape: 'diamond' },
    end: { name: 'סיום', icon: Pause, color: 'bg-gray-100 text-gray-800', shape: 'circle' }
  };

  // זרימות מוכנות מראש
  const [predefinedFlows] = useState([
    {
      id: 1,
      name: 'זרימה בסיסית - קבלת שיחות',
      description: 'זרימה סטנדרטית לקבלת שיחות עם בוט ראשוני',
      nodes: [
        { id: 'start', type: 'start', x: 100, y: 100, label: 'שיחה נכנסת' },
        { id: 'greeting', type: 'message', x: 250, y: 100, label: 'ברוכים הבאים' },
        { id: 'menu', type: 'bot', x: 400, y: 100, label: 'תפריט ראשי' },
        { id: 'sales', type: 'queue', x: 300, y: 250, label: 'תור מכירות' },
        { id: 'support', type: 'queue', x: 500, y: 250, label: 'תור תמיכה' }
      ]
    },
    {
      id: 2,
      name: 'זרימה מתקדמת - שירות לקוחות',
      description: 'זרימה עם זיהוי לקוח קיים ונתוב חכם',
      nodes: [
        { id: 'start', type: 'start', x: 100, y: 100, label: 'שיחה נכנסת' },
        { id: 'identify', type: 'bot', x: 250, y: 100, label: 'זיהוי לקוח' },
        { id: 'existing', type: 'decision', x: 400, y: 100, label: 'לקוח קיים?' },
        { id: 'vip', type: 'queue', x: 300, y: 250, label: 'תור VIP' },
        { id: 'regular', type: 'queue', x: 500, y: 250, label: 'תור רגיל' }
      ]
    }
  ]);

  // הוספת צומת חדש
  const addNode = (type, x = 300, y = 200) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      x: x - 50, // מרכוז הצומת
      y: y - 25,
      label: nodeTypes[type].name,
      properties: {
        timeout: type === 'queue' ? 30 : 0,
        message: type === 'message' ? 'הכנס הודעה כאן' : '',
        conditions: type === 'decision' ? [] : undefined
      }
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedTool('select');
  };

  // טיפול בקליק על הקנבס
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool !== 'select') {
      addNode(selectedTool, x, y);
      return;
    }

    // בדיקה אם לחצו על צומת
    const clickedNode = nodes.find(node => 
      x >= node.x && x <= node.x + 100 && 
      y >= node.y && y <= node.y + 50
    );

    setSelectedNode(clickedNode);
    if (clickedNode) {
      setShowNodeProperties(true);
    } else {
      setShowNodeProperties(false);
    }
  };

  // התחלת גרירה
  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    if (selectedTool === 'select') {
      setIsDragging(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const node = nodes.find(n => n.id === nodeId);
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
      setSelectedNode(node);
    }
  };

  // גרירת צומת
  const handleMouseMove = (e) => {
    if (isDragging && selectedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      setNodes(prev => prev.map(node => 
        node.id === selectedNode.id 
          ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
          : node
      ));
    }
  };

  // סיום גרירה
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedNode, dragOffset]);

  // רכיב תכונות צומת
  const NodePropertiesPanel = () => {
    if (!showNodeProperties || !selectedNode) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border rounded-lg p-4 w-80`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">תכונות צומת</h3>
          <button 
            onClick={() => setShowNodeProperties(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              תווית
            </label>
            <input
              type="text"
              value={selectedNode.label}
              onChange={(e) => {
                const updatedNodes = nodes.map(node => 
                  node.id === selectedNode.id ? { ...node, label: e.target.value } : node
                );
                setNodes(updatedNodes);
                setSelectedNode({ ...selectedNode, label: e.target.value });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {selectedNode.type === 'message' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                תוכן הודעה
              </label>
              <textarea
                value={selectedNode.properties?.message || ''}
                onChange={(e) => {
                  const updatedNodes = nodes.map(node => 
                    node.id === selectedNode.id 
                      ? { ...node, properties: { ...node.properties, message: e.target.value } }
                      : node
                  );
                  setNodes(updatedNodes);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-20"
                placeholder="הכנס את תוכן הודעה..."
              />
            </div>
          )}

          {selectedNode.type === 'queue' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                זמן המתנה מקסימלי (שניות)
              </label>
              <input
                type="number"
                value={selectedNode.properties?.timeout || 30}
                onChange={(e) => {
                  const updatedNodes = nodes.map(node => 
                    node.id === selectedNode.id 
                      ? { ...node, properties: { ...node.properties, timeout: parseInt(e.target.value) } }
                      : node
                  );
                  setNodes(updatedNodes);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => {
                setNodes(prev => prev.filter(node => node.id !== selectedNode.id));
                setShowNodeProperties(false);
                setSelectedNode(null);
              }}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              מחק
            </button>
            <button
              onClick={() => {
                const newNode = { 
                  ...selectedNode, 
                  id: `node_${Date.now()}`, 
                  x: selectedNode.x + 120, 
                  y: selectedNode.y 
                };
                setNodes(prev => [...prev, newNode]);
              }}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Copy className="w-4 h-4 mr-1" />
              שכפל
            </button>
          </div>
        </div>
      </div>
    );
  };

  // רכיב טולבר
  const Toolbar = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border rounded-lg p-3 mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Save className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">מעצב זרימות שיחות</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            צור ועדכן זרימות שיחות אינטראקטיביות עם כלים חזותיים
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* פאנל כלים */}
        <div className="xl:col-span-1">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border`}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">כלי צורות</h3>
            
            <div className="space-y-2 mb-6">
              <button
                onClick={() => setSelectedTool('select')}
                className={`w-full p-2 text-right rounded-lg ${selectedTool === 'select' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                בחירה וגרירה
              </button>
              
              {Object.entries(nodeTypes).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedTool(type)}
                  className={`w-full p-2 text-right rounded-lg flex items-center ${
                    selectedTool === type 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <config.icon className="w-4 h-4 ml-2" />
                  {config.name}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">זרימות מוכנות</h3>
            <div className="space-y-2">
              {predefinedFlows.map(flow => (
                <div key={flow.id} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{flow.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{flow.description}</p>
                  <button
                    onClick={() => {
                      setNodes(flow.nodes);
                      setFlowName(flow.name);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                  >
                    טען זרימה
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* אזור הקנבס */}
        <div className="xl:col-span-3">
          <Toolbar />
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border overflow-hidden`}>
            <div
              ref={canvasRef}
              className="relative bg-gray-50 dark:bg-gray-900 cursor-crosshair"
              style={{ width: '100%', height: '600px' }}
              onClick={handleCanvasClick}
            >
              {/* רשת רקע */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              ></div>

              {/* קווי חיבור */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((connection, index) => {
                  const fromNode = nodes.find(n => n.id === connection.from);
                  const toNode = nodes.find(n => n.id === connection.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <line
                      key={index}
                      x1={fromNode.x + 50}
                      y1={fromNode.y + 25}
                      x2={toNode.x + 50}
                      y2={toNode.y + 25}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                  </marker>
                </defs>
              </svg>

              {/* צמתים */}
              {nodes.map((node) => {
                const NodeIcon = nodeTypes[node.type].icon;
                const isSelected = selectedNode?.id === node.id;
                
                return (
                  <div
                    key={node.id}
                    className={`absolute cursor-move select-none ${
                      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                    }`}
                    style={{ left: node.x, top: node.y }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                  >
                    <div className={`
                      ${nodeTypes[node.type].color} 
                      ${nodeTypes[node.type].shape === 'circle' ? 'rounded-full' : 'rounded-lg'} 
                      ${nodeTypes[node.type].shape === 'diamond' ? 'transform rotate-45' : ''} 
                      p-3 shadow-md border-2 border-white flex items-center justify-center
                      w-24 h-12 transition-all duration-200 hover:shadow-lg
                    `}>
                      <NodeIcon className={`w-5 h-5 ${nodeTypes[node.type].shape === 'diamond' ? 'transform -rotate-45' : ''}`} />
                    </div>
                    <div className={`
                      text-center mt-1 text-xs font-medium text-gray-700 dark:text-gray-300 
                      bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm border
                      ${nodeTypes[node.type].shape === 'diamond' ? 'transform translate-x-2' : ''}
                    `}>
                      {node.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* פאנל תכונות */}
        <div className="xl:col-span-1">
          <NodePropertiesPanel />
          
          {/* סטטיסטיקות זרימה */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border mt-4`}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">סטטיסטיקות</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">צמתים:</span>
                <span className="font-medium text-gray-900 dark:text-white">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">חיבורים:</span>
                <span className="font-medium text-gray-900 dark:text-white">{connections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">מורכבות:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {nodes.length < 3 ? 'פשוט' : nodes.length < 8 ? 'בינוני' : 'מתקדם'}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
              הפעל זרימה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallFlowCanvas;