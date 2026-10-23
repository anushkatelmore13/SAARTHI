import React, { useState } from 'react';
import { Header } from './components/Header';
import { CentralInputSection } from './components/CentralInputSection';
import { RecentCasesSection } from './components/RecentCasesSection';
import { ActivePlansSection } from './components/ActivePlansSection';
import { VerificationHealthWidget } from './components/VerificationHealthWidget';
import { AnalysisOverview } from './components/AnalysisOverview';
import { FactsTriageSection } from './components/FactsTriageSection';
import { ActionCenter } from './components/ActionCenter';
import { IntentActionGraph } from './components/IntentActionGraph';
import { WhyThisActionModal } from './components/WhyThisActionModal';
import { ResolveMissingInfoModal } from './components/ResolveMissingInfoModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportReportModal } from './components/ExportReportModal';
import { ActionPackModal } from './components/ActionPackModal';
import { HowSaarthiWorksJudgePanel } from './components/HowSaarthiWorksJudgePanel';
import { SignaturePipelineFlow } from './components/SignaturePipelineFlow';
import { DEMO_CASES } from './data/demoCases';
import { CaseAnalysis, InputSourceType, ActionItem, MissingInfoItem, FactItem } from './types';
import { geminiService } from './services/geminiService';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  PackageCheck,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [cases, setCases] = useState<CaseAnalysis[]>(DEMO_CASES);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'analysis' | 'actions' | 'graph'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animated Signature Pipeline Flow state
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pendingSnippet, setPendingSnippet] = useState<string>('');

  // Modals state
  const [whyThisActionModal, setWhyThisActionModal] = useState<ActionItem | null>(null);
  const [resolveMissingModal, setResolveMissingModal] = useState<MissingInfoItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isActionPackOpen, setIsActionPackOpen] = useState(false);
  const [isJudgePanelOpen, setIsJudgePanelOpen] = useState(false);

  const currentCase = cases.find(c => c.id === currentCaseId) || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Input Submission (Custom Text / Voice / File)
  const handleSubmitInput = async (
    text: string, 
    inputType: InputSourceType, 
    metadata?: any
  ) => {
    setIsLoading(true);
    setPendingSnippet(text.slice(0, 90));
    setIsPipelineRunning(true);

    try {
      const { analysis, source } = await geminiService.analyzeInput(text, inputType, metadata);
      setCases(prev => [analysis, ...prev]);
      setCurrentCaseId(analysis.id);

      // Wait for pipeline animation step completion
      setTimeout(() => {
        setIsPipelineRunning(false);
        setCurrentView('analysis');

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#a855f7', '#3b82f6'],
          });
        } catch (_) {}

        showToast(
          source === 'gemini-live'
            ? 'Live Gemini AI structured analysis completed!'
            : 'Deterministic Intelligence Engine structured analysis completed!'
        );
      }, 2600);
    } catch (err: any) {
      console.error(err);
      setIsPipelineRunning(false);
      showToast('Error processing input. Please check configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Select Demo Case (Runs the signature cognitive pipeline flow)
  const handleSelectDemoCase = (caseId: string) => {
    const selected = cases.find(c => c.id === caseId);
    if (selected) {
      setPendingSnippet(selected.rawInput.slice(0, 90));
      setIsPipelineRunning(true);
      setCurrentCaseId(caseId);

      setTimeout(() => {
        setIsPipelineRunning(false);
        setCurrentView('analysis');
        showToast(`Loaded ${selected.category} demo scenario.`);
      }, 2400);
    }
  };

  // Toggle Action Status (Pending -> Completed)
  const handleToggleActionStatus = (actionId: string) => {
    if (!currentCaseId) return;

    setCases(prev =>
      prev.map(c => {
        if (c.id !== currentCaseId) return c;
        return {
          ...c,
          actions: c.actions.map(a => {
            if (a.id !== actionId) return a;
            const newStatus = a.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
            return { ...a, status: newStatus };
          }),
        };
      })
    );
  };

  // Toggle Checklist Item inside an action
  const handleToggleChecklistItem = (actionId: string, checkId: string) => {
    if (!currentCaseId) return;

    setCases(prev =>
      prev.map(c => {
        if (c.id !== currentCaseId) return c;
        return {
          ...c,
          actions: c.actions.map(a => {
            if (a.id !== actionId || !a.prefilledData?.checklistItems) return a;
            return {
              ...a,
              prefilledData: {
                ...a.prefilledData,
                checklistItems: a.prefilledData.checklistItems.map(item =>
                  item.id === checkId ? { ...item, done: !item.done } : item
                ),
              },
            };
          }),
        };
      })
    );
  };

  // Resolve Missing Information item (Interactive demo wow feature)
  const handleResolveMissingItem = (itemId: string, answer: string) => {
    if (!currentCaseId) return;

    setCases(prev =>
      prev.map(c => {
        if (c.id !== currentCaseId) return c;

        const targetMissing = c.missingInformation.find(m => m.id === itemId);
        if (!targetMissing) return c;

        // Create a new verified fact from the resolved question
        const newVerifiedFact: FactItem = {
          id: `f-resolved-${Date.now()}`,
          category: 'status',
          label: `Resolved: ${targetMissing.question.slice(0, 36)}...`,
          value: answer,
          status: 'VERIFIED',
          confidence: 99,
          rationale: 'Confirmed on-scene by responder verification.',
          whyDoWeTrustThis: 'Direct stakeholder submission resolving identified information gap.',
        };

        // Recalculate genuine dynamic confidence metrics
        const updatedVerifiedFacts = [newVerifiedFact, ...c.extractedFacts];
        const verifiedCount = updatedVerifiedFacts.filter(f => f.status === 'VERIFIED').length;
        const providedCount = updatedVerifiedFacts.filter(f => f.status === 'PROVIDED').length;
        const totalItems = updatedVerifiedFacts.length + c.missingInformation.length - 1;

        const factGrounding = Math.min(100, Math.round(((verifiedCount + providedCount) / Math.max(1, totalItems)) * 100));
        const verificationCertainty = Math.min(100, Math.round(((verifiedCount * 1.0 + providedCount * 0.8) / Math.max(1, updatedVerifiedFacts.length)) * 100));
        const updatedConfidence = Math.min(99, Math.round((c.confidenceBreakdown.inputCoherence * 0.3) + (factGrounding * 0.4) + (verificationCertainty * 0.3)));

        return {
          ...c,
          overallConfidence: updatedConfidence,
          extractedFacts: updatedVerifiedFacts,
          missingInformation: c.missingInformation.map(m =>
            m.id === itemId ? { ...m, resolved: true, resolvedValue: answer } : m
          ),
          confidenceBreakdown: {
            ...c.confidenceBreakdown,
            factGrounding,
            verificationCertainty,
          },
        };
      })
    );

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4'],
      });
    } catch (_) {}

    showToast('Missing fact resolved & verified! Plan updated in real-time.');
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col mesh-grid selection:bg-cyan-500 selection:text-slate-950">
      {/* Background radiant orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Global Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setCurrentView('dashboard')}
        onOpenJudgePanel={() => setIsJudgePanelOpen(true)}
        activeCaseCount={cases.length}
        currentView={currentView}
        onViewChange={v => setCurrentView(v)}
        hasCurrentCase={!!currentCase}
      />

      {/* Signature Animated Pipeline Flow (Active during input/scenario loading) */}
      <SignaturePipelineFlow
        isProcessing={isPipelineRunning}
        onComplete={() => setIsPipelineRunning(false)}
        rawSnippet={pendingSnippet}
        isLiveGemini={geminiService.hasApiKey()}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/60 shadow-2xl shadow-cyan-500/20 text-xs text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: LANDING / DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Central Interaction: "Tell me what happened." */}
            <CentralInputSection
              onSubmit={handleSubmitInput}
              isLoading={isLoading || isPipelineRunning}
              onSelectDemoCase={handleSelectDemoCase}
            />

            {/* Judge-Facing Innovation Panel */}
            <HowSaarthiWorksJudgePanel />

            {/* Dashboard Operational Widgets: Recent Cases, Active Plans, Truth Layer Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <RecentCasesSection
                  cases={cases}
                  activeCaseId={currentCaseId}
                  onSelectCase={id => {
                    setCurrentCaseId(id);
                    setCurrentView('analysis');
                  }}
                />
              </div>

              <div className="lg:col-span-1">
                <ActivePlansSection
                  cases={cases}
                  onOpenActionCenter={id => {
                    setCurrentCaseId(id);
                    setCurrentView('actions');
                  }}
                />
              </div>

              <div className="lg:col-span-1">
                <VerificationHealthWidget cases={cases} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DEEP ANALYSIS SCREEN */}
        {currentView === 'analysis' && currentCase && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Back to Dashboard Navigation Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Central Input Dashboard</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsActionPackOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/40 to-cyan-500/40 border border-purple-500/60 text-white text-xs font-bold hover:scale-105 transition-all shadow-md"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Generate Action Pack</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('actions')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-semibold hover:border-cyan-500 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Action Center ({currentCase.actions.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('graph')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-semibold hover:border-purple-500 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Graph</span>
                </button>
              </div>
            </div>

            {/* 1. Situation, Intent, Urgency, Confidence, Safety Disclaimer */}
            <AnalysisOverview
              currentCase={currentCase}
              onOpenActions={() => setCurrentView('actions')}
              onOpenGraph={() => setCurrentView('graph')}
              onOpenExport={() => setIsExportOpen(true)}
              onOpenActionPack={() => setIsActionPackOpen(true)}
            />

            {/* 4, 5 & 6. The Truth Layer (Provided, Verified, Uncertain, Missing) */}
            <FactsTriageSection
              facts={currentCase.extractedFacts}
              missingInfo={currentCase.missingInformation}
              onResolveMissingItem={item => setResolveMissingModal(item)}
            />
          </div>
        )}

        {/* VIEW 3: ACTION CENTER */}
        {currentView === 'actions' && currentCase && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('analysis')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Situation & Truth Layer</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsActionPackOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/40 to-cyan-500/40 border border-purple-500/60 text-white text-xs font-bold hover:scale-105 transition-all shadow-md"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Generate Action Pack</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('graph')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-semibold hover:border-purple-500 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Intent → Action Graph</span>
                </button>
              </div>
            </div>

            <ActionCenter
              actions={currentCase.actions}
              onToggleStatus={handleToggleActionStatus}
              onOpenWhyThisAction={action => setWhyThisActionModal(action)}
              onGenerateActionPack={() => setIsActionPackOpen(true)}
              onToggleChecklistItem={handleToggleChecklistItem}
            />
          </div>
        )}

        {/* VIEW 4: SIGNATURE INTENT → ACTION GRAPH */}
        {currentView === 'graph' && currentCase && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('analysis')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Situation & Truth Layer</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsActionPackOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-semibold hover:border-purple-500 transition-colors"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Action Pack</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('actions')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-semibold hover:border-cyan-500 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Action Center</span>
                </button>
              </div>
            </div>

            <IntentActionGraph
              nodes={currentCase.graphNodes}
              onSelectActionNode={() => setCurrentView('actions')}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <WhyThisActionModal
        action={whyThisActionModal}
        onClose={() => setWhyThisActionModal(null)}
      />

      <ResolveMissingInfoModal
        item={resolveMissingModal}
        onClose={() => setResolveMissingModal(null)}
        onResolve={handleResolveMissingItem}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => showToast('Engine settings updated.')}
      />

      <ExportReportModal
        caseAnalysis={currentCase}
        onClose={() => setIsExportOpen(false)}
      />

      <ActionPackModal
        isOpen={isActionPackOpen}
        onClose={() => setIsActionPackOpen(false)}
        actionPack={currentCase?.actionPack}
        caseTitle={currentCase?.title || 'Current Incident'}
      />

      {/* Judge Panel Modal triggerable from header */}
      {isJudgePanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl relative">
            <button
              type="button"
              onClick={() => setIsJudgePanelOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <HowSaarthiWorksJudgePanel />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/70 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SAARTHI — From Human Intent to Verified Action</span>
          <span>Zero-Hallucination Truth Layer • PromptWars Competition Entry</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
