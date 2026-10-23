import React from 'react';
import { ActionItem } from '../types';
import { X, HelpCircle, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface WhyThisActionModalProps {
  action: ActionItem | null;
  onClose: () => void;
}

export const WhyThisActionModal: React.FC<WhyThisActionModalProps> = ({ action, onClose }) => {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                <HelpCircle className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Action Explainability Engine
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Why this action?
            </h2>
            <p className="text-xs text-slate-400">
              Target: <span className="text-slate-200 font-semibold">{action.title}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Reasoning */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
            Algorithmic Reasoning
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {action.whyThisAction.reasoning}
          </p>
        </div>

        {/* Driving Facts */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Grounded Driving Facts</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {action.whyThisAction.drivingFacts.map((fact, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-200 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        {action.whyThisAction.prerequisites.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Operational Prerequisites</span>
            </span>
            <div className="space-y-1.5">
              {action.whyThisAction.prerequisites.map((prereq, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{prereq}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk If Omitted */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/50 space-y-1.5">
          <span className="text-xs font-mono uppercase font-bold text-rose-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Risk If Omitted or Delayed</span>
          </span>
          <p className="text-xs sm:text-sm text-rose-200 leading-relaxed font-semibold">
            {action.whyThisAction.riskIfOmitted}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Reasoning
          </button>
        </div>
      </div>
    </div>
  );
};
