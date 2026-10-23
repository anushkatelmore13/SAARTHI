import React, { useState } from 'react';
import type { GraphNode, GraphStage } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Mic, 
  Brain, 
  ShieldAlert, 
  Target, 
  Zap, 
  Activity
} from 'lucide-react';

interface IntentActionGraphProps {
  nodes: GraphNode[];
  onSelectActionNode?: (nodeTitle: string) => void;
}

export const IntentActionGraph: React.FC<IntentActionGraphProps> = ({
  nodes,
  onSelectActionNode,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [isSimulating, setIsSimulating] = useState(false);

  const stages: { stage: GraphStage; title: string; color: string; desc: string }[] = [
    { stage: 'INPUT', title: '1. Human Input', color: 'from-blue-500 to-cyan-500', desc: 'Messy real-world input' },
    { stage: 'UNDERSTAND', title: '2. Understanding', color: 'from-cyan-500 to-teal-500', desc: 'Semantic extraction' },
    { stage: 'FACTS', title: '3. Grounded Facts', color: 'from-emerald-500 to-green-500', desc: 'Telemetry & entities' },
    { stage: 'VERIFICATION', title: '4. Verification', color: 'from-amber-500 to-yellow-500', desc: 'Tri-state truth triage' },
    { stage: 'INTENT', title: '5. Resolved Intent', color: 'from-purple-500 to-pink-500', desc: 'Prioritized objective' },
    { stage: 'ACTIONS', title: '6. Recommended Actions', color: 'from-rose-500 to-red-500', desc: 'Action Center dispatch' },
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Group nodes by stage
  const nodesByStage: Record<GraphStage, GraphNode[]> = {
    INPUT: nodes.filter(n => n.stage === 'INPUT'),
    UNDERSTAND: nodes.filter(n => n.stage === 'UNDERSTAND'),
    FACTS: nodes.filter(n => n.stage === 'FACTS'),
    VERIFICATION: nodes.filter(n => n.stage === 'VERIFICATION'),
    INTENT: nodes.filter(n => n.stage === 'INTENT'),
    ACTIONS: nodes.filter(n => n.stage === 'ACTIONS'),
  };

  const getNodeStatusStyles = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300';
      case 'uncertain':
        return 'border-amber-500/60 bg-amber-950/30 text-amber-300';
      case 'missing':
        return 'border-purple-500/60 bg-purple-950/30 text-purple-300';
      case 'urgent':
        return 'border-rose-500/60 bg-rose-950/30 text-rose-300 animate-pulse-subtle';
      case 'primary':
        return 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300';
      default:
        return 'border-slate-700 bg-slate-900/60 text-slate-300';
    }
  };

  const getStageIcon = (stage: GraphStage) => {
    switch (stage) {
      case 'INPUT': return Mic;
      case 'UNDERSTAND': return Brain;
      case 'FACTS': return ShieldAlert;
      case 'VERIFICATION': return CheckCircle2;
      case 'INTENT': return Target;
      case 'ACTIONS': return Zap;
      default: return Activity;
    }
  };

  const handleSimulatePipeline = () => {
    setIsSimulating(true);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < nodes.length) {
        setSelectedNodeId(nodes[idx].id);
        idx++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Header */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Signature Feature: Intent → Action Graph
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual cognitive pipeline tracing messy human intent through understanding and verification into actionable directives.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulatePipeline}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSimulating
                  ? 'bg-purple-900/40 text-purple-300 border border-purple-700/60 animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/20'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Simulating Pipeline Flow...' : 'Simulate Graph Flow'}</span>
            </button>
          </div>
        </div>

        {/* Pipeline Stage Indicators Banner */}
        <div className="hidden lg:grid grid-cols-6 gap-2 pt-4 border-t border-slate-800/80">
          {stages.map((stg, i) => (
            <div key={stg.stage} className="text-center relative">
              <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                {stg.title}
              </div>
              <p className="text-[10px] text-slate-500">{stg.desc}</p>
              {i < 5 && (
                <div className="hidden lg:block absolute -right-2 top-3 text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-x-auto">
        <div className="min-w-[950px] space-y-6">
          {/* Visual Columnar Pipeline */}
          <div className="grid grid-cols-6 gap-3">
            {stages.map(stg => {
              const stageNodes = nodesByStage[stg.stage] || [];
              const Icon = getStageIcon(stg.stage);

              return (
                <div
                  key={stg.stage}
                  className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-slate-800/60">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-tight">
                      {stg.stage}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {stageNodes.length === 0 ? (
                      <div className="p-3 text-center text-[10px] text-slate-600 font-mono">
                        No nodes
                      </div>
                    ) : (
                      stageNodes.map(node => {
                        const isSelected = node.id === selectedNodeId;
                        const statusClass = getNodeStatusStyles(node.status);

                        return (
                          <div
                            key={node.id}
                            onClick={() => {
                              setSelectedNodeId(node.id);
                              if (node.stage === 'ACTIONS' && onSelectActionNode) {
                                onSelectActionNode(node.title);
                              }
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${statusClass} ${
                              isSelected
                                ? 'ring-2 ring-cyan-400 scale-[1.03] shadow-lg shadow-cyan-500/20'
                                : 'hover:scale-[1.01] hover:border-cyan-400/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider line-clamp-1">
                                {node.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2">
                              {node.detail}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Inspector Drawer */}
          {selectedNode && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                    Stage: {selectedNode.stage}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Node ID: {selectedNode.id}</span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedNode.title}</h3>
                <p className="text-xs text-slate-300">{selectedNode.detail}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-400 font-mono">
                  {selectedNode.targetIds.length > 0 ? `→ ${selectedNode.targetIds.length} Downstream Dependencies` : 'Terminal Execution Node'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
