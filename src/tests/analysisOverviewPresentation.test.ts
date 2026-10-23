import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateLocalAnalysis } from '../services/localAnalyzer.ts';
import { AnalysisOverview } from '../components/AnalysisOverview.tsx';

async function testOverviewPresentation() {
  console.log('🧪 Testing AnalysisOverview User-Facing Report Presentation...\n');

  const analysis = generateLocalAnalysis('fire forest', 'text');
  
  // Render component to static HTML string
  const html = renderToStaticMarkup(
    React.createElement(AnalysisOverview, {
      currentCase: analysis,
      onOpenActions: () => {},
      onOpenGraph: () => {},
      onOpenExport: () => {},
      onOpenActionPack: () => {},
    })
  );

  // 1. Verify Immediate Safety Steps section is present near the top
  assert.ok(
    html.includes('Immediate Safety Steps &amp; Decision Support') || html.includes('Immediate Safety Steps & Decision Support'),
    'Report must contain the prominent Immediate Safety Steps section'
  );

  // 2. Verify the 4 Core Decision Support Questions are answered
  assert.ok(html.includes('1. What should I do right now?'), 'Must answer question 1');
  assert.ok(html.includes('2. What should I avoid?'), 'Must answer question 2');
  assert.ok(html.includes('3. What should I do next?'), 'Must answer question 3');
  assert.ok(html.includes('4. What information is still needed?'), 'Must answer question 4');

  // 3. Verify plain-language safety actions appear before detailed telemetry
  const safetyIndex = html.indexOf('Immediate Safety Steps');
  const telemetryIndex = html.indexOf('Detailed Technical Telemetry');
  assert.ok(safetyIndex < telemetryIndex, 'Immediate Safety Steps must appear BEFORE detailed technical telemetry');

  // 4. Verify unconfirmed status is displayed prominently in header
  assert.ok(html.includes('UNCONFIRMED INPUT'), 'Header must contain UNCONFIRMED INPUT badge');

  // 5. Verify the 3 essential questions are rendered in question 4
  assert.ok(html.includes('Is the fire happening now?'), 'Must render question "Is the fire happening now?"');
  assert.ok(html.includes('Is anyone in danger?'), 'Must render question "Is anyone in danger?"');
  assert.ok(html.includes('What is the nearest safe-to-provide location or landmark?'), 'Must render question "What is the nearest safe-to-provide location or landmark?"');

  // 6. Verify concise safety advisory (no duplicate emergency paragraphs)
  assert.ok(html.includes(analysis.safetyDisclaimer), 'Must include concise safety disclaimer');
  assert.ok(
    !html.includes('SAARTHI acts as a universal bridge to translate human intent into verified next steps'),
    'Must NOT contain boilerplate marketing paragraph in safety banner'
  );

  console.log('✅ AnalysisOverview Presentation Test Passed: First visible section provides concise immediate safety steps and answers the 4 core decision support questions.');
}

testOverviewPresentation().catch((err) => {
  console.error('❌ Presentation test failed:', err);
  process.exit(1);
});
