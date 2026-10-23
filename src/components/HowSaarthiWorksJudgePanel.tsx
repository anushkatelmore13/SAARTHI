import React, { useState } from 'react';
import { 
  Brain, 
  Layers, 
  ShieldCheck, 
  Target, 
  Zap, 
  HelpCircle, 
  Award, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const HowSaarthiWorksJudgePanel: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'UNDERSTAND' | 'STRUCTURE' | 'VERIFY' | 'DECIDE' | 'ACT'>('VERIFY');

  const stages = [
    {
      key: 'UNDERSTAND' as const,
      title: '1. UNDERSTAND',
      subtitle: 'Messy Human Intent Ingestion',
      icon: Brain,
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
      summary: 'Parses chaotic speech, frantic text messages, or messy PDF scans. Isolates emotional stress, temporal urgency, and domain context without imposing premature assumptions.',
      technicalInnovation: 'Multi-modal semantic parsing trained to handle audio disfluencies, panic phrasing, and fragmented bureaucratic complaints across 7 universal societal domains.',
      societalImpact: 'Empowers everyday citizens—regardless of literacy, technical jargon, or panic—to be understood by formal institutions.',
    },
    {
      key: 'STRUCTURE' as const,
      title: '2. STRUCTURE',
      subtitle: 'Deterministic Telemetry Extraction',
      icon: Layers,
      color: 'text-blue-400 border-blue-500/40 bg-blue-950/20',
      summary: 'Deconstructs raw narrative into structured entities: locations, dates, regulatory codes, monetary amounts, equipment IDs, and statutory deadlines.',
      technicalInnovation: 'Converts unstructured human prose into formal schema representations that existing enterprise and government APIs can digest natively.',
      societalImpact: 'Removes the administrative barrier that prevents citizens from accessing public services or reporting workplace hazards.',
    },
    {
      key: 'VERIFY' as const,
      title: '3. VERIFY',
      subtitle: 'The Zero-Hallucination Truth Layer',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
      summary: 'Every extracted claim is partitioned into: PROVIDED (directly stated), VERIFIED (grounded in rules/telemetry), UNCERTAIN (hearsay/ambiguous), or MISSING (unknown dependency).',
      technicalInnovation: 'Crucial AI safety constraint: The model NEVER invents missing facts. Critical unknowns are converted into blocking verification queries rather than synthetic guesses.',
      societalImpact: 'Eliminates dangerous AI hallucinations in high-stakes legal, medical, travel, and emergency domains.',
    },
    {
      key: 'DECIDE' as const,
      title: '4. DECIDE',
      subtitle: 'Constraint & Intent Alignment',
      icon: Target,
      color: 'text-pink-400 border-pink-500/40 bg-pink-950/20',
      summary: 'Matches verified facts against real-world constraints (e.g. statutory 90-day grievance rules, I-70 highway traction laws, electrical safety codes) to formulate high-conviction intent.',
      technicalInnovation: 'Context-conditioned goal optimization that balances immediate life/financial preservation against secondary compliance protocols.',
      societalImpact: 'Navigates complex, intimidating bureaucratic regulations on behalf of vulnerable populations.',
    },
    {
      key: 'ACT' as const,
      title: '5. ACT',
      subtitle: 'Action Center & Action Pack',
      icon: Zap,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
      summary: 'Produces concrete, transparent recommendations categorized into DO NOW, PREPARE, VERIFY, SHARE, and FOLLOW UP. Every action details why it was chosen, what input was used, and what would alter it.',
      technicalInnovation: 'Generates execution-ready Action Packs containing pre-filled communications, checklist items, and audit-proof rationales ready for instant stakeholder transmission.',
      societalImpact: 'Transforms anxiety and helplessness into immediate, structured, verified agency.',
    },
  ];

  const currentInfo = stages.find(s => s.key === activeStage) || stages[2];
  const CurrentIcon = currentInfo.icon;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>How SAARTHI Works — Judge Explainability Panel</span>
            </h3>
            <p className="text-xs text-slate-400">
              The universal bridge architecture solving PromptWars: Human Intent → Complex Systems
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>PromptWars Core Architecture</span>
        </div>
      </div>

      {/* Stage Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {stages.map((stg, i) => {
          const isSelected = stg.key === activeStage;
          const Icon = stg.icon;

          return (
            <button
              key={stg.key}
              type="button"
              onClick={() => setActiveStage(stg.key)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isSelected
                  ? `${stg.color} text-white font-bold shadow-lg scale-[1.02]`
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold text-slate-500">0{i + 1}</span>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block">
                {stg.key}
              </span>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {stg.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Card for Selected Stage */}
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
            <CurrentIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {currentInfo.title}: {currentInfo.subtitle}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {currentInfo.summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
              Technical Innovation & Architecture
            </span>
            <p className="text-slate-300 leading-relaxed">
              {currentInfo.technicalInnovation}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
              Societal Benefit & Impact
            </span>
            <p className="text-slate-300 leading-relaxed">
              {currentInfo.societalImpact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
