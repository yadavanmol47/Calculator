import React from 'react';
import { X, Atom, Plus } from 'lucide-react';
import { ConstantItem } from '../types.ts';

interface ConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  constants: ConstantItem[];
  onInsertConstant: (symbol: string) => void;
}

export const ConstantsModal: React.FC<ConstantsModalProps> = ({
  isOpen,
  onClose,
  constants,
  onInsertConstant,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="constants-modal-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="constants-modal-panel"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-sm text-stone-100">Constants Library</h3>
              <p className="text-xs text-stone-400">Fetched live from NestJS CalculatorService</p>
            </div>
          </div>
          <button
            id="close-constants-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-2 bg-stone-50/50 flex-1">
          {constants.map((c) => (
            <div
              key={c.symbol}
              id={`constant-item-${c.symbol}`}
              className="p-3 bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg text-amber-900 w-6 text-center">
                    {c.symbol}
                  </span>
                  <span className="font-semibold text-stone-900 text-sm">{c.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                    {c.category}
                  </span>
                </div>
                <div className="text-xs font-mono text-stone-600 mt-1 truncate">
                  {c.value} {c.unit ? c.unit : ''}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">{c.description}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onInsertConstant(c.symbol);
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-800 font-medium text-xs border border-stone-200 hover:border-amber-600 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insert</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
