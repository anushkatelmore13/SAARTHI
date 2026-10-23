import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { ImageOcrService } from '../services/imageOcrService.ts';
import { generateLocalAnalysis } from '../services/localAnalyzer.ts';

async function runRegressionTests() {
  console.log('🧪 Starting SAARTHI Image Analysis & OCR Regression Suite...\n');

  const fixturesDir = path.resolve(process.cwd(), 'src/tests/fixtures');
  const ocrService = ImageOcrService.getInstance();

  // Forbidden terms that must NEVER leak from previous mock data
  const FORBIDDEN_LEASE_TERMS = [
    'commercial lease',
    'lease demand',
    'apex realty',
    'cam arrears',
    '14,200',
    'letter of credit',
    '25,000',
    'section 14.3',
    'section 22.1',
    'landlord',
    'tenant',
  ];

  // -------------------------------------------------------------
  // TEST 1: OCR Extraction from SVG CloudSync Pro Test Fixture
  // -------------------------------------------------------------
  console.log('Test 1: OCR Text Extraction on CloudSync Pro SVG...');
  const svgPath = path.join(fixturesDir, 'cloudsync_pro_test.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

  const svgOcrResult = await ocrService.extractTextFromImage(
    { name: 'cloudsync_pro_test.svg', type: 'image/svg+xml' },
    svgDataUrl,
    Buffer.from(svgContent, 'utf-8')
  );

  assert.equal(svgOcrResult.success, true, 'SVG OCR extraction should succeed');
  assert.ok(svgOcrResult.text.includes('CS-503'), 'Extracted text must include error code CS-503');
  assert.ok(
    /cloud storage unavailable/i.test(svgOcrResult.text),
    'Extracted text must mention cloud storage unavailable'
  );
  assert.ok(
    /degraded service status/i.test(svgOcrResult.text),
    'Extracted text must mention degraded service status'
  );

  // Assert absence of mock lease terms
  for (const forbidden of FORBIDDEN_LEASE_TERMS) {
    assert.ok(
      !svgOcrResult.text.toLowerCase().includes(forbidden),
      `OCR extracted text must NOT contain "${forbidden}"`
    );
  }
  console.log('✅ Test 1 Passed: SVG OCR extraction yielded correct CloudSync Pro telemetry.');

  // -------------------------------------------------------------
  // TEST 2: OCR Extraction from Rasterized PNG CloudSync Pro Fixture
  // -------------------------------------------------------------
  console.log('\nTest 2: OCR Text Extraction on CloudSync Pro PNG...');
  const pngPath = path.join(fixturesDir, 'cloudsync_pro_test.png');
  const pngBuffer = fs.readFileSync(pngPath);
  const pngBase64 = pngBuffer.toString('base64');
  const pngDataUrl = `data:image/png;base64,${pngBase64}`;

  const pngOcrResult = await ocrService.extractTextFromImage(
    { name: 'cloudsync_pro_test.png', type: 'image/png', size: pngBuffer.length },
    pngDataUrl,
    pngBuffer
  );

  assert.equal(pngOcrResult.success, true, 'PNG OCR extraction should succeed');
  assert.ok(pngOcrResult.text.includes('CS-503'), 'PNG extracted text must include CS-503');
  assert.ok(
    /cloud storage unavailable/i.test(pngOcrResult.text),
    'PNG extracted text must mention cloud storage unavailable'
  );
  assert.ok(
    /degraded service status/i.test(pngOcrResult.text),
    'PNG extracted text must mention degraded service status'
  );

  for (const forbidden of FORBIDDEN_LEASE_TERMS) {
    assert.ok(
      !pngOcrResult.text.toLowerCase().includes(forbidden),
      `PNG OCR extracted text must NOT contain "${forbidden}"`
    );
  }
  console.log('✅ Test 2 Passed: PNG OCR extraction successfully detected CloudSync Pro error signature.');

  // -------------------------------------------------------------
  // TEST 3: Downstream Analysis Pipeline on Extracted CloudSync Pro Text
  // -------------------------------------------------------------
  console.log('\nTest 3: Downstream Analyzer on Extracted CloudSync Pro Telemetry...');
  const analysisInput = `[EXTRACTED FROM OCR IMAGE: cloudsync_pro_test.png]\n${pngOcrResult.text}`;
  const analysis = generateLocalAnalysis(analysisInput, 'image', { fileName: 'cloudsync_pro_test.png' });

  // Verify category and urgency
  assert.equal(analysis.category, 'Workplace / Operational Incidents', 'Category must be Workplace / Operational Incidents');
  assert.equal(analysis.urgency, 'HIGH', 'Urgency for CS-503 cloud storage unavailable should be HIGH');

  // Verify situation summary mentions CloudSync Pro and CS-503
  assert.ok(/cloudsync/i.test(analysis.situationDetected), 'Situation summary must mention CloudSync');
  assert.ok(/cs-?503/i.test(analysis.situationDetected), 'Situation summary must mention CS-503');
  assert.ok(/degraded service status/i.test(analysis.situationDetected), 'Situation summary must mention degraded service status');

  // Verify truth layer: All facts must be PROVIDED, none VERIFIED without independent external source
  assert.ok(analysis.extractedFacts.length > 0, 'Extracted facts must be populated');
  for (const fact of analysis.extractedFacts) {
    assert.equal(fact.status, 'PROVIDED', `Fact "${fact.label}" must have status PROVIDED, not ${fact.status}`);
  }
  assert.equal(analysis.confidenceBreakdown.verificationCertainty, 0, 'Verification certainty must be 0% with no external verification source');
  assert.equal(analysis.confidenceBreakdown.factGrounding, 0, 'Fact grounding must be 0% without independent verification');

  // Verify actions are targeted cloud/storage actions
  const actionTitles = analysis.actions.map(a => a.title).join(' | ');
  assert.ok(/cloud provider status/i.test(actionTitles), 'Actions must include cloud provider status verification');
  assert.ok(/storage/i.test(actionTitles), 'Actions must include storage gateway inspection');

  // Stringify entire analysis object and verify ZERO lease / CAM / letter of credit contamination
  const serialized = JSON.stringify(analysis).toLowerCase();
  for (const forbidden of FORBIDDEN_LEASE_TERMS) {
    assert.ok(
      !serialized.includes(forbidden),
      `Full analysis report must NOT contain "${forbidden}" anywhere in title, facts, actions, or rationale`
    );
  }
  console.log('✅ Test 3 Passed: Analysis pipeline produced pure CloudSync Pro operational report with zero lease contamination.');

  // -------------------------------------------------------------
  // TEST 4: OCR Failure & Unreadable Image Handling
  // -------------------------------------------------------------
  console.log('\nTest 4: Handling Unreadable Image and Explicit Failure Reporting...');
  const emptyOcrResult = await ocrService.extractTextFromImage(
    { name: 'unreadable_scan.jpg', type: 'image/jpeg' },
    undefined,
    undefined
  );

  assert.equal(emptyOcrResult.success, false, 'Unreadable image should return success: false');
  assert.equal(emptyOcrResult.confidence, 0, 'Confidence for unreadable image should be 0');
  assert.ok(emptyOcrResult.error?.includes('No legible text'), 'Error must clearly state no legible text could be extracted');

  // Simulate passing the OCR failure notification into local analyzer
  const failureInput = `[IMAGE OCR NOTICE: unreadable_scan.jpg] No legible text could be extracted from this image. Please provide a clearer screenshot or enter the incident details manually.`;
  const failureAnalysis = generateLocalAnalysis(failureInput, 'image', { fileName: 'unreadable_scan.jpg' });

  assert.equal(failureAnalysis.urgency, 'LOW', 'Urgency for unreadable image should be LOW');
  assert.ok(/OCR Extraction Incomplete/i.test(failureAnalysis.title), 'Title must indicate OCR extraction incomplete');
  assert.ok(
    /could not extract legible text/i.test(failureAnalysis.situationDetected),
    'Situation must explicitly explain OCR could not detect legible text'
  );
  assert.ok(
    /provide clearer image|enter incident details manually/i.test(failureAnalysis.actions[0]?.title),
    'Action must instruct user to provide clearer image or manual details'
  );
  assert.equal(failureAnalysis.confidenceBreakdown.factGrounding, 0, 'Fact grounding must be 0%');

  console.log('✅ Test 4 Passed: Unreadable image handled gracefully with clear notice and non-hallucinatory workflow.');

  console.log('\n🎉 ALL 4 IMAGE OCR & ANALYSIS REGRESSION TESTS PASSED SUCCESSFULLY!\n');
}

runRegressionTests().catch((err) => {
  console.error('❌ Regression Test Failed:', err);
  process.exit(1);
});
