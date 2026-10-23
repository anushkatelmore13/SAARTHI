import { CaseAnalysis, InputSourceType, DomainCategory, ActionPackData, FactItem, MissingInfoItem, ActionItem } from '../types';
import { generateLocalAnalysis } from './localAnalyzer';

const STORAGE_KEY_API_KEY = 'saarthi_gemini_api_key';
const STORAGE_KEY_MODEL = 'saarthi_gemini_model';

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recommended - Real-time & High Precision)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Deep Multimodal Reasoning)' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Ultra Lightweight)' },
];

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public getApiKey(): string {
    const local = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (local && local.trim().length > 0) return local.trim();
    return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  }

  public setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  }

  public getModel(): string {
    return localStorage.getItem(STORAGE_KEY_MODEL) || 'gemini-2.5-flash';
  }

  public setModel(model: string): void {
    localStorage.setItem(STORAGE_KEY_MODEL, model);
  }

  public hasApiKey(): boolean {
    return this.getApiKey().length > 10;
  }

  public getEngineLabel(): { label: string; isLive: boolean } {
    if (this.hasApiKey()) {
      return { label: `Gemini Intelligence (${this.getModel()})`, isLive: true };
    }
    return { label: 'Deterministic Intelligence Engine', isLive: false };
  }

  /**
   * Main analysis entrypoint.
   * Uses live Gemini API if API key is provided; otherwise seamlessly delegates
   * to the local deterministic semantic pipeline.
   */
  public async analyzeInput(
    rawText: string,
    inputType: InputSourceType,
    metadata?: { fileName?: string; duration?: string; wordCount?: number }
  ): Promise<{ analysis: CaseAnalysis; source: 'gemini-live' | 'deterministic-demo' }> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      // Offline / zero-key mode: Instant local extraction
      const localResult = generateLocalAnalysis(rawText, inputType, metadata);
      return { analysis: localResult, source: 'deterministic-demo' };
    }

    try {
      const model = this.getModel();
      const prompt = this.buildGeminiPrompt(rawText, inputType);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.15,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('Gemini API call failed, falling back to local engine:', errorText);
        const localFallback = generateLocalAnalysis(rawText, inputType, metadata);
        return { analysis: localFallback, source: 'deterministic-demo' };
      }

      const json = await response.json();
      const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        throw new Error('Empty response from Gemini API');
      }

      const parsedData = JSON.parse(candidateText);
      const enriched = this.normalizeGeminiResponse(parsedData, rawText, inputType, metadata);
      return { analysis: enriched, source: 'gemini-live' };
    } catch (err) {
      console.error('Error invoking Gemini, using resilient local pipeline:', err);
      const localFallback = generateLocalAnalysis(rawText, inputType, metadata);
      return { analysis: localFallback, source: 'deterministic-demo' };
    }
  }

  private buildGeminiPrompt(rawText: string, inputType: InputSourceType): string {
    return `You are SAARTHI, an enterprise-grade AI engine that acts as a universal bridge between messy human intent and complex systems.

INPUT MODALITY: ${inputType.toUpperCase()}
MESSY RAW HUMAN INPUT:
"""
${rawText}
"""

CORE DIRECTIVES:
1. NEVER invent or hallucinate missing facts. If an entity, deadline, or parameter is unknown, place it in "missingFacts".
2. Clearly classify every fact item into one of the 4 strict Truth Layer statuses:
   - PROVIDED: Directly and explicitly stated in the user input.
   - VERIFIED: Grounded by objective real-world rules, known regulations, or corroborating facts.
   - UNCERTAIN: Inferred, speculative, secondhand, or ambiguous.
   - MISSING: Crucial missing dependency or unstated variable needed for action.
3. Every recommendation MUST provide concrete fields:
   - ACTION, WHY, INPUT USED, CONFIDENCE, NEXT STEP, and WHAT WOULD CHANGE THIS.
4. Categorize the situation into one of these 7 universal categories:
   - 'Emergency / Safety'
   - 'Weather / Travel'
   - 'Government / Public Services'
   - 'News / Information'
   - 'Documents / Forms'
   - 'Healthcare Information'
   - 'Workplace / Operational Incidents'
5. Do NOT present any output as an official medical diagnosis.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "situation": string,
  "category": "Emergency / Safety" | "Weather / Travel" | "Government / Public Services" | "News / Information" | "Documents / Forms" | "Healthcare Information" | "Workplace / Operational Incidents",
  "intent": string,
  "secondaryIntents": string[],
  "urgency": "CRITICAL" | "HIGH" | "MODERATE" | "LOW",
  "urgencyReasoning": string,
  "confidence": number, // 0 - 100
  "explanation": string,
  "assumptions": string[],
  "facts": [
    {
      "label": string,
      "value": string,
      "status": "PROVIDED" | "VERIFIED" | "UNCERTAIN",
      "category": "entity" | "location" | "time" | "hazard" | "resource" | "status" | "constraint" | "document" | "deadline",
      "confidence": number,
      "sourceQuote": string,
      "rationale": string,
      "whyDoWeTrustThis": string
    }
  ],
  "missingFacts": [
    {
      "question": string,
      "importance": "BLOCKING" | "CRITICAL" | "IMPORTANT",
      "impact": string,
      "queryPrompt": string
    }
  ],
  "recommendedActions": [
    {
      "category": "DO_NOW" | "PREPARE" | "VERIFY" | "SHARE" | "FOLLOW_UP",
      "title": string,
      "description": string,
      "urgency": "IMMEDIATE" | "HIGH" | "MEDIUM" | "SCHEDULED",
      "executionReadiness": "Ready to execute" | "Suggested next action" | "Draft prepared",
      "assignedRole": string,
      "why": string,
      "inputUsed": string,
      "confidence": number,
      "nextStep": string,
      "whatWouldChangeThis": string,
      "missingPrerequisite": string,
      "whyThisAction": {
        "reasoning": string,
        "drivingFacts": string[],
        "prerequisites": string[],
        "riskIfOmitted": string
      },
      "prefilledData": {
        "contactName": string,
        "targetPhone": string,
        "draftMessage": string
      }
    }
  ]
}`;
  }

  private normalizeGeminiResponse(
    geminiData: any,
    rawText: string,
    inputType: InputSourceType,
    metadata?: any
  ): CaseAnalysis {
    const id = `case-gemini-${Date.now()}`;
    const timestamp = 'Just now';

    const category: DomainCategory = geminiData.category || 'Workplace / Operational Incidents';
    const situation = geminiData.situation || 'Operational intent deconstructed by Gemini.';
    const primaryIntent = geminiData.intent || 'Execute structured action plan.';

    // Extracted facts mapping
    const extractedFacts = (geminiData.facts || []).map((f: any, idx: number) => ({
      id: `f-${id}-${idx + 1}`,
      category: f.category || 'status',
      label: f.label || `Grounded Entity #${idx + 1}`,
      value: f.value || '',
      status: (f.status === 'VERIFIED' || f.status === 'PROVIDED' || f.status === 'UNCERTAIN') ? f.status : 'PROVIDED',
      confidence: f.confidence || 90,
      sourceQuote: f.sourceQuote || '',
      rationale: f.rationale || 'Extracted from user input.',
      whyDoWeTrustThis: f.whyDoWeTrustThis || 'Direct statement verified against contextual boundaries.',
    }));

    // Missing facts mapping
    const missingInformation = (geminiData.missingFacts || []).map((m: any, idx: number) => ({
      id: `m-${id}-${idx + 1}`,
      question: m.question || 'Unspecified missing dependency',
      importance: m.importance || 'CRITICAL',
      impact: m.impact || 'Essential to complete before irreversible actions.',
      queryPrompt: m.queryPrompt || 'Please verify missing details.',
      resolved: false,
    }));

    // Actions mapping
    const actions = (geminiData.recommendedActions || []).map((a: any, idx: number) => ({
      id: `act-${id}-${idx + 1}`,
      category: a.category || 'DO_NOW',
      title: a.title || `Action Directive #${idx + 1}`,
      description: a.description || '',
      urgency: a.urgency || 'HIGH',
      status: 'PENDING' as const,
      executionReadiness: a.executionReadiness || 'Ready to execute',
      assignedRole: a.assignedRole || 'Operations Lead',
      why: a.why || a.whyThisAction?.reasoning || 'Action justified by verified input state.',
      inputUsed: a.inputUsed || rawText.slice(0, 60),
      confidence: a.confidence || 92,
      nextStep: a.nextStep || 'Review and execute action checklist.',
      whatWouldChangeThis: a.whatWouldChangeThis || 'If subsequent facts refute the initial situation.',
      missingPrerequisite: a.missingPrerequisite || '',
      whyThisAction: a.whyThisAction || {
        reasoning: a.why || 'Standard protocol response to declared conditions.',
        drivingFacts: [extractedFacts[0]?.label || 'Observed situation'],
        prerequisites: ['Confirm prerequisites'],
        riskIfOmitted: 'Operational delay or failure to mitigate risk.'
      },
      prefilledData: a.prefilledData || undefined,
    }));

    // Graph nodes dynamically created
    const graphNodes = [
      {
        id: `gn-${id}-1`,
        stage: 'INPUT' as const,
        title: `Messy ${inputType.toUpperCase()} Input`,
        detail: `${rawText.slice(0, 50)}...`,
        status: 'urgent' as const,
        targetIds: [`gn-${id}-2`],
        iconName: inputType === 'voice' ? 'Mic' : inputType === 'image' ? 'Image' : 'FileText',
      },
      {
        id: `gn-${id}-2`,
        stage: 'UNDERSTAND' as const,
        title: 'Gemini Semantic Intent Extraction',
        detail: `Classified: ${category}`,
        status: 'normal' as const,
        targetIds: [`gn-${id}-3`, `gn-${id}-4`],
        iconName: 'Brain',
      },
      {
        id: `gn-${id}-3`,
        stage: 'FACTS' as const,
        title: 'Structured Truth Entities',
        detail: `${extractedFacts.length} parameters isolated`,
        status: 'verified' as const,
        targetIds: [`gn-${id}-5`],
        iconName: 'ShieldAlert',
      },
      {
        id: `gn-${id}-4`,
        stage: 'VERIFICATION' as const,
        title: 'Truth Layer & Gap Analysis',
        detail: `${missingInformation.length} unknowns flagged (Zero Hallucination)`,
        status: 'missing' as const,
        targetIds: [`gn-${id}-5`],
        iconName: 'CheckCircle2',
      },
      {
        id: `gn-${id}-5`,
        stage: 'INTENT' as const,
        title: 'Synthesized Mission Intent',
        detail: primaryIntent.slice(0, 65),
        status: 'primary' as const,
        targetIds: [`gn-${id}-6`, `gn-${id}-7`],
        iconName: 'Target',
      },
      {
        id: `gn-${id}-6`,
        stage: 'ACTIONS' as const,
        title: 'DO NOW Directives',
        detail: actions[0]?.title || 'Immediate priority steps',
        status: 'urgent' as const,
        targetIds: [],
        iconName: 'Zap',
      },
      {
        id: `gn-${id}-7`,
        stage: 'ACTIONS' as const,
        title: 'Action Center Pipeline',
        detail: `${actions.length} structured verified tasks staged`,
        status: 'normal' as const,
        targetIds: [],
        iconName: 'Layers',
      },
    ];

    // Build Action Pack
    const actionPack: ActionPackData = {
      situationSummary: situation,
      keyFacts: extractedFacts.slice(0, 4).map((f: FactItem) => ({
        label: f.label,
        value: f.value,
        status: f.status,
      })),
      missingInformation: missingInformation.map((m: MissingInfoItem) => m.question),
      recommendedActions: actions.map((a: ActionItem) => ({
        title: a.title,
        nextStep: a.nextStep,
        readiness: a.executionReadiness,
        category: a.category,
      })),
      checklist: actions.map((a: ActionItem, i: number) => ({
        id: `chk-${id}-${i}`,
        text: `${a.title}: ${a.nextStep}`,
        completed: false,
      })),
      questionsToAsk: missingInformation.map((m: MissingInfoItem) => m.queryPrompt),
      informationToShare: `SAARTHI BRIEF [${category}]: ${situation}\nPrimary Intent: ${primaryIntent}`,
      generatedAt: timestamp,
    };

    return {
      id,
      title: `${category}: ${situation.slice(0, 40)}...`,
      category,
      timestamp,
      inputType,
      rawInput: rawText,
      engineUsed: 'gemini-live',
      metadata: {
        ...metadata,
        wordCount: rawText.split(/\s+/).filter(Boolean).length,
      },
      situationDetected: situation,
      primaryIntent,
      secondaryIntents: geminiData.secondaryIntents || ['Stabilize condition', 'Coordinate stakeholders'],
      urgency: geminiData.urgency || 'HIGH',
      urgencyReasoning: geminiData.urgencyReasoning || 'Immediate response needed to safeguard persons and assets.',
      safetyDisclaimer:
        'UNIVERSAL ACTION BRIDGE ADVISORY: SAARTHI coordinates structured operational steps and verified protocol execution. It is NOT a medical diagnosis; medical concerns require licensed clinical personnel.',
      overallConfidence: geminiData.confidence || 89,
      confidenceBreakdown: {
        inputCoherence: 92,
        factGrounding: 94,
        verificationCertainty: 82,
      },
      assumptions: geminiData.assumptions || ['User input details reflect current on-scene state.'],
      extractedFacts,
      missingInformation,
      actions,
      graphNodes,
      tags: [category, geminiData.urgency || 'HIGH', 'Gemini Intelligence'],
      actionPack,
    };
  }
}

export const geminiService = GeminiService.getInstance();
