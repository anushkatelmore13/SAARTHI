import React, { useState } from 'react';
import { MissingInfoItem } from '../types';
import { X, CheckCircle2, HelpCircle, Send, Sparkles } from 'lucide-react';

interface ResolveMissingInfoModalProps {
  item: MissingInfoItem | null;
  onClose: () => void;
  onResolve: (itemId: string, answer: string) => void;
}

export const ResolveMissingInfoModal: React.FC<ResolveMissingInfoModalProps> = ({
  item,
  onClose,
  onResolve,
}) => {
  const [answer, setAnswer] = useState(item?.resolvedValue || '');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    onResolve(item.id, answer.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-lg rounded-2xl border border-purple-500/40 p-6 shadow-2xl relative space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
              Resolve Unknown Information
            </span>
            <h3 className="text-lg font-bold text-white">
              Supply Grounded Telemetry
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missing Item Question */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
          <span className="text-xs font-mono font-bold text-purple-300 uppercase">
            Identified Information Gap:
          </span>
          <p className="text-sm font-semibold text-white">
            {item.question}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            <strong>Impact:</strong> {item.impact}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Verified Value or On-Scene Update:
            </label>
            <textarea
              rows={3}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder={`E.g., "Confirmed by radio: ${item.queryPrompt}"`}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Converts gap to verified fact & recalculates plan</span>
            </p>

            <button
              type="submit"
              disabled={!answer.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Recalculate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
