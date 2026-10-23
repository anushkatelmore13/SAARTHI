import React, { useState } from 'react';
import { ActionItem, ActionCategory } from '../types';
import { 
  Zap, 
  Shield, 
  CheckCircle2, 
  Share2, 
  Clock, 
  HelpCircle, 
  Copy, 
  Check, 
  Layers, 
  Send,
  PackageCheck,
  ArrowRight,
  AlertOctagon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionCenterProps {
  actions: ActionItem[];
  onToggleStatus: (actionId: string) => void;
  onOpenWhyThisAction: (action: ActionItem) => void;
  onGenerateActionPack?: () => void;
  onToggleChecklistItem?: (actionId: string, checkId: string) => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  actions,
  onToggleStatus,
  onOpenWhyThisAction,
  onGenerateActionPack,
  onToggleChecklistItem: _onToggleChecklistItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'ALL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedChangeId, setExpandedChangeId] = useState<string | null>(null);

  const categories: { key: ActionCategory; label: string; icon: any; color: string; desc: string }[] = [
    { key: 'DO_NOW', label: 'DO NOW', icon: Zap, color: 'text-rose-400 border-rose-500/40 bg-rose-950/20', desc: 'Critical immediate interventions' },
    { key: 'PREPARE', label: 'PREPARE', icon: Shield, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20', desc: 'Equipment, staging & materials' },
    { key: 'VERIFY', label: 'VERIFY', icon: CheckCircle2, color: 'text-amber-400 border-amber-500/40 bg-amber-950/20', desc: 'Fact checking & telemetry queries' },
    { key: 'SHARE', label: 'SHARE', icon: Share2, color: 'text-purple-400 border-purple-500/40 bg-purple-950/20', desc: 'Briefings & stakeholder alerts' },
    { key: 'FOLLOW_UP', label: 'FOLLOW UP', icon: Clock, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20', desc: 'Audit, legal & retrospective tracking' },
  ];

  const filteredActions = selectedCategory === 'ALL'
    ? actions
    : actions.filter(a => a.category === selectedCategory);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusClick = (action: ActionItem) => {
    onToggleStatus(action.id);
    if (action.status !== 'COMPLETED') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#10b981', '#8b5cf6'],
        });
      } catch { }
    }
  };

  const completedCount = actions.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Action Center Header Banner */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
              <Layers className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Intelligent Action Center
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Concrete, transparent recommendations grounded in verified facts. No fake external dispatches.
              </p>
            </div>
          </div>

          {/* Action Center Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onGenerateActionPack && (
              <button
                type="button"
                onClick={onGenerateActionPack}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Generate Action Pack</span>
              </button>
            )}

            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2 font-mono">
              <span className="text-slate-400">Progress:</span>
              <span className="text-emerald-400 font-bold">
                {completedCount}/{actions.length} Completed ({actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-800 border-cyan-500/50 text-white font-bold shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-mono uppercase block mb-0.5">All Categories</span>
            <span className="text-lg font-black text-white font-mono">{actions.length}</span>
          </button>

          {categories.map(cat => {
            const count = actions.filter(a => a.category === cat.key).length;
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? `${cat.color} text-white font-bold shadow-md`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono uppercase">{cat.label}</span>
                </div>
                <span className="text-lg font-black text-white font-mono">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredActions.map(action => {
          const catInfo = categories.find(c => c.key === action.category) || categories[0];
          const Icon = catInfo.icon;
          const isDone = action.status === 'COMPLETED';

          return (
            <div
              key={action.id}
              className={`glass-panel rounded-2xl border transition-all p-5 shadow-xl relative overflow-hidden ${
                isDone
                  ? 'border-emerald-800/40 bg-emerald-950/10 opacity-75'
                  : action.category === 'DO_NOW'
                  ? 'border-rose-800/50 bg-rose-950/10'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Main Action Content */}
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Status Toggle Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleStatusClick(action)}
                    className={`mt-1 flex items-center justify-center w-6 h-6 rounded-lg border transition-all flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'bg-slate-900 border-slate-700 hover:border-cyan-400 text-transparent'
                    }`}
                    title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                  >
                    <Check className="w-4 h-4 font-bold text-slate-950 stroke-[3]" />
                  </button>

                  <div className="space-y-3 flex-1">
                    {/* Header Row: Category, Readiness, Role */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${catInfo.color}`}>
                        <Icon className="w-3 h-3" />
                        <span>{catInfo.label}</span>
                      </span>

                      {/* Explicit Execution Readiness Label (No fake calls/actions) */}
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {action.executionReadiness}
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        Role: {action.assignedRole}
                      </span>

                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-bold">
                        Confidence: {action.confidence}%
                      </span>

                      {isDone && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          COMPLETED
                        </span>
                      )}
                    </div>

                    {/* Action Title */}
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider block">
                        ACTION
                      </span>
                      <h3 className={`text-base font-bold text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Requirement 6: ACTION / WHY / INPUT USED / NEXT STEP Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                        <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block mb-0.5">
                          WHY:
                        </span>
                        <p className="text-slate-200 leading-relaxed font-medium">
                          {action.why}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                        <span className="text-[10px] font-mono uppercase font-bold text-purple-400 block mb-0.5">
                          INPUT USED:
                        </span>
                        <p className="text-slate-300 italic font-mono text-[11px] leading-relaxed">
                          "{action.inputUsed}"
                        </p>
                      </div>
                    </div>

                    {/* Concrete NEXT STEP */}
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/50 flex items-start gap-2.5 text-xs">
                      <ArrowRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
                          NEXT STEP:
                        </span>
                        <p className="text-emerald-100 font-semibold leading-relaxed">
                          {action.nextStep}
                        </p>
                        {action.missingPrerequisite && (
                          <p className="text-[11px] text-amber-300/90 mt-1">
                            <strong>Prerequisite Gap:</strong> {action.missingPrerequisite}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Requirement 5: "What would change this recommendation?" */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedChangeId(prev => (prev === action.id ? null : action.id))}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                      >
                        <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                        <span>What would change this recommendation?</span>
                      </button>

                      {expandedChangeId === action.id && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 leading-relaxed animate-in fade-in">
                          <strong>Contingency Trigger:</strong> {action.whatWouldChangeThis}
                        </div>
                      )}
                    </div>

                    {/* Pre-filled communications payload if any */}
                    {action.prefilledData?.draftMessage && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-mono uppercase font-semibold text-cyan-400 flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>Prefilled Communications Payload (Manual Dispatch)</span>
                            {action.prefilledData.contactName && ` • Target: ${action.prefilledData.contactName}`}
                          </span>
                          <p className="text-xs font-mono text-slate-200 select-all leading-relaxed">
                            {action.prefilledData.draftMessage}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(action.id, action.prefilledData!.draftMessage!)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors flex-shrink-0"
                        >
                          {copiedId === action.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Explainability Trigger ("Why this action?") */}
                <div className="flex lg:flex-col items-center justify-between lg:justify-start gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/60 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenWhyThisAction(action)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 hover:border-cyan-500/60 text-cyan-300 text-xs font-semibold transition-all hover:scale-105"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why this action?</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusClick(action)}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {isDone ? 'Mark as Incomplete' : 'Complete Action'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
