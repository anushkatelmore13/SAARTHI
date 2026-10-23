import React from 'react';
import { CaseAnalysis } from '../types';
import { Layers, ArrowUpRight, Zap, Shield, CheckCircle2 } from 'lucide-react';

interface ActivePlansSectionProps {
  cases: CaseAnalysis[];
  onOpenActionCenter: (caseId: string) => void;
}

export const ActivePlansSection: React.FC<ActivePlansSectionProps> = ({
  cases,
  onOpenActionCenter,
}) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Active Action Plans</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time execution status of operational interventions
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          {cases.reduce((acc, c) => acc + c.actions.length, 0)} Total Tasks
        </span>
      </div>

      <div className="space-y-3">
        {cases.map((c) => {
          const total = c.actions.length;
          const completed = c.actions.filter(a => a.status === 'COMPLETED').length;
          const inProgress = c.actions.filter(a => a.status === 'IN_PROGRESS').length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          const doNowCount = c.actions.filter(a => a.category === 'DO_NOW').length;

          return (
            <div
              key={`plan-${c.id}`}
              className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 hover:bg-slate-800/40 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1">
                    {c.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenActionCenter(c.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Open Plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 mb-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Execution Progress</span>
                  <span className="text-cyan-400 font-bold">{percent}% Completed</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                  <div
                    className="h-full bg-cyan-400/60 transition-all duration-500"
                    style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Task breakdown chips */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {doNowCount > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/60 text-rose-300 font-medium">
                    <Zap className="w-3 h-3" />
                    <span>{doNowCount} DO NOW</span>
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span>{total - doNowCount} Prepared/Verified</span>
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{completed}/{total} Done</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
