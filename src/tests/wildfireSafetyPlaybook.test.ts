import assert from 'node:assert/strict';
import { generateLocalAnalysis } from '../services/localAnalyzer.ts';

async function runWildfireTests() {
  console.log('🧪 Starting SAARTHI Wildfire / Forest Fire Safety Playbook Regression Suite...\n');

  const FORBIDDEN_LEASE_TERMS = [
    'commercial lease',
    'lease demand',
    'apex realty',
    'cam arrears',
    'letter of credit',
    'landlord',
    'tenant',
  ];

  // -------------------------------------------------------------
  // TEST 1: Vague short input "fire forest"
  // -------------------------------------------------------------
  console.log('Test 1: Vague Short Input "fire forest"...');
  const vagueAnalysis = generateLocalAnalysis('fire forest', 'text');

  assert.equal(
    vagueAnalysis.category,
    'Emergency / Safety',
    'Category for "fire forest" must be Emergency / Safety'
  );
  assert.equal(
    vagueAnalysis.urgency,
    'HIGH',
    'Urgency for vague input "fire forest" must be HIGH (not CRITICAL) pending confirmation'
  );
  assert.ok(
    /unconfirmed/i.test(vagueAnalysis.title),
    'Title must clearly label incident as unconfirmed for vague input'
  );
  assert.ok(
    vagueAnalysis.urgencyReasoning.includes('HIGH') && vagueAnalysis.urgencyReasoning.includes('112'),
    'Urgency reasoning must explain HIGH classification and reference 112 emergency service'
  );

  // Safety Disclaimer checks (concise)
  assert.ok(
    vagueAnalysis.safetyDisclaimer.includes('112') && /fire and smoke/i.test(vagueAnalysis.safetyDisclaimer),
    'Safety disclaimer must contain 112 guidance and direct safety advice'
  );

  // Actions checks
  assert.equal(vagueAnalysis.actions.length, 5, 'Must generate exactly 5 wildfire actions');

  // Action 1: DO_NOW
  const act1 = vagueAnalysis.actions[0];
  assert.equal(act1.category, 'DO_NOW', 'Action 1 must be DO_NOW');
  assert.ok(
    /move away/i.test(act1.title) && /112/i.test(act1.description),
    'Action 1 must instruct moving away from fire/smoke and calling 112'
  );

  // Action 2: Safety Precautions
  const act2 = vagueAnalysis.actions[1];
  assert.equal(act2.category, 'PREPARE', 'Action 2 category must be PREPARE (precautions)');
  assert.ok(
    /do not approach|spreading wildfire/i.test(act2.title),
    'Action 2 must advise against approaching/fighting spreading fire'
  );

  // Action 3: Follow Official Evacuation Orders
  const act3 = vagueAnalysis.actions[2];
  assert.equal(act3.category, 'FOLLOW_UP', 'Action 3 category must be FOLLOW_UP');
  assert.ok(
    /follow official evacuation/i.test(act3.title),
    'Action 3 must instruct following evacuation orders'
  );

  // Action 4: Report Location to Responders
  const act4 = vagueAnalysis.actions[3];
  assert.equal(act4.category, 'SHARE', 'Action 4 category must be SHARE');
  assert.ok(
    /report the safest known location/i.test(act4.title),
    'Action 4 must instruct reporting location to emergency responders when safe'
  );

  // Action 5: Check Essential Questions
  const act5 = vagueAnalysis.actions[4];
  assert.equal(act5.category, 'VERIFY', 'Action 5 category must be VERIFY');
  assert.ok(
    /check essential status questions/i.test(act5.title),
    'Action 5 must check essential status questions when safe'
  );

  // Missing Information questions: AT MOST 3 essential questions initially
  assert.ok(
    vagueAnalysis.missingInformation.length <= 3,
    `Must ask at most 3 essential follow-up questions initially, got ${vagueAnalysis.missingInformation.length}`
  );
  assert.ok(
    vagueAnalysis.missingInformation.some(m => m.question === 'Is the fire happening now?'),
    'Missing info must include exact question "Is the fire happening now?"'
  );
  assert.ok(
    vagueAnalysis.missingInformation.some(m => m.question === 'Is anyone in danger?'),
    'Missing info must include exact question "Is anyone in danger?"'
  );
  assert.ok(
    vagueAnalysis.missingInformation.some(m => m.question === 'What is the nearest safe-to-provide location or landmark?'),
    'Missing info must include exact question "What is the nearest safe-to-provide location or landmark?"'
  );

  // No forbidden mock lease terms
  const serializedVague = JSON.stringify(vagueAnalysis).toLowerCase();
  for (const term of FORBIDDEN_LEASE_TERMS) {
    assert.ok(
      !serializedVague.includes(term),
      `Vague fire report output must NOT contain forbidden term: "${term}"`
    );
  }
  console.log('✅ Test 1 Passed: "fire forest" triggered calibrated HIGH urgency, unconfirmed title, at most 3 questions, and concise plain-language actions.');

  // -------------------------------------------------------------
  // TEST 2: Contextualized Wildfire Input
  // -------------------------------------------------------------
  console.log('Test 2: Contextualized Wildfire Input with active danger...');
  const detailedAnalysis = generateLocalAnalysis(
    'Wildfire spreading rapidly through the hillside forest near Sector 4 mountain road. 15 people are evacuating and dense smoke is blowing towards homes.',
    'text'
  );

  assert.equal(
    detailedAnalysis.category,
    'Emergency / Safety',
    'Category for detailed wildfire must be Emergency / Safety'
  );
  assert.equal(
    detailedAnalysis.urgency,
    'CRITICAL',
    'Urgency for contextualized wildfire with evacuating people must be CRITICAL'
  );
  assert.equal(detailedAnalysis.actions.length, 5, 'Must generate exactly 5 wildfire actions');
  assert.ok(
    /move away/i.test(detailedAnalysis.actions[0].title),
    'First action must prioritize moving away and life safety'
  );

  const serializedDetailed = JSON.stringify(detailedAnalysis).toLowerCase();
  for (const term of FORBIDDEN_LEASE_TERMS) {
    assert.ok(
      !serializedDetailed.includes(term),
      `Detailed wildfire report output must NOT contain forbidden term: "${term}"`
    );
  }
  console.log('✅ Test 2 Passed: Detailed wildfire triggered CRITICAL urgency and complete playbook.');

  // -------------------------------------------------------------
  // TEST 3: Bushfire / Brushfire Variations
  // -------------------------------------------------------------
  console.log('Test 3: Bushfire and Brushfire phrasing variations...');
  const bushfireAnalysis = generateLocalAnalysis('Bushfire approaching national park trail', 'text');
  assert.equal(bushfireAnalysis.category, 'Emergency / Safety');
  assert.ok(/move away/i.test(bushfireAnalysis.actions[0].title));

  const serializedBushfire = JSON.stringify(bushfireAnalysis).toLowerCase();
  for (const term of FORBIDDEN_LEASE_TERMS) {
    assert.ok(!serializedBushfire.includes(term));
  }
  console.log('✅ Test 3 Passed: Bushfire phrasing correctly handled.');

  console.log('\n🎉 ALL WILDFIRE PLAYBOOK REGRESSION TESTS PASSED SUCCESSFULLY!\n');
}

runWildfireTests().catch((err) => {
  console.error('❌ Wildfire Test failed:', err);
  process.exit(1);
});
