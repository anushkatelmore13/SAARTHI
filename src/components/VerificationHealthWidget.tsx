import React from 'react';
import { CaseAnalysis } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

interface VerificationHealthWidgetProps {
  cases: CaseAnalysis[];
}

export const VerificationHealthWidget: React.FC<VerificationHealthWidgetProps> = ({ cases }) => {
  // Genuinely calculated from actual loaded application state
  let totalProvided = 0;
  let totalVerified = 0;
  let totalUncertain = 0;
  let totalMissing = 0;

  cases.forEach(c => {
    totalProvided += c.extractedFacts.filter(f => f.status === 'PROVIDED').length;
    totalVerified += c.extractedFacts.filter(f => f.status === 'VERIFIED').length;
    totalUncertain += c.extractedFacts.filter(f => f.status === 'UNCERTAIN').length;
    totalMissing += c.missingInformation.length;
  });

  const grandTotal = totalProvided + totalVerified + totalUncertain + totalMissing;
  const groundedRate = grandTotal > 0 
    ? Math.round(((totalProvided + totalVerified) / grandTotal) * 100) 
    : 0;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>The Truth Layer Health</span>
          </h3>
          <p className="text-xs text-slate-400">
            Dynamically computed across {cases.length} active state cases
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>{groundedRate}% Grounded</span>
        </div>
      </div>

      {/* Truth Layer Metric Grid (Strictly derived from state) */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {/* Provided */}
        <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-800/40">
          <span className="text-[10px] font-mono font-bold text-blue-400 block mb-0.5">PROVIDED</span>
          <span className="text-xl font-extrabold text-white font-mono">{totalProvided}</span>
          <p className="text-[10px] text-blue-300/80 mt-0.5">Direct Input</p>
        </div>

        {/* Verified */}
        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
          <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-0.5">VERIFIED</span>
          <span className="text-xl font-extrabold text-white font-mono">{totalVerified}</span>
          <p className="text-[10px] text-emerald-300/80 mt-0.5">Rule Grounded</p>
        </div>

        {/* Uncertain */}
        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/40">
          <span className="text-[10px] font-mono font-bold text-amber-400 block mb-0.5">UNCERTAIN</span>
          <span className="text-xl font-extrabold text-white font-mono">{totalUncertain}</span>
          <p className="text-[10px] text-amber-300/80 mt-0.5">Needs Check</p>
        </div>

        {/* Missing */}
        <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/40">
          <span className="text-[10px] font-mono font-bold text-purple-400 block mb-0.5">MISSING</span>
          <span className="text-xl font-extrabold text-white font-mono">{totalMissing}</span>
          <p className="text-[10px] text-purple-300/80 mt-0.5">Isolated Gaps</p>
        </div>
      </div>

      {/* Dynamic calculation note */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
        <p>
          <strong className="text-slate-200">Zero Hallucination Shield:</strong> Calculated dynamically from {grandTotal} live parameters. Unknown dependencies are never guessed; they are quarantined as missing queries.
        </p>
      </div>
    </div>
  );
};
