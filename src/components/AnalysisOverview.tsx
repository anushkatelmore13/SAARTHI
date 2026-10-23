import React, { useState } from 'react';
import { CaseAnalysis } from '../types';
import { 
  AlertOctagon, 
  Target, 
  Activity, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Layers, 
  Sparkles, 
  FileText, 
  Mic, 
  Share2, 
  PackageCheck, 
  Cpu, 
  Brain,
  Zap,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface AnalysisOverviewProps {
  currentCase: CaseAnalysis;
  onOpenActions: () => void;
  onOpenGraph: () => void;
  onOpenExport: () => void;
  onOpenActionPack?: () => void;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  currentCase,
  onOpenActions,
  onOpenGraph,
  onOpenExport,
  onOpenActionPack,
}) => {
  const [showRawInput, setShowRawInput] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const urgencyStyles = {
    CRITICAL: {
      border: 'border-rose-500/50',
      bg: 'bg-rose-950/20',
      badge: 'bg-rose-950/80 text-rose-400 border-rose-800/80',
      glow: 'shadow-rose-500/10',
      iconColor: 'text-rose-400',
    },
    HIGH: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-950/20',
      badge: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
      glow: 'shadow-amber-500/10',
      iconColor: 'text-amber-400',
    },
    MODERATE: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-950/20',
      badge: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80',
      glow: 'shadow-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    LOW: {
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-950/20',
      badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
      glow: 'shadow-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
  }[currentCase.urgency];

  const isLiveGemini = currentCase.engineUsed === 'gemini-live';
  const isUnconfirmed = currentCase.confidenceBreakdown.verificationCertainty === 0;

  // Extract core decision support elements
  const doNowAction = currentCase.actions.find(a => a.category === 'DO_NOW') || currentCase.actions[0];
  const avoidAction = currentCase.actions.find(
    a => /avoid|precaution|do not/i.test(a.title) || /avoid|precaution|do not/i.test(a.description)
  ) || currentCase.actions.find(a => a.category === 'PREPARE');
  const nextAction = currentCase.actions.find(a => a.category === 'FOLLOW_UP') 
    || currentCase.actions.find(a => a.category === 'SHARE') 
    || currentCase.actions[1];
  const keyQuestions = currentCase.missingInformation.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Case Header Banner */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Pill */}
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
                {currentCase.category}
              </span>

              {/* Urgency Badge */}
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${urgencyStyles.badge}`}>
                {currentCase.urgency} URGENCY
              </span>

              {/* Honest Verification Status Pill */}
              {isUnconfirmed && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/80 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>UNCONFIRMED INPUT</span>
                </span>
              )}

              {/* Engine Attribution Badge */}
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                isLiveGemini 
                  ? 'bg-purple-950/80 text-purple-300 border-purple-800' 
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                {isLiveGemini ? <Brain className="w-3 h-3 text-purple-400" /> : <Cpu className="w-3 h-3 text-cyan-400" />}
                <span>{isLiveGemini ? 'Gemini Intelligence' : 'Deterministic Engine'}</span>
              </span>

              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
                {currentCase.inputType === 'voice' ? <Mic className="w-3 h-3 text-cyan-400" /> : <FileText className="w-3 h-3 text-slate-400" />}
                <span className="uppercase">{currentCase.inputType}</span>
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentCase.timestamp}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentCase.title}
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenActionPack && (
              <button
                type="button"
                onClick={onOpenActionPack}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-slate-950 shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
              >
                <PackageCheck className="w-4 h-4 text-slate-950" />
                <span>Generate Action Pack</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenActions}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/15 transition-all hover:scale-[1.02]"
            >
              <Layers className="w-4 h-4" />
              <span>Action Center ({currentCase.actions.length})</span>
            </button>

            <button
              type="button"
              onClick={onOpenGraph}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>View Graph</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
              title="Export Report"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Raw Input Viewer (Preserved) */}
        <div className="mt-4 pt-4 border-t border-slate-800/70">
          <button
            type="button"
            onClick={() => setShowRawInput(!showRawInput)}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {showRawInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{showRawInput ? 'Hide Raw Input Ingestion' : 'View Raw Human Input Ingestion'}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
              {currentCase.metadata?.wordCount || currentCase.rawInput.split(/\s+/).length} words
            </span>
          </button>

          {showRawInput && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
              {currentCase.rawInput}
            </div>
          )}
        </div>
      </div>

      {/* 2. Concise Single Safety Advisory Banner (No duplicate warnings, no boilerplate) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-semibold text-cyan-200">
            {currentCase.safetyDisclaimer}
          </p>
        </div>
      </div>

      {/* 3. PROMINENT IMMEDIATE SAFETY & DECISION SUPPORT SECTION (Before detailed metadata) */}
      <div className="glass-panel rounded-2xl border border-cyan-500/30 p-6 shadow-2xl space-y-6 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Immediate Safety Steps & Decision Support
              </h2>
              <p className="text-xs text-slate-400">
                Concise, practical guidance based on your report
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenActions}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Open in Action Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Core Decision Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. What should I do right now? */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <Zap className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">1. What should I do right now?</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {doNowAction?.title || 'Prioritize immediate life safety'}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {doNowAction?.description || 'Move away from immediate hazards and contact local emergency services if anyone is in danger.'}
            </p>
          </div>

          {/* 2. What should I avoid? */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertOctagon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">2. What should I avoid?</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {avoidAction?.title || 'Avoid approaching hazards or taking unverified actions'}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {avoidAction?.description || 'Do not attempt civilian suppression or enter dangerous routes. Keep access roads clear for responders.'}
            </p>
          </div>

          {/* 3. What should I do next? */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">3. What should I do next?</span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {nextAction?.title || 'Follow official instructions'}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {nextAction?.description || 'Adhere strictly to official guidance and report status to local responders once safe.'}
            </p>
          </div>

          {/* 4. What information is still needed? */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">4. What information is still needed?</span>
            </div>
            {keyQuestions.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-200">
                {keyQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-purple-400 font-bold font-mono">{idx + 1}.</span>
                    <span>{q.question}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">No critical information dependencies pending.</p>
            )}
          </div>
        </div>

        {/* Actionable Steps Overview (3-5 concise steps) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Recommended Action Plan ({currentCase.actions.length} Steps)
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {currentCase.actions.slice(0, 5).map((action, idx) => (
              <div 
                key={action.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex-shrink-0 mt-0.5">
                    Step {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {action.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {action.nextStep}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    action.urgency === 'IMMEDIATE' 
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {action.urgency}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
                    {action.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. COLLAPSIBLE DETAILED TECHNICAL ANALYSIS & TELEMETRY SECTION */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                {showDetailedAnalysis ? 'Detailed Technical Telemetry' : 'Show Detailed Technical Telemetry & Operational Metadata'}
              </span>
              <span className="text-[11px] text-slate-400 block">
                Situation synthesis, intent breakdown, assumptions, and heuristic confidence scores
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <span>{showDetailedAnalysis ? 'Collapse' : 'Expand'}</span>
            {showDetailedAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDetailedAnalysis && (
          <div className="p-6 pt-2 border-t border-slate-800/80 space-y-6 animate-in fade-in duration-200">
            {/* Grid: Situation, Intent, Urgency, Confidence */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Situation & Intent (2 cols on large screen) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Situation Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-mono uppercase font-bold text-slate-300">Situation Synthesized</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentCase.situationDetected}
                  </p>
                </div>

                {/* Intent Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-mono uppercase font-bold text-slate-300">Intent Synthesis</h3>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40">
                    <span className="text-[10px] font-mono uppercase font-bold text-purple-400 tracking-wider">
                      Primary Intent
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 mt-0.5">
                      {currentCase.primaryIntent}
                    </p>
                  </div>

                  {currentCase.secondaryIntents.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Secondary Operational Constraints
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentCase.secondaryIntents.map((intent, idx) => (
                          <div
                            key={idx}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                            <span className="line-clamp-2">{intent}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assumptions List if present */}
                  {currentCase.assumptions && currentCase.assumptions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider block mb-1">
                        System Assumptions:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {currentCase.assumptions.map((assump, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-cyan-400 font-mono">•</span>
                            <span>{assump}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Urgency & Confidence Breakdown (1 col) */}
              <div className="space-y-6">
                {/* Urgency Card */}
                <div className={`p-4 rounded-xl bg-slate-900/60 border ${urgencyStyles.border} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono uppercase font-bold">Urgency Reasoning</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${urgencyStyles.badge}`}>
                      {currentCase.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentCase.urgencyReasoning}
                  </p>
                </div>

                {/* Confidence Metrics Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono uppercase font-bold">Input Completeness</span>
                    <span className="text-sm font-mono font-bold text-cyan-400">
                      {currentCase.confidenceBreakdown.inputCoherence}%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Input Density</span>
                      <span className="font-mono text-slate-200">{currentCase.confidenceBreakdown.inputCoherence}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${currentCase.confidenceBreakdown.inputCoherence}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Fact Grounding</span>
                      <span className="font-mono text-slate-200">{currentCase.confidenceBreakdown.factGrounding}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${currentCase.confidenceBreakdown.factGrounding}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Verification Certainty</span>
                      <span className="font-mono text-slate-200">{currentCase.confidenceBreakdown.verificationCertainty}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${currentCase.confidenceBreakdown.verificationCertainty}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
