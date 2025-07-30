import React, { useState, useRef, useEffect } from 'react';
import { Calculator, TrendingUp, BookOpen, Settings, Menu, X, Zap, History, Copy, Check } from 'lucide-react';
import { MathEngine } from './utils/mathEngine';
import { EquationSolver } from './utils/equationSolver';
import { GraphPlotter } from './components/GraphPlotter';
import { EquationSolverPanel } from './components/EquationSolverPanel';
import { MathReference } from './components/MathReference';
import { CalculatorPanel } from './components/CalculatorPanel';

type ActiveTab = 'calculator' | 'solver' | 'grapher' | 'reference';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const mathEngine = new MathEngine();
  const equationSolver = new EquationSolver();

  const handleCalculate = () => {
    if (!expression.trim()) return;

    try {
      setError('');
      const calculatedResult = mathEngine.evaluate(expression);
      setResult(calculatedResult.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid expression');
      setResult('');
    }
  };

  const handleCopyResult = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const tabs = [
    { id: 'calculator' as const, name: 'Calculator', icon: Calculator },
    { id: 'solver' as const, name: 'Equation Solver', icon: Zap },
    { id: 'grapher' as const, name: 'Graph Plotter', icon: TrendingUp },
    { id: 'reference' as const, name: 'Math Reference', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MathSolver Pro</h1>
                <p className="text-sm text-slate-300">Advanced Mathematical Computing</p>
              </div>
            </div>
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black/30 backdrop-blur-lg border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2 mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Calculator in Sidebar */}
          <div className="p-4 mt-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-3">Quick Calculate</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                  placeholder="Enter expression..."
                  className="w-full bg-slate-800/50 text-white text-sm px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
                
                {error && (
                  <p className="text-red-400 text-xs">{error}</p>
                )}
                
                {result && !error && (
                  <div className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-lg">
                    <span className="text-green-400 text-sm font-mono">{result}</span>
                    <button
                      onClick={handleCopyResult}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Tab Content */}
            {activeTab === 'calculator' && (
              <CalculatorPanel />
            )}
            
            {activeTab === 'solver' && (
              <EquationSolverPanel equationSolver={equationSolver} />
            )}
            
            {activeTab === 'grapher' && (
              <GraphPlotter />
            )}
            
            {activeTab === 'reference' && (
              <MathReference />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;