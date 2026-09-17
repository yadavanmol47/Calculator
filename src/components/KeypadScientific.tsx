import React, { useState } from 'react';
import { KeypadStandard } from './KeypadStandard.tsx';
import { Atom } from 'lucide-react';

interface KeypadScientificProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onEvaluate: () => void;
  onMemoryAction: (action: 'add' | 'subtract' | 'store' | 'clear' | 'recall') => void;
  hasMemory: boolean;
  onOpenConstants: () => void;
}

export const KeypadScientific: React.FC<KeypadScientificProps> = ({
  onInput,
  onClear,
  onBackspace,
  onToggleSign,
  onPercent,
  onEvaluate,
  onMemoryAction,
  hasMemory,
  onOpenConstants,
}) => {
  const [isInverse, setIsInverse] = useState(false);

  return (
    <div id="scientific-keypad" className="flex flex-col gap-3">
      {/* Scientific Function Grid (5 columns) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-xs font-mono">
        {/* Row 1 */}
        <button
          id="btn-sci-2nd"
          type="button"
          onClick={() => setIsInverse(!isInverse)}
          className={`py-2 px-1 rounded-lg border font-semibold transition-colors ${
            isInverse
              ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
          }`}
        >
          2nd
        </button>

        <button
          id="btn-sci-sin"
          type="button"
          onClick={() => onInput(isInverse ? 'asin(' : 'sin(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          {isInverse ? 'sin⁻¹' : 'sin'}
        </button>

        <button
          id="btn-sci-cos"
          type="button"
          onClick={() => onInput(isInverse ? 'acos(' : 'cos(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          {isInverse ? 'cos⁻¹' : 'cos'}
        </button>

        <button
          id="btn-sci-tan"
          type="button"
          onClick={() => onInput(isInverse ? 'atan(' : 'tan(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          {isInverse ? 'tan⁻¹' : 'tan'}
        </button>

        <button
          id="btn-sci-constants"
          type="button"
          onClick={onOpenConstants}
          className="py-2 px-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold flex items-center justify-center gap-1 transition-colors"
          title="Open Mathematical & Physical Constants"
        >
          <Atom className="w-3.5 h-3.5" />
          <span>Const</span>
        </button>

        {/* Row 2 */}
        <button
          id="btn-sci-ln"
          type="button"
          onClick={() => onInput(isInverse ? 'exp(' : 'ln(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          {isInverse ? 'eˣ' : 'ln'}
        </button>

        <button
          id="btn-sci-log"
          type="button"
          onClick={() => onInput(isInverse ? '10^(' : 'log(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          {isInverse ? '10ˣ' : 'log'}
        </button>

        <button
          id="btn-sci-sqrt"
          type="button"
          onClick={() => onInput(isInverse ? '^2' : 'sqrt(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          {isInverse ? 'x²' : '√x'}
        </button>

        <button
          id="btn-sci-cbrt"
          type="button"
          onClick={() => onInput(isInverse ? '^3' : 'cbrt(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          {isInverse ? 'x³' : '³√x'}
        </button>

        <button
          id="btn-sci-pow"
          type="button"
          onClick={() => onInput('^')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          xʸ
        </button>

        {/* Row 3 */}
        <button
          id="btn-sci-pi"
          type="button"
          onClick={() => onInput('π')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-serif font-bold text-sm transition-colors"
        >
          π
        </button>

        <button
          id="btn-sci-e"
          type="button"
          onClick={() => onInput('e')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-serif italic font-bold text-sm transition-colors"
        >
          e
        </button>

        <button
          id="btn-sci-fact"
          type="button"
          onClick={() => onInput('!')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          n!
        </button>

        <button
          id="btn-sci-abs"
          type="button"
          onClick={() => onInput('abs(')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          |x|
        </button>

        <button
          id="btn-sci-mod"
          type="button"
          onClick={() => onInput(' % ')}
          className="py-2 px-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-medium transition-colors"
        >
          mod
        </button>
      </div>

      {/* Main Standard Keypad beneath */}
      <KeypadStandard
        onInput={onInput}
        onClear={onClear}
        onBackspace={onBackspace}
        onToggleSign={onToggleSign}
        onPercent={onPercent}
        onEvaluate={onEvaluate}
        onMemoryAction={onMemoryAction}
        hasMemory={hasMemory}
      />
    </div>
  );
};
