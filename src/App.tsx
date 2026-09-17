import React, { useState, useEffect, useCallback } from 'react';
import {
  AngleUnit,
  BaseConvertResult,
  CalculationHistoryItem,
  CalculatorMode,
  ConstantItem,
  NestHealthStatus,
  StepItem,
} from './types.ts';
import { calculatorApi } from './api/calculatorApi.ts';
import { CalculatorDisplay } from './components/CalculatorDisplay.tsx';
import { KeypadStandard } from './components/KeypadStandard.tsx';
import { KeypadScientific } from './components/KeypadScientific.tsx';
import { KeypadProgrammer } from './components/KeypadProgrammer.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { StepByStepModal } from './components/StepByStepModal.tsx';
import { ConstantsModal } from './components/ConstantsModal.tsx';
import { NestJsStatusBadge } from './components/NestJsStatusBadge.tsx';
import { History, Sparkles, Binary, Calculator as CalcIcon, FlaskConical } from 'lucide-react';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [memory, setMemory] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | undefined>(undefined);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isStepsOpen, setIsStepsOpen] = useState<boolean>(false);
  const [isConstantsOpen, setIsConstantsOpen] = useState<boolean>(false);

  // Data lists
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [constants, setConstants] = useState<ConstantItem[]>([]);

  // Programmer mode state
  const [activeBase, setActiveBase] = useState<2 | 8 | 10 | 16>(10);
  const [baseValues, setBaseValues] = useState<BaseConvertResult | null>(null);

  // NestJS backend health
  const [health, setHealth] = useState<NestHealthStatus | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Load initial backend status, history, constants
  const fetchHealthAndData = useCallback(async () => {
    try {
      const h = await calculatorApi.checkHealth();
      setHealth(h);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }

    try {
      const hist = await calculatorApi.getHistory();
      setHistory(hist);
    } catch {
      // Non-blocking
    }

    try {
      const mem = await calculatorApi.getMemory();
      setMemory(mem);
    } catch {
      // Non-blocking
    }

    try {
      const c = await calculatorApi.getConstants();
      setConstants(c);
    } catch {
      // Non-blocking
    }
  }, []);

  useEffect(() => {
    fetchHealthAndData();
    const interval = setInterval(fetchHealthAndData, 20000);
    return () => clearInterval(interval);
  }, [fetchHealthAndData]);

  // Update base values whenever result changes in programmer mode
  useEffect(() => {
    if (mode === 'programmer') {
      const numericVal = parseFloat(result) || 0;
      calculatorApi
        .convertBase(numericVal, 10)
        .then(setBaseValues)
        .catch(() => {});
    }
  }, [result, mode]);

  // Handle character/token input
  const handleInput = (val: string) => {
    setErrorMessage(null);
    setExpression((prev) => {
      // If we just had a calculated result and type a new digit, start fresh
      if (prev === '' && ![' + ', ' − ', ' × ', ' ÷ ', ' % ', '^'].includes(val)) {
        // If starting fresh with a function or number
        return val;
      }
      return prev + val;
    });
  };

  // Handle clear
  const handleClear = () => {
    if (expression !== '') {
      setExpression('');
      setErrorMessage(null);
    } else {
      setResult('0');
      setSteps([]);
      setErrorMessage(null);
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    setErrorMessage(null);
    setExpression((prev) => {
      if (!prev) return '';
      // If ends with spaced operator like ' + ' or ' × '
      if (prev.endsWith(' + ') || prev.endsWith(' − ') || prev.endsWith(' × ') || prev.endsWith(' ÷ ') || prev.endsWith(' % ')) {
        return prev.slice(0, -3);
      }
      return prev.slice(0, -1);
    });
  };

  // Toggle sign
  const handleToggleSign = () => {
    setErrorMessage(null);
    if (!expression && result !== '0') {
      // Toggle sign on result
      const num = Number(result);
      if (!isNaN(num)) {
        const negated = (-num).toString();
        setResult(negated);
        setExpression(negated);
      }
      return;
    }

    // Toggle sign of trailing number
    setExpression((prev) => {
      const match = prev.match(/(.*?)(-?\d+(?:\.\d+)?)$/);
      if (match) {
        const prefix = match[1];
        const num = match[2];
        if (num.startsWith('-')) {
          return prefix + num.substring(1);
        } else {
          return prefix + `(-${num})`;
        }
      }
      return prev + '(-';
    });
  };

  // Handle percent
  const handlePercent = () => {
    setExpression((prev) => (prev ? `${prev}%` : ''));
  };

  // Evaluate formula via NestJS
  const handleEvaluate = async () => {
    const exprToEval = expression.trim() || result;
    if (!exprToEval || exprToEval === '0') return;

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const response = await calculatorApi.evaluate(exprToEval, angleUnit);
      setResult(response.formattedResult);
      setSteps(response.steps);
      setLastLatencyMs(response.latencyMs);

      // Refresh history from server
      const updatedHistory = await calculatorApi.getHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      setErrorMessage(err.message || 'Calculation error');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Memory action
  const handleMemoryAction = async (action: 'add' | 'subtract' | 'store' | 'clear' | 'recall') => {
    try {
      const currentVal = Number(result) || Number(expression) || 0;
      if (action === 'recall') {
        const mem = await calculatorApi.getMemory();
        setExpression((prev) => prev + mem.toString());
      } else {
        const res = await calculatorApi.handleMemory(action, currentVal);
        setMemory(res.memory);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Memory error');
    }
  };

  // Clear history
  const handleClearHistory = async () => {
    try {
      await calculatorApi.clearHistory();
      setHistory([]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to clear history');
    }
  };

  // Delete history item
  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await calculatorApi.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // Ignore
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === '.') {
        handleInput('.');
      } else if (e.key === '+') {
        handleInput(' + ');
      } else if (e.key === '-') {
        handleInput(' − ');
      } else if (e.key === '*') {
        handleInput(' × ');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInput(' ÷ ');
      } else if (e.key === '%') {
        handlePercent();
      } else if (e.key === '(' || e.key === ')') {
        handleInput(e.key);
      } else if (e.key === '^') {
        handleInput('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, result, angleUnit]);

  return (
    <div
      id="app-root-container"
      className="min-h-screen bg-stone-100 text-stone-900 flex flex-col justify-between selection:bg-amber-200 selection:text-stone-900 font-sans"
    >
      {/* Top Header Bar */}
      <header
        id="app-header"
        className="w-full max-w-2xl mx-auto px-4 pt-4 sm:pt-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
            <CalcIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-base text-stone-900 tracking-tight flex items-center gap-2">
              <span>NestJS Calculator</span>
            </h1>
            <p className="text-xs text-stone-500">Enterprise Full-Stack Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* NestJS status badge */}
          <NestJsStatusBadge
            health={health}
            isConnected={isConnected}
            onRefreshHealth={fetchHealthAndData}
          />

          {/* History drawer trigger button */}
          <button
            id="toggle-history-btn"
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs relative"
            title="Open calculation history"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Calculator Center Card */}
      <main
        id="main-calculator-viewport"
        className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4"
      >
        {/* Mode Selector Tabs */}
        <div
          id="calculator-mode-tabs"
          className="grid grid-cols-3 p-1 rounded-xl bg-stone-200/80 border border-stone-300/60 text-xs font-medium"
        >
          <button
            id="mode-tab-standard"
            type="button"
            onClick={() => setMode('standard')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'standard'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalcIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Standard</span>
          </button>

          <button
            id="mode-tab-scientific"
            type="button"
            onClick={() => setMode('scientific')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'scientific'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
            <span>Scientific</span>
          </button>

          <button
            id="mode-tab-programmer"
            type="button"
            onClick={() => setMode('programmer')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'programmer'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Binary className="w-3.5 h-3.5 text-amber-600" />
            <span>Programmer</span>
          </button>
        </div>

        {/* Digital Display */}
        <CalculatorDisplay
          expression={expression}
          result={result}
          mode={mode}
          angleUnit={angleUnit}
          hasMemory={memory !== 0}
          isEvaluating={isEvaluating}
          errorMessage={errorMessage}
          hasSteps={steps.length > 0}
          onToggleAngleUnit={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
          onOpenSteps={() => setIsStepsOpen(true)}
          onClear={handleClear}
          onBackspace={handleBackspace}
          lastLatencyMs={lastLatencyMs}
        />

        {/* Tactile Keypads based on selected mode */}
        <div
          id="calculator-keypad-container"
          className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200 shadow-xs"
        >
          {mode === 'standard' && (
            <KeypadStandard
              onInput={handleInput}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onToggleSign={handleToggleSign}
              onPercent={handlePercent}
              onEvaluate={handleEvaluate}
              onMemoryAction={handleMemoryAction}
              hasMemory={memory !== 0}
            />
          )}

          {mode === 'scientific' && (
            <KeypadScientific
              onInput={handleInput}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onToggleSign={handleToggleSign}
              onPercent={handlePercent}
              onEvaluate={handleEvaluate}
              onMemoryAction={handleMemoryAction}
              hasMemory={memory !== 0}
              onOpenConstants={() => setIsConstantsOpen(true)}
            />
          )}

          {mode === 'programmer' && (
            <KeypadProgrammer
              baseValues={baseValues}
              activeBase={activeBase}
              onChangeBase={(b) => {
                setActiveBase(b);
                if (result) {
                  calculatorApi
                    .convertBase(result, b)
                    .then(setBaseValues)
                    .catch(() => {});
                }
              }}
              onInput={handleInput}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onEvaluate={handleEvaluate}
            />
          )}
        </div>
      </main>

      {/* Subtle Footer with Keyboard Shortcuts info */}
      <footer
        id="app-footer"
        className="w-full max-w-md mx-auto px-4 pb-4 text-center text-xs text-stone-500"
      >
        <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-stone-400">
          <span>[Enter] =</span>
          <span>•</span>
          <span>[Esc] Clear</span>
          <span>•</span>
          <span>[⌫] Del</span>
          <span>•</span>
          <span>NestJS Backend</span>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectExpression={(expr) => {
          setExpression(expr);
          setIsHistoryOpen(false);
        }}
        onSelectResult={(res) => {
          setExpression(String(res));
          setResult(String(res));
          setIsHistoryOpen(false);
        }}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* Step-by-Step Breakdown Modal */}
      <StepByStepModal
        isOpen={isStepsOpen}
        onClose={() => setIsStepsOpen(false)}
        expression={expression || result}
        result={result}
        steps={steps}
      />

      {/* Constants Library Modal */}
      <ConstantsModal
        isOpen={isConstantsOpen}
        onClose={() => setIsConstantsOpen(false)}
        constants={constants}
        onInsertConstant={(sym) => handleInput(sym)}
      />
    </div>
  );
}
