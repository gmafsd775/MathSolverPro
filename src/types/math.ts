export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface MathFunction {
  name: string;
  description: string;
  example: string;
}

export interface MathConstant {
  name: string;
  value: number;
  description: string;
}