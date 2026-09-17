import React from 'react';
import { BaseConvertResult } from '../types.ts';

interface KeypadProgrammerProps {
  baseValues: BaseConvertResult | null;
  activeBase: 2 | 8 | 10 | 16;
  onChangeBase: (base: 2 | 8 | 10 | 16) => void;
  onInput: (val: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEvaluate: () => void;
}

export const KeypadProgrammer: React.FC<KeypadProgrammerProps> = ({
  baseValues,
  activeBase,
  onChangeBase,
  onInput,
  onClear,
  onBackspace,
  onEvaluate,
}) => {
  const isDigitEnabled = (d: string) => {
    const num = parseInt(d, 16);
    return !isNaN(num) && num < activeBase;
  };

  // Format binary into 4-bit nibbles for readability
  const formatBin = (bin: string = '0') => {
    const clean = bin.replace(/^0+(?=\d)/, '') || '0';
    const padded = clean.padStart(Math.ceil(clean.length / 4) * 4, '0');
    return padded.match(/.{1,4}/g)?.join(' ') || clean;
  };

  return (
    <div id="programmer-keypad" className="flex flex-col gap-3">
      {/* 4-Way Base Representation Panel */}
      <div className="bg-stone-900 text-stone-200 rounded-xl p-3.5 border border-stone-800 text-xs font-mono flex flex-col gap-1.5 shadow-inner">
        {/* HEX */}
        <button
          id="base-select-hex"
          type="button"
          onClick={() => onChangeBase(16)}
          className={`flex items-center justify-between px-2 py-1 rounded transition-colors text-left ${
            activeBase === 16 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-stone-800/60 text-stone-400'
          }`}
        >
          <span className="w-10">HEX</span>
          <span className="truncate max-w-[260px]">{baseValues?.hex ?? '0'}</span>
        </button>

        {/* DEC */}
        <button
          id="base-select-dec"
          type="button"
          onClick={() => onChangeBase(10)}
          className={`flex items-center justify-between px-2 py-1 rounded transition-colors text-left ${
            activeBase === 10 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-stone-800/60 text-stone-400'
          }`}
        >
          <span className="w-10">DEC</span>
          <span className="truncate max-w-[260px]">{baseValues?.dec ?? '0'}</span>
        </button>

        {/* OCT */}
        <button
          id="base-select-oct"
          type="button"
          onClick={() => onChangeBase(8)}
          className={`flex items-center justify-between px-2 py-1 rounded transition-colors text-left ${
            activeBase === 8 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-stone-800/60 text-stone-400'
          }`}
        >
          <span className="w-10">OCT</span>
          <span className="truncate max-w-[260px]">{baseValues?.oct ?? '0'}</span>
        </button>

        {/* BIN */}
        <button
          id="base-select-bin"
          type="button"
          onClick={() => onChangeBase(2)}
          className={`flex items-center justify-between px-2 py-1 rounded transition-colors text-left ${
            activeBase === 2 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-stone-800/60 text-stone-400'
          }`}
        >
          <span className="w-10">BIN</span>
          <span className="truncate max-w-[260px] text-[11px] tracking-wider font-mono">
            {formatBin(baseValues?.bin)}
          </span>
        </button>
      </div>

      {/* Bitwise operations strip */}
      <div className="grid grid-cols-6 gap-1.5 text-xs font-mono font-medium">
        <button
          id="btn-prog-and"
          type="button"
          onClick={() => onInput(' & ')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
        >
          AND
        </button>
        <button
          id="btn-prog-or"
          type="button"
          onClick={() => onInput(' | ')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
        >
          OR
        </button>
        <button
          id="btn-prog-xor"
          type="button"
          onClick={() => onInput(' ^ ')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
        >
          XOR
        </button>
        <button
          id="btn-prog-not"
          type="button"
          onClick={() => onInput('~')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
        >
          NOT
        </button>
        <button
          id="btn-prog-lsh"
          type="button"
          onClick={() => onInput(' << ')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
        >
          &lt;&lt;
        </button>
        <button
          id="btn-prog-rsh"
          type="button"
          onClick={() => onInput(' >> ')}
          className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
        >
          &gt;&gt;
        </button>
      </div>

      {/* Programmer Grid: Hex characters + Digits */}
      <div className="grid grid-cols-5 gap-2 text-sm font-semibold">
        {/* Row 1 */}
        {['A', 'B', '7', '8', '9'].map((char) => {
          const enabled = isDigitEnabled(char);
          return (
            <button
              key={char}
              id={`btn-prog-${char.toLowerCase()}`}
              type="button"
              disabled={!enabled}
              onClick={() => onInput(char)}
              className={`h-12 rounded-xl border transition-colors shadow-xs ${
                enabled
                  ? 'bg-white hover:bg-stone-100 text-stone-900 border-stone-200/90'
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/50 cursor-not-allowed'
              }`}
            >
              {char}
            </button>
          );
        })}

        {/* Row 2 */}
        {['C', 'D', '4', '5', '6'].map((char) => {
          const enabled = isDigitEnabled(char);
          return (
            <button
              key={char}
              id={`btn-prog-${char.toLowerCase()}`}
              type="button"
              disabled={!enabled}
              onClick={() => onInput(char)}
              className={`h-12 rounded-xl border transition-colors shadow-xs ${
                enabled
                  ? 'bg-white hover:bg-stone-100 text-stone-900 border-stone-200/90'
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/50 cursor-not-allowed'
              }`}
            >
              {char}
            </button>
          );
        })}

        {/* Row 3 */}
        {['E', 'F', '1', '2', '3'].map((char) => {
          const enabled = isDigitEnabled(char);
          return (
            <button
              key={char}
              id={`btn-prog-${char.toLowerCase()}`}
              type="button"
              disabled={!enabled}
              onClick={() => onInput(char)}
              className={`h-12 rounded-xl border transition-colors shadow-xs ${
                enabled
                  ? 'bg-white hover:bg-stone-100 text-stone-900 border-stone-200/90'
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/50 cursor-not-allowed'
              }`}
            >
              {char}
            </button>
          );
        })}

        {/* Row 4 */}
        <button
          id="btn-prog-clear"
          type="button"
          onClick={onClear}
          className="h-12 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-xs"
        >
          AC
        </button>
        <button
          id="btn-prog-0"
          type="button"
          onClick={() => onInput('0')}
          className="h-12 rounded-xl bg-white hover:bg-stone-100 text-stone-900 border border-stone-200/90 transition-colors shadow-xs"
        >
          0
        </button>
        <button
          id="btn-prog-backspace"
          type="button"
          onClick={onBackspace}
          className="h-12 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors shadow-xs"
        >
          ⌫
        </button>
        <button
          id="btn-prog-mod"
          type="button"
          onClick={() => onInput(' % ')}
          className="h-12 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors shadow-xs"
        >
          MOD
        </button>
        <button
          id="btn-prog-equals"
          type="button"
          onClick={onEvaluate}
          className="h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xl border border-stone-900 transition-colors shadow-sm"
        >
          =
        </button>
      </div>
    </div>
  );
};
