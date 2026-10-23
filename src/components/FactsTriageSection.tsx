import React, { useState } from 'react';
import { FactItem, MissingInfoItem } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  Quote, 
  Sparkles,
  PlusCircle,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface FactsTriageSectionProps {
  facts: FactItem[];
  missingInfo: MissingInfoItem[];
  onResolveMissingItem: (item: MissingInfoItem) => void;
}

export const FactsTriageSection: React.FC<FactsTriageSectionProps> = ({
  facts,
  missingInfo,
  onResolveMissingItem,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PROVIDED' | 'VERIFIED' | 'UNCERTAIN' | 'MISSING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTrustId, setExpandedTrustId] = useState<string | null>(null);

  const providedFacts = facts.filter(f => f.status === 'PROVIDED');
  const verifiedFacts = facts.filter(f => f.status === 'VERIFIED');
  const uncertainFacts = facts.filter(f => f.status === 'UNCERTAIN');

  const filteredProvided = providedFacts.filter(f => 
    f.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVerified = verifiedFacts.filter(f => 
    f.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUncertain = uncertainFacts.filter(f => 
    f.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMissing = missingInfo.filter(m => 
    m.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.impact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTrust = (id: string) => {
    setExpandedTrustId(prev => (prev === id ? null : id));
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              The Truth Layer — Grounded Verification
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero hallucination guarantee: Every parameter is strictly classified as Provided, Verified, Uncertain, or Missing.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'ALL'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({facts.length + missingInfo.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('PROVIDED')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              filter === 'PROVIDED'
                ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/40'
                : 'text-blue-400/80 hover:text-blue-300'
            }`}
          >
            <span>✓ Provided ({providedFacts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('VERIFIED')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              filter === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                : 'text-emerald-400/80 hover:text-emerald-300'
            }`}
          >
            <span>✓ Verified ({verifiedFacts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('UNCERTAIN')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              filter === 'UNCERTAIN'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <span>⚠ Uncertain ({uncertainFacts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('MISSING')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              filter === 'MISSING'
                ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40'
                : 'text-purple-400/80 hover:text-purple-300'
            }`}
          >
            <span>? Missing ({missingInfo.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter extracted facts, entities, statutes, or missing questions..."
          className="w-full rounded-xl bg-slate-900/80 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Grid of Facts & Information */}
      <div className="space-y-6">
        {/* SECTION 1: PROVIDED FACTS */}
        {(filter === 'ALL' || filter === 'PROVIDED') && filteredProvided.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Provided Information ({filteredProvided.length})</span>
              <span className="text-[11px] text-slate-500 font-normal lowercase">• directly stated in human input</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredProvided.map(f => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl bg-blue-950/15 border border-blue-800/40 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-bold uppercase">
                        {f.category}
                      </span>
                      <span className="text-[10px] font-mono text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800">
                        ✓ PROVIDED ({f.confidence}%)
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-300 mb-1">{f.label}</h4>
                    <p className="text-sm font-semibold text-slate-100 mb-2">{f.value}</p>

                    {f.sourceQuote && (
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5 font-mono italic mb-2">
                        <Quote className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>"{f.sourceQuote}"</span>
                      </div>
                    )}
                  </div>

                  {/* "Why do we trust this?" interaction */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => toggleTrust(f.id)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      <Info className="w-3 h-3 text-blue-400" />
                      <span>Why do we trust this?</span>
                      {expandedTrustId === f.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedTrustId === f.id && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-900/90 border border-blue-800/60 text-[11px] text-slate-300 animate-in fade-in">
                        <strong>Source Grounding:</strong> {f.whyDoWeTrustThis || f.rationale}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: VERIFIED FACTS */}
        {(filter === 'ALL' || filter === 'VERIFIED') && filteredVerified.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Verified Information ({filteredVerified.length})</span>
              <span className="text-[11px] text-slate-500 font-normal lowercase">• validated against regulations & telemetry</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredVerified.map(f => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-800/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 font-bold uppercase">
                        {f.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                        ✓ VERIFIED ({f.confidence}%)
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-300 mb-1">{f.label}</h4>
                    <p className="text-sm font-semibold text-slate-100 mb-2">{f.value}</p>

                    {f.sourceQuote && (
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5 font-mono italic mb-2">
                        <Quote className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>"{f.sourceQuote}"</span>
                      </div>
                    )}
                  </div>

                  {/* "Why do we trust this?" interaction */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => toggleTrust(f.id)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      <Info className="w-3 h-3 text-emerald-400" />
                      <span>Why do we trust this?</span>
                      {expandedTrustId === f.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedTrustId === f.id && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-900/90 border border-emerald-800/60 text-[11px] text-slate-300 animate-in fade-in">
                        <strong>Corroboration:</strong> {f.whyDoWeTrustThis || f.rationale}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: UNCERTAIN FACTS */}
        {(filter === 'ALL' || filter === 'UNCERTAIN') && filteredUncertain.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>⚠ Uncertain Information ({filteredUncertain.length})</span>
              <span className="text-[11px] text-slate-500 font-normal lowercase">• contains speculative phrasing or hearsay</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredUncertain.map(f => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl bg-amber-950/15 border border-amber-800/40 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-bold uppercase">
                        {f.category}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800">
                        ⚠ UNCERTAIN ({f.confidence}%)
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-300 mb-1">{f.label}</h4>
                    <p className="text-sm font-semibold text-amber-200 mb-2">{f.value}</p>

                    {f.sourceQuote && (
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5 font-mono italic mb-2">
                        <Quote className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>"{f.sourceQuote}"</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-amber-300/80 mt-2">
                    <strong>Audit Caveat:</strong> {f.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: MISSING INFORMATION */}
        {(filter === 'ALL' || filter === 'MISSING') && filteredMissing.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>? Unknown / Missing Information ({filteredMissing.length})</span>
                <span className="text-[11px] text-slate-500 font-normal lowercase">• AI will NEVER hallucinate these</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">Interactive: Click "Answer" to resolve</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredMissing.map(m => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 hover:border-purple-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        m.importance === 'BLOCKING'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                          : 'bg-purple-950/80 text-purple-300 border border-purple-800/80'
                      }`}>
                        ? {m.importance} GAP
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {m.question}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-purple-300">Operational Impact:</strong> {m.impact}
                    </p>

                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <FileQuestion className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span><strong>Suggested Verification Query:</strong> {m.queryPrompt}</span>
                    </div>

                    {m.resolved && m.resolvedValue && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span><strong>Resolved by User:</strong> {m.resolvedValue}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onResolveMissingItem(m)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all hover:scale-105"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{m.resolved ? 'Update Answer' : 'Answer / Verify'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
