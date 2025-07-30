import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Play, Trash2, Eye, EyeOff } from 'lucide-react';

interface Function {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

export const GraphPlotter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [newFunction, setNewFunction] = useState('');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    drawGraph();
  }, [functions, xMin, xMax, yMin, yMax]);

  const addFunction = () => {
    if (!newFunction.trim()) return;

    const newFunc: Function = {
      id: Date.now().toString(),
      expression: newFunction,
      color: colors[functions.length % colors.length],
      visible: true,
    };

    setFunctions(prev => [...prev, newFunc]);
    setNewFunction('');
  };

  const removeFunction = (id: string) => {
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const toggleFunction = (id: string) => {
    setFunctions(prev => prev.map(f => 
      f.id === id ? { ...f, visible: !f.visible } : f
    ));
  };

  const evaluateFunction = (expression: string, x: number): number => {
    try {
      // Simple function evaluator - replace x with the value
      let expr = expression.toLowerCase();
      
      // Replace common functions
      expr = expr.replace(/sin\(/g, 'Math.sin(');
      expr = expr.replace(/cos\(/g, 'Math.cos(');
      expr = expr.replace(/tan\(/g, 'Math.tan(');
      expr = expr.replace(/log\(/g, 'Math.log10(');
      expr = expr.replace(/ln\(/g, 'Math.log(');
      expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
      expr = expr.replace(/abs\(/g, 'Math.abs(');
      expr = expr.replace(/\^/g, '**');
      expr = expr.replace(/pi/g, 'Math.PI');
      expr = expr.replace(/e(?![a-z])/g, 'Math.E');
      
      // Replace x with the actual value
      expr = expr.replace(/x/g, `(${x})`);
      
      // Evaluate the expression
      return eval(expr);
    } catch (error) {
      return NaN;
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    const xStep = (xMax - xMin) / 20;
    const yStep = (yMax - yMin) / 20;

    // Vertical grid lines
    for (let x = xMin; x <= xMax; x += xStep) {
      const canvasX = ((x - xMin) / (xMax - xMin)) * width;
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = yMin; y <= yMax; y += yStep) {
      const canvasY = height - ((y - yMin) / (yMax - yMin)) * height;
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(width, canvasY);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;

    // X-axis
    if (yMin <= 0 && yMax >= 0) {
      const y0 = height - ((0 - yMin) / (yMax - yMin)) * height;
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(width, y0);
      ctx.stroke();
    }

    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
      const x0 = ((0 - xMin) / (xMax - xMin)) * width;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, height);
      ctx.stroke();
    }

    // Draw functions
    functions.forEach(func => {
      if (!func.visible) return;

      ctx.strokeStyle = func.color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      let firstPoint = true;
      const step = (xMax - xMin) / width;

      for (let x = xMin; x <= xMax; x += step) {
        const y = evaluateFunction(func.expression, x);
        
        if (!isNaN(y) && isFinite(y)) {
          const canvasX = ((x - xMin) / (xMax - xMin)) * width;
          const canvasY = height - ((y - yMin) / (yMax - yMin)) * height;

          if (firstPoint) {
            ctx.moveTo(canvasX, canvasY);
            firstPoint = false;
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        } else {
          firstPoint = true;
        }
      }

      ctx.stroke();
    });

    // Draw axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';

    // X-axis labels
    if (yMin <= 0 && yMax >= 0) {
      const y0 = height - ((0 - yMin) / (yMax - yMin)) * height;
      for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        if (x !== 0) {
          const canvasX = ((x - xMin) / (xMax - xMin)) * width;
          ctx.fillText(x.toString(), canvasX, y0 + 15);
        }
      }
    }

    // Y-axis labels
    if (xMin <= 0 && xMax >= 0) {
      const x0 = ((0 - xMin) / (xMax - xMin)) * width;
      ctx.textAlign = 'left';
      for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        if (y !== 0) {
          const canvasY = height - ((y - yMin) / (yMax - yMin)) * height;
          ctx.fillText(y.toString(), x0 + 5, canvasY - 5);
        }
      }
    }
  };

  const presetFunctions = [
    'x^2',
    'sin(x)',
    'cos(x)',
    'x^3 - 3*x',
    'sqrt(x)',
    'log(x)',
    '1/x',
    'abs(x)'
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Function Grapher</h2>
        <p className="text-slate-300">Visualize mathematical functions with interactive graphs</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add Function */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Add Function
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Function f(x) =
                </label>
                <input
                  type="text"
                  value={newFunction}
                  onChange={(e) => setNewFunction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addFunction()}
                  placeholder="e.g., x^2, sin(x), x^3-2*x"
                  className="w-full bg-slate-800/50 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none font-mono"
                />
              </div>

              <button
                onClick={addFunction}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Plot Function
              </button>

              <div>
                <p className="text-sm text-slate-300 mb-2">Quick examples:</p>
                <div className="grid grid-cols-2 gap-2">
                  {presetFunctions.map((func, index) => (
                    <button
                      key={index}
                      onClick={() => setNewFunction(func)}
                      className="text-left text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors font-mono"
                    >
                      {func}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Viewport Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Viewport</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">X Min</label>
                <input
                  type="number"
                  value={xMin}
                  onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
                  className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">X Max</label>
                <input
                  type="number"
                  value={xMax}
                  onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
                  className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Y Min</label>
                <input
                  type="number"
                  value={yMin}
                  onChange={(e) => setYMin(parseFloat(e.target.value) || -10)}
                  className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Y Max</label>
                <input
                  type="number"
                  value={yMax}
                  onChange={(e) => setYMax(parseFloat(e.target.value) || 10)}
                  className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Function List */}
          {functions.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Functions</h3>
              
              <div className="space-y-3">
                {functions.map((func) => (
                  <div key={func.id} className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: func.color }}
                    />
                    <span className="flex-1 text-white font-mono text-sm">
                      f(x) = {func.expression}
                    </span>
                    <button
                      onClick={() => toggleFunction(func.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {func.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => removeFunction(func.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Graph Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Graph</h3>
            
            <div className="bg-slate-800 rounded-xl p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto border border-slate-600 rounded-lg"
              />
            </div>

            <div className="mt-4 text-sm text-slate-400">
              <p>Supported functions: sin, cos, tan, log, ln, sqrt, abs, ^, pi, e</p>
              <p>Use * for multiplication (e.g., 2*x instead of 2x)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};