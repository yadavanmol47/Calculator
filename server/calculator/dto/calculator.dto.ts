export class EvaluateDto {
  expression!: string;
  angleUnit?: 'deg' | 'rad';
  precision?: number;
}

export class BaseConvertDto {
  value!: string | number;
  fromBase!: 2 | 8 | 10 | 16;
}

export class MemoryActionDto {
  action!: 'add' | 'subtract' | 'store' | 'clear' | 'recall';
  value?: number;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: number | string;
  angleUnit: 'deg' | 'rad';
  timestamp: number;
}

export interface StepItem {
  stepNumber: number;
  description: string;
  expression: string;
  result?: string | number;
}

export interface ConstantItem {
  symbol: string;
  name: string;
  value: number;
  category: 'Math' | 'Physics';
  unit?: string;
  description: string;
}
