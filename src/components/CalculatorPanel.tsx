import React, { useState, useRef, useEffect } from 'react';
import { Calculator, History, Trash2, Copy, Check, AlertCircle, Zap } from 'lucide-react';
import { MathEngine } from '../utils/mathEngine';
import { HistoryItem } from '../types/math';
import { MathDisplay } from './MathDisplay';
import { HistoryPanel } from './HistoryPanel';
import { KeypadButton } from './KeypadButton';

export const CalculatorPanel: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mathEngine = new MathEngine();

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const handleCalculate = () => {
    if (!expression.trim()) return;

    try {
      setError('');
      const calculatedResult = mathEngine.evaluate(expression);
      const newResult = calculatedResult.toString();
      setResult(newResult);

      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: newResult,
        timestamp: new Date(),
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 49)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid expression');
      setResult('');
    }
  };

  const handleKeyPress = (key: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newExpression = expression.slice(0, start) + key + expression.slice(end);
    
    setExpression(newExpression);
    
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + key.length, start + key.length);
    }, 0);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
    setError('');
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    if (start === end && start > 0) {
      const newExpression = expression.slice(0, start - 1) + expression.slice(start);
      setExpression(newExpression);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start - 1, start - 1);
      }, 0);
    } else if (start !== end) {
      const newExpression = expression.slice(0, start) + expression.slice(end);
      setExpression(newExpression);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start, start);
      }, 0);
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

  const handleHistorySelect = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setError('');
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  const keypadButtons = [
    ['(', ')', 'C', '⌫'],
    ['sin', 'cos', 'tan', '÷'],
    ['ln', 'log', '^', '×'],
    ['√', 'π', 'e', '-'],
    ['7', '8', '9', '+'],
    ['4', '5', '6', '.'],
    ['1', '2', '3', '='],
    ['0', '00', 'Ans', '='],
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Advanced Calculator</h2>
        <p className="text-slate-300">Perform complex mathematical calculations with ease</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
            {/* Display */}
            <div className="mb-6">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Expression
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCalculate();
                      } else if (e.key === 'Escape') {
                        handleClear();
                      }
                    }}
                    className="w-full bg-transparent text-white text-xl font-mono border-none outline-none placeholder-slate-400"
                    placeholder="Enter mathematical expression..."
                  />
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                {result && !error && (
                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          Result
                        </label>
                        <MathDisplay value={result} className="text-2xl font-bold text-green-400" />
                      </div>
                      <button
                        onClick={handleCopyResult}
                        className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                        title="Copy result"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2">
              {keypadButtons.flat().map((button, index) => (
                <KeypadButton
                  key={index}
                  value={button}
                  onClick={() => {
                    if (button === '=') {
                      handleCalculate();
                    } else if (button === 'C') {
                      handleClear();
                    } else if (button === '⌫') {
                      handleBackspace();
                    } else if (button === 'Ans' && result) {
                      handleKeyPress(result);
                    } else if (button !== 'Ans') {
                      let keyToInsert = button;
                      if (button === '×') keyToInsert = '*';
                      else if (button === '÷') keyToInsert = '/';
                      else if (button === 'π') keyToInsert = 'pi';
                      else if (button === '√') keyToInsert = 'sqrt(';
                      else if (button === '^') keyToInsert = '^';
                      else if (['sin', 'cos', 'tan', 'ln', 'log'].includes(button)) {
                        keyToInsert = button + '(';
                      }
                      handleKeyPress(keyToInsert);
                    }
                  }}
                  className={
                    button === '=' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                    button === 'C' ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' :
                    ['÷', '×', '-', '+', '^', '√'].includes(button) ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700' :
                    ['sin', 'cos', 'tan', 'ln', 'log', 'π', 'e'].includes(button) ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700' :
                    'bg-slate-700 hover:bg-slate-600'
                  }
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <Zap className="w-5 h-5" />
                Calculate
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <History className="w-5 h-5" />
                History
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <HistoryPanel
            history={history}
            isVisible={showHistory}
            onSelect={handleHistorySelect}
            onClear={clearHistory}
          />
        </div>
      </div>
    </div>
  );
};