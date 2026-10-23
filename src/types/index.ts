export type InputSourceType = 'text' | 'voice' | 'image' | 'document';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type DomainCategory = 
  | 'Emergency / Safety'
  | 'Weather / Travel'
  | 'Government / Public Services'
  | 'News / Information'
  | 'Documents / Forms'
  | 'Healthcare Information'
  | 'Workplace / Operational Incidents';

export type FactStatus = 'PROVIDED' | 'VERIFIED' | 'UNCERTAIN' | 'MISSING';

export type FactCategory = 'entity' | 'location' | 'time' | 'hazard' | 'resource' | 'status' | 'constraint' | 'document' | 'deadline';

export interface FactItem {
  id: string;
  category: FactCategory;
  label: string;
  value: string;
  status: FactStatus;
  confidence: number; // 0 - 100
  sourceQuote?: string;
  rationale?: string;
  whyDoWeTrustThis?: string; // Explains source consistency, auditability, and grounding
}

export interface MissingInfoItem {
  id: string;
  question: string;
  importance: 'BLOCKING' | 'CRITICAL' | 'IMPORTANT' | 'DESIRABLE';
  impact: string;
  queryPrompt: string;
  resolved: boolean;
  resolvedValue?: string;
}

export type ActionCategory = 'DO_NOW' | 'PREPARE' | 'VERIFY' | 'SHARE' | 'FOLLOW_UP';

export interface WhyThisAction {
  reasoning: string;
  drivingFacts: string[];
  prerequisites: string[];
  riskIfOmitted: string;
}

export interface ActionItem {
  id: string;
  category: ActionCategory;
  title: string;
  description: string;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'SCHEDULED';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  executionReadiness: 'Ready to execute' | 'Suggested next action' | 'Draft prepared';
  assignedRole: string;
  why: string; // Core WHY explanation
  inputUsed: string; // Specific human input/evidence used
  confidence: number; // 0 - 100
  missingPrerequisite?: string; // Missing element required
  nextStep: string; // Concrete next step
  whatWouldChangeThis: string; // Circumstances/assumptions that alter this recommendation
  whyThisAction: WhyThisAction;
  actionType: 'DISPATCH' | 'COMMUNICATION' | 'PROCEDURAL' | 'SAFETY_OVERRIDE' | 'CHECKLIST';
  prefilledData?: {
    contactName?: string;
    targetPhone?: string;
    draftMessage?: string;
    checklistItems?: { id: string; text: string; done: boolean }[];
  };
}

export type GraphStage = 'INPUT' | 'UNDERSTAND' | 'FACTS' | 'VERIFICATION' | 'INTENT' | 'ACTIONS';

export interface GraphNode {
  id: string;
  stage: GraphStage;
  title: string;
  detail: string;
  status?: 'verified' | 'uncertain' | 'missing' | 'urgent' | 'primary' | 'normal';
  targetIds: string[];
  iconName?: string;
}

export interface ActionPackData {
  situationSummary: string;
  keyFacts: { label: string; value: string; status: FactStatus }[];
  missingInformation: string[];
  recommendedActions: { title: string; nextStep: string; readiness: string; category: ActionCategory }[];
  checklist: { id: string; text: string; completed: boolean }[];
  questionsToAsk: string[];
  informationToShare: string;
  generatedAt: string;
}

export interface CaseAnalysis {
  id: string;
  title: string;
  category: DomainCategory;
  timestamp: string;
  inputType: InputSourceType;
  rawInput: string;
  metadata?: {
    fileName?: string;
    duration?: string;
    wordCount?: number;
    fileSize?: string;
    thumbnailUrl?: string;
  };
  situationDetected: string;
  primaryIntent: string;
  secondaryIntents: string[];
  urgency: UrgencyLevel;
  urgencyReasoning: string;
  extractedFacts: FactItem[];
  missingInformation: MissingInfoItem[];
  assumptions: string[];
  overallConfidence: number;
  confidenceBreakdown: {
    inputCoherence: number;
    factGrounding: number;
    verificationCertainty: number;
  };
  safetyDisclaimer: string;
  actions: ActionItem[];
  graphNodes: GraphNode[];
  tags: string[];
  engineUsed: 'gemini-live' | 'deterministic-demo';
  actionPack?: ActionPackData;
}

export interface ApiSettings {
  geminiApiKey: string;
  model: string;
  useLiveApi: boolean;
  temperature: number;
}
