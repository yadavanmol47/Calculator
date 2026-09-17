import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';

interface KeypadStandardProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onEvaluate: () => void;
  onMemoryAction: (action: 'add' | 'subtract' | 'store' | 'clear' | 'recall') => void;
  hasMemory: boolean;
}

export const KeypadStandard: React.FC<KeypadStandardProps> = ({
  onInput,
  onClear,
  onBackspace,
  onToggleSign,
  onPercent,
  onEvaluate,
  onMemoryAction,
  hasMemory,
}) => {
  return (
    <div id="standard-keypad" className="flex flex-col gap-2">
      {/* Memory action strip */}
      <div className="grid grid-cols-5 gap-2 text-xs font-mono">
        <button
          id="btn-mem-clear"
          type="button"
          onClick={() => onMemoryAction('clear')}
          disabled={!hasMemory}
          className={`py-1.5 rounded-lg border transition-colors ${
            hasMemory
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              : 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
          }`}
        >
          MC
        </button>
        <button
          id="btn-mem-recall"
          type="button"
          onClick={() => onMemoryAction('recall')}
          disabled={!hasMemory}
          className={`py-1.5 rounded-lg border transition-colors ${
            hasMemory
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300 font-semibold'
              : 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
          }`}
        >
          MR
        </button>
        <button
          id="btn-mem-add"
          type="button"
          onClick={() => onMemoryAction('add')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
        >
          M+
        </button>
        <button
          id="btn-mem-sub"
          type="button"
          onClick={() => onMemoryAction('subtract')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
        >
          M-
        </button>
        <button
          id="btn-mem-store"
          type="button"
          onClick={() => onMemoryAction('store')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
        >
          MS
        </button>
      </div>

      {/* Main Standard Grid: 4 columns */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Row 1 */}
        <button
          id="btn-key-clear"
          type="button"
          onClick={onClear}
          className="h-13 sm:h-14 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 font-medium text-lg border border-rose-200 transition-colors shadow-xs"
        >
          AC
        </button>
        <button
          id="btn-key-paren-open"
          type="button"
          onClick={() => onInput('(')}
          className="h-13 sm:h-14 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 font-medium text-lg border border-stone-200 transition-colors shadow-xs"
        >
          (
        </button>
        <button
          id="btn-key-paren-close"
          type="button"
          onClick={() => onInput(')')}
          className="h-13 sm:h-14 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 font-medium text-lg border border-stone-200 transition-colors shadow-xs"
        >
          )
        </button>
        <button
          id="btn-key-divide"
          type="button"
          onClick={() => onInput(' ÷ ')}
          className="h-13 sm:h-14 rounded-xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 font-semibold text-xl border border-amber-200 transition-colors shadow-xs"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          id="btn-key-7"
          type="button"
          onClick={() => onInput('7')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          7
        </button>
        <button
          id="btn-key-8"
          type="button"
          onClick={() => onInput('8')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          8
        </button>
        <button
          id="btn-key-9"
          type="button"
          onClick={() => onInput('9')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          9
        </button>
        <button
          id="btn-key-multiply"
          type="button"
          onClick={() => onInput(' × ')}
          className="h-13 sm:h-14 rounded-xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 font-semibold text-xl border border-amber-200 transition-colors shadow-xs"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          id="btn-key-4"
          type="button"
          onClick={() => onInput('4')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          4
        </button>
        <button
          id="btn-key-5"
          type="button"
          onClick={() => onInput('5')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          5
        </button>
        <button
          id="btn-key-6"
          type="button"
          onClick={() => onInput('6')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          6
        </button>
        <button
          id="btn-key-subtract"
          type="button"
          onClick={() => onInput(' − ')}
          className="h-13 sm:h-14 rounded-xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 font-semibold text-xl border border-amber-200 transition-colors shadow-xs"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          id="btn-key-1"
          type="button"
          onClick={() => onInput('1')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          1
        </button>
        <button
          id="btn-key-2"
          type="button"
          onClick={() => onInput('2')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          2
        </button>
        <button
          id="btn-key-3"
          type="button"
          onClick={() => onInput('3')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          3
        </button>
        <button
          id="btn-key-add"
          type="button"
          onClick={() => onInput(' + ')}
          className="h-13 sm:h-14 rounded-xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 font-semibold text-xl border border-amber-200 transition-colors shadow-xs"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          id="btn-key-sign"
          type="button"
          onClick={onToggleSign}
          className="h-13 sm:h-14 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-medium text-lg border border-stone-200 transition-colors shadow-xs"
        >
          ±
        </button>
        <button
          id="btn-key-0"
          type="button"
          onClick={() => onInput('0')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          0
        </button>
        <button
          id="btn-key-dot"
          type="button"
          onClick={() => onInput('.')}
          className="h-13 sm:h-14 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-900 font-bold text-xl border border-stone-200/80 transition-colors shadow-xs"
        >
          .
        </button>
        <button
          id="btn-key-equals"
          type="button"
          onClick={onEvaluate}
          className="h-13 sm:h-14 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-bold text-2xl border border-stone-900 transition-colors shadow-sm"
        >
          =
        </button>
      </div>
    </div>
  );
};
