import React, { useState } from 'react';
import { Server, Activity, CheckCircle2, ChevronRight, X, Code2, Database } from 'lucide-react';
import { NestHealthStatus } from '../types.ts';

interface NestJsStatusBadgeProps {
  health: NestHealthStatus | null;
  isConnected: boolean;
  onRefreshHealth: () => void;
}

export const NestJsStatusBadge: React.FC<NestJsStatusBadgeProps> = ({
  health,
  isConnected,
  onRefreshHealth,
}) => {
  const [showInspector, setShowInspector] = useState(false);

  const endpoints = [
    { method: 'POST', path: '/api/calculator/evaluate', desc: 'Evaluate arithmetic & scientific formulas' },
    { method: 'POST', path: '/api/calculator/step-by-step', desc: 'Generate tokenized evaluation trace' },
    { method: 'POST', path: '/api/calculator/convert', desc: 'Hex/Dec/Oct/Bin programmer base conversion' },
    { method: 'GET', path: '/api/calculator/history', desc: 'Retrieve calculation history records' },
    { method: 'DELETE', path: '/api/calculator/history', desc: 'Clear in-memory calculation history' },
    { method: 'POST', path: '/api/calculator/memory', desc: 'Memory store, recall, add, subtract, clear' },
    { method: 'GET', path: '/api/calculator/constants', desc: 'Mathematical & physical constants catalog' },
    { method: 'GET', path: '/api/calculator/health', desc: 'NestJS application health & uptime status' },
  ];

  return (
    <>
      <button
        id="nestjs-status-indicator-btn"
        type="button"
        onClick={() => setShowInspector(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white/90 hover:bg-stone-50 text-xs text-stone-700 transition-all shadow-xs cursor-pointer"
        title="Click to inspect NestJS architecture & REST API"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <span className="font-semibold text-stone-800">NestJS v12</span>
        <span className="text-stone-400 font-mono text-[11px]">
          {isConnected ? `${health?.latencyMs ?? 0}ms` : 'Offline'}
        </span>
        <span className="hidden sm:inline text-stone-400 text-[11px]">• API Active</span>
      </button>

      {/* NestJS Architecture & Endpoint Inspector Modal */}
      {showInspector && (
        <div
          id="nestjs-inspector-overlay"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowInspector(false)}
        >
          <div
            id="nestjs-inspector-panel"
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-sm">
                  N
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">NestJS Architecture & API Inspector</h3>
                  <p className="text-xs text-stone-400">Server-authoritative calculation engine running in Node.js</p>
                </div>
              </div>
              <button
                id="close-nestjs-inspector-btn"
                type="button"
                onClick={() => setShowInspector(false)}
                className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 bg-stone-50/50 flex-1 text-xs">
              {/* Health card */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-700">
                <div>
                  <div className="text-stone-400 text-[11px]">Backend Framework</div>
                  <div className="font-semibold font-mono text-stone-900 mt-0.5">{health?.framework || 'NestJS v12'}</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Status</div>
                  <div className="font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active (200 OK)</span>
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Round-Trip Ping</div>
                  <div className="font-semibold font-mono text-stone-900 mt-0.5">{health?.latencyMs ?? 0} ms</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Server Uptime</div>
                  <div className="font-semibold font-mono text-stone-900 mt-0.5">
                    {health ? `${Math.round(health.uptime)}s` : '—'}
                  </div>
                </div>
              </div>

              {/* Module Hierarchy */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-amber-600" />
                  <span>NestJS Dependency Graph</span>
                </div>
                <div className="font-mono text-[11px] bg-stone-900 text-stone-200 p-3 rounded-lg leading-relaxed">
                  <div className="text-rose-400">@Module({'{'} imports: [CalculatorModule] {'}'}) AppModule</div>
                  <div className="pl-4 text-amber-300">↳ @Module({'{'}</div>
                  <div className="pl-8 text-sky-300">controllers: [CalculatorController],</div>
                  <div className="pl-8 text-emerald-300">providers: [CalculatorService],</div>
                  <div className="pl-8 text-emerald-300">exports: [CalculatorService]</div>
                  <div className="pl-4 text-amber-300">{'}'}) CalculatorModule</div>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Exposed REST Endpoints</span>
                  <button
                    type="button"
                    onClick={onRefreshHealth}
                    className="text-amber-700 hover:text-amber-800 font-medium text-[11px]"
                  >
                    Refresh Status
                  </button>
                </div>
                <div className="space-y-1.5">
                  {endpoints.map((ep) => (
                    <div
                      key={ep.path}
                      className="p-2 bg-stone-50 rounded-lg border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                            ep.method === 'POST'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : ep.method === 'DELETE'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="text-stone-800 font-semibold">{ep.path}</span>
                      </div>
                      <span className="text-stone-500 font-sans text-[11px]">{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInspector(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
