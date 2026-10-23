import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Brain, 
  ShieldAlert, 
  CheckCircle2, 
  Target, 
  Zap, 
  Layers, 
  Sparkles, 
  RefreshCw,
  Check
} from 'lucide-react';

export interface PipelineStep {
  id: string;
  title: string;
  subtext: string;
  icon: any;
  status: 'pending' | 'active' | 'completed';
}

interface SignaturePipelineFlowProps {
  isProcessing: boolean;
  onComplete?: () => void;
  rawSnippet?: string;
  isLiveGemini?: boolean;
}

export const SignaturePipelineFlow: React.FC<SignaturePipelineFlowProps> = ({
  isProcessing,
  onComplete,
  rawSnippet = 'Messy human intent ingested...',
  isLiveGemini = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      id: 'step-1',
      title: 'MESSY HUMAN INPUT',
      subtext: 'Ingesting raw unstructured audio, document, or narrative text',
      icon: FileText,
      color: 'text-blue-400 border-blue-500/40 bg-blue-950/30',
    },
    {
      id: 'step-2',
      title: isLiveGemini ? 'GEMINI UNDERSTANDS (LIVE)' : 'GEMINI UNDERSTANDS',
      subtext: 'Deconstructing semantic layers, cadence, and urgency signals',
      icon: Brain,
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/30',
    },
    {
      id: 'step-3',
      title: 'STRUCTURED FACTS',
      subtext: 'Isolating grounded entities, timelines, and constraints',
      icon: ShieldAlert,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30',
    },
    {
      id: 'step-4',
      title: 'GROUNDING / VERIFICATION',
      subtext: 'Tri-state truth layer: Provided vs Verified vs Uncertain vs Missing',
      icon: CheckCircle2,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
    },
    {
      id: 'step-5',
      title: 'INTENT DETECTION',
      subtext: 'Synthesizing primary goal and secondary operational boundaries',
      icon: Target,
      color: 'text-pink-400 border-pink-500/40 bg-pink-950/30',
    },
    {
      id: 'step-6',
      title: 'ACTION GENERATION',
      subtext: 'Formulating DO NOW, PREPARE, VERIFY, SHARE & FOLLOW UP tasks',
      icon: Zap,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/30',
    },
    {
      id: 'step-7',
      title: 'EXECUTION-READY OUTPUT',
      subtext: 'Generating Action Center directives and exportable Action Pack',
      icon: Layers,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
    },
  ];

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStepIndex(steps.length);
      return;
    }

    setCurrentStepIndex(0);
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return steps.length;
        }
      });
    }, 450);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, steps.length]);

  if (!isProcessing && currentStepIndex >= steps.length) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Signature Gemini Intelligence Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Raw Chaos Becoming Organized Intelligence
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Witness SAARTHI transform unstructured real-world distress into verified, execution-ready actions.
          </p>
        </div>

        {/* Input Snippet Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono italic flex items-center gap-2.5">
          <span className="text-slate-500 font-bold uppercase not-italic text-[10px] px-1.5 py-0.5 rounded bg-slate-800 flex-shrink-0">
            Ingested Intent
          </span>
          <span className="line-clamp-1">{rawSnippet}</span>
        </div>

        {/* Pipeline Stepper */}
        <div className="space-y-2.5">
          {steps.map((stg, idx) => {
            const Icon = stg.icon;
            const isDone = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={stg.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? `${stg.color} ring-1 ring-cyan-400 scale-[1.02] shadow-lg shadow-cyan-500/10`
                    : isDone
                    ? 'border-slate-800 bg-slate-900/50 text-slate-400'
                    : 'border-slate-900 bg-slate-950/40 text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : isDone
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold tracking-wider ${isCurrent ? 'text-white' : ''}`}>
                        {stg.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse font-bold">
                          PROCESSING
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {stg.subtext}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold">
                    {isDone ? '✓ Grounded' : isCurrent ? 'Deconstructing...' : 'Queued'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Progress Bar */}
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Cognitive Bridge Pipeline</span>
            <span className="text-cyan-400 font-bold">
              {Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100))}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.min(100, ((currentStepIndex + 1) / steps.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
