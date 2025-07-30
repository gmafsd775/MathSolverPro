import React, { useState } from 'react';
import { BookOpen, Calculator, TrendingUp, Zap, ChevronDown, ChevronRight } from 'lucide-react';

interface ReferenceSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: {
    category: string;
    items: {
      name: string;
      formula: string;
      description: string;
      example?: string;
    }[];
  }[];
}

export const MathReference: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const referenceData: ReferenceSection[] = [
    {
      id: 'basic',
      title: 'Basic Operations',
      icon: Calculator,
      content: [
        {
          category: 'Arithmetic',
          items: [
            { name: 'Addition', formula: 'a + b', description: 'Sum of two numbers' },
            { name: 'Subtraction', formula: 'a - b', description: 'Difference of two numbers' },
            { name: 'Multiplication', formula: 'a × b or a * b', description: 'Product of two numbers' },
            { name: 'Division', formula: 'a ÷ b or a / b', description: 'Quotient of two numbers' },
            { name: 'Exponentiation', formula: 'a^b or a**b', description: 'a raised to the power of b' },
            { name: 'Square Root', formula: '√a or sqrt(a)', description: 'Square root of a' },
          ]
        },
        {
          category: 'Order of Operations (PEMDAS)',
          items: [
            { name: 'Parentheses', formula: '()', description: 'Operations inside parentheses first' },
            { name: 'Exponents', formula: '^', description: 'Powers and roots' },
            { name: 'Multiplication/Division', formula: '×, ÷', description: 'Left to right' },
            { name: 'Addition/Subtraction', formula: '+, -', description: 'Left to right' },
          ]
        }
      ]
    },
    {
      id: 'functions',
      title: 'Mathematical Functions',
      icon: Zap,
      content: [
        {
          category: 'Trigonometric Functions',
          items: [
            { name: 'Sine', formula: 'sin(x)', description: 'Sine of angle x (in radians)', example: 'sin(π/2) = 1' },
            { name: 'Cosine', formula: 'cos(x)', description: 'Cosine of angle x (in radians)', example: 'cos(0) = 1' },
            { name: 'Tangent', formula: 'tan(x)', description: 'Tangent of angle x (in radians)', example: 'tan(π/4) = 1' },
            { name: 'Arcsine', formula: 'asin(x)', description: 'Inverse sine function', example: 'asin(1) = π/2' },
            { name: 'Arccosine', formula: 'acos(x)', description: 'Inverse cosine function', example: 'acos(1) = 0' },
            { name: 'Arctangent', formula: 'atan(x)', description: 'Inverse tangent function', example: 'atan(1) = π/4' },
          ]
        },
        {
          category: 'Logarithmic Functions',
          items: [
            { name: 'Natural Logarithm', formula: 'ln(x)', description: 'Logarithm base e', example: 'ln(e) = 1' },
            { name: 'Common Logarithm', formula: 'log(x)', description: 'Logarithm base 10', example: 'log(100) = 2' },
            { name: 'Binary Logarithm', formula: 'log2(x)', description: 'Logarithm base 2', example: 'log2(8) = 3' },
          ]
        },
        {
          category: 'Other Functions',
          items: [
            { name: 'Absolute Value', formula: 'abs(x)', description: 'Absolute value of x', example: 'abs(-5) = 5' },
            { name: 'Ceiling', formula: 'ceil(x)', description: 'Smallest integer ≥ x', example: 'ceil(3.2) = 4' },
            { name: 'Floor', formula: 'floor(x)', description: 'Largest integer ≤ x', example: 'floor(3.8) = 3' },
            { name: 'Round', formula: 'round(x)', description: 'Round to nearest integer', example: 'round(3.6) = 4' },
            { name: 'Exponential', formula: 'exp(x)', description: 'e raised to the power x', example: 'exp(1) = e' },
          ]
        }
      ]
    },
    {
      id: 'constants',
      title: 'Mathematical Constants',
      icon: BookOpen,
      content: [
        {
          category: 'Common Constants',
          items: [
            { name: 'Pi', formula: 'π or pi', description: 'Ratio of circumference to diameter', example: '≈ 3.14159' },
            { name: 'Euler\'s Number', formula: 'e', description: 'Base of natural logarithm', example: '≈ 2.71828' },
            { name: 'Golden Ratio', formula: 'φ or phi', description: '(1 + √5) / 2', example: '≈ 1.61803' },
          ]
        }
      ]
    },
    {
      id: 'equations',
      title: 'Equation Solving',
      icon: TrendingUp,
      content: [
        {
          category: 'Linear Equations',
          items: [
            { name: 'Standard Form', formula: 'ax + b = c', description: 'Linear equation in one variable' },
            { name: 'Solution', formula: 'x = (c - b) / a', description: 'Solve for x when a ≠ 0' },
          ]
        },
        {
          category: 'Quadratic Equations',
          items: [
            { name: 'Standard Form', formula: 'ax² + bx + c = 0', description: 'Quadratic equation in standard form' },
            { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / (2a)', description: 'General solution formula' },
            { name: 'Discriminant', formula: 'Δ = b² - 4ac', description: 'Determines number of real solutions' },
            { name: 'Vertex Form', formula: 'y = a(x - h)² + k', description: 'Parabola with vertex at (h, k)' },
          ]
        },
        {
          category: 'Solution Types',
          items: [
            { name: 'Two Real Solutions', formula: 'Δ > 0', description: 'Discriminant is positive' },
            { name: 'One Real Solution', formula: 'Δ = 0', description: 'Discriminant is zero (repeated root)' },
            { name: 'No Real Solutions', formula: 'Δ < 0', description: 'Discriminant is negative' },
          ]
        }
      ]
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Math Reference</h2>
        <p className="text-slate-300">Comprehensive reference for mathematical functions and formulas</p>
      </div>

      <div className="space-y-6">
        {referenceData.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6">
                  {section.content.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-6 last:mb-0">
                      <h4 className="text-lg font-semibold text-blue-300 mb-4">{category.category}</h4>
                      
                      <div className="grid gap-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                              <div className="sm:w-1/3">
                                <h5 className="font-semibold text-white mb-1">{item.name}</h5>
                                <code className="text-green-400 bg-slate-900/50 px-2 py-1 rounded text-sm">
                                  {item.formula}
                                </code>
                              </div>
                              
                              <div className="sm:w-2/3">
                                <p className="text-slate-300 text-sm mb-2">{item.description}</p>
                                {item.example && (
                                  <div className="text-xs text-slate-400">
                                    <span className="font-medium">Example: </span>
                                    <code className="bg-slate-900/50 px-1 py-0.5 rounded">{item.example}</code>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Usage Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Usage Tips
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Calculator Input</h4>
            <ul className="space-y-1">
              <li>• Use parentheses for grouping: <code className="bg-slate-800 px-1 rounded">(2+3)*4</code></li>
              <li>• Functions need parentheses: <code className="bg-slate-800 px-1 rounded">sin(x)</code></li>
              <li>• Use * for multiplication: <code className="bg-slate-800 px-1 rounded">2*x</code></li>
              <li>• Use ^ or ** for powers: <code className="bg-slate-800 px-1 rounded">x^2</code></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-2">Equation Solver</h4>
            <ul className="space-y-1">
              <li>• Linear: <code className="bg-slate-800 px-1 rounded">2x + 5 = 11</code></li>
              <li>• Quadratic: Enter coefficients a, b, c</li>
              <li>• Use decimal numbers when needed</li>
              <li>• Check step-by-step solutions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};