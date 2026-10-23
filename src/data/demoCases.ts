import { CaseAnalysis } from '../types';

export const DEMO_CASES: CaseAnalysis[] = [
  // SCENARIO A: Emergency / Safety
  {
    id: 'case-demo-1',
    title: 'Industrial Flash Flood & Chemical Containment',
    category: 'Emergency / Safety',
    timestamp: 'Just now (10:14 AM)',
    inputType: 'voice',
    engineUsed: 'deterministic-demo',
    rawInput:
      `"Command, this is Ramesh... Sector 7 B-Wing loading docks! Listen, water came up super fast, past the ramp, already two feet deep and rising! Forklift three tipped over right next to the 400-series chemical racks. I think Sandeep was in the south battery charging room when the siren sounded, but the alarm speaker cut out. The backup transformer is buzzing loudly and throwin' sparks right near the water level! The main exterior valve shutoff might be underwater or rusted tight, I couldn't budge it. We need high-clearance SAR or inflatable boats right now, my radio and phone battery are down to 4%!"`,
    metadata: {
      duration: '0:38',
      wordCount: 96,
      fileName: 'dispatch_audio_rec_093.wav',
    },
    situationDetected:
      'Industrial flash flood inundation at Sector 7 B-Wing with submerged electrical infrastructure (sparking transformer), hazardous chemical containment breach risk, unconfirmed trapped personnel (Sandeep), and imminent responder communication cutoff.',
    primaryIntent:
      'Execute urgent life-safety rescue and remote electrical de-energization before hazardous material dispersion or electrocution.',
    secondaryIntents: [
      'Isolate chemical rack containment perimeter',
      'Establish emergency backup RF communications relay',
      'Deploy high-clearance amphibious rescue asset'
    ],
    urgency: 'CRITICAL',
    urgencyReasoning:
      'Immediate threat to human life: 2ft rising water in direct proximity to an active sparking 480V transformer; unaccounted worker in battery room; responder device battery at 4%.',
    safetyDisclaimer:
      'OPERATIONAL RESCUE & HAZMAT PROTOCOL: Guides emergency logistics, containment, and search priorities. It does not replace on-scene structural or medical triage commands.',
    overallConfidence: 91,
    confidenceBreakdown: {
      inputCoherence: 94,
      factGrounding: 95,
      verificationCertainty: 84,
    },
    assumptions: [
      'Reporter observation of 2ft water depth is accurate to within 6 inches.',
      'South battery charging room door was closed when water reached the sill.'
    ],
    extractedFacts: [
      {
        id: 'f-1',
        category: 'location',
        label: 'Incident Location',
        value: 'Sector 7, B-Wing Loading Docks & Battery Room',
        status: 'PROVIDED',
        confidence: 99,
        sourceQuote: 'Sector 7 B-Wing loading docks... south battery charging room',
        rationale: 'Directly stated twice by on-scene reporter.',
        whyDoWeTrustThis: 'Corroborated by reporter radio callsign identifier and facility repeater node telemetry.',
      },
      {
        id: 'f-2',
        category: 'hazard',
        label: 'Flood Depth & Trajectory',
        value: '2 feet deep, rapidly rising above ramp level',
        status: 'PROVIDED',
        confidence: 94,
        sourceQuote: 'water came up super fast, past the ramp, already two feet deep and rising',
        rationale: 'Direct physical measurement by on-scene observer.',
        whyDoWeTrustThis: 'Matches municipal creek flash flood telemetry sensor 14B downstream.',
      },
      {
        id: 'f-3',
        category: 'hazard',
        label: 'Active Electrical Arcing Hazard',
        value: 'Backup transformer buzzing loudly & throwing sparks near waterline',
        status: 'VERIFIED',
        confidence: 97,
        sourceQuote: 'backup transformer is buzzing loudly and throwin\' sparks right near the water level',
        rationale: 'Acoustic background hum confirmed on radio audio; severe electrocution hazard.',
        whyDoWeTrustThis: 'Acoustic frequency analysis confirms 60Hz transformer electrical arcing cadence.',
      },
      {
        id: 'f-4',
        category: 'hazard',
        label: 'Physical Equipment Collision',
        value: 'Forklift 3 tipped adjacent to 400-series chemical racks',
        status: 'PROVIDED',
        confidence: 92,
        sourceQuote: 'Forklift three tipped over right next to the 400-series chemical racks',
        rationale: 'Identified equipment number and proximity to chemical containment tier.',
        whyDoWeTrustThis: 'Visual observation from reporter inside dock staging area.',
      },
      {
        id: 'f-5',
        category: 'constraint',
        label: 'Comms Depletion Deadline',
        value: 'Reporter phone/radio battery critically low at 4%',
        status: 'VERIFIED',
        confidence: 99,
        sourceQuote: 'my radio and phone battery are down to 4%',
        rationale: 'Telemetry stated by reporter; comms loss expected within 5-8 minutes.',
        whyDoWeTrustThis: 'Direct device state telemetry communicated before cutoff.',
      },
      {
        id: 'f-6',
        category: 'entity',
        label: 'Trapped Personnel Status (Sandeep)',
        value: 'Believed in South Battery Room; NOT visually confirmed',
        status: 'UNCERTAIN',
        confidence: 58,
        sourceQuote: 'I think Sandeep was in the south battery charging room when the siren sounded',
        rationale: 'Reporter inferred presence from schedule, but alarm audio failed and no visual contact made.',
        whyDoWeTrustThis: 'Tentative inference — requires electronic badge log audit before committing dive rescue.',
      },
      {
        id: 'f-7',
        category: 'resource',
        label: 'Main Exterior Water Valve',
        value: 'Inoperable — reported stuck or submerged',
        status: 'UNCERTAIN',
        confidence: 64,
        sourceQuote: 'main exterior valve shutoff might be underwater or rusted tight',
        rationale: 'Unclear whether mechanical valve failure or physical submersion prevented closure.',
        whyDoWeTrustThis: 'Physical attempt reported by stressed operator; torque tool not applied.',
      },
    ],
    missingInformation: [
      {
        id: 'm-1',
        question: 'Exact chemical composition and UN numbers stored on 400-series racks',
        importance: 'BLOCKING',
        impact: 'Determines whether water-reactive agents exist before deploying water-based rescue crafts.',
        queryPrompt: 'Check facility ERP / MSDS ledger for Bay 7 / 400-Series storage tier manifest.',
        resolved: false,
      },
      {
        id: 'm-2',
        question: 'Secondary egress / fire door status of South Battery charging room',
        importance: 'CRITICAL',
        impact: 'If exit door 7-B2 is open, Sandeep may have evacuated towards Muster Point C.',
        queryPrompt: 'Request Security Control to check South Gate camera feed 07-B.',
        resolved: false,
      },
      {
        id: 'm-3',
        question: 'Remote breaker grid ID to kill power without entering submerged switchboard',
        importance: 'BLOCKING',
        impact: 'Substation crew must de-energize Bay 7 transformer externally to prevent rescue team electrocution.',
        queryPrompt: 'Contact City Grid Dispatch for Substation 4 feeder line Bay-7 isolation.',
        resolved: false,
      },
    ],
    actions: [
      {
        id: 'act-1',
        category: 'DO_NOW',
        title: 'Remote Emergency Grid Power De-Energization',
        description: 'Command City Electric Substation 4 to trip feeder circuit breaker SF-704, cutting 480V feed to Bay 7 transformer before rescue personnel enter water.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Utility Grid Controller',
        actionType: 'SAFETY_OVERRIDE',
        why: 'Active sparking transformer near 2ft flood water poses catastrophic electrocution risk to trapped personnel and arriving responders.',
        inputUsed: 'Voice dispatch: "transformer is buzzing loudly and throwin\' sparks near water level"',
        confidence: 98,
        nextStep: 'Authorize emergency breaker SF-704 trip command at Substation 4 supervisory desk.',
        missingPrerequisite: 'Feeder breaker ID SF-704 cross-reference',
        whatWouldChangeThis: 'If facility automatic isolation tripped internally or telemetry confirms transformer feed is dead.',
        whyThisAction: {
          reasoning: 'Active sparking transformer near 2ft flood water poses catastrophic electrocution risk to both trapped personnel and arriving responders.',
          drivingFacts: ['Active Electrical Arcing Hazard', 'Flood Depth 2ft and rising'],
          prerequisites: ['Identify feeder line ID SF-704 from single-line diagram'],
          riskIfOmitted: 'Fatal electrocution of rescue team upon water contact; arc flash explosion near chemical storage.'
        },
        prefilledData: {
          contactName: 'Metropolitan Grid Control Desk',
          targetPhone: '+1 (800) 555-GRID',
          draftMessage: 'URGENT LIFE-SAFETY: Substation 4, disconnect Feeder SF-704 immediately. 2ft floodwater in contact with arcing 480V transformer at Sector 7 B-Wing.',
        }
      },
      {
        id: 'act-2',
        category: 'DO_NOW',
        title: 'Deploy High-Clearance Amphibious Search & Rescue Team',
        description: 'Deploy Water Rescue Unit 9 with inflatable Zodiac crafts directly to South Battery Room exterior door 7-B2.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Fire & Rescue Incident Commander',
        actionType: 'DISPATCH',
        why: 'Standard wheeled rescue ambulances cannot navigate 2ft+ water. Immediate access needed for trapped worker Sandeep.',
        inputUsed: 'Voice dispatch: "water past ramp, 2ft deep... Sandeep in battery room... need boat"',
        confidence: 94,
        nextStep: 'Stage Water Rescue Unit 9 at North perimeter staging ramp B.',
        whatWouldChangeThis: 'If badge muster audit confirms Sandeep evacuated through exterior gate.',
        whyThisAction: {
          reasoning: 'Standard wheeled ambulances cannot navigate 2ft+ water. Immediate access needed for trapped worker Sandeep.',
          drivingFacts: ['2 feet deep, rapidly rising', 'Trapped Personnel Status (Sandeep)'],
          prerequisites: ['Power cut verified by Act-1'],
          riskIfOmitted: 'Drowning or asphyxiation if water ingress reaches battery room before conventional access.'
        },
        prefilledData: {
          contactName: 'County Search & Rescue Dispatch',
          targetPhone: '911 / Unit 9 Direct',
          draftMessage: 'Priority 1 Rescue: Sector 7 B-Wing. Target: South Battery Room. Access via North perimeter road with boat. Personnel: 1 missing (Sandeep).',
        }
      },
      {
        id: 'act-3',
        category: 'PREPARE',
        title: 'Stage Hazmat Containment Booms & Sorbent Barriers',
        description: 'Pre-position chemical containment barriers around loading dock runoff spillway to intercept potential 400-series solvent leakage.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Hazmat Logistics Specialist',
        actionType: 'PROCEDURAL',
        why: 'Forklift impact with chemical racks may have punctured drums. Rising water will wash contaminants into storm drains.',
        inputUsed: 'Voice dispatch: "Forklift three tipped over right next to 400-series chemical racks"',
        confidence: 91,
        nextStep: 'Deploy 200ft polypropylene absorbent booms at Culvert Outflow C-3.',
        whatWouldChangeThis: 'If physical inspection verifies all 400-series drums remained sealed without structural rupture.',
        whyThisAction: {
          reasoning: 'Forklift impact with chemical racks may have punctured drums. Rising water will wash contaminants into municipal storm drains.',
          drivingFacts: ['Forklift 3 tipped adjacent to 400-series chemical racks'],
          prerequisites: ['Verify MSDS sheet for water-reactivity'],
          riskIfOmitted: 'Municipal storm sewer chemical contamination causing broader environmental disaster.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'c-1', text: 'Retrieve 200ft polypropylene absorbent booms', done: false },
            { id: 'c-2', text: 'Anchor boom at Culvert Outflow C-3', done: false },
            { id: 'c-3', text: 'Wear Level B protective PPE', done: false },
          ]
        }
      },
      {
        id: 'act-4',
        category: 'VERIFY',
        title: 'Confirm Muster Point Headcount & Sandeep Badge Telemetry',
        description: 'Query electronic turnstile access logs for card #4829 (Sandeep) to determine if badge-out was logged at Muster Point C or D.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Facility Safety Auditor',
        actionType: 'CHECKLIST',
        why: 'Verifies whether the trapped worker assumption is accurate or if he evacuated unnoticed before the siren failure.',
        inputUsed: 'Voice dispatch: "I think Sandeep was in south battery charging room... alarm speaker cut out"',
        confidence: 88,
        nextStep: 'Open security access control console and query card reader #4829 timestamp logs.',
        whatWouldChangeThis: 'If card swipe logs confirm Sandeep clocked out at assembly shelter.',
        whyThisAction: {
          reasoning: 'Verifies whether the trapped worker assumption is accurate or if he evacuated unnoticed before the siren failure.',
          drivingFacts: ['Trapped Personnel Status (Sandeep)'],
          prerequisites: ['Facility badge server network heartbeat check'],
          riskIfOmitted: 'Committing high-risk dive rescue personnel into dangerous waters for an already-evacuated worker.'
        },
        prefilledData: {
          contactName: 'Security Access Control Room',
          draftMessage: 'Check badge telemetry for employee #4829 Sandeep K. between 10:00 AM and 10:15 AM. Has badge registered at any assembly point reader?'
        }
      },
      {
        id: 'act-5',
        category: 'SHARE',
        title: 'Transmit Tactical Situation Packet to Arriving Incident Command',
        description: 'Send telemetry, hazard perimeter map, and missing fact alerts to regional fire dispatch mobile data terminals (MDT).',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Draft prepared',
        assignedRole: 'Operations Communications Officer',
        actionType: 'COMMUNICATION',
        why: 'Reporter battery is at 4%; arriving units must not enter blind without knowledge of the submerged transformer and tipped chemical rack.',
        inputUsed: 'Voice dispatch: "radio and phone battery are down to 4%"',
        confidence: 96,
        nextStep: 'Push digital tactical brief to County Fire Talkgroup 4 MDT terminals.',
        whatWouldChangeThis: 'If primary cell tower repeater fails before packet transmission is acknowledged.',
        whyThisAction: {
          reasoning: 'Reporter battery is at 4%; arriving units must not enter blind without knowledge of the submerged transformer and tipped chemical rack.',
          drivingFacts: ['Reporter battery down to 4%', 'Active Electrical Arcing Hazard'],
          prerequisites: ['Generate SAARTHI situational digest'],
          riskIfOmitted: 'Arriving fire engine driving into deep water or backing into live energized puddle.'
        },
        prefilledData: {
          contactName: 'Mutual Aid Tactical Radio Talkgroup 4',
          targetPhone: 'Channel TAC-4',
          draftMessage: 'SAARTHI ALERT: Sector 7 B-Wing. Hazmat rack compromise + 480V transformer in 2ft water. Do not enter via lower dock ramp. Approach via North Gate.'
        }
      },
      {
        id: 'act-6',
        category: 'FOLLOW_UP',
        title: 'Continuous Water Level Monitoring & Environmental Agency Protocol',
        description: 'Setup ultrasonic flood telemetry sensors and log EPA Spill Report notice if chemical release exceeds reporting thresholds.',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Environmental Compliance Officer',
        actionType: 'PROCEDURAL',
        why: 'Ensures legal compliance and tracking of potential groundwater infiltration after water recedes.',
        inputUsed: 'Industrial chemical proximity + municipal flood zone designation',
        confidence: 89,
        nextStep: 'File EPA Section 304 spill notification if drums breach.',
        whatWouldChangeThis: 'If flood waters recede without structural compromise to chemical drums.',
        whyThisAction: {
          reasoning: 'Ensures legal compliance and tracking of potential groundwater infiltration after water recedes.',
          drivingFacts: ['Flood Depth and Trajectory', 'Forklift 3 tipped adjacent to chemical racks'],
          prerequisites: ['Containment secured'],
          riskIfOmitted: 'Regulatory fines and unmonitored downstream ecological toxicity.'
        }
      }
    ],
    graphNodes: [
      { id: 'gn-1', stage: 'INPUT', title: 'Raw Voice Radio Transmission', detail: '38s stressed audio dispatch from Ramesh at Sector 7', status: 'urgent', targetIds: ['gn-2'], iconName: 'Mic' },
      { id: 'gn-2', stage: 'UNDERSTAND', title: 'Acoustic & Semantic Parsing', detail: 'Detected high stress cadence, 60Hz arcing buzz, rising flood velocity', status: 'normal', targetIds: ['gn-3', 'gn-4'], iconName: 'Brain' },
      { id: 'gn-3', stage: 'FACTS', title: 'Critical Hazards & Coordinates', detail: 'Sector 7 B-Wing, 2ft water, transformer arcing, tipped forklift', status: 'verified', targetIds: ['gn-5'], iconName: 'ShieldAlert' },
      { id: 'gn-4', stage: 'VERIFICATION', title: 'Truth Layer Triage', detail: '✓ 5 Provided/Verified | ⚠ 2 Uncertain | ? 3 Blocking Missing Data', status: 'missing', targetIds: ['gn-5'], iconName: 'CheckCircle2' },
      { id: 'gn-5', stage: 'INTENT', title: 'Primary Mission Intent', detail: 'Life-safety rescue with zero-electrocution containment', status: 'primary', targetIds: ['gn-6', 'gn-7'], iconName: 'Target' },
      { id: 'gn-6', stage: 'ACTIONS', title: 'DO NOW: Remote Power Kill', detail: 'Substation 4 trip breaker SF-704 immediately', status: 'urgent', targetIds: [], iconName: 'Zap' },
      { id: 'gn-7', stage: 'ACTIONS', title: 'DO NOW: Zodiac SAR Deployment', detail: 'Boat access to South Battery door 7-B2', status: 'urgent', targetIds: [], iconName: 'Layers' },
    ],
    tags: ['Emergency / Safety', 'Flash Flood', 'Electrical Safety', 'SAR Trapped Personnel', 'Hazmat'],
    actionPack: {
      situationSummary: 'Flash flood inundation at Sector 7 B-Wing. Submerged 480V transformer arcing near 2ft rising water. Tipped forklift near 400-series chemical rack. Unconfirmed worker Sandeep in battery room. Reporter battery at 4%.',
      keyFacts: [
        { label: 'Location', value: 'Sector 7 B-Wing Loading Docks', status: 'PROVIDED' },
        { label: 'Water Depth', value: '2 feet and rising rapidly', status: 'PROVIDED' },
        { label: 'Electrical Hazard', value: '480V transformer arcing in water', status: 'VERIFIED' },
        { label: 'Missing Worker', value: 'Sandeep (unconfirmed in battery room)', status: 'UNCERTAIN' },
      ],
      missingInformation: [
        'Chemical UN numbers on 400-series rack',
        'External feeder breaker SF-704 confirmation',
        'Badge muster record for employee Sandeep #4829'
      ],
      recommendedActions: [
        { title: 'Remote Power De-Energization', nextStep: 'Command Substation 4 to disconnect Feeder SF-704', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Deploy Zodiac Water Rescue Unit 9', nextStep: 'Launch boat from North perimeter road to Door 7-B2', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Stage Hazmat Booms', nextStep: 'Deploy 200ft booms at Culvert Outflow C-3', readiness: 'Ready to execute', category: 'PREPARE' },
      ],
      checklist: [
        { id: 'chk-1', text: 'Confirm Substation 4 breaker trip SF-704', completed: false },
        { id: 'chk-2', text: 'Query badge reader logs for Sandeep #4829', completed: false },
        { id: 'chk-3', text: 'Transmit tactical packet on radio talkgroup TAC-4', completed: false },
        { id: 'chk-4', text: 'Deploy sorbent chemical booms at storm culvert', completed: false },
      ],
      questionsToAsk: [
        'Is Feeder SF-704 de-energized on supervisory telemetry?',
        'Did employee Sandeep swipe out at assembly gate C or D?',
        'Does the 400-tier rack hold water-reactive organophosphates?'
      ],
      informationToShare: 'URGENT LIFE SAFETY: Sector 7 B-Wing. 2ft water in contact with arcing 480V transformer. Do not drive standard vehicles into lower dock ramp. Approach via North perimeter only.',
      generatedAt: '10:14 AM'
    }
  },

  // SCENARIO B: Government / Public Services
  {
    id: 'case-demo-2',
    title: 'Deceased Relative Pension Transfer & Portal Identity Lock',
    category: 'Government / Public Services',
    timestamp: '18 min ago (9:56 AM)',
    inputType: 'document',
    engineUsed: 'deterministic-demo',
    rawInput:
      `"My 78yo mother-in-law's widow pension stopped coming 3 months ago after father-in-law passed. The state social security portal keeps rejecting her application with 'Error 409: Biometric / Name mismatch between Death Certificate and Aadhaar / Pension ID'. We uploaded the hospital death summary, but the clerk says we need a stamped municipal death certificate with QR verification, a non-remarriage affidavit on stamp paper, and an updated bank mandate form. We don't have the original pension PPO booklet, and she can't travel to the sub-treasury office because she is bedridden. What exactly do we need to do before the 90-day lapse cutoff on Friday?"`,
    metadata: {
      fileName: 'pension_rejection_notice_and_notes.txt',
      fileSize: '3.8 KB',
      wordCount: 104,
    },
    situationDetected:
      'Widow pension disbursement blocked for 3 months due to digital identity mismatch (Error 409) between hospital records and state database. Pending 90-day lapse deadline on Friday; applicant is bedridden and unable to visit sub-treasury in person.',
    primaryIntent:
      'Prevent permanent pension file lapse before Friday deadline by securing administrative stay and submitting legally valid municipal death documents with home-visit biometric exemption.',
    secondaryIntents: [
      'Replace hospital summary with municipal death certificate QR record',
      'Execute non-remarriage affidavit on non-judicial stamp paper',
      'Request home biometric verification under senior citizen disability guidelines'
    ],
    urgency: 'HIGH',
    urgencyReasoning:
      'Imminent regulatory deadline: 90-day lapse cutoff occurs this Friday. If lapsed, case moves to re-sanctioning queue, causing 6-12 months of delayed financial support for vulnerable senior.',
    safetyDisclaimer:
      'PUBLIC SERVICE & ADMINISTRATIVE ADVISORY: SAARTHI provides procedural guidance, statutory checklist preparation, and agency routing. Legal filings must comply with local jurisdiction notarization rules.',
    overallConfidence: 94,
    confidenceBreakdown: {
      inputCoherence: 97,
      factGrounding: 95,
      verificationCertainty: 90,
    },
    assumptions: [
      'Applicant is legally eligible for family pension under deceased spouse PPO ledger.',
      'Friday deadline represents the statutory 90-day grievance window before archival.'
    ],
    extractedFacts: [
      {
        id: 'f-b1',
        category: 'deadline',
        label: 'Statutory Lapse Deadline',
        value: 'Friday (90-day grievance cutoff)',
        status: 'PROVIDED',
        confidence: 99,
        sourceQuote: 'What exactly do we need to do before the 90-day lapse cutoff on Friday?',
        rationale: 'Direct temporal deadline stated by applicant family member.',
        whyDoWeTrustThis: 'Matches state social welfare department regulation Rule 18(b) on quarterly grievance windows.',
      },
      {
        id: 'f-b2',
        category: 'status',
        label: 'Portal Rejection Code',
        value: 'Error 409: Biometric / Name mismatch between death record and Aadhaar / Pension ID',
        status: 'VERIFIED',
        confidence: 96,
        sourceQuote: 'The state social security portal keeps rejecting her application with \'Error 409: Biometric / Name mismatch\'',
        rationale: 'Specific system error code identifying schema validation failure.',
        whyDoWeTrustThis: 'Confirmed error code in state Treasury e-Pension portal architecture for token mismatch.',
      },
      {
        id: 'f-b3',
        category: 'document',
        label: 'Rejected Document Type',
        value: 'Hospital death summary (legally invalid for treasury disbursements)',
        status: 'VERIFIED',
        confidence: 98,
        sourceQuote: 'We uploaded the hospital death summary, but the clerk says we need a stamped municipal death certificate with QR verification',
        rationale: 'Treasuries reject medical summaries; only municipal civil registrar certificates with QR are accepted.',
        whyDoWeTrustThis: 'Standard statutory mandate under Registration of Births and Deaths Act Section 12.',
      },
      {
        id: 'f-b4',
        category: 'constraint',
        label: 'Physical Mobility Barrier',
        value: '78yo applicant is bedridden; physically unable to visit treasury counter',
        status: 'PROVIDED',
        confidence: 95,
        sourceQuote: 'she can\'t travel to the sub-treasury office because she is bedridden',
        rationale: 'Direct statement of physical dependency requiring doorstep facilitation.',
        whyDoWeTrustThis: 'Consistent with senior citizen welfare provisions for non-ambulatory pensioners.',
      },
      {
        id: 'f-b5',
        category: 'document',
        label: 'Missing Original PPO Booklet',
        value: 'Physical Pension Payment Order (PPO) booklet lost or unlocated',
        status: 'UNCERTAIN',
        confidence: 70,
        sourceQuote: 'We don\'t have the original pension PPO booklet',
        rationale: 'Family cannot find booklet, but digital treasury record exists in central database.',
        whyDoWeTrustThis: 'PPO number can be retrieved electronically from deceased spouse bank account passbook.',
      },
    ],
    missingInformation: [
      {
        id: 'm-b1',
        question: 'Digital Pension Payment Order (PPO) number from bank passbook or pension slips',
        importance: 'BLOCKING',
        impact: 'Required to look up electronic master record without waiting for physical booklet replacement.',
        queryPrompt: 'Check bank statement narration for 12-digit PPO number code (e.g., PPO-XXXX-XXXX).',
        resolved: false,
      },
      {
        id: 'm-b2',
        question: 'Municipal death registration application acknowledgment number',
        importance: 'CRITICAL',
        impact: 'Needed to download verified QR death certificate immediately from city municipal portal.',
        queryPrompt: 'Was death registered with Municipal Corporation within 21 days of passing?',
        resolved: false,
      },
      {
        id: 'm-b3',
        question: 'Joint bank account survivor mandate status',
        importance: 'IMPORTANT',
        impact: 'Determines whether widow can continue receiving funds into existing account or needs new single account.',
        queryPrompt: 'Is the bank account operated under "Either or Survivor" mode?',
        resolved: false,
      },
    ],
    actions: [
      {
        id: 'act-b1',
        category: 'DO_NOW',
        title: 'File Emergency Provisional Stay & Grievance Token to Stop Friday Cutoff',
        description: 'Submit formal digital representation under Grievance Rule 14 to District Treasury Officer citing applicant medical confinement to prevent 90-day case lapse.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Grievance Facilitator',
        actionType: 'PROCEDURAL',
        why: 'Prevents automatic case cancellation on Friday, saving 6-12 months of bureaucratic re-sanctioning.',
        inputUsed: 'Applicant message: "90-day lapse cutoff on Friday"',
        confidence: 96,
        nextStep: 'Submit electronic grievance docket to District Treasury Portal before 5:00 PM today.',
        missingPrerequisite: '12-digit PPO number from bank statement',
        whatWouldChangeThis: 'If Friday cutoff is an informal reminder rather than an automated database purge.',
        whyThisAction: {
          reasoning: 'An active grievance docket legally tolls statutory limitation periods in state pension rules.',
          drivingFacts: ['Statutory Lapse Deadline Friday', 'Portal Rejection Code Error 409'],
          prerequisites: ['Generate SAARTHI grievance stay brief'],
          riskIfOmitted: 'Case file permanently archived; retroactive pension arrears forfeited.'
        },
        prefilledData: {
          draftMessage: 'RE: URGENT STAY REQUEST - Family Pension Transfer for Smt. Martha V. (PPO Ref Pending). Applicant is 78yo bedridden widow. Formal request to toll 90-day cutoff pending doorstep verification.',
        }
      },
      {
        id: 'act-b2',
        category: 'DO_NOW',
        title: 'Download Verified Municipal QR Death Certificate Online',
        description: 'Access the Municipal Civil Registration System (CRS) portal using hospital death record date to download the official QR-verifiable certificate.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Document Coordinator',
        actionType: 'PROCEDURAL',
        why: 'Hospital death summaries are legally rejected by state treasuries; only civil municipal certificates resolve Error 409.',
        inputUsed: 'Clerk notice: "need stamped municipal death certificate with QR verification"',
        confidence: 95,
        nextStep: 'Log into Municipal Birth & Death Portal and download digitally signed PDF.',
        whatWouldChangeThis: 'If death was not formally registered with municipal registrar within statutory window.',
        whyThisAction: {
          reasoning: 'Treasury payment systems require automated QR cryptographic signature verification against civil registries.',
          drivingFacts: ['Rejected Document Type: Hospital death summary'],
          prerequisites: ['Date of death and hospital registration slip number'],
          riskIfOmitted: 'Continuous portal rejection under Error 409.'
        }
      },
      {
        id: 'act-b3',
        category: 'PREPARE',
        title: 'Draft Non-Remarriage & Identity Affidavit on Non-Judicial Stamp Paper',
        description: 'Prepare standard Form 14 Non-Remarriage Affidavit and schedule home notary visit for bedridden applicant signature.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Legal Notary Coordinator',
        actionType: 'PROCEDURAL',
        why: 'Statutory requirement for widow pension transition to prevent wrongful disbursement.',
        inputUsed: 'Clerk checklist: "non-remarriage affidavit on stamp paper"',
        confidence: 93,
        nextStep: 'Print SAARTHI prefilled Form 14 affidavit template onto ₹100 stamp paper.',
        whatWouldChangeThis: 'If local treasury accepts self-declaration without executive magistrate stamp.',
        whyThisAction: {
          reasoning: 'Statutory prerequisite under Civil Pension Rules Section 54.',
          drivingFacts: ['State Social Security regulatory requirements'],
          prerequisites: ['Applicant identity proof copy'],
          riskIfOmitted: 'Rejection of physical submission by treasury auditor.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'bchk-1', text: 'Fill deceased pensioner name and date of demise', done: false },
            { id: 'bchk-2', text: 'Attach two self-attested passport photographs', done: false },
            { id: 'bchk-3', text: 'Obtain notary seal at residence', done: false },
          ]
        }
      },
      {
        id: 'act-b4',
        category: 'VERIFY',
        title: 'Request Doorstep Biometric Verification (DLC) Service',
        description: 'Book India Post Payments Bank (IPPB) or local social welfare doorstep digital life certificate home visit for bedridden pensioner.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Doorstep Outreach Desk',
        actionType: 'CHECKLIST',
        why: 'Applicant cannot travel to treasury; postal doorstep biometric device fulfills treasury physical verification.',
        inputUsed: 'Applicant message: "she can\'t travel to the sub-treasury office because she is bedridden"',
        confidence: 92,
        nextStep: 'Book doorstep postman visit via PostInfo mobile application or postal helpline.',
        whatWouldChangeThis: 'If applicant fingerprints fail due to age-related biometric wear (iris scan needed).',
        whyThisAction: {
          reasoning: 'Universal public service accommodation for non-ambulatory seniors under Ministry guidelines.',
          drivingFacts: ['Physical Mobility Barrier: Bedridden senior'],
          prerequisites: ['Aadhaar linked mobile number active for OTP'],
          riskIfOmitted: 'Treasury rejects application for lack of mandatory physical appearance.'
        }
      },
      {
        id: 'act-b5',
        category: 'FOLLOW_UP',
        title: 'Submit Bank Mandate Form with Direct Treasury Acknowledgement',
        description: 'Deliver updated Annexure-I bank mandate to pension disbursing bank branch and obtain stamped treasury counterfoil.',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Banking Liaison',
        actionType: 'PROCEDURAL',
        why: 'Redirects ongoing monthly credit into widow single savings account.',
        inputUsed: 'Clerk notice: "updated bank mandate form"',
        confidence: 90,
        nextStep: 'Visit parent branch with widow KYC and stamped treasury approval order.',
        whatWouldChangeThis: 'If pension account was already registered under survivor mandate.',
        whyThisAction: {
          reasoning: 'Treasuries will not disburse funds into a deceased individual primary account.',
          drivingFacts: ['3 months halted pension disbursements'],
          prerequisites: ['Municipal death certificate + Form 14 approval'],
          riskIfOmitted: 'Disbursement bounces and funds revert to state treasury reserve.'
        }
      }
    ],
    graphNodes: [
      { id: 'gn-b1', stage: 'INPUT', title: 'Messy Citizen Pension Dispute', detail: '104 words detailing halted widow pension, portal error 409, Friday cutoff', status: 'urgent', targetIds: ['gn-b2'], iconName: 'FileText' },
      { id: 'gn-b2', stage: 'UNDERSTAND', title: 'Statutory & Systems Parsing', detail: 'Identified Error 409 mismatch, 90-day limitation rule, non-ambulatory status', status: 'normal', targetIds: ['gn-b3', 'gn-b4'], iconName: 'Brain' },
      { id: 'gn-b3', stage: 'FACTS', title: 'Extracted Grounded Requirements', detail: 'Municipal QR death cert needed, bedridden status, Friday lapse deadline', status: 'verified', targetIds: ['gn-b5'], iconName: 'ShieldAlert' },
      { id: 'gn-b4', stage: 'VERIFICATION', title: 'Truth Layer Triage', detail: '✓ 4 Provided/Verified | ⚠ 1 Uncertain PPO | ? 3 Blocking Missing Data', status: 'missing', targetIds: ['gn-b5'], iconName: 'CheckCircle2' },
      { id: 'gn-b5', stage: 'INTENT', title: 'Administrative Stay & Resolution Intent', detail: 'Toll limitation cutoff and execute doorstep assisted transition', status: 'primary', targetIds: ['gn-b6', 'gn-b7'], iconName: 'Target' },
      { id: 'gn-b6', stage: 'ACTIONS', title: 'DO NOW: Emergency Stay Grievance', detail: 'Prevent automated Friday system cutoff', status: 'urgent', targetIds: [], iconName: 'Zap' },
      { id: 'gn-b7', stage: 'ACTIONS', title: 'DO NOW: Municipal QR Cert Download', detail: 'Replace invalid hospital summary', status: 'urgent', targetIds: [], iconName: 'Layers' },
    ],
    tags: ['Government / Public Services', 'Pension Transfer', 'Error 409', 'Senior Welfare', 'Doorstep Facilitation'],
    actionPack: {
      situationSummary: 'Widow pension blocked for 3 months due to Error 409 mismatch between hospital summary and state portal. 90-day grievance deadline lapses this Friday. Applicant is 78yo bedridden senior unable to visit sub-treasury.',
      keyFacts: [
        { label: 'Deadline', value: 'Friday (90-day cutoff)', status: 'PROVIDED' },
        { label: 'System Error', value: 'Error 409: Biometric / Name Mismatch', status: 'VERIFIED' },
        { label: 'Deficient Document', value: 'Hospital summary uploaded instead of Municipal QR certificate', status: 'VERIFIED' },
        { label: 'Mobility Condition', value: '78yo bedridden senior citizen', status: 'PROVIDED' },
      ],
      missingInformation: [
        '12-digit PPO registration number from passbook',
        'Municipal death certificate application acknowledgment',
        'Bank account Joint survivor mandate status'
      ],
      recommendedActions: [
        { title: 'Emergency Stay Grievance Docket', nextStep: 'Submit electronic stay request to District Treasury Officer before 5 PM', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Download Municipal QR Death Cert', nextStep: 'Access municipal portal to retrieve cryptographically signed certificate', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Book Postal Doorstep Biometric Visit', nextStep: 'Schedule PostInfo doorstep Digital Life Certificate appointment', readiness: 'Ready to execute', category: 'VERIFY' },
      ],
      checklist: [
        { id: 'bchk-1', text: 'Obtain 12-digit PPO number from old pension bank statement', completed: false },
        { id: 'bchk-2', text: 'Download official Municipal QR Death Certificate', completed: false },
        { id: 'bchk-3', text: 'Draft Form 14 Non-Remarriage Affidavit on ₹100 stamp paper', completed: false },
        { id: 'bchk-4', text: 'Book IPPB Doorstep Biometric agent for home verification', completed: false },
      ],
      questionsToAsk: [
        'Can the Treasury Officer confirm the 90-day clock is tolled upon grievance filing?',
        'Does the postal doorstep agent support iris scanning if fingerprints are worn?',
        'Is the current bank account operated under "Either or Survivor" terms?'
      ],
      informationToShare: 'URGENT PENSION GRIEVANCE: Case Martha V. Widow Pension transfer delayed by Error 409. Formal stay requested under Senior Citizen Protection guidelines. Bedridden applicant requires doorstep DLC verification.',
      generatedAt: '9:56 AM'
    }
  },

  // SCENARIO C: Weather / Travel
  {
    id: 'case-demo-3',
    title: 'Blizzard Flight Divert, Pass Closure & Stranded Family',
    category: 'Weather / Travel',
    timestamp: '42 min ago (9:32 AM)',
    inputType: 'text',
    engineUsed: 'deterministic-demo',
    rawInput:
      `"We are stuck with our 2 kids (ages 4 and 7) and diabetic grandfather at Denver concourse B. Our connecting flight to Aspen was canceled due to high mountain blizzard winds (gusts 65mph). United says next flight is in 48 hours. The rental car counter has only 2WD sedans left, but highway patrol just mandated chains or 4WD traction on I-70 through Eisenhower Tunnel and Loveland Pass is closed! Our non-refundable condo rental in Snowmass checks in tonight, and grandpa only packed 2 days of insulin in his carry-on. Should we book an airport hotel, take a shuttle, or rent the car, and what happens to the $1,800 lodging charge?"`,
    metadata: {
      fileName: 'family_travel_crisis_denver.txt',
      wordCount: 108,
    },
    situationDetected:
      'Family of 5 (including 2 young children and an insulin-dependent senior) stranded at Denver Airport during winter blizzard. Connecting flight canceled with 48h rebooking lag; mountain road restrictions (I-70 Traction Law, Loveland Pass closed) make 2WD rental unsafe and illegal; medical insulin supply is constrained; $1,800 lodging forfeiture risk.',
    primaryIntent:
      'Ensure immediate family safety and insulin continuity by securing lodging near the airport, averting illegal/hazardous mountain driving, and invoking airline/lodging force-majeure protections.',
    secondaryIntents: [
      'Strictly avoid 2WD mountain travel under I-70 Traction Law',
      'Secure insulin contingency supply at 24h airport pharmacy',
      'Notify Snowmass property manager of weather cancellation under travel interruption clause'
    ],
    urgency: 'HIGH',
    urgencyReasoning:
      'Compounded safety risk: Extreme weather (65mph winds, pass closure), two minors (4 & 7), senior with 48-hour insulin supply limit, and high probability of severe hypothermic highway stranding if attempting I-70 in 2WD.',
    safetyDisclaimer:
      'TRAVEL LOGISTICS & METEOROLOGICAL ADVISORY: SAARTHI provides route safety validation and regulatory consumer travel rights guidance. Never bypass state highway patrol road closures.',
    overallConfidence: 93,
    confidenceBreakdown: {
      inputCoherence: 96,
      factGrounding: 94,
      verificationCertainty: 89,
    },
    assumptions: [
      'United Airlines cancellation is classified as meteorological weather disruption (Force Majeure).',
      'Airport hotels are filling rapidly due to regional flight ground stop.'
    ],
    extractedFacts: [
      {
        id: 'f-c1',
        category: 'hazard',
        label: 'Mountain Weather Condition',
        value: 'High mountain blizzard with 65mph gusts; flight canceled, 48h rebook',
        status: 'PROVIDED',
        confidence: 98,
        sourceQuote: 'connecting flight to Aspen was canceled due to high mountain blizzard winds (gusts 65mph)',
        rationale: 'Confirmed airline ground cancellation at Aspen/Pitkin County Airport.',
        whyDoWeTrustThis: 'Cross-referenced against National Weather Service Winter Storm Warning #CO-084.',
      },
      {
        id: 'f-c2',
        category: 'constraint',
        label: 'Highway Traction Law',
        value: 'I-70 Traction Law Code 15 active; Loveland Pass closed; 2WD rental illegal without chains',
        status: 'VERIFIED',
        confidence: 99,
        sourceQuote: 'highway patrol just mandated chains or 4WD traction on I-70 through Eisenhower Tunnel and Loveland Pass is closed',
        rationale: 'Colorado DOT Regulation 42-4-106 legally mandates 4WD/AWD or approved commercial chains.',
        whyDoWeTrustThis: 'Official Colorado Department of Transportation (COTRIP) live feed verification.',
      },
      {
        id: 'f-c3',
        category: 'hazard',
        label: 'Vulnerable Travelers',
        value: '2 children (ages 4 & 7) + diabetic grandfather with 2-day insulin reserve',
        status: 'PROVIDED',
        confidence: 96,
        sourceQuote: 'stuck with our 2 kids (ages 4 and 7) and diabetic grandfather... grandpa only packed 2 days of insulin',
        rationale: 'Direct passenger manifest detail providing critical welfare parameters.',
        whyDoWeTrustThis: 'Direct statement by traveling family member responsible for care.',
      },
      {
        id: 'f-c4',
        category: 'resource',
        label: 'Non-Refundable Lodging at Risk',
        value: '$1,800 Snowmass condo check-in scheduled for tonight',
        status: 'PROVIDED',
        confidence: 94,
        sourceQuote: 'Our non-refundable condo rental in Snowmass checks in tonight... what happens to the $1,800 lodging charge?',
        rationale: 'Financial exposure requiring prompt travel insurance / force majeure formal notice.',
        whyDoWeTrustThis: 'Stated booking terms; subject to standard airline cancellation waiver exceptions.',
      },
      {
        id: 'f-c5',
        category: 'status',
        label: 'Mountain Shuttle Availability',
        value: 'Commercial van shuttles (Epic/Bustang) operating status UNCERTAIN',
        status: 'UNCERTAIN',
        confidence: 65,
        sourceQuote: 'take a shuttle, or rent the car',
        rationale: 'Commercial shuttles with chained 4WD vans may still run scheduled trips if I-70 is open to commercial carriers.',
        whyDoWeTrustThis: 'Requires direct dispatcher confirmation; road conditions changing hourly.',
      },
    ],
    missingInformation: [
      {
        id: 'm-c1',
        question: 'Grandfather exact insulin brand, dosage units, and prescribing pharmacy network',
        importance: 'CRITICAL',
        impact: 'Needed if Denver airport pharmacy must issue an emergency 72-hour bridge refill.',
        queryPrompt: 'Check insulin pen label for Rx number, brand (e.g. Lantus/Humalog), and pharmacy name.',
        resolved: false,
      },
      {
        id: 'm-c2',
        question: 'Travel insurance policy number or booking credit card cardholder benefit coverage',
        importance: 'IMPORTANT',
        impact: 'Premium credit cards (Chase Sapphire, Amex Plat) provide $500–$10,000 trip interruption coverage for weather.',
        queryPrompt: 'Was condo/flight booked on a credit card offering automatic travel protection?',
        resolved: false,
      },
      {
        id: 'm-c3',
        question: 'United Airlines official cancellation reason code on boarding pass',
        importance: 'IMPORTANT',
        impact: 'Determines whether airline is legally obligated to provide hotel vouchers under DOT commitments.',
        queryPrompt: 'Ask United customer desk for the cancellation code (WX vs MX).',
        resolved: false,
      },
    ],
    actions: [
      {
        id: 'act-c1',
        category: 'DO_NOW',
        title: 'DO NOT Rent 2WD Vehicle; Secure Denver Airport Hotel Immediately',
        description: 'Immediately book room at Westin Denver International Airport or adjacent gateway hotel. Under no circumstances attempt I-70 Eisenhower Tunnel in a 2WD rental.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Family Travel Lead',
        actionType: 'SAFETY_OVERRIDE',
        why: 'Driving a 2WD sedan into a 65mph blizzard on I-70 is illegal under Code 15, risks massive fines ($650+), and poses life-threatening stranding risk for young children and diabetic senior.',
        inputUsed: 'COTRIP Highway Patrol Traction Law + rental counter only has 2WD sedans',
        confidence: 99,
        nextStep: 'Open hotel booking app or visit airport hotel courtesy desk at terminal center.',
        missingPrerequisite: 'Room availability check',
        whatWouldChangeThis: 'If Colorado DOT lifts Traction Law and Loveland Pass reopens completely (unlikely during active blizzard).',
        whyThisAction: {
          reasoning: 'Vehicles without chains or AWD frequently spin out in Eisenhower approaches, trapping occupants in sub-zero blizzard for 8+ hours.',
          drivingFacts: ['Highway Traction Law Code 15 active', '2 children + diabetic senior traveling'],
          prerequisites: ['Cancel rental car reservation without penalty'],
          riskIfOmitted: 'Hypothermic highway stranding with two minors and vulnerable senior.'
        },
        prefilledData: {
          contactName: 'Westin Denver Airport Desk',
          targetPhone: '+1 (303) 317-1800',
          draftMessage: 'Priority family reservation request: 2 adults, 2 minors, 1 senior stranded due to weather ground stop.',
        }
      },
      {
        id: 'act-c2',
        category: 'DO_NOW',
        title: 'Verify Airport Pharmacy Insulin Refill Contingency',
        description: 'Locate Denver Concourse B/C medical station or pharmacy to establish 72-hour insulin bridge protocol before supplies hit critical threshold.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Medical Logistics',
        actionType: 'PROCEDURAL',
        why: 'Grandfather has only 2 days of insulin and airline rebooking is at least 48 hours out. Any further weather delays will cause life-threatening medication exhaustion.',
        inputUsed: 'Applicant message: "grandpa only packed 2 days of insulin... next flight is in 48 hours"',
        confidence: 95,
        nextStep: 'Visit Denver Airport Clinic (Concourse A/B connector) with existing insulin prescription vial.',
        whatWouldChangeThis: 'If family secures confirmed morning flight out of Denver within 12 hours.',
        whyThisAction: {
          reasoning: 'Proactive prescription bridge prevents diabetic ketoacidosis risk during extended storm grounding.',
          drivingFacts: ['Vulnerable Travelers: 2 days insulin reserve remaining'],
          prerequisites: ['Rx number from existing pen'],
          riskIfOmitted: 'Severe hyperglycemic medical emergency in airport terminal.'
        }
      },
      {
        id: 'act-c3',
        category: 'PREPARE',
        title: 'Issue Weather Force-Majeure Notice to Snowmass Condo Manager',
        description: 'Send formal written notice citing mandatory flight cancellation and highway traction law closures to claim travel interruption credit for $1,800 charge.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Draft prepared',
        assignedRole: 'Financial Recovery Officer',
        actionType: 'COMMUNICATION',
        why: 'Most non-refundable terms contain "Acts of God / Inaccessibility" clauses requiring written notice within 4 hours of scheduled arrival.',
        inputUsed: 'Applicant message: "$1,800 lodging charge tonight in Snowmass"',
        confidence: 92,
        nextStep: 'Send SAARTHI generated email notice to property manager with United cancellation screenshot.',
        whatWouldChangeThis: 'If property contract strictly disclaims all weather contingencies and travel insurance was declined.',
        whyThisAction: {
          reasoning: 'Preserves legal rights under Colorado Consumer Protection & Force Majeure doctrine.',
          drivingFacts: ['$1,800 non-refundable condo tonight', 'Loveland Pass closed by CDOT'],
          prerequisites: ['Attach screenshot of United Flight Cancel Notice'],
          riskIfOmitted: 'Total forfeiture of $1,800 without ability to dispute chargeback.'
        },
        prefilledData: {
          draftMessage: 'NOTICE OF INACCESSIBILITY / FORCE MAJEURE: Reservation #SNOW-9481. Due to official Colorado DOT I-70 closure and United Airlines cancellation WX-084, physical access to property is legally prohibited. We formally request date credit or refund under Section 9 Travel Disruption.',
        }
      },
      {
        id: 'act-c4',
        category: 'VERIFY',
        title: 'Check Chained 4WD Mountain Express Shuttle Feasibility for Tomorrow',
        description: 'Query commercial carriers (Epic Mountain Express / Bustang West) for scheduled departures tomorrow once plow convoys clear Eisenhower tunnel.',
        urgency: 'MEDIUM',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Transit Coordinator',
        actionType: 'CHECKLIST',
        why: 'Commercial shuttles run legally under Code 15 with professional drivers and heavy chain equipment, avoiding 48h flight lag.',
        inputUsed: 'Next flight is 48 hours away; alternative ground transport needed',
        confidence: 88,
        nextStep: 'Check morning shuttle departure manifest from Denver Airport terminal.',
        whatWouldChangeThis: 'If CDOT closes I-70 completely to commercial vehicles due to avalanche mitigation.',
        whyThisAction: {
          reasoning: 'Reaches Aspen/Snowmass 36 hours ahead of the rescheduled airline departure.',
          drivingFacts: ['Next flight in 48 hours'],
          prerequisites: ['Road clearance update at 06:00 AM'],
          riskIfOmitted: 'Wasting 2 full vacation days in airport terminal waiting for airline.'
        }
      },
      {
        id: 'act-c5',
        category: 'FOLLOW_UP',
        title: 'File Trip Delay Claim with Booking Credit Card Benefits Administrator',
        description: 'Aggregate hotel receipts, meal bills, and flight delay notices to submit under credit card trip delay reimbursement ($500/ticket benefit).',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Claims Specialist',
        actionType: 'PROCEDURAL',
        why: 'Reimburses tonight airport hotel, meals, and emergency toiletries up to card policy limits.',
        inputUsed: 'Stranded at Denver concourse B due to weather',
        confidence: 91,
        nextStep: 'Retain all itemized receipts from Denver airport hotel and dining.',
        whatWouldChangeThis: 'If flight was purchased using debit card or miles without embedded trip delay benefits.',
        whyThisAction: {
          reasoning: 'Offsets unplanned lodging and sustenance expenses.',
          drivingFacts: ['Flight cancellation delay exceeding 12 hours'],
          prerequisites: ['Receipt collection'],
          riskIfOmitted: 'Absorbing $400+ unexpected overnight delay expenses out of pocket.'
        }
      }
    ],
    graphNodes: [
      { id: 'gn-c1', stage: 'INPUT', title: 'Family Weather Distress Message', detail: '108 words: stranded family, blizzard, 2WD rental dilemma, insulin limit', status: 'urgent', targetIds: ['gn-c2'], iconName: 'FileText' },
      { id: 'gn-c2', stage: 'UNDERSTAND', title: 'Meteorological & Legal Transport Triage', detail: 'Mapped CDOT Code 15 traction restrictions + insulin exhaustion curve', status: 'normal', targetIds: ['gn-c3', 'gn-c4'], iconName: 'Brain' },
      { id: 'gn-c3', stage: 'FACTS', title: 'Highway & Health Constraints', detail: '2WD rental illegal on I-70, 2-day insulin left, $1,800 condo at risk', status: 'verified', targetIds: ['gn-c5'], iconName: 'ShieldAlert' },
      { id: 'gn-c4', stage: 'VERIFICATION', title: 'Truth Layer Triage', detail: '✓ 4 Provided/Verified | ⚠ 1 Uncertain Shuttle | ? 3 Missing Telemetry', status: 'missing', targetIds: ['gn-c5'], iconName: 'CheckCircle2' },
      { id: 'gn-c5', stage: 'INTENT', title: 'Safe Lodging & Force Majeure Intent', detail: 'Halt hazardous travel, secure medical bridge, invoke lodging credit', status: 'primary', targetIds: ['gn-c6', 'gn-c7'], iconName: 'Target' },
      { id: 'gn-c6', stage: 'ACTIONS', title: 'DO NOW: Abort 2WD & Book Hotel', detail: 'Avoid lethal mountain highway stranding', status: 'urgent', targetIds: [], iconName: 'Zap' },
      { id: 'gn-c7', stage: 'ACTIONS', title: 'DO NOW: Emergency Insulin Bridge', detail: 'Secure airport medical backup supply', status: 'urgent', targetIds: [], iconName: 'Layers' },
    ],
    tags: ['Weather / Travel', 'Winter Blizzard', 'Highway Traction Law', 'Medical Continuity', 'Consumer Rights'],
    actionPack: {
      situationSummary: 'Family of 5 (2 kids, diabetic senior) stranded at Denver Airport during blizzard. Aspen flight canceled with 48h lag. I-70 Traction Law active; 2WD rental illegal and unsafe. Grandfather has 2 days insulin remaining. $1,800 condo at risk tonight.',
      keyFacts: [
        { label: 'Weather Hazard', value: 'Blizzard with 65mph gusts; Loveland Pass closed', status: 'PROVIDED' },
        { label: 'Legal Road Status', value: 'I-70 Traction Law Code 15 active (2WD barred)', status: 'VERIFIED' },
        { label: 'Medical Vulnerability', value: 'Diabetic senior with 48h insulin remaining', status: 'PROVIDED' },
        { label: 'Financial Exposure', value: '$1,800 Snowmass condo check-in tonight', status: 'PROVIDED' },
      ],
      missingInformation: [
        'Grandfather insulin brand and prescription number',
        'Credit card trip interruption coverage tier',
        'United Airlines cancellation code (WX vs MX)'
      ],
      recommendedActions: [
        { title: 'DO NOT Drive 2WD; Book Airport Hotel', nextStep: 'Secure hotel room at Denver Airport terminal gateway immediately', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Secure Emergency Insulin Bridge', nextStep: 'Visit airport medical clinic to ensure prescription continuity', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Issue Force-Majeure Notice to Condo', nextStep: 'Transmit written notice to preserve $1,800 reservation credit', readiness: 'Ready to execute', category: 'PREPARE' },
      ],
      checklist: [
        { id: 'cchk-1', text: 'Secure Denver airport hotel room reservation', completed: false },
        { id: 'cchk-2', text: 'Inspect grandfather insulin pen remaining units', completed: false },
        { id: 'cchk-3', text: 'Email Snowmass lodging manager with cancel proof', completed: false },
        { id: 'cchk-4', text: 'Save all meal and delay receipts for card insurance claim', completed: false },
      ],
      questionsToAsk: [
        'Does the airport clinic have Lantus / Humalog pens in stock?',
        'Will United issue a hotel voucher at the customer service desk?',
        'Will the Snowmass condo credit our payment toward a future stay?'
      ],
      informationToShare: 'TRAVEL DISRUPTION BRIEF: Family of 5 stranded in Denver. Flight canceled due to blizzard. I-70 Traction Law bars 2WD travel. Hotel booked at airport. Requesting emergency insulin bridge and lodging force-majeure hold.',
      generatedAt: '9:32 AM'
    }
  },

  // SCENARIO D: Documents / Forms
  {
    id: 'case-demo-4',
    title: 'Commercial Lease Addendum Dispute & Escrow Withholding',
    category: 'Documents / Forms',
    timestamp: '55 min ago (9:19 AM)',
    inputType: 'document',
    engineUsed: 'deterministic-demo',
    rawInput:
      `"Landlord sent a formal notice alleging we owe $14,200 in retroactive Triple Net (NNN) common area maintenance reconciliations from 2024 and threatening to draw down our $25,000 security deposit letter of credit in 5 business days. But our signed lease Section 14.3 explicitly caps annual CAM increases at 5% unless due to property tax hikes, and they haven't provided any municipal tax bills. Furthermore, Section 22.1 requires 30 days written notice to cure before any letter of credit draw. Our accountant noticed they billed for HVAC roof replacement, which our Rider B clause specifies is a Capital Expenditure payable 100% by the Lessor, not an operational maintenance expense! We need to stop the bank draw immediately and demand an audit."`,
    metadata: {
      fileName: 'commercial_lease_dispute_notice.pdf',
      fileSize: '5.1 KB',
      wordCount: 119,
    },
    situationDetected:
      'Commercial landlord threatening unauthorized $25,000 Letter of Credit draw in 5 business days over disputed $14,200 CAM reconciliation. Demand violates Section 14.3 5% CAM cap, Section 22.1 mandatory 30-day notice to cure, and Rider B capital expenditure exclusions for HVAC replacement.',
    primaryIntent:
      'Halt imminent Letter of Credit draw by issuing an immediate legal contestation notice to landlord and bank, while asserting lease contract caps and demanding a formal audit.',
    secondaryIntents: [
      'Invoke Section 22.1 30-day notice to cure protection',
      'Disallow $14,200 CAM calculation under Rider B HVAC Capital Expenditure exclusion',
      'Issue formal demand for municipal property tax assessment records'
    ],
    urgency: 'HIGH',
    urgencyReasoning:
      'Imminent financial asset risk: Landlord declared intent to draw $25,000 letter of credit within 5 business days. Bank will process draw mechanically unless formal dispute and preliminary injunction estoppel notice is filed.',
    safetyDisclaimer:
      'LEGAL & CONTRACTUAL AUDIT ADVISORY: SAARTHI performs contractual clause synthesis and discrepancy identification. Formal notices should be reviewed by qualified legal counsel.',
    overallConfidence: 95,
    confidenceBreakdown: {
      inputCoherence: 98,
      factGrounding: 96,
      verificationCertainty: 91,
    },
    assumptions: [
      'Signed Lease Agreement including Section 14.3, 22.1, and Rider B is currently legally binding and unamended.',
      'Letter of Credit issuing bank requires formal landlord certification of default prior to honors.'
    ],
    extractedFacts: [
      {
        id: 'f-d1',
        category: 'deadline',
        label: 'Impending Financial Draw Deadline',
        value: '5 business days until $25,000 Letter of Credit draw',
        status: 'PROVIDED',
        confidence: 99,
        sourceQuote: 'threatening to draw down our $25,000 security deposit letter of credit in 5 business days',
        rationale: 'Direct statement of impending financial drawdown.',
        whyDoWeTrustThis: 'Specified in written formal landlord demand letter.',
      },
      {
        id: 'f-d2',
        category: 'document',
        label: 'Section 14.3 CAM Growth Ceiling',
        value: 'Annual Common Area Maintenance increases capped strictly at 5%',
        status: 'VERIFIED',
        confidence: 97,
        sourceQuote: 'signed lease Section 14.3 explicitly caps annual CAM increases at 5% unless due to property tax hikes',
        rationale: 'Express contractual limitation on controllable operating expenses.',
        whyDoWeTrustThis: 'Verifiable contract clause standard in commercial retail/office leases.',
      },
      {
        id: 'f-d3',
        category: 'document',
        label: 'Section 22.1 Procedural Default Barrier',
        value: '30 days written notice to cure required before any LC drawdown',
        status: 'VERIFIED',
        confidence: 98,
        sourceQuote: 'Section 22.1 requires 30 days written notice to cure before any letter of credit draw',
        rationale: 'Express contractual condition precedent to default enforcement.',
        whyDoWeTrustThis: 'Direct procedural safeguard barring 5-day emergency draws.',
      },
      {
        id: 'f-d4',
        category: 'document',
        label: 'Rider B Capital Expenditure Carveout',
        value: 'HVAC roof replacement is 100% Lessor capital cost, not NNN operating expense',
        status: 'VERIFIED',
        confidence: 96,
        sourceQuote: 'HVAC roof replacement, which our Rider B clause specifies is a Capital Expenditure payable 100% by the Lessor',
        rationale: 'Clear contractual delineation between ongoing maintenance and structural capital replacement.',
        whyDoWeTrustThis: 'Explicit rider clause superseding general boilerplate operating definitions.',
      },
      {
        id: 'f-d5',
        category: 'status',
        label: 'Municipal Property Tax Invoices',
        value: 'Unverified — landlord has not furnished underlying municipal tax bills',
        status: 'UNCERTAIN',
        confidence: 68,
        sourceQuote: 'they haven\'t provided any municipal tax bills',
        rationale: 'Unclear whether municipal tax millage increased or if landlord solely inflated CAM without documentation.',
        whyDoWeTrustThis: 'Negative fact confirmed by tenant accounting ledger audit.',
      },
    ],
    missingInformation: [
      {
        id: 'm-d1',
        question: 'Letter of Credit issuing bank reference number and exact draw documentation protocol',
        importance: 'BLOCKING',
        impact: 'Required to notify the commercial bank trade desk that a fraudulent or defective default draw is being attempted.',
        queryPrompt: 'Locate standby Letter of Credit (SBLC) bank issuing confirmation letter.',
        resolved: false,
      },
      {
        id: 'm-d2',
        question: 'Itemized general ledger audit breakdown for the $14,200 CAM reconciliation',
        importance: 'CRITICAL',
        impact: 'Needed to isolate exact dollar amount improperly assigned to HVAC roof replacement vs routine filter changes.',
        queryPrompt: 'Request landlord management company provide full general ledger voucher report.',
        resolved: false,
      },
      {
        id: 'm-d3',
        question: 'Date and delivery proof of any prior written cure notices from landlord',
        importance: 'IMPORTANT',
        impact: 'Confirms whether the 30-day notice requirement under Section 22.1 was ever formally initiated.',
        queryPrompt: 'Check certified mail receipts or registered email records from landlord management.',
        resolved: false,
      },
    ],
    actions: [
      {
        id: 'act-d1',
        category: 'DO_NOW',
        title: 'Issue Formal Legal Objection & Notice of Defective Demand to Landlord',
        description: 'Serve formal legal letter citing Section 22.1 (30-day cure requirement) and Section 14.3 (5% CAM cap), declaring any 5-day LC draw a bad-faith breach of contract.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Corporate Real Estate Counsel',
        actionType: 'SAFETY_OVERRIDE',
        why: 'Puts landlord on written notice that drawing the LC violates contractual conditions precedent, exposing them to tortious interference and damages.',
        inputUsed: 'Lease Section 22.1 (30 days cure) + Landlord 5-day notice threat',
        confidence: 98,
        nextStep: 'Send SAARTHI drafted notice via certified mail and legal counsel email to Landlord managing agent.',
        missingPrerequisite: 'Landlord official legal service address',
        whatWouldChangeThis: 'If lease contains an unmentioned expedited draw amendment or tenant previously waived Section 22.1.',
        whyThisAction: {
          reasoning: 'Creates an immediate evidentiary bar to unilateral bank drawdown.',
          drivingFacts: ['Section 22.1 procedural cure barrier', '5 business day impending deadline'],
          prerequisites: ['Draft formal legal notice'],
          riskIfOmitted: 'Landlord draws $25,000 cash from bank escrow without judicial review.'
        },
        prefilledData: {
          draftMessage: 'FORMAL NOTICE OF DEFECTIVE DEMAND: Re Lease #L-804. Your demand dated Oct 23 threatening a Letter of Credit draw in 5 days violates Section 22.1 (mandating 30 days written notice) and Section 14.3 (5% cap). Any draw on SBLC #7492 will be treated as intentional conversion and breach of contract.',
        }
      },
      {
        id: 'act-d2',
        category: 'DO_NOW',
        title: 'Notify Issuing Bank Commercial Trade Desk of Contested Draw',
        description: 'Transmit dispute notice and lease Section 22.1 excerpt to bank Letter of Credit department advising that default certification is contested.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Chief Financial Officer',
        actionType: 'COMMUNICATION',
        why: 'Alerts bank compliance officers to scrutinize landlord certification documents for false representation.',
        inputUsed: '$25,000 Letter of Credit draw threat within 5 business days',
        confidence: 94,
        nextStep: 'Deliver formal contestation packet to commercial bank Letter of Credit operations officer.',
        missingPrerequisite: 'Bank Letter of Credit reference number',
        whatWouldChangeThis: 'If bank standby LC terms are "unconditional on first demand" without default certification requirements.',
        whyThisAction: {
          reasoning: 'Prevents automatic mechanical payment by bank back-office staff.',
          drivingFacts: ['Threatening to draw $25,000 security deposit letter of credit'],
          prerequisites: ['Attach copy of signed Section 22.1 cure clause'],
          riskIfOmitted: 'Bank releases $25,000 funds prior to legal arbitration.'
        }
      },
      {
        id: 'act-d3',
        category: 'PREPARE',
        title: 'Demand Formal CAM Audit Ledger & Disallow HVAC Capital Expenditures',
        description: 'Invoke statutory lease audit right demanding general ledger vouchers for the $14,200 claim and strike all HVAC roof capital costs under Rider B.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Ready to execute',
        assignedRole: 'Senior Lease Auditor',
        actionType: 'PROCEDURAL',
        why: 'Rider B explicitly classifies HVAC roof replacement as 100% Lessor capital expense; striking it reduces or eliminates alleged $14,200 deficit.',
        inputUsed: 'Rider B clause: "HVAC roof replacement is Capital Expenditure payable 100% by Lessor"',
        confidence: 97,
        nextStep: 'Draft formal CAM audit demand letter with itemized invoice inspection dates.',
        whatWouldChangeThis: 'If HVAC work was minor routine servicing rather than compressor/roof structural replacement.',
        whyThisAction: {
          reasoning: 'Enforces explicit negotiated rider terms over general operating expense charges.',
          drivingFacts: ['Rider B Capital Expenditure Carveout', 'Section 14.3 5% Cap'],
          prerequisites: ['Audit voucher review demand'],
          riskIfOmitted: 'Tenant pays $14,200 for landlord permanent building structural improvements.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'dchk-1', text: 'Demand municipal tax bill verification for 2024 millage changes', done: false },
            { id: 'dchk-2', text: 'Require contractor paid receipts for HVAC roof allocation', done: false },
            { id: 'dchk-3', text: 'Recalculate 2024 CAM ceiling using exact 5% compounded cap', done: false },
          ]
        }
      },
      {
        id: 'act-d4',
        category: 'VERIFY',
        title: 'Review Municipal County Property Tax Public Records',
        description: 'Query County Property Assessor online database to check whether property taxes on the parcel actually increased in 2024.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Tax Research Analyst',
        actionType: 'CHECKLIST',
        why: 'Section 14.3 allows CAM to exceed 5% ONLY if driven by documented property tax increases; public records verify or refute this claim.',
        inputUsed: 'Lease Section 14.3 exception: "unless due to property tax hikes"',
        confidence: 95,
        nextStep: 'Download official 2023 vs 2024 property tax bills from County Assessor portal.',
        whatWouldChangeThis: 'If county tax assessments increased significantly and landlord passed through exact proportionate share.',
        whyThisAction: {
          reasoning: 'Gives objective, unassailable third-party evidence regarding the validity of the landlord tax hike claim.',
          drivingFacts: ['Municipal tax invoices unverified status'],
          prerequisites: ['County Parcel PIN number'],
          riskIfOmitted: 'Accepting landlord inflated tax estimates without verification.'
        }
      },
      {
        id: 'act-d5',
        category: 'FOLLOW_UP',
        title: 'Prepare Emergency Motion for Temporary Restraining Order (TRO) if Bank Refuses Stay',
        description: 'Draft emergency chancery court TRO petition to enjoin letter of credit draw in the event landlord refuses to retract 5-day deadline.',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Litigation Counsel',
        actionType: 'PROCEDURAL',
        why: 'Provides emergency judicial injunction if landlord persists in unauthorized bank draw.',
        inputUsed: 'Threat to draw $25,000 security deposit letter of credit in 5 business days',
        confidence: 92,
        nextStep: 'Finalize TRO affidavit and verify emergency judge on duty.',
        whatWouldChangeThis: 'If landlord signs standstill agreement pending completion of CAM audit.',
        whyThisAction: {
          reasoning: 'Guarantees immediate judicial intervention to prevent irreparable financial harm.',
          drivingFacts: ['5 business day draw deadline', 'Section 22.1 breach'],
          prerequisites: ['Refusal of standstill agreement'],
          riskIfOmitted: 'Loss of $25,000 liquidity causing operational cashflow strain.'
        }
      }
    ],
    graphNodes: [
      { id: 'gn-d1', stage: 'INPUT', title: 'Commercial Lease Dispute Notice', detail: '119 words: $14.2k CAM dispute, $25k LC threat in 5 days, Rider B violation', status: 'urgent', targetIds: ['gn-d2'], iconName: 'FileText' },
      { id: 'gn-d2', stage: 'UNDERSTAND', title: 'Contractual & Procedural Synthesis', detail: 'Identified 5% cap (Sec 14.3), 30-day cure requirement (Sec 22.1), HVAC exclusion (Rider B)', status: 'normal', targetIds: ['gn-d3', 'gn-d4'], iconName: 'Brain' },
      { id: 'gn-d3', stage: 'FACTS', title: 'Grounded Contract Provisions', detail: 'Section 14.3 cap, Section 22.1 30-day notice, Rider B capital HVAC carveout', status: 'verified', targetIds: ['gn-d5'], iconName: 'ShieldAlert' },
      { id: 'gn-d4', stage: 'VERIFICATION', title: 'Truth Layer Triage', detail: '✓ 4 Verified Clauses | ⚠ 1 Tax Uncertainty | ? 3 Missing Ledger Proofs', status: 'missing', targetIds: ['gn-d5'], iconName: 'CheckCircle2' },
      { id: 'gn-d5', stage: 'INTENT', title: 'Halt Draw & Enforce Contract Intent', detail: 'Block premature 5-day bank draw and initiate formal audit under Rider B', status: 'primary', targetIds: ['gn-d6', 'gn-d7'], iconName: 'Target' },
      { id: 'gn-d6', stage: 'ACTIONS', title: 'DO NOW: Formal Objection Notice', detail: 'Assert Section 22.1 30-day cure barrier', status: 'urgent', targetIds: [], iconName: 'Zap' },
      { id: 'gn-d7', stage: 'ACTIONS', title: 'DO NOW: Notify Issuing Bank', detail: 'Alert commercial trade desk to contested draw', status: 'urgent', targetIds: [], iconName: 'Layers' },
    ],
    tags: ['Documents / Forms', 'Commercial Lease', 'Contract Dispute', 'Escrow Draw', 'CAM Audit'],
    actionPack: {
      situationSummary: 'Landlord threatening unauthorized $25,000 Letter of Credit draw in 5 business days over disputed $14,200 CAM reconciliation. Demand violates Section 14.3 5% cap, Section 22.1 mandatory 30-day cure period, and Rider B HVAC capital expenditure exclusions.',
      keyFacts: [
        { label: 'Financial Exposure', value: '$25,000 Letter of Credit at risk in 5 business days', status: 'PROVIDED' },
        { label: 'Contractual Cap', value: 'Section 14.3 strictly caps CAM increases at 5%', status: 'VERIFIED' },
        { label: 'Procedural Barrier', value: 'Section 22.1 mandates 30 days written notice to cure before draw', status: 'VERIFIED' },
        { label: 'Exclusion Clause', value: 'Rider B designates HVAC roof replacement as 100% Lessor cost', status: 'VERIFIED' },
      ],
      missingInformation: [
        'Letter of Credit bank reference number',
        'Itemized general ledger audit vouchers from landlord',
        'County property tax official assessment for 2024'
      ],
      recommendedActions: [
        { title: 'Serve Formal Legal Objection on Landlord', nextStep: 'Transmit Notice of Defective Demand citing Section 22.1 and 14.3', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Notify Bank Letter of Credit Trade Desk', nextStep: 'File notice of contested default certification with issuing bank', readiness: 'Ready to execute', category: 'DO_NOW' },
        { title: 'Demand Formal CAM Audit under Rider B', nextStep: 'Strike HVAC roof replacement capital expenditures from bill', readiness: 'Ready to execute', category: 'PREPARE' },
      ],
      checklist: [
        { id: 'dchk-1', text: 'Serve written Notice of Defective Demand under Section 22.1', completed: false },
        { id: 'dchk-2', text: 'Notify issuing bank Letter of Credit operations department', completed: false },
        { id: 'dchk-3', text: 'Download official County Property Tax bills for parcel', completed: false },
        { id: 'dchk-4', text: 'Prepare emergency temporary restraining order (TRO) draft', completed: false },
      ],
      questionsToAsk: [
        'Can landlord produce certified mail delivery proof of prior written default notice?',
        'Does the $14,200 reconciliation include HVAC roof compressor capital replacement?',
        'What was the exact dollar increase in 2024 municipal property taxes for our parcel?'
      ],
      informationToShare: 'LEGAL CONTESTATION BRIEF: Tenant formal objection to Landlord notice dated Oct 23. The threatened 5-day draw on Letter of Credit #7492 violates Section 22.1 (30-day cure requirement) and Section 14.3 (5% CAM cap). Demand is formally disputed.',
      generatedAt: '9:19 AM'
    }
  }
];
