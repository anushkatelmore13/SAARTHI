import React, { useState } from 'react';
import { ActionPackData } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  PackageCheck, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  MessageSquare
} from 'lucide-react';

interface ActionPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionPack?: ActionPackData;
  caseTitle: string;
}

export const ActionPackModal: React.FC<ActionPackModalProps> = ({
  isOpen,
  onClose,
  actionPack,
  caseTitle,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [checklist, setChecklist] = useState(actionPack?.checklist || []);

  if (!isOpen || !actionPack) return null;

  const handleToggleCheck = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const generateFullPackMarkdown = () => {
    return `# SAARTHI ACTION PACK: ${caseTitle}
*From Human Intent to Verified Action*
Generated: ${actionPack.generatedAt}

## 1. SITUATION SUMMARY
${actionPack.situationSummary}

## 2. KEY GROUNDED FACTS
${actionPack.keyFacts.map(f => `- [${f.status}] ${f.label}: ${f.value}`).join('\n')}

## 3. MISSING INFORMATION (BLOCKING GAPS)
${actionPack.missingInformation.map(m => `- [?] ${m}`).join('\n')}

## 4. RECOMMENDED ACTIONS
${actionPack.recommendedActions.map((a, i) => `${i + 1}. [${a.category}] ${a.title} (${a.readiness})\n   → Next Step: ${a.nextStep}`).join('\n')}

## 5. OPERATIONAL CHECKLIST
${checklist.map(c => `- [${c.completed ? 'x' : ' '}] ${c.text}`).join('\n')}

## 6. QUESTIONS TO ASK
${actionPack.questionsToAsk.map(q => `• ${q}`).join('\n')}

## 7. READY-TO-SHARE BRIEF
"""
${actionPack.informationToShare}
"""

---
*Notice: SAARTHI orchestrates operational triage and protocol compliance.*
`;
  };

  const handleDownload = () => {
    const text = generateFullPackMarkdown();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // .txt so macOS opens in TextEdit instead of the IDE (.md is mapped to the code editor)
    a.download = `SAARTHI_Action_Pack_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-4xl rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Compact Structured Output</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Action Pack: {caseTitle}
            </h2>
            <p className="text-xs text-slate-400">
              Generated at {actionPack.generatedAt} • Ready for stakeholder handoff and operational execution
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

        {/* Action Pack Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-300 font-medium">
            Export all structured directives, key facts, and dispatch briefs:
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(generateFullPackMarkdown(), 'full')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all"
            >
              {copiedSection === 'full' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Pack Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Entire Pack</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
          </div>
        </div>

        {/* 1. Situation Summary */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
            • Situation Summary
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {actionPack.situationSummary}
          </p>
        </div>

        {/* 2 & 3. Key Facts and Missing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Facts */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>• Key Grounded Facts ({actionPack.keyFacts.length})</span>
            </span>
            <div className="space-y-1.5">
              {actionPack.keyFacts.map((fact, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">{fact.label}:</span>
                  <span className="line-clamp-1 text-slate-300">{fact.value}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex-shrink-0">
                    {fact.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Information */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-purple-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>• Missing Information ({actionPack.missingInformation.length})</span>
            </span>
            <div className="space-y-1.5">
              {actionPack.missingInformation.map((item, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Recommended Actions */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-cyan-400 block">
            • Recommended Actions & Next Steps
          </span>
          <div className="space-y-2">
            {actionPack.recommendedActions.map((act, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{act.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                      {act.readiness}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5">
                    <strong>Next Step:</strong> {act.nextStep}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Interactive Checklist */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-slate-300 block">
            • Interactive Operational Checklist ({checklist.filter(c => c.completed).length}/{checklist.length})
          </span>
          <div className="space-y-1.5">
            {checklist.map(item => (
              <label
                key={item.id}
                onClick={() => handleToggleCheck(item.id)}
                className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400 line-through'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 6. Questions to Ask */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-amber-400 block">
            • Questions to Ask Counterparts / Officials
          </span>
          <div className="space-y-1.5">
            {actionPack.questionsToAsk.map((q, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-amber-950/15 border border-amber-800/30 text-xs text-amber-200 flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Ready-to-Share Brief */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>• Ready-to-Share Brief (For Email / SMS / Radio)</span>
            </span>

            <button
              type="button"
              onClick={() => copyToClipboard(actionPack.informationToShare, 'share')}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {copiedSection === 'share' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Brief Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200 select-all leading-relaxed whitespace-pre-wrap">
            {actionPack.informationToShare}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Action Pack
          </button>
        </div>
      </div>
    </div>
  );
};
