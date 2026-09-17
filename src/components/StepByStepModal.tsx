import React from 'react';
import { X, CheckCircle, ArrowDown } from 'lucide-react';
import { StepItem } from '../types.ts';

interface StepByStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  expression: string;
  result: string;
  steps: StepItem[];
}

export const StepByStepModal: React.FC<StepByStepModalProps> = ({
  isOpen,
  onClose,
  expression,
  result,
  steps,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="step-by-step-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="step-by-step-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-1.5 text-amber-300">
              <span>NestJS Backend Evaluation Trace</span>
            </h3>
            <p className="text-xs text-stone-400 font-mono mt-0.5 truncate max-w-xs sm:max-w-md">
              {expression}
            </p>
          </div>
          <button
            id="close-steps-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps sequence */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div
                key={step.stepNumber}
                id={`calc-step-${step.stepNumber}`}
                className={`p-3 rounded-xl border transition-all ${
                  isLast
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-stone-700">
                    Step {step.stepNumber}: {step.description}
                  </span>
                  {isLast && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      Result
                    </span>
                  )}
                </div>

                <div className="font-mono text-sm text-stone-900 bg-stone-100/70 px-2.5 py-1.5 rounded-lg border border-stone-200/80 break-all">
                  {step.result ? (
                    <span className="font-bold text-amber-900">= {step.result}</span>
                  ) : (
                    <span>{step.expression}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span>Engine: <strong className="text-stone-800 font-mono">NestJS CalculatorService</strong></span>
          <button
            id="done-steps-modal-btn"
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
