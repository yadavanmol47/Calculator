import {
  AngleUnit,
  BaseConvertResult,
  CalculationHistoryItem,
  ConstantItem,
  NestHealthStatus,
  StepItem,
} from '../types.ts';

const BASE_URL = '/api/calculator';

export interface EvaluateResponse {
  result: number;
  expression: string;
  formattedResult: string;
  angleUnit: AngleUnit;
  steps: StepItem[];
  latencyMs?: number;
}

export const calculatorApi = {
  // Check NestJS health
  async checkHealth(): Promise<NestHealthStatus> {
    const start = performance.now();
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    const data = await res.json();
    const latencyMs = Math.round(performance.now() - start);
    return { ...data, latencyMs };
  },

  // Evaluate formula expression on NestJS
  async evaluate(expression: string, angleUnit: AngleUnit = 'deg'): Promise<EvaluateResponse> {
    const start = performance.now();
    const res = await fetch(`${BASE_URL}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression, angleUnit }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Evaluation failed (${res.status})`);
    }

    const data = await res.json();
    const latencyMs = Math.round(performance.now() - start);
    return { ...data, latencyMs };
  },

  // Base conversion for programmer mode
  async convertBase(value: string | number, fromBase: 2 | 8 | 10 | 16): Promise<BaseConvertResult> {
    const res = await fetch(`${BASE_URL}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, fromBase }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Conversion failed');
    }

    return res.json();
  },

  // History operations
  async getHistory(): Promise<CalculationHistoryItem[]> {
    const res = await fetch(`${BASE_URL}/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    const data = await res.json();
    return data.history || [];
  },

  async clearHistory(): Promise<void> {
    const res = await fetch(`${BASE_URL}/history`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear history');
  },

  async deleteHistoryItem(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/history/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete history item');
  },

  // Memory operations
  async getMemory(): Promise<number> {
    const res = await fetch(`${BASE_URL}/memory`);
    if (!res.ok) throw new Error('Failed to fetch memory');
    const data = await res.json();
    return data.memory ?? 0;
  },

  async handleMemory(action: 'add' | 'subtract' | 'store' | 'clear' | 'recall', value?: number): Promise<{ memory: number; message: string }> {
    const res = await fetch(`${BASE_URL}/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, value }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Memory operation failed');
    }

    return res.json();
  },

  // Constants
  async getConstants(): Promise<ConstantItem[]> {
    const res = await fetch(`${BASE_URL}/constants`);
    if (!res.ok) throw new Error('Failed to fetch constants');
    const data = await res.json();
    return data.constants || [];
  },
};
