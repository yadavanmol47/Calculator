import React, { useState } from 'react';
import { Copy, Check, CornerDownLeft, Delete, Eye, Sparkles } from 'lucide-react';
import { AngleUnit, CalculatorMode } from '../types.ts';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  mode: CalculatorMode;
  angleUnit: AngleUnit;
  hasMemory: boolean;
  isEvaluating: boolean;
  errorMessage: string | null;
  hasSteps: boolean;
  onToggleAngleUnit: () => void;
  onOpenSteps: () => void;
  onClear: () => void;
  onBackspace: () => void;
  lastLatencyMs?: number;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  mode,
  angleUnit,
  hasMemory,
  isEvaluating,
  errorMessage,
  hasSteps,
  onToggleAngleUnit,
  onOpenSteps,
  onClear,
  onBackspace,
  lastLatencyMs,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result || expression || '0';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      id="calculator-display-container"
      className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-md relative select-none flex flex-col justify-between min-h-[160px]"
    >
      {/* Top status & controls row */}
      <div className="flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          {mode === 'scientific' && (
            <button
              id="angle-unit-toggle-btn"
              type="button"
              onClick={onToggleAngleUnit}
              className={`px-2 py-0.5 rounded font-mono font-medium tracking-wide transition-colors ${
                angleUnit === 'deg'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
              title="Click to toggle Degrees / Radians"
            >
              {angleUnit.toUpperCase()}
            </button>
          )}

          {hasMemory && (
            <span
              id="memory-indicator-badge"
              className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono font-semibold"
              title="Memory active (M)"
            >
              M
            </span>
          )}

          <span className="capitalize text-stone-400 font-medium">
            {mode} Mode
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {typeof lastLatencyMs === 'number' && (
            <span className="text-[11px] font-mono text-stone-500 hidden sm:inline" title="NestJS API response time">
              {lastLatencyMs}ms
            </span>
          )}

          {hasSteps && (
            <button
              id="view-steps-btn"
              type="button"
              onClick={onOpenSteps}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="View NestJS step-by-step breakdown"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Steps</span>
            </button>
          )}

          <button
            id="copy-result-btn"
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            title="Copy value"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expression input trail */}
      <div className="my-2 overflow-x-auto overflow-y-hidden text-right whitespace-nowrap scrollbar-none font-mono text-stone-400 text-base min-h-[28px] tracking-wide">
        {expression || <span className="text-stone-600">0</span>}
      </div>

      {/* Main evaluated value / display */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-1">
          {isEvaluating && (
            <span className="text-xs text-amber-400 font-mono animate-pulse">
              Computing via NestJS...
            </span>
          )}
          {errorMessage && (
            <span className="text-xs text-rose-400 font-sans line-clamp-1" title={errorMessage}>
              {errorMessage}
            </span>
          )}
        </div>

        <div
          id="main-result-display"
          className="text-right font-mono font-medium text-3xl sm:text-4xl text-white tracking-tight break-all overflow-x-auto overflow-y-hidden scrollbar-none"
        >
          {result || '0'}
        </div>
      </div>
    </div>
  );
};
