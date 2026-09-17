import React from 'react';
import { Trash2, X, Clock, ArrowRight } from 'lucide-react';
import { CalculationHistoryItem } from '../types.ts';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onSelectExpression: (expr: string) => void;
  onSelectResult: (res: string | number) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectExpression,
  onSelectResult,
  onClearHistory,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      id="history-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div
        id="history-drawer-panel"
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2 text-stone-800 font-semibold">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Calculation History</span>
            <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                id="clear-all-history-btn"
                type="button"
                onClick={onClearHistory}
                className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-history-drawer-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {history.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-stone-400">
              <Clock className="w-8 h-8 text-stone-300 mb-2" />
              <p className="text-sm font-medium">No calculation history yet</p>
              <p className="text-xs text-stone-400 mt-0.5">Evaluations performed via NestJS will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className="group p-3 rounded-xl border border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/30 transition-all flex flex-col gap-1 text-right"
              >
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>{formatTime(item.timestamp)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-400 hover:text-rose-600 transition-opacity"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectExpression(item.expression)}
                  className="font-mono text-xs text-stone-600 hover:text-stone-900 transition-colors text-right break-all cursor-pointer"
                  title="Click to load expression"
                >
                  {item.expression}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectResult(item.result)}
                  className="font-mono font-bold text-lg text-stone-900 hover:text-amber-700 transition-colors text-right break-all cursor-pointer flex items-center justify-end gap-1.5"
                  title="Click to load result"
                >
                  <span className="text-stone-400 font-normal text-sm">=</span>
                  <span>{item.result}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
