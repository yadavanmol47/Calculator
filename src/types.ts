export type CalculatorMode = 'standard' | 'scientific' | 'programmer';
export type AngleUnit = 'deg' | 'rad';

export interface StepItem {
  stepNumber: number;
  description: string;
  expression: string;
  result?: string | number;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: number | string;
  angleUnit: 'deg' | 'rad';
  timestamp: number;
}

export interface ConstantItem {
  symbol: string;
  name: string;
  value: number;
  category: 'Math' | 'Physics';
  unit?: string;
  description: string;
}

export interface BaseConvertResult {
  dec: string;
  hex: string;
  oct: string;
  bin: string;
  bits: number;
  signed32: number;
  unsigned32: number;
}

export interface NestHealthStatus {
  status: string;
  framework: string;
  service: string;
  timestamp: string;
  uptime: number;
  latencyMs?: number;
}
