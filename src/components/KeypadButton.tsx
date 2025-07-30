import React from 'react';

interface KeypadButtonProps {
  value: string;
  onClick: () => void;
  className?: string;
}

export const KeypadButton: React.FC<KeypadButtonProps> = ({
  value,
  onClick,
  className = '',
}) => {
  const getButtonContent = (val: string) => {
    switch (val) {
      case '⌫':
        return '⌫';
      case '√':
        return '√';
      case 'π':
        return 'π';
      case '÷':
        return '÷';
      case '×':
        return '×';
      default:
        return val;
    }
  };

  const baseClasses = `
    h-12 rounded-lg font-semibold text-white transition-all duration-200 
    active:scale-95 shadow-lg border border-white/10
    ${className || 'bg-slate-700 hover:bg-slate-600'}
  `;

  return (
    <button
      onClick={onClick}
      className={baseClasses}
      type="button"
    >
      {getButtonContent(value)}
    </button>
  );
};