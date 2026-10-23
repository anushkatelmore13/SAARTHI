import React from 'react';
import { 
  Compass, 
  Settings, 
  Sparkles, 
  Layers, 
  Activity,
  Cpu,
  Brain,
  Award
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface HeaderProps {
  onOpenSettings: () => void;
  onGoHome: () => void;
  onOpenJudgePanel?: () => void;
  activeCaseCount: number;
  currentView: 'dashboard' | 'analysis' | 'actions' | 'graph';
  onViewChange: (view: 'dashboard' | 'analysis' | 'actions' | 'graph') => void;
  hasCurrentCase: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onGoHome,
  onOpenJudgePanel,
  activeCaseCount,
  currentView,
  onViewChange,
  hasCurrentCase,
}) => {
  const hasKey = geminiService.hasApiKey();
  const currentModel = geminiService.getModel();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-105 transition-all shadow-lg shadow-cyan-500/10">
            <Compass className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                SAARTHI
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold tracking-wider">
                Universal Intent Bridge
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block tracking-tight">
              From Human Intent to Verified Action
            </p>
          </div>
        </div>

        {/* View Switcher (when a case is loaded) */}
        {hasCurrentCase && (
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => onViewChange('analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'analysis'
                  ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Situation & Truth Layer</span>
            </button>
            <button
              onClick={() => onViewChange('actions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'actions'
                  ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Action Center</span>
            </button>
            <button
              onClick={() => onViewChange('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'graph'
                  ? 'bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intent → Action Graph</span>
            </button>
          </nav>
        )}

        {/* Status, Judge Panel & Settings */}
        <div className="flex items-center gap-2.5">
          {/* Judge Explainability Button */}
          {onOpenJudgePanel && (
            <button
              type="button"
              onClick={onOpenJudgePanel}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/80 text-purple-300 text-xs font-semibold transition-all hover:scale-105"
            >
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>
          )}

          {/* Engine Indicator (Honest labeling) */}
          <div 
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700 transition-colors"
            title={hasKey ? `Using Gemini API (${currentModel})` : 'Using Deterministic Intelligence Engine (Demo Mode)'}
          >
            {hasKey ? (
              <>
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline text-cyan-300 font-medium">Gemini Intelligence (Live)</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline text-amber-300 font-medium">Deterministic Engine</span>
              </>
            )}
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings and API Configuration"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
