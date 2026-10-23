import React from 'react';
import { CaseAnalysis } from '../types';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight,
  Mic,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface RecentCasesSectionProps {
  cases: CaseAnalysis[];
  activeCaseId: string | null;
  onSelectCase: (caseId: string) => void;
}

export const RecentCasesSection: React.FC<RecentCasesSectionProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
}) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Recent Cases</span>
          </h3>
          <p className="text-xs text-slate-400">
            Cases ingested across universal societal domains
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          {cases.length} Ingested
        </span>
      </div>

      <div className="space-y-2.5">
        {cases.map((c) => {
          const isSelected = c.id === activeCaseId;
          const providedCount = c.extractedFacts.filter(f => f.status === 'PROVIDED').length;
          const verifiedCount = c.extractedFacts.filter(f => f.status === 'VERIFIED').length;
          const uncertainCount = c.extractedFacts.filter(f => f.status === 'UNCERTAIN').length;
          const missingCount = c.missingInformation.length;

          const urgencyColor =
            c.urgency === 'CRITICAL'
              ? 'text-rose-400 bg-rose-950/60 border-rose-800/60'
              : c.urgency === 'HIGH'
              ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
              : 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';

          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                  : 'bg-slate-900/50 border-slate-800/70 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {c.inputType === 'voice' ? (
                    <Mic className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  ) : c.inputType === 'image' ? (
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {c.title}
                  </h4>
                </div>

                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${urgencyColor}`}>
                  {c.urgency}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {c.category}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                {c.situationDetected}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60">
                {/* Truth Layer badges */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-blue-400" title="Provided facts">
                    <span className="font-bold">P:</span>
                    <span>{providedCount}</span>
                  </span>
                  <span className="flex items-center gap-0.5 text-emerald-400" title="Verified facts">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{verifiedCount}</span>
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-400" title="Uncertain facts">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{uncertainCount}</span>
                  </span>
                  <span className="flex items-center gap-0.5 text-purple-400" title="Missing information">
                    <HelpCircle className="w-3 h-3" />
                    <span>{missingCount}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-400 transition-colors text-[11px]">
                  <span>{c.timestamp}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
