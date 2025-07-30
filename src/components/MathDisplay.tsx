import React from 'react';

interface MathDisplayProps {
  value: string;
  className?: string;
}

export const MathDisplay: React.FC<MathDisplayProps> = ({ value, className = '' }) => {
  const formatNumber = (num: string): string => {
    const parsed = parseFloat(num);
    
    // Handle very large or very small numbers with scientific notation
    if (Math.abs(parsed) >= 1e10 || (Math.abs(parsed) < 1e-6 && parsed !== 0)) {
      return parsed.toExponential(6);
    }
    
    // Handle regular numbers with appropriate decimal places
    if (parsed % 1 === 0) {
      return parsed.toString();
    }
    
    // Limit decimal places for display
    return parsed.toPrecision(12).replace(/\.?0+$/, '');
  };

  const displayValue = isNaN(parseFloat(value)) ? value : formatNumber(value);

  return (
    <div className={`font-mono select-all ${className}`}>
      {displayValue}
    </div>
  );
};