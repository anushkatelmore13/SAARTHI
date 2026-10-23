import assert from 'node:assert/strict';
import { generateLocalAnalysis } from '../services/localAnalyzer.ts';
import type { CaseAnalysis, DomainCategory, UrgencyLevel } from '../types/index.ts';

/**
 * SAARTHI Domain Coverage & Security Regression Test Suite
 * --------------------------------------------------------
 * Validates all 7 universal domains, urgency calibration edge cases,
 * fact extraction integrity, security hardening (XSS, injection),
 * and empty/boundary input handling.
 */
async function runDomainCoverageTests() {
  console.log('🧪 Starting SAARTHI Domain Coverage & Security Regression Suite...\n');

  let _passed = 0;
  let total = 0;

  function check(label: string, condition: boolean, detail?: string) {
    total++;
    if (condition) {
      _passed++;
    } else {
      console.error(`   ❌ FAILED: ${label}${detail ? ` — ${detail}` : ''}`);
      throw new Error(`Assertion failed: ${label}`);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 1: Empty Input Handling
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 1: Empty Input Handling...');
  const emptyResult = generateLocalAnalysis('', 'text');
  check('Empty input urgency is LOW', emptyResult.urgency === 'LOW');
  check('Empty input has extractedFacts', emptyResult.extractedFacts.length > 0);
  check('Empty input has safety disclaimer', emptyResult.safetyDisclaimer.length > 0);
  check('Empty input engine is deterministic', emptyResult.engineUsed === 'deterministic-demo');
  console.log('✅ Test 1 Passed: Empty input handled gracefully.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 2: Whitespace-Only Input
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 2: Whitespace-Only Input...');
  const whitespaceResult = generateLocalAnalysis('   \n\t  \n  ', 'text');
  check('Whitespace input urgency is LOW', whitespaceResult.urgency === 'LOW');
  console.log('✅ Test 2 Passed: Whitespace-only input handled.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 3: All 7 Domain Categories Detection
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 3: All 7 Domain Categories Detection...');

  const domainTestCases: { input: string; expected: DomainCategory }[] = [
    { input: 'The building is on fire, people are trapped on the third floor and we need to evacuate immediately', expected: 'Emergency / Safety' },
    { input: 'Flight from Denver airport cancelled due to blizzard, need to rebook hotel and alternative travel', expected: 'Weather / Travel' },
    { input: 'I need to apply for a new passport and my aadhaar card has the wrong date of birth listed', expected: 'Government / Public Services' },
    { input: 'Breaking news from a major media report says there was an unconfirmed report about policy changes from news outlet', expected: 'News / Information' },
    { input: 'The lease contract has a clause about NNN and CAM that the tenant needs to review by escrow deadline', expected: 'Documents / Forms' },
    { input: 'Patient needs insulin prescription refilled, doctor said adjust dose based on heart rate monitoring', expected: 'Healthcare Information' },
    { input: 'CloudSync Pro server cluster showing CS-503 gateway failure and storage unavailable error since morning', expected: 'Workplace / Operational Incidents' },
  ];

  for (const tc of domainTestCases) {
    const result = generateLocalAnalysis(tc.input, 'text');
    check(`Domain "${tc.expected}" detected`, result.category === tc.expected, `Got: ${result.category}`);
  }
  console.log('✅ Test 3 Passed: All 7 domain categories correctly detected.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 4: Urgency Calibration Edge Cases
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 4: Urgency Calibration Edge Cases...');

  const urgencyTestCases: { input: string; minUrgency: UrgencyLevel; label: string }[] = [
    { input: 'Someone is trapped and can\'t breathe, building is flooding', minUrgency: 'CRITICAL', label: 'life-safety combined' },
    { input: 'Ransomware outbreak detected on production database, unauthorized access confirmed', minUrgency: 'CRITICAL', label: 'cyber security' },
    { input: 'Gas leak reported in the basement, maintenance shutting off supply', minUrgency: 'HIGH', label: 'gas leak' },
    { input: 'The deadline for the pension application form is in 5 business days', minUrgency: 'HIGH', label: 'deadline pressure' },
    { input: 'I am planning a trip to Goa next month and want some restaurant suggestions', minUrgency: 'MODERATE', label: 'casual planning' },
  ];

  const urgencyRank: Record<UrgencyLevel, number> = { LOW: 0, MODERATE: 1, HIGH: 2, CRITICAL: 3 };

  for (const tc of urgencyTestCases) {
    const result = generateLocalAnalysis(tc.input, 'text');
    const resultRank = urgencyRank[result.urgency];
    const minRank = urgencyRank[tc.minUrgency];
    check(
      `Urgency for "${tc.label}" >= ${tc.minUrgency}`,
      resultRank >= minRank,
      `Got: ${result.urgency} (expected at least ${tc.minUrgency})`
    );
  }
  console.log('✅ Test 4 Passed: Urgency calibration validated across edge cases.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 5: Fact Extraction Integrity
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 5: Fact Extraction Integrity...');
  const factResult = generateLocalAnalysis(
    'The transformer in Building B Room 204 started sparking at 2pm today. The forklift battery leaked acid. Sandeep reported it Friday.',
    'text'
  );

  check('Facts extracted > 0', factResult.extractedFacts.length > 0);
  // Deterministic engine should never assign VERIFIED without external source
  for (const fact of factResult.extractedFacts) {
    check(
      `Fact "${fact.label}" is not VERIFIED without source`,
      fact.status !== 'VERIFIED',
      `Deterministic engine must not assign VERIFIED status`
    );
  }
  // Should detect hazard category for sparking/leak
  const hasHazardFact = factResult.extractedFacts.some(f => f.category === 'hazard');
  check('At least one hazard fact extracted', hasHazardFact);
  console.log('✅ Test 5 Passed: Fact extraction integrity confirmed.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 6: Security — XSS Injection Resistance
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 6: Security — XSS Injection Resistance...');
  const xssInput = '<script>alert("xss")</script><img src=x onerror=alert(1)> ${document.cookie}';
  const xssResult = generateLocalAnalysis(xssInput, 'text');

  // The raw input is preserved in rawInput, but the analysis should not crash
  check('XSS input does not crash analyzer', xssResult.id.length > 0);
  check('XSS input produces valid category', typeof xssResult.category === 'string');
  check('XSS input produces extractedFacts', Array.isArray(xssResult.extractedFacts));
  check('XSS input produces actions', Array.isArray(xssResult.actions));
  check('XSS input raw text preserved as-is', xssResult.rawInput === xssInput);
  console.log('✅ Test 6 Passed: XSS injection handled safely.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 7: Security — SQL/NoSQL Injection Patterns
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 7: Security — SQL/NoSQL Injection Patterns...');
  const sqlInput = "'; DROP TABLE users; -- SELECT * FROM incidents WHERE 1=1";
  const sqlResult = generateLocalAnalysis(sqlInput, 'text');
  check('SQL injection does not crash analyzer', sqlResult.id.length > 0);
  check('SQL injection raw text preserved', sqlResult.rawInput === sqlInput);
  console.log('✅ Test 7 Passed: SQL injection patterns handled safely.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 8: Very Long Input Handling
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 8: Very Long Input Handling...');
  const longInput = 'The server is down. '.repeat(500);
  const longResult = generateLocalAnalysis(longInput, 'text');
  check('Long input does not crash', longResult.id.length > 0);
  check('Long input has facts', longResult.extractedFacts.length > 0);
  check('Long input has reasonable fact count (capped)', longResult.extractedFacts.length <= 10);
  console.log('✅ Test 8 Passed: Very long input handled within bounds.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 9: Multi-Modal Input Types
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 9: Multi-Modal Input Types...');
  const voiceResult = generateLocalAnalysis('Someone is hurt badly, we need an ambulance', 'voice');
  check('Voice input type preserved', voiceResult.inputType === 'voice');
  check('Voice emergency detected as CRITICAL', voiceResult.urgency === 'CRITICAL');

  const imageResult = generateLocalAnalysis('[EXTRACTED FROM OCR IMAGE: incident.png]\nCS-503 Cloud storage unavailable', 'image');
  check('Image input type preserved', imageResult.inputType === 'image');

  const docResult = generateLocalAnalysis('Pension form section 14.3 requires PPO number submission by Friday', 'document');
  check('Document input type preserved', docResult.inputType === 'document');
  console.log('✅ Test 9 Passed: All input modalities handled correctly.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 10: CaseAnalysis Schema Completeness
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 10: CaseAnalysis Schema Completeness...');
  const schemaResult = generateLocalAnalysis('Gas leak in Building A, maintenance team alerted', 'text');

  // Verify every required field in CaseAnalysis is populated
  const requiredStringFields: (keyof CaseAnalysis)[] = [
    'id', 'title', 'category', 'timestamp', 'inputType', 'rawInput',
    'situationDetected', 'primaryIntent', 'urgency', 'urgencyReasoning',
    'safetyDisclaimer', 'engineUsed',
  ];
  for (const field of requiredStringFields) {
    check(`Schema field "${field}" is populated`, typeof schemaResult[field] === 'string' && (schemaResult[field] as string).length > 0);
  }

  check('overallConfidence is number', typeof schemaResult.overallConfidence === 'number');
  check('confidenceBreakdown exists', typeof schemaResult.confidenceBreakdown === 'object');
  check('confidenceBreakdown.inputCoherence is number', typeof schemaResult.confidenceBreakdown.inputCoherence === 'number');
  check('confidenceBreakdown.factGrounding is number', typeof schemaResult.confidenceBreakdown.factGrounding === 'number');
  check('confidenceBreakdown.verificationCertainty is number', typeof schemaResult.confidenceBreakdown.verificationCertainty === 'number');

  check('extractedFacts is array', Array.isArray(schemaResult.extractedFacts));
  check('missingInformation is array', Array.isArray(schemaResult.missingInformation));
  check('actions is array', Array.isArray(schemaResult.actions));
  check('graphNodes is array', Array.isArray(schemaResult.graphNodes));
  check('tags is array', Array.isArray(schemaResult.tags));
  check('secondaryIntents is array', Array.isArray(schemaResult.secondaryIntents));
  check('assumptions is array', Array.isArray(schemaResult.assumptions));
  check('actionPack exists', typeof schemaResult.actionPack === 'object');
  console.log('✅ Test 10 Passed: Full CaseAnalysis schema validated.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 11: Action Completeness — Every Action Has Required Fields
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 11: Action Item Schema Completeness...');
  for (const action of schemaResult.actions) {
    check(`Action "${action.title}" has id`, action.id.length > 0);
    check(`Action "${action.title}" has category`, ['DO_NOW', 'PREPARE', 'VERIFY', 'SHARE', 'FOLLOW_UP'].includes(action.category));
    check(`Action "${action.title}" has description`, action.description.length > 0);
    check(`Action "${action.title}" has urgency`, ['IMMEDIATE', 'HIGH', 'MEDIUM', 'SCHEDULED'].includes(action.urgency));
    check(`Action "${action.title}" has status`, ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(action.status));
    check(`Action "${action.title}" has why`, action.why.length > 0);
    check(`Action "${action.title}" has confidence`, typeof action.confidence === 'number');
    check(`Action "${action.title}" has whyThisAction`, typeof action.whyThisAction === 'object');
    check(`Action "${action.title}" has whyThisAction.reasoning`, action.whyThisAction.reasoning.length > 0);
    check(`Action "${action.title}" has whyThisAction.drivingFacts`, Array.isArray(action.whyThisAction.drivingFacts));
    check(`Action "${action.title}" has whyThisAction.riskIfOmitted`, action.whyThisAction.riskIfOmitted.length > 0);
  }
  console.log('✅ Test 11 Passed: All action items have complete schema.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 12: Graph Node Pipeline Integrity
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 12: Graph Node Pipeline Integrity...');
  const graphResult = generateLocalAnalysis('Wildfire near Sector 4, evacuating 15 people', 'text');
  check('Graph has nodes', graphResult.graphNodes.length >= 5);

  const stagesSeen = new Set(graphResult.graphNodes.map(n => n.stage));
  check('Graph has INPUT stage', stagesSeen.has('INPUT'));
  check('Graph has UNDERSTAND stage', stagesSeen.has('UNDERSTAND'));
  check('Graph has FACTS stage', stagesSeen.has('FACTS'));
  check('Graph has VERIFICATION stage', stagesSeen.has('VERIFICATION'));
  check('Graph has INTENT stage', stagesSeen.has('INTENT'));
  check('Graph has ACTIONS stage', stagesSeen.has('ACTIONS'));

  for (const node of graphResult.graphNodes) {
    check(`Graph node "${node.title}" has id`, node.id.length > 0);
    check(`Graph node "${node.title}" has title`, node.title.length > 0);
    check(`Graph node "${node.title}" has targetIds array`, Array.isArray(node.targetIds));
  }
  console.log('✅ Test 12 Passed: Graph node pipeline validated.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 13: Uncertain Fact Detection
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 13: Uncertain Fact Detection...');
  const uncertainResult = generateLocalAnalysis(
    'I think there might be a gas leak in the building. I am not sure if anyone is inside. Maybe the valve is broken.',
    'text'
  );
  const uncertainFacts = uncertainResult.extractedFacts.filter(f => f.status === 'UNCERTAIN');
  check('Uncertain language flagged', uncertainFacts.length > 0, `Got ${uncertainFacts.length} uncertain facts`);
  console.log('✅ Test 13 Passed: Uncertain language correctly flagged.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 14: ActionPack Generation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('Test 14: ActionPack Generation...');
  const apResult = generateLocalAnalysis('Building fire on floor 3, people evacuating', 'text');
  assert.ok(apResult.actionPack, 'ActionPack must be generated');
  check('ActionPack has situationSummary', apResult.actionPack!.situationSummary.length > 0);
  check('ActionPack has keyFacts', apResult.actionPack!.keyFacts.length > 0);
  check('ActionPack has recommendedActions', apResult.actionPack!.recommendedActions.length > 0);
  check('ActionPack has checklist', apResult.actionPack!.checklist.length > 0);
  check('ActionPack has generatedAt', apResult.actionPack!.generatedAt.length > 0);
  console.log('✅ Test 14 Passed: ActionPack fully generated.\n');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SUMMARY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log(`\n🎉 ALL ${total} DOMAIN COVERAGE & SECURITY TESTS PASSED SUCCESSFULLY!\n`);
}

runDomainCoverageTests().catch((err) => {
  console.error('❌ Domain Coverage Test Failed:', err);
  process.exit(1);
});
