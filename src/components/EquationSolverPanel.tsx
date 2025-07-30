import React, { useState } from 'react';
import { Zap, BookOpen, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { EquationSolver } from '../utils/equationSolver';

interface EquationSolverPanelProps {
  equationSolver: EquationSolver;
}

export const EquationSolverPanel: React.FC<EquationSolverPanelProps> = ({ equationSolver }) => {
  const [activeMode, setActiveMode] = useState<'linear' | 'quadratic'>('linear');
  const [linearEquation, setLinearEquation] = useState('');
  const [quadraticA, setQuadraticA] = useState('1');
  const [quadraticB, setQuadraticB] = useState('0');
  const [quadraticC, setQuadraticC] = useState('0');
  const [solution, setSolution] = useState<any>(null);
  const [error, setError] = useState('');

  const solveLinearEquation = () => {
    try {
      setError('');
      const result = equationSolver.solveLinear(linearEquation);
      setSolution(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error solving equation');
      setSolution(null);
    }
  };

  const solveQuadraticEquation = () => {
    try {
      setError('');
      const a = parseFloat(quadraticA);
      const b = parseFloat(quadraticB);
      const c = parseFloat(quadraticC);

      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        throw new Error('Please enter valid numbers for all coefficients');
      }

      if (a === 0) {
        throw new Error('Coefficient "a" cannot be zero for a quadratic equation');
      }

      const result = equationSolver.solveQuadratic(a, b, c);
      const factored = equationSolver.factorQuadratic(a, b, c);
      setSolution({ ...result, factored });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error solving equation');
      setSolution(null);
    }
  };

  const examples = {
    linear: [
      '2x + 5 = 11',
      '3x - 7 = 14',
      'x + 4 = 2x - 3',
      '5x = 25'
    ],
    quadratic: [
      { a: 1, b: -5, c: 6, desc: 'x² - 5x + 6 = 0' },
      { a: 2, b: 4, c: -6, desc: '2x² + 4x - 6 = 0' },
      { a: 1, b: 0, c: -9, desc: 'x² - 9 = 0' },
      { a: 1, b: -4, c: 4, desc: 'x² - 4x + 4 = 0' }
    ]
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Equation Solver</h2>
        <p className="text-slate-300">Solve linear and quadratic equations step by step</p>
      </div>

      {/* Mode Selector */}
      <div className="mb-8">
        <div className="flex bg-slate-800/50 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveMode('linear')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeMode === 'linear'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Linear Equations
          </button>
          <button
            onClick={() => setActiveMode('quadratic')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeMode === 'quadratic'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Quadratic Equations
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {activeMode === 'linear' ? 'Linear Equation Solver' : 'Quadratic Equation Solver'}
          </h3>

          {activeMode === 'linear' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter equation (format: ax + b = c)
                </label>
                <input
                  type="text"
                  value={linearEquation}
                  onChange={(e) => setLinearEquation(e.target.value)}
                  placeholder="e.g., 2x + 5 = 11"
                  className="w-full bg-slate-800/50 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <button
                onClick={solveLinearEquation}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Solve Linear Equation
              </button>

              <div>
                <p className="text-sm text-slate-300 mb-2">Examples:</p>
                <div className="grid grid-cols-2 gap-2">
                  {examples.linear.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setLinearEquation(example)}
                      className="text-left text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Quadratic equation: ax² + bx + c = 0
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">a</label>
                    <input
                      type="number"
                      value={quadraticA}
                      onChange={(e) => setQuadraticA(e.target.value)}
                      className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">b</label>
                    <input
                      type="number"
                      value={quadraticB}
                      onChange={(e) => setQuadraticB(e.target.value)}
                      className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">c</label>
                    <input
                      type="number"
                      value={quadraticC}
                      onChange={(e) => setQuadraticC(e.target.value)}
                      className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={solveQuadraticEquation}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Solve Quadratic Equation
              </button>

              <div>
                <p className="text-sm text-slate-300 mb-2">Examples:</p>
                <div className="space-y-2">
                  {examples.quadratic.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuadraticA(example.a.toString());
                        setQuadraticB(example.b.toString());
                        setQuadraticC(example.c.toString());
                      }}
                      className="w-full text-left text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      {example.desc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Solution Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Solution Steps
          </h3>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {solution && !error && (
            <div className="space-y-4">
              {activeMode === 'linear' ? (
                <div>
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Solution Found!</span>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                    <p className="text-white text-lg font-mono">
                      x = {isFinite(solution.solution) ? solution.solution : 'No unique solution'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Step-by-step solution:</h4>
                    {solution.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 text-slate-300">
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
                          {index + 1}
                        </span>
                        <span className="font-mono">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Solution Found!</span>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                    {solution.solutions.length === 0 ? (
                      <p className="text-white">No real solutions</p>
                    ) : solution.solutions.length === 1 ? (
                      <p className="text-white text-lg font-mono">x = {solution.solutions[0]}</p>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-white text-lg font-mono">x₁ = {solution.solutions[0]}</p>
                        <p className="text-white text-lg font-mono">x₂ = {solution.solutions[1]}</p>
                      </div>
                    )}
                  </div>

                  {solution.factored && (
                    <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-semibold mb-2">Factored form:</h4>
                      <p className="text-green-400 font-mono">{solution.factored}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Step-by-step solution:</h4>
                    {solution.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 text-slate-300">
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
                          {index + 1}
                        </span>
                        <span className="font-mono">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!solution && !error && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">Enter an equation to see the solution steps</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};