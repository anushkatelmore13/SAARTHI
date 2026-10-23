import { generateLocalAnalysis } from '../services/localAnalyzer.ts';

const testInputs = [
  { name: '1. fire forest', input: 'fire forest', type: 'text' },
  { name: '2. I can\'t breathe.', input: 'I can\'t breathe.', type: 'text' },
  { name: '3. There is a data breach.', input: 'There is a data breach.', type: 'text' },
  { name: '4. My computer froze and I have an important deadline today.', input: 'My computer froze and I have an important deadline today.', type: 'text' },
  { name: '5. Empty or whitespace', input: '   \n\t  ', type: 'text' },
  { name: '6. Ambiguous / contradictory', input: 'The system crashed completely but everything is running normally with no downtime and no errors.', type: 'text' },
  { name: '7. Unreadable image notice', input: '[IMAGE OCR NOTICE: scan.png] No legible text could be extracted from this image.', type: 'image' }
];

console.log('=== AUDITING 7 REQUIRED TEST CASES ===\n');

for (const tc of testInputs) {
  const result = generateLocalAnalysis(tc.input, tc.type as any);
  console.log(`--- [${tc.name}] ---`);
  console.log(`Category: ${result.category}`);
  console.log(`Urgency: ${result.urgency}`);
  console.log(`Title: ${result.title}`);
  console.log(`Situation: ${result.situationDetected}`);
  console.log(`Primary Intent: ${result.primaryIntent}`);
  console.log(`Actions Count: ${result.actions.length}`);
  console.log(`Action 1: [${result.actions[0]?.category}] ${result.actions[0]?.title} -> ${result.actions[0]?.nextStep}`);
  console.log(`Action 2: [${result.actions[1]?.category}] ${result.actions[1]?.title}`);
  console.log(`Missing Info Count: ${result.missingInformation.length}`);
  if (result.missingInformation.length > 0) {
    console.log(`Q1: ${result.missingInformation[0]?.question}`);
  }
  console.log(`Safety Disclaimer: ${result.safetyDisclaimer}`);
  console.log('\n');
}
