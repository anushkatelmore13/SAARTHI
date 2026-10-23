import React, { useState } from 'react';
import { CaseAnalysis } from '../types';
import { X, Copy, Check, Download, FileText, Code } from 'lucide-react';

interface ExportReportModalProps {
  caseAnalysis: CaseAnalysis | null;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ caseAnalysis, onClose }) => {
  if (!caseAnalysis) return null;

  const [activeTab, setActiveTab] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    return `# SAARTHI Incident & Action Report: ${caseAnalysis.title}
**Tagline:** From Human Intent to Verified Action
**Generated:** ${caseAnalysis.timestamp}
**Urgency Tier:** ${caseAnalysis.urgency}
**Overall Grounded Confidence:** ${caseAnalysis.overallConfidence}%

---

## 1. Raw Ingestion
**Modality:** ${caseAnalysis.inputType.toUpperCase()}
> ${caseAnalysis.rawInput}

---

## 2. Situation Detected
${caseAnalysis.situationDetected}

---

## 3. Mission Intent
**Primary Intent:** ${caseAnalysis.primaryIntent}
**Secondary Intents:**
${caseAnalysis.secondaryIntents.map(i => `- ${i}`).join('\n')}

---

## 4. Urgency Calibration
**Tier:** ${caseAnalysis.urgency}
**Reasoning:** ${caseAnalysis.urgencyReasoning}

---

## 5. Extracted Grounded Facts (Tri-State Triage)
### ✓ Verified Facts
${caseAnalysis.extractedFacts.filter(f => f.status === 'VERIFIED').map(f => `- **${f.label}**: ${f.value} (${f.confidence}% Grounded)`).join('\n')}

### ⚠ Uncertain Facts
${caseAnalysis.extractedFacts.filter(f => f.status === 'UNCERTAIN').map(f => `- **${f.label}**: ${f.value} [Caveat: ${f.rationale}]`).join('\n') || '- None'}

### ? Missing Critical Information (AI Never Hallucinates)
${caseAnalysis.missingInformation.map(m => `- **[${m.importance}] ${m.question}**\n  - *Impact:* ${m.impact}\n  - *Verification Query:* ${m.queryPrompt}${m.resolved ? `\n  - *Resolved:* ${m.resolvedValue}` : ''}`).join('\n')}

---

## 6. Action Center Directives
${caseAnalysis.actions.map((act, i) => `### ${i + 1}. [${act.category}] ${act.title}
- **Assigned Role:** ${act.assignedRole}
- **Urgency:** ${act.urgency}
- **Status:** ${act.status}
- **Description:** ${act.description}
- **Why this action?**
  - *Reasoning:* ${act.whyThisAction.reasoning}
  - *Driving Facts:* ${act.whyThisAction.drivingFacts.join(', ')}
  - *Risk if Omitted:* ${act.whyThisAction.riskIfOmitted}
`).join('\n')}

---
*Safety Notice: SAARTHI orchestrates operational triage. It is not a medical diagnosis; medical emergencies require certified medical responders.*
`;
  };

  const markdownContent = generateMarkdown();
  const jsonContent = JSON.stringify(caseAnalysis, null, 2);
  const activeContent = activeTab === 'markdown' ? markdownContent : jsonContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // .txt for markdown exports so all OSes open in the default text editor
    // (macOS maps .md to the IDE; .txt always opens in TextEdit or Notepad)
    const ext = activeTab === 'markdown' ? 'txt' : 'json';
    const mimeType = activeTab === 'markdown' ? 'text/plain;charset=utf-8' : 'application/json';
    const blob = new Blob([activeContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAARTHI_${caseAnalysis.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-3xl rounded-2xl border border-cyan-500/40 p-6 shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Export Structured Action Report</h3>
            <p className="text-xs text-slate-400">Share with command staff or archive for audit</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'markdown'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'json'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON Schema</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {activeContent}
        </div>
      </div>
    </div>
  );
};
