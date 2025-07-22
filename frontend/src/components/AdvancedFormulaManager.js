import React, { useState, useEffect } from 'react';
import { 
  Scale, Palette, Calculator, AlertCircle, CheckCircle, 
  Plus, Minus, Save, Camera, Clock, DollarSign, TrendingUp,
  Eye, Droplets, Target, Award, Zap
} from 'lucide-react';

const AdvancedFormulaManager = ({ user, colorDatabase }) => {
  const [activeFormula, setActiveFormula] = useState(null);
  const [scaleConnected, setScaleConnected] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [formulas, setFormulas] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);

  // Formula state
  const [formula, setFormula] = useState({
    formula_name: '',
    client_id: '',
    colors_used: [],
    developer: {
      vol: '20vol',
      amount_ml: 60,
      actual_amount_ml: 0
    },
    mixing_ratio: '1:1',
    processing_time_minutes: 35,
    service_price: 0,
    notes: ''
  });

  const [measurements, setMeasurements] = useState({});
  const [liveCostAnalysis, setLiveCostAnalysis] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Load clients
      const clientsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/clients`, { headers });
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        setClients(clientsData.clients || []);
      }

      // Load recent formulas
      const formulasResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/formulas?limit=10`, { headers });
      if (formulasResponse.ok) {
        const formulasData = await formulasResponse.json();
        setFormulas(formulasData.formulas || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const connectScale = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/scale/connect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setScaleConnected(true);
        startWeightReading();
      }
    } catch (error) {
      console.error('Error connecting scale:', error);
    }
  };

  const startWeightReading = () => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/scale/reading`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentWeight(data.weight);
        }
      } catch (error) {
        console.error('Error getting weight:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const addColorToFormula = (brand, code) => {
    const colorInfo = findColorInDatabase(brand, code);
    if (!colorInfo) return;

    const newColor = {
      brand,
      code,
      name: colorInfo.name,
      price: colorInfo.price,
      planned_weight: 30, // Default 30g
      actual_weight: 0
    };

    setFormula(prev => ({
      ...prev,
      colors_used: [...prev.colors_used, newColor]
    }));
  };

  const updateColorWeight = (index, field, value) => {
    setFormula(prev => ({
      ...prev,
      colors_used: prev.colors_used.map((color, i) => 
        i === index ? { ...color, [field]: parseFloat(value) || 0 } : color
      )
    }));
  };

  const removeColorFromFormula = (index) => {
    setFormula(prev => ({
      ...prev,
      colors_used: prev.colors_used.filter((_, i) => i !== index)
    }));
  };

  const findColorInDatabase = (brand, code) => {
    if (!colorDatabase[brand]) return null;
    
    for (const seriesKey in colorDatabase[brand].series) {
      const series = colorDatabase[brand].series[seriesKey];
      const color = series.colors.find(c => c.code === code);
      if (color) return color;
    }
    return null;
  };

  const calculateRealTimeCost = () => {
    let colorCost = 0;
    let totalPlannedWeight = 0;
    let totalActualWeight = 0;

    formula.colors_used.forEach(color => {
      const costPerGram = color.price / 60; // 60g tube
      colorCost += color.actual_weight * costPerGram;
      totalPlannedWeight += color.planned_weight;
      totalActualWeight += color.actual_weight;
    });

    const developerCost = formula.developer.actual_amount_ml * 0.05; // 5 agorot per ml
    const totalMaterialCost = colorCost + developerCost;
    const wasteGrams = Math.max(0, totalPlannedWeight - totalActualWeight);
    const wastePercentage = totalPlannedWeight > 0 ? (wasteGrams / totalPlannedWeight) * 100 : 0;
    const efficiencyScore = Math.max(0, 100 - wastePercentage);
    const profitMargin = formula.service_price > 0 ? 
      ((formula.service_price - totalMaterialCost) / formula.service_price) * 100 : 0;

    return {
      colorCost: colorCost.toFixed(2),
      developerCost: developerCost.toFixed(2),
      totalMaterialCost: totalMaterialCost.toFixed(2),
      wasteGrams: wasteGrams.toFixed(2),
      wastePercentage: wastePercentage.toFixed(1),
      efficiencyScore: efficiencyScore.toFixed(1),
      profitMargin: profitMargin.toFixed(1)
    };
  };

  const saveFormula = async () => {
    try {
      const token = localStorage.getItem('token');
      const formulaCostAnalysis = calculateRealTimeCost();
      
      const formulaData = {
        ...formula,
        cost_breakdown: {
          color_cost: parseFloat(formulaCostAnalysis.colorCost),
          developer_cost: parseFloat(formulaCostAnalysis.developerCost),
          total_material_cost: parseFloat(formulaCostAnalysis.totalMaterialCost),
          waste_cost: 0
        },
        waste_percentage: parseFloat(formulaCostAnalysis.wastePercentage),
        efficiency_score: parseFloat(formulaCostAnalysis.efficiencyScore),
        profit_margin: parseFloat(formulaCostAnalysis.profitMargin)
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/professional/formulas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulaData)
      });

      if (response.ok) {
        alert('פורמולה נשמרה בהצלחה!');
        setFormula({
          formula_name: '',
          client_id: '',
          colors_used: [],
          developer: { vol: '20vol', amount_ml: 60, actual_amount_ml: 0 },
          mixing_ratio: '1:1',
          processing_time_minutes: 35,
          service_price: 0,
          notes: ''
        });
        loadData();
      }
    } catch (error) {
      console.error('Error saving formula:', error);
      alert('שגיאה בשמירת הפורמולה');
    }
  };

  const measureComponent = (index, componentType) => {
    setMeasurements(prev => ({
      ...prev,
      [`${componentType}_${index}`]: currentWeight
    }));

    if (componentType === 'color') {
      updateColorWeight(index, 'actual_weight', currentWeight);
    } else if (componentType === 'developer') {
      setFormula(prev => ({
        ...prev,
        developer: { ...prev.developer, actual_amount_ml: currentWeight }
      }));
    }
  };

  const costAnalysis = calculateRealTimeCost();

  return (
    <div className="space-y-6">
      {/* Header with Scale Connection */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-7 h-7 text-purple-500" />
            מנהל פורמולות מתקדם
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Scale Connection */}
            <div className="flex items-center gap-2">
              <button
                onClick={connectScale}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  scaleConnected 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <Scale className="w-4 h-4" />
                {scaleConnected ? 'משקל מחובר' : 'חבר משקל'}
              </button>
              
              {scaleConnected && (
                <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                  <div className="text-sm font-semibold text-green-800">
                    משקל: {currentWeight}g
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            בחר לקוח
          </label>
          <select
            value={formula.client_id}
            onChange={(e) => setFormula(prev => ({ ...prev, client_id: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
          >
            <option value="">בחר לקוח...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.personal_info?.full_name || client.name || 'לקוח'}
              </option>
            ))}
          </select>
        </div>

        {/* Formula Name and Service Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם הפורמולה
            </label>
            <input
              type="text"
              value={formula.formula_name}
              onChange={(e) => setFormula(prev => ({ ...prev, formula_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="למשל: בלונד זהוב לשרה"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מחיר שירות (₪)
            </label>
            <input
              type="number"
              value={formula.service_price}
              onChange={(e) => setFormula(prev => ({ ...prev, service_price: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="380"
            />
          </div>
        </div>
      </div>

      {/* Color Selection and Mixing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors Used */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            צבעים בשימוש
          </h3>

          <div className="space-y-4 mb-6">
            {formula.colors_used.map((color, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: findColorInDatabase(color.brand, color.code)?.hex }}
                    />
                    <div>
                      <div className="font-semibold">{color.brand} {color.code}</div>
                      <div className="text-sm text-gray-600">{color.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeColorFromFormula(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      משקל מתוכנן (גרם)
                    </label>
                    <input
                      type="number"
                      value={color.planned_weight}
                      onChange={(e) => updateColorWeight(index, 'planned_weight', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      משקל בפועל (גרם)
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={color.actual_weight}
                        onChange={(e) => updateColorWeight(index, 'actual_weight', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                      />
                      {scaleConnected && (
                        <button
                          onClick={() => measureComponent(index, 'color')}
                          className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                        >
                          מדוד
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  עלות: ₪{((color.actual_weight * color.price) / 60).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Add Color Button */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">הוסף צבע:</h4>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {Object.entries(colorDatabase).map(([brandKey, brand]) =>
                Object.entries(brand.series).map(([seriesKey, series]) =>
                  series.colors.slice(0, 6).map(color => (
                    <button
                      key={`${brandKey}-${color.code}`}
                      onClick={() => addColorToFormula(brandKey, color.code)}
                      className="flex items-center gap-2 p-2 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.code}</span>
                    </button>
                  ))
                )
              )}
            </div>
          </div>

          {/* Developer */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">מפתח</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">נפח</label>
                <select
                  value={formula.developer.vol}
                  onChange={(e) => setFormula(prev => ({
                    ...prev,
                    developer: { ...prev.developer, vol: e.target.value }
                  }))}
                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded"
                >
                  <option value="10vol">10vol</option>
                  <option value="20vol">20vol</option>
                  <option value="30vol">30vol</option>
                  <option value="40vol">40vol</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">כמות מתוכננת (מל)</label>
                <input
                  type="number"
                  value={formula.developer.amount_ml}
                  onChange={(e) => setFormula(prev => ({
                    ...prev,
                    developer: { ...prev.developer, amount_ml: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">כמות בפועל</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={formula.developer.actual_amount_ml}
                    onChange={(e) => setFormula(prev => ({
                      ...prev,
                      developer: { ...prev.developer, actual_amount_ml: parseFloat(e.target.value) || 0 }
                    }))}
                    className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded"
                  />
                  {scaleConnected && (
                    <button
                      onClick={() => measureComponent(0, 'developer')}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      מדוד
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-500" />
            ניתוח עלויות בזמן אמת
          </h3>

          <div className="space-y-4">
            {/* Cost Breakdown */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">פירוט עלויות</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>עלות צבעים:</span>
                  <span className="font-medium">₪{costAnalysis.colorCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>עלות מפתח:</span>
                  <span className="font-medium">₪{costAnalysis.developerCost}</span>
                </div>
                <div className="flex justify-between border-t border-green-300 pt-2 font-semibold">
                  <span>סה"כ חומרים:</span>
                  <span>₪{costAnalysis.totalMaterialCost}</span>
                </div>
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3">מדדי יעילות</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>יעילות</span>
                    <span className="font-medium">{costAnalysis.efficiencyScore}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, costAnalysis.efficiencyScore)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>בזבוז</span>
                    <span className="font-medium">{costAnalysis.wastePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        parseFloat(costAnalysis.wastePercentage) > 10 ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, costAnalysis.wastePercentage)}%` }}
                    ></div>
                  </div>
                </div>

                {formula.service_price > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>רווח גולמי</span>
                      <span className="font-medium">{costAnalysis.profitMargin}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, costAnalysis.profitMargin))}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Score */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">ציון ביצועים</div>
                  <div className="text-2xl font-bold">
                    {Math.round((parseFloat(costAnalysis.efficiencyScore) + Math.max(0, parseFloat(costAnalysis.profitMargin))) / 2)}
                  </div>
                </div>
                <Award className="w-8 h-8 opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Settings and Save */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              יחס ערבוב
            </label>
            <select
              value={formula.mixing_ratio}
              onChange={(e) => setFormula(prev => ({ ...prev, mixing_ratio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="1:1">1:1</option>
              <option value="1:1.5">1:1.5</option>
              <option value="1:2">1:2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              זמן פעולה (דקות)
            </label>
            <input
              type="number"
              value={formula.processing_time_minutes}
              onChange={(e) => setFormula(prev => ({ ...prev, processing_time_minutes: parseInt(e.target.value) || 35 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הערות
          </label>
          <textarea
            value={formula.notes}
            onChange={(e) => setFormula(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            placeholder="הערות נוספות על הפורמולה..."
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setFormula({
              formula_name: '',
              client_id: '',
              colors_used: [],
              developer: { vol: '20vol', amount_ml: 60, actual_amount_ml: 0 },
              mixing_ratio: '1:1',
              processing_time_minutes: 35,
              service_price: 0,
              notes: ''
            })}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            נקה הכל
          </button>
          <button
            onClick={saveFormula}
            disabled={!formula.formula_name || !formula.client_id || formula.colors_used.length === 0}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            שמור פורמולה
          </button>
        </div>
      </div>

      {/* Recent Formulas */}
      {formulas.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">פורמולות אחרונות</h3>
          <div className="space-y-3">
            {formulas.slice(0, 5).map((f, index) => (
              <div key={f.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{f.formula_name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(f.created_at).toLocaleDateString('he-IL')} • 
                    יעילות: {f.efficiency_score?.toFixed(1)}% • 
                    עלות: ₪{f.cost_breakdown?.total_material_cost?.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (f.efficiency_score || 0) > 90 ? 'bg-green-100 text-green-800' :
                    (f.efficiency_score || 0) > 75 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(f.efficiency_score || 0) > 90 ? 'מעולה' :
                     (f.efficiency_score || 0) > 75 ? 'טוב' : 'צריך שיפור'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFormulaManager;