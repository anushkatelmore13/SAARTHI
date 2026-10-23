import { 
  CaseAnalysis, 
  FactItem, 
  MissingInfoItem, 
  ActionItem, 
  GraphNode, 
  InputSourceType, 
  UrgencyLevel, 
  DomainCategory,
  ActionPackData 
} from '../types';

export function generateLocalAnalysis(
  rawText: string,
  inputType: InputSourceType,
  metadata?: { fileName?: string; duration?: string; wordCount?: number }
): CaseAnalysis {
  // Edge-case guard: treat empty or whitespace-only input cleanly
  const isEmptyInput = rawText.trim().length === 0;
  const safeText = isEmptyInput ? '' : rawText;
  const lower = safeText.toLowerCase();
  const id = `local-${Date.now()}`;
  const timestamp = 'Just now';

  // 1. Detect Category across the 7 Universal Domains
  let category: DomainCategory = 'Workplace / Operational Incidents';

  if (!isEmptyInput) {
    if (/cloudsync|cs-?503|gateway|storage.*unavailable|server.*fail|cluster|outage|downtime|data breach|cyber attack|malware|incident response/i.test(lower)) {
      category = 'Workplace / Operational Incidents';
    } else if (/pension|aadhaar|ssn|passport|visa|dmv|license|welfare|treasury|notary|affidavit|court|judge|municipal|clerk|subsidy|ration/i.test(lower)) {
      category = 'Government / Public Services';
    } else if (/flight|airline|blizzard|snow|weather|storm|highway|delay|pass|hotel|travel|airport|denver|cancelled|cancel|concourse/i.test(lower)) {
      category = 'Weather / Travel';
    } else if (/lease|contract|clause|landlord|tenant|escrow|nnn|cam|letter of credit|deposit|hvac|section|rider|indemnity/i.test(lower)) {
      category = 'Documents / Forms';
    } else if (/trapped|flood|chemical|transformer|sparks|fire|wildfire|bushfire|brushfire|explosion|toxic|arcing|drowning|evacuate|siren|hazmat|breathe|breathing|unconscious|unresponsive|choking|cardiac|hurt|injured/i.test(lower)) {
      category = 'Emergency / Safety';
    } else if (/medicine|prescription|insulin|doctor|hospital|dose|clinic|patient|symptoms|heart rate|diabetic|allergy/i.test(lower)) {
      category = 'Healthcare Information';
    } else if (/breaking news|press release|media report|journalis|rumor|unconfirmed report|news outlet|article/i.test(lower)) {
      category = 'News / Information';
    }
  }

  // 2. Calibrate Urgency & Separate Incident Domains
  // IMPORTANT: This is a keyword heuristic, NOT a reliable emergency classifier.
  // It will have false-positives and false-negatives. The persistent UI safety advisory ensures
  // users in genuine emergencies are always advised to contact official emergency services directly.
  let urgency: UrgencyLevel = 'MODERATE';
  let urgencyReasoning = 'Urgency assessed by keyword heuristic; this is not a reliable emergency classifier. Genuine emergencies require direct contact with official emergency services (in India, call 112).';

  // Phrase-guarded cybersecurity patterns
  const CYBER_PATTERNS = [
    /\bdata breach\b|\bsecurity breach\b/,
    /\bransomware\b|\bmalware outbreak\b/,
    /\bunauthorized access\b|\bcredential leak\b|\bdatabase leak\b/,
    /\bcyber attack\b|\bcompromised system\b/,
  ];

  // Forest fire / wildfire patterns — catch "fire in forest", "forest fire", "wildfire", "bushfire", etc.
  const FOREST_FIRE_PATTERNS = [
    /\bforest.{0,15}fire\b|\bfire.{0,15}forest\b/i,
    /\bwildfire\b|\bwild.?fire\b/i,
    /\bbushfire\b|\bbrush.?fire\b/i,
    /\bfire.{0,20}(jungle|woodland|nature reserve|national park|hillside|mountain|grassland|scrubland)\b/i,
    /\b(jungle|woodland|nature reserve|national park|hillside|mountain|grassland|scrubland).{0,20}fire\b/i,
    /\bfire.{0,10}spreading.{0,20}(trees|forest|bush|grass|hill)/i,
  ];

  // Critical life-safety & acute medical patterns (handling apostrophes and phrasing variations)
  const LIFE_SAFETY_CRITICAL_PATTERNS = [
    /\btrapped\b/,
    /\bbuilding.{0,20}fire\b|\bfire.{0,20}(broke out|started|spreading|department)\b|\bon fire\b/,
    /\bflood(ing|ed|waters?)\b|\bflooded\b/,
    /\bdying\b/,
    // Breathing emergencies: "I can't breathe", "difficulty breathing", "not breathing", etc.
    /\b(can['']?t|cannot|can not|having difficulty|difficulty|having trouble|trouble|hard to|struggling to|not|stopped)\s+(breathe|breathing)\b|\bshortness of breath\b|\bstop(ped|ping)?.{0,10}breath/,
    /\bexplosion\b|\bexplode(d|s)?\b/,
    /\bbleeding\b/,
    // Unconsciousness: "someone is unconscious", "person is unconscious", etc.
    /\bunconscious\b|\bunresponsive\b|\bpassed out\b|\bfainted\b/,
    // Injury / trauma: "someone is hurt", "person is hurt", etc.
    /\b(someone|somebody|person|people|anyone|individual)\s+(is|are|was|were|got)\s+(hurt|injured)\b|\b(badly|seriously|severely)\s+(hurt|injured)\b|\bsevere injur/i,
    /\belectrical?.{0,20}(hazard|shock|arc|fire|fault)\b|\belectric shock\b/,
    /\bsubmerged\b|\bdrowning\b/,
    /\bhazmat\b|\btoxic.{0,20}(spill|leak|gas|fumes?)\b|\bchemical.{0,20}(spill|leak|release)\b/,
    /\bspark(s|ing)?.{0,20}(fire|hazard|electric)\b|\barcing\b/,
    /\bheart.{0,20}(attack|fail|stop|rate dropping)\b|\bcardiac arrest\b/,
    /\bevacuat/,
    /\bblizzard.{0,20}(warning|stranded|trapped)\b|\bstranded.{0,20}blizzard\b/,
    /\bpipes?.{0,15}freez|\bfreez.{0,15}(pipes?|water|solid)\b/,
    /\bdeadbolt.{0,20}(broken|stuck|fail|won.t|locked)\b|\blocked.{0,15}(out|in).{0,15}deadbolt\b/,
  ];

  const HIGH_PATTERNS = [
    /\b(very )?urgent\b/,
    /\bmedical emergency\b|\bemergency (room|department|services?)\b/,
    /\basap\b/,
    /\bbroken.{0,15}(pipe|valve|window|lock|system|server)\b/,
    /\bsystem.{0,10}fail/,
    /\bgas.{0,10}leak\b|\bwater.{0,10}leak\b|\bpipe.{0,10}burst\b/,
    /\bcut off.{0,15}(power|water|gas|supply)\b|\bshut off\b/,
    /\bhazard\b/,
    /\bstuck\b/,
    /\bwarning.{0,20}(notice|letter|received|issued)\b/,
    /\bdeadline\b/,
    /\blapse\b/,
    /\brejection\b/,
    /\b5 business days\b/,
    /\b4%\b/,
    /\b(critical error|service unavailable|storage unavailable|cloud storage|degraded service|cs-?503|service outage|downtime)\b/,
  ];

  const isOcrFailureNotice = 
    /\[image ocr (notice|extraction failed)[^\]]*\]/i.test(rawText) ||
    /no legible text could be extracted/i.test(lower);
  const isCloudSyncOutage = 
    /cloudsync/i.test(lower) || 
    /cs-?503/i.test(lower) || 
    (/cloud.*storage/i.test(lower) && /unavailable/i.test(lower));

  const forestFireMatches = isEmptyInput ? [] : FOREST_FIRE_PATTERNS.filter(p => p.test(lower));
  const lifeSafetyMatches = isEmptyInput ? [] : LIFE_SAFETY_CRITICAL_PATTERNS.filter(p => p.test(lower));
  const cyberMatches = isEmptyInput ? [] : CYBER_PATTERNS.filter(p => p.test(lower));
  const highMatches = isEmptyInput ? [] : HIGH_PATTERNS.filter(p => p.test(lower));

  const isForestFire = forestFireMatches.length > 0;
  const isLifeSafetyHazard = lifeSafetyMatches.length > 0;
  const isCyberIncident = cyberMatches.length > 0;

  // A vague fire report: fire+forest detected but no location, no people mentioned, very short input.
  // Do NOT auto-classify as CRITICAL — instead use HIGH with an explicit uncertainty note and ask clarifying questions.
  const isVagueFireReport = isForestFire
    && safeText.trim().split(/\s+/).length <= 5
    && !/address|location|sector|street|city|landmark|\d+\s*(km|m\b)|gps|near|at \w/i.test(lower)
    && !/people|person|anyone|victim|injured|trapped|danger|evacuating/i.test(lower);

  if (isEmptyInput) {
    urgency = 'LOW';
    urgencyReasoning = 'No input was provided. Provide incident narrative, voice transcript, or documents to initiate triage.';
  } else if (isOcrFailureNotice) {
    urgency = 'LOW';
    urgencyReasoning = 'Image optical character recognition (OCR) could not detect legible text from the uploaded file. Incident details require manual review or clearer image re-upload.';
  } else if (isForestFire && isVagueFireReport) {
    urgency = 'HIGH';
    urgencyReasoning = 'Forest fire or wildfire language detected, but input is too brief to confirm whether this is an active emergency. Urgency set to HIGH pending confirmation. If anyone is in immediate danger, call 112 (India) or your local emergency number now.';
  } else if (isForestFire) {
    urgency = 'CRITICAL';
    urgencyReasoning = 'Keyword heuristic detected forest fire / wildfire incident. Treat as potential life-safety emergency. Contact local emergency services (in India, call 112 or the nearest forest department). SAARTHI cannot confirm active danger from text input alone.';
  } else if (isLifeSafetyHazard) {
    urgency = 'CRITICAL';
    urgencyReasoning = 'Keyword heuristic flagged potential physical life-safety hazard or acute medical distress. This is NOT a confirmed emergency — genuine emergencies require calling official emergency services directly (in India, call 112).';
  } else if (isCyberIncident) {
    urgency = 'CRITICAL';
    urgencyReasoning = 'Keyword heuristic detected critical cybersecurity or data breach incident. Requires immediate operational containment and notification of authorized security personnel.';
  } else if (isCloudSyncOutage) {
    urgency = 'HIGH';
    urgencyReasoning = 'Keyword heuristic detected operational cloud service disruption: CloudSync Pro storage unavailable with error code CS-503. Check upstream cloud provider status dashboard.';
  } else if (highMatches.length > 0) {
    urgency = 'HIGH';
    urgencyReasoning = 'Keyword heuristic detected impending deadlines or active constraints. Heuristic only; verify before acting on this classification.';
  }

  // 3. Extract Facts into Truth Layer
  // Strictly: Explicit user assertions = PROVIDED. Speculative clauses = UNCERTAIN.
  // Never assign VERIFIED without a confirmed independent verification source.
  const sentences = safeText
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  const extractedFacts: FactItem[] = [];

  if (isOcrFailureNotice) {
    extractedFacts.push({
      id: `f-${id}-1`,
      category: 'status',
      label: 'Image OCR Extraction Status',
      value: 'No legible text detected from uploaded image',
      status: 'UNCERTAIN',
      confidence: 30,
      sourceQuote: rawText.slice(0, 80),
      rationale: 'Optical character recognition scanner did not detect readable text blocks in the provided image file.',
      whyDoWeTrustThis: 'Automated OCR scanner result; requires human review of image.'
    });
  } else {
    sentences.slice(0, 6).forEach((sentence, idx) => {
      const isUncertain = /think|might|maybe|possibly|not sure|unclear|guess|supposed|alleged|rumored/i.test(sentence);
      let factCategory: FactItem['category'] = 'status';

      if (/room|dock|sector|street|wing|building|floor|road|hub|address|door|airport|denver/i.test(sentence)) {
        factCategory = 'location';
      } else if (/fire|water|flood|shock|spark|leak|spill|deadbolt|blizzard|winds|gusts|breach|malware|breathe|unconscious|error|outage|failure|503/i.test(sentence)) {
        factCategory = 'hazard';
      } else if (/valve|battery|phone|radio|transformer|forklift|key|power|server|insulin|car|plane|shuttle|storage|cluster|database/i.test(sentence)) {
        factCategory = 'resource';
      } else if (/friday|today|hours|days|months|tonight|cutoff|deadline|minutes/i.test(sentence)) {
        factCategory = 'deadline';
      } else if (/section|clause|rider|certificate|affidavit|pension|ppo|letter of credit|lease|form/i.test(sentence)) {
        factCategory = 'document';
      } else if (/sandeep|ramesh|martha|he |she |kids|grandfather|clerk|officer|landlord|tenant/i.test(sentence)) {
        factCategory = 'entity';
      }

      const status = isUncertain ? 'UNCERTAIN' : 'PROVIDED';

      extractedFacts.push({
        id: `f-${id}-${idx + 1}`,
        category: factCategory,
        label: inputType === 'image' ? `Extracted OCR Factor #${idx + 1}` : `Extracted ${factCategory.toUpperCase()} Factor #${idx + 1}`,
        value: sentence,
        status,
        confidence: 50,
        sourceQuote: sentence,
        rationale: isUncertain
          ? 'Heuristic estimate: clause contains hedge or ambiguous phrasing; requires explicit confirmation.'
          : inputType === 'image'
          ? 'Heuristic estimate: statement extracted via Optical Character Recognition (OCR) from uploaded image; unverified against external records or infrastructure status.'
          : 'Heuristic estimate: statement explicitly provided in user input narrative; unverified against external records.',
        whyDoWeTrustThis: isUncertain
          ? 'Heuristic estimate (unverified): flagged as uncertain due to speculative language in user input.'
          : inputType === 'image'
          ? 'Heuristic estimate (unverified): OCR transcription from uploaded image; has not yet been confirmed by independent system logs.'
          : 'Heuristic estimate (unverified): direct statement from user narrative; has not yet been verified against external records.',
      });
    });

    if (extractedFacts.length === 0) {
      const fallbackValue = safeText.trim().length > 0 ? safeText.slice(0, 100) : 'No incident or narrative was provided.';
      extractedFacts.push({
        id: `f-${id}-1`,
        category: 'status',
        label: isEmptyInput ? 'No Input Provided' : 'Initial Narrative Report',
        value: fallbackValue,
        status: 'PROVIDED',
        confidence: 50,
        sourceQuote: fallbackValue,
        rationale: isEmptyInput
          ? 'No extractable input was provided.'
          : 'Heuristic estimate: input was too short for sentence extraction; treated as single narrative fact.',
        whyDoWeTrustThis: isEmptyInput
          ? 'No user input to evaluate.'
          : 'Heuristic estimate (unverified): user narrative excerpt; unverified against external records.',
      });
    }
  }

  // 4. Missing Information Triage — category-aware; only ask relevant questions.
  const missingInformation: MissingInfoItem[] = [];

  // Forest fire missing information — at most 3 concise essential questions
  if (isForestFire && !isEmptyInput) {
    missingInformation.push({
      id: `m-${id}-fire-active`,
      question: 'Is the fire happening now?',
      importance: 'BLOCKING',
      impact: 'Determines whether immediate life-safety action is required right now versus historical reporting.',
      queryPrompt: 'Is this fire currently active? Are flames or heavy smoke visible right now?',
      resolved: false,
    });
    if (!/people|person|anyone|victim|evacuating|danger|trapped|hurt/i.test(lower)) {
      missingInformation.push({
        id: `m-${id}-fire-people`,
        question: 'Is anyone in danger?',
        importance: 'CRITICAL',
        impact: 'Determines whether people or structures are at immediate risk requiring emergency dispatch.',
        queryPrompt: 'Is anyone injured, trapped, or in immediate physical danger?',
        resolved: false,
      });
    }
    if (!/address|location|landmark|city|street|near|gps/i.test(lower)) {
      missingInformation.push({
        id: `m-${id}-fire-location`,
        question: 'What is the nearest safe-to-provide location or landmark?',
        importance: 'CRITICAL',
        impact: 'Needed so local emergency responders know where to head once it is safe to report.',
        queryPrompt: 'What is the nearest landmark, road, or area you can safely identify?',
        resolved: false,
      });
    }
  } else if (isEmptyInput) {
    missingInformation.push({
      id: `m-${id}-input`,
      question: 'Incident description or operational report',
      importance: 'BLOCKING',
      impact: 'No action planning can proceed without an initial report of the event.',
      queryPrompt: 'Please enter a description of what happened or upload supporting records.',
      resolved: false,
    });
  } else if (isOcrFailureNotice) {
    missingInformation.push({
      id: `m-${id}-ocr-details`,
      question: 'Manual incident narrative or legible error code',
      importance: 'BLOCKING',
      impact: 'System cannot recommend verified technical actions without legible error details or incident narrative.',
      queryPrompt: 'What error message, service name, or event was shown in the image?',
      resolved: false,
    });
  } else if (isCloudSyncOutage) {
    missingInformation.push({
      id: `m-${id}-storage-scope`,
      question: 'Affected storage volume IDs, cluster region, or client workloads',
      importance: 'BLOCKING',
      impact: 'Required to isolate storage volumes and verify whether failover replication targets are healthy.',
      queryPrompt: 'Which specific storage volumes, mount paths, or applications are affected by the CS-503 error?',
      resolved: false,
    });
    missingInformation.push({
      id: `m-${id}-cloud-provider`,
      question: 'Upstream cloud infrastructure provider status link',
      importance: 'IMPORTANT',
      impact: 'Needed to check whether this is a platform-wide outage or isolated gateway disconnection.',
      queryPrompt: 'Does the cloud provider status page show an active incident for your region?',
      resolved: false,
    });
  } else {
    // Location is relevant for physical-world situations (emergency, travel, workplace, government).
    // It is generally not meaningful for pure document/form analysis, news queries, cybersecurity incidents, or cloud outages.
    const locationRelevantCategories: DomainCategory[] = [
      'Emergency / Safety',
      'Weather / Travel',
      'Government / Public Services',
      'Healthcare Information',
      'Workplace / Operational Incidents',
    ];
    const needsLocation = locationRelevantCategories.includes(category)
      && !isCyberIncident
      && !isCloudSyncOutage
      && !/address|location|sector|room|street|bay|site|city|gate|gps|coordinates/i.test(lower);
    if (needsLocation) {
      missingInformation.push({
        id: `m-${id}-loc`,
        question: 'Physical location or site details',
        importance: urgency === 'CRITICAL' ? 'BLOCKING' : 'IMPORTANT',
        impact: urgency === 'CRITICAL'
          ? 'Emergency responders cannot be directed without a confirmed location.'
          : 'Support staff or representatives need a location to provide assistance.',
        queryPrompt: urgency === 'CRITICAL'
          ? 'What is the exact address or GPS coordinates of the incident?'
          : 'What is the address, floor, room number, or relevant location details?',
        resolved: false,
      });
    }

    // Specific to cybersecurity incidents: identify affected systems and databases
    if (isCyberIncident && !/system|server|database|network|account|credential/i.test(lower)) {
      missingInformation.push({
        id: `m-${id}-system`,
        question: 'Affected systems, databases, or service accounts',
        importance: 'BLOCKING',
        impact: 'Required to isolate affected network segments and determine the perimeter of compromise.',
        queryPrompt: 'Which specific systems, databases, applications, or user accounts are suspected of being affected?',
        resolved: false,
      });
    }

    // Contact details are relevant when coordination with external parties is needed.
    const contactRelevantCategories: DomainCategory[] = [
      'Emergency / Safety',
      'Government / Public Services',
      'Healthcare Information',
      'Workplace / Operational Incidents',
    ];
    const needsContact = contactRelevantCategories.includes(category)
      && !/\bname\b|\bphone\b|\bcontact\b|\bcallback\b|\bemail\b|\bofficer\b|\bcounsel\b/i.test(lower);
    if (needsContact) {
      missingInformation.push({
        id: `m-${id}-contact`,
        question: isLifeSafetyHazard ? 'Emergency contact or on-scene callback number' : 'Primary contact name or reference',
        importance: isLifeSafetyHazard ? 'CRITICAL' : 'IMPORTANT',
        impact: isLifeSafetyHazard
          ? 'Needed to coordinate with emergency services or maintain communication if device battery is low.'
          : 'Useful for following up with the appropriate person or case officer.',
        queryPrompt: isLifeSafetyHazard
          ? 'What is the best number to reach you or an on-scene contact right now?'
          : 'Who is the primary contact or case officer for this matter?',
        resolved: false,
      });
    }

    // Reference numbers are only relevant for administrative/legal/financial situations.
    const adminCategories: DomainCategory[] = [
      'Documents / Forms',
      'Government / Public Services',
    ];
    const needsRef = adminCategories.includes(category)
      && /\b(lease|pension|draw|cutoff|deadline)\b/i.test(lower)
      && !/\b(policy|reference|docket|case id|application number|ref no|account number)\b/i.test(lower);
    if (needsRef) {
      missingInformation.push({
        id: `m-${id}-ref`,
        question: 'Official reference, policy, or case identifier',
        importance: 'BLOCKING',
        impact: 'Required to look up official records or file a formal inquiry.',
        queryPrompt: 'What is the reference or case number on your notice or statement?',
        resolved: false,
      });
    }

    if (missingInformation.length === 0) {
      missingInformation.push({
        id: `m-${id}-scope`,
        question: 'Additional context or affected parties',
        importance: 'IMPORTANT',
        impact: 'Ensures the situation is fully described and relevant parties are accounted for.',
        queryPrompt: 'Is there additional context, other people involved, or downstream systems affected?',
        resolved: false,
      });
    }
  }

  // 5. Dynamic Confidence Breakdown
  // Separation of input coherence from verified ground truth:
  // - factGrounding strictly measures independently verified facts against total items (0% when unverified).
  // - verificationCertainty strictly measures verified proportion of extracted facts (0% without external source).
  // - overallConfidence is set to neutral heuristic baseline (50%) when unverified.
  const totalItems = extractedFacts.length + missingInformation.length;
  const verifiedCount = extractedFacts.filter(f => f.status === 'VERIFIED').length;
  const providedCount = extractedFacts.filter(f => f.status === 'PROVIDED').length;
  const uncertainCount = extractedFacts.filter(f => f.status === 'UNCERTAIN').length;

  const inputCoherence = isOcrFailureNotice
    ? 30
    : Math.min(90, Math.max(40, Math.round(50 + (sentences.length * 3) - (uncertainCount * 5))));
  const factGrounding = totalItems > 0 ? Math.round((verifiedCount / totalItems) * 100) : 0;
  const verificationCertainty = extractedFacts.length > 0 
    ? Math.round((verifiedCount / extractedFacts.length) * 100) 
    : 0;
  const overallConfidence = verifiedCount > 0
    ? Math.round((inputCoherence * 0.4) + (factGrounding * 0.3) + (verificationCertainty * 0.3))
    : isOcrFailureNotice ? 30 : 50;

  // 6. Synthesize Intent & Situation
  const titleBody = extractedFacts[0]?.value?.trim().slice(0, 48) || 'Structured Intent Case';
  const title = isEmptyInput 
    ? 'No Input Provided' 
    : isOcrFailureNotice
    ? 'Image OCR Extraction Incomplete'
    : (isForestFire && isVagueFireReport)
    ? 'Unconfirmed Wildfire Mention (Pending Verification)'
    : isForestFire
    ? 'Active Wildfire / Forest Fire Alert'
    : `${category}: ${titleBody}`;

  const situationDetected = isEmptyInput
    ? 'No incident description was provided. Enter text, record voice, or upload a document to begin.'
    : isOcrFailureNotice
    ? 'Image upload received, but optical character recognition could not extract legible text. Please enter incident details manually or re-upload a clearer image.'
    : isForestFire
    ? (isVagueFireReport
      ? 'Unconfirmed mention of a forest fire or wildfire. No location, severity, or active status has been verified. If you are near an active fire, seek safety immediately and call emergency services (112 in India).'
      : `Potential wildfire incident reported under ${category}. Active conditions have not been verified by responders. If anyone is in immediate danger, contact emergency services (112 in India) immediately.`)
    : isCloudSyncOutage
    ? `Operational service disruption detected in CloudSync Pro. OCR extraction isolated critical error code CS-503, cloud storage unavailable, and reported degraded service status. Unverified against cloud infrastructure status page.`
    : isCyberIncident
    ? `Cybersecurity incident synthesized under ${category}. Isolated ${extractedFacts.length} narrative parameters (${providedCount} provided, ${uncertainCount} uncertain) and ${missingInformation.length} unresolved dependencies. Independent verification status: 0% verified.`
    : `Real-world situation synthesized under ${category}. Isolated ${extractedFacts.length} narrative parameters (${providedCount} provided, ${uncertainCount} uncertain) and ${missingInformation.length} unresolved dependencies. Independent verification status: 0% verified.`;

  const primaryIntent = isEmptyInput
    ? 'Awaiting human input to structure into verified action workflows.'
    : isOcrFailureNotice
    ? 'Prompt user to review image quality, re-upload a higher-resolution screenshot, or enter the incident description manually.'
    : isForestFire
    ? 'Move away from fire and smoke, call local emergency services (112 in India) if anyone is in danger, avoid approaching or fighting the fire, and follow official evacuation orders.'
    : isCloudSyncOutage
    ? 'Coordinate structured Workplace / Operational Incidents response: verify cloud service status dashboard, inspect storage volume gateway failover logs, and notify affected operational leads.'
    : isLifeSafetyHazard
    ? 'Advise contacting local emergency services (in India, call 112) for immediate danger, while structuring unverified telemetry for response support.'
    : isCyberIncident
    ? 'Coordinate structured cybersecurity incident response: preserve forensic logs, isolate affected systems per established protocol, and notify authorized security personnel.'
    : `Coordinate structured ${category} intervention and stage actionable verified tasks without taking irreversible unconfirmed steps.`;

  const secondaryIntents = isEmptyInput
    ? [
        'Enter narrative text or voice audio in the input panel',
        'Review extracted facts and verify dependencies upon submission'
      ]
    : isOcrFailureNotice
    ? [
        'Ensure image resolution is sufficient to render text clearly',
        'Provide manual incident details or exact error code if available'
      ]
    : isForestFire
    ? [
        'Move to a safe area away from fire and smoke',
        'Do not approach or fight a spreading wildfire',
        'Follow official evacuation instructions from emergency authorities',
        'Report safest known location or landmark to emergency responders when safe'
      ]
    : isCloudSyncOutage
    ? [
        'Verify cloud provider status page for region us-east',
        'Inspect local storage gateway replication and mount logs',
        'Confirm blast radius across customer storage volumes'
      ]
    : isCyberIncident
    ? [
        'Preserve system and access logs without modifying evidence',
        'Isolate compromised network segments according to authorized protocol',
        'Assess statutory breach reporting obligations with authorized counsel'
      ]
    : [
        'Resolve unconfirmed information through targeted queries before irreversible action',
        'Stage preparatory documentation and notify key operational stakeholders',
        'Establish continuous milestone tracking across identified constraints'
      ];

  // 7. Generate Concrete Actions (Safety-Reviewed & Non-Hallucinatory)
  let actions: ActionItem[];

  if (isEmptyInput) {
    actions = [
      {
        id: `act-${id}-1`,
        category: 'DO_NOW',
        title: 'Provide Incident Description or Upload Telemetry',
        description: 'Enter a text description, record voice notes, or upload relevant documents to begin situation analysis and action planning.',
        urgency: 'MEDIUM',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'User',
        actionType: 'PROCEDURAL',
        why: 'No incident description was provided; system requires input to generate verified workflows.',
        inputUsed: 'None',
        confidence: 50,
        nextStep: 'Type your report in the input field above and click Analyze.',
        missingPrerequisite: 'Incident report or document',
        whatWouldChangeThis: 'When user submits text, voice, or file data.',
        whyThisAction: {
          reasoning: 'System cannot generate operational workflows without an initial human input narrative.',
          drivingFacts: ['No Input Provided'],
          prerequisites: ['Provide incident text or audio'],
          riskIfOmitted: 'Workflow cannot proceed.'
        },
        prefilledData: {
          draftMessage: 'Please provide incident details to begin analysis.',
        }
      }
    ];
  } else if (isOcrFailureNotice) {
    actions = [
      {
        id: `act-${id}-1`,
        category: 'DO_NOW',
        title: 'Provide Clearer Image or Enter Incident Details Manually',
        description: 'Optical character recognition could not detect legible text from the uploaded image. Re-upload a higher-resolution screenshot with visible error details or type the incident narrative manually.',
        urgency: 'MEDIUM',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'User / Reporting Party',
        actionType: 'PROCEDURAL',
        why: 'Automated OCR found no readable text blocks; manual entry is required to prevent ungrounded inferences.',
        inputUsed: rawText.slice(0, 60),
        confidence: 50,
        nextStep: 'Check image resolution or describe the issue directly in the text area.',
        missingPrerequisite: 'Legible image or manual input text',
        whatWouldChangeThis: 'When legible incident details or a clear screenshot are provided.',
        whyThisAction: {
          reasoning: 'Prevents fabricating facts from unreadable or blank image inputs.',
          drivingFacts: ['Image OCR Extraction Status'],
          prerequisites: ['Locate original error message or application screen'],
          riskIfOmitted: 'Inability to formulate verified operational next steps.'
        },
        prefilledData: {
          draftMessage: 'Please provide error code or incident details from the image.',
        }
      }
    ];
  } else if (isForestFire) {
    actions = [
      {
        id: `act-${id}-1`,
        category: 'DO_NOW',
        title: 'Move away from fire and smoke; call emergency services if anyone is in danger',
        description: 'Get to a safe area away from flames and smoke immediately. If anyone is in danger or injured, call local emergency services right now (in India, call 112). SAARTHI does not dispatch emergency responders.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'On-Scene Individual',
        actionType: 'COMMUNICATION',
        why: 'Wildfires spread rapidly and unexpectedly. Moving to safety and alerting emergency services takes absolute priority.',
        inputUsed: extractedFacts[0]?.value || rawText.slice(0, 60),
        confidence: 50,
        nextStep: 'Move to a safe, clear location and dial 112 (India) or your local emergency number if anyone is at risk.',
        missingPrerequisite: 'Confirmation of personal safety',
        whatWouldChangeThis: 'When all individuals are in a safe location away from the fire.',
        whyThisAction: {
          reasoning: 'Immediate life preservation takes precedence over any other task.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Ensure clear path away from flames and smoke'],
          riskIfOmitted: 'Severe burn injury, smoke inhalation, or entrapment.'
        },
        prefilledData: {
          draftMessage: `EMERGENCY WILDFIRE REPORT: Active fire reported. Location: ${missingInformation.find(m => m.id.includes('location'))?.question || 'Provide nearest landmark'}. People in danger: ${missingInformation.find(m => m.id.includes('people'))?.question || 'Pending check'}. (Self-reported; unverified).`
        }
      },
      {
        id: `act-${id}-2`,
        category: 'PREPARE',
        title: 'Do not approach or fight a spreading wildfire',
        description: 'Do not attempt to combat spreading flames. Avoid smoke-filled areas and keep roadways and access gates clear for emergency fire vehicles.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'On-Scene Individual',
        actionType: 'CHECKLIST',
        why: 'Civilian firefighting attempts lead to entrapment. Blocked routes delay vital emergency vehicles.',
        inputUsed: 'Observed fire conditions',
        confidence: 50,
        nextStep: 'Stay clear of the fire perimeter and ensure roads and driveway gates remain open for emergency vehicles.',
        whatWouldChangeThis: 'When emergency responders arrive and establish perimeter control.',
        whyThisAction: {
          reasoning: 'Prevents civilian injury while maintaining open routes for responders.',
          drivingFacts: ['Wildfire Safety Precautions'],
          prerequisites: ['Stay clear of fire and smoke'],
          riskIfOmitted: 'Civilian injury and blocked emergency access routes.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'chk-1', text: 'Do not approach the fire perimeter or attempt to fight it', done: false },
            { id: 'chk-2', text: 'Avoid entering smoke-filled routes', done: false },
            { id: 'chk-3', text: 'Keep access roads and driveway gates clear for emergency vehicles', done: false },
          ]
        }
      },
      {
        id: `act-${id}-3`,
        category: 'FOLLOW_UP',
        title: 'Follow official evacuation instructions',
        description: 'Adhere strictly to official notices from local authorities. Do not return to an affected area until emergency officials confirm it is safe.',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Evacuating Individual',
        actionType: 'PROCEDURAL',
        why: 'Buried embers and flare-ups remain hazardous after flames pass. Returning prematurely causes avoidable injuries.',
        inputUsed: 'Official evacuation guidelines',
        confidence: 50,
        nextStep: 'Monitor official local emergency broadcasts and wait for an official all-clear before returning.',
        whatWouldChangeThis: 'When local emergency authorities declare the area safe to re-enter.',
        whyThisAction: {
          reasoning: 'Prevents injury from hidden embers and hazardous conditions after a fire.',
          drivingFacts: ['Evacuation Safety Standards'],
          prerequisites: ['Official re-entry clearance issued by authorities'],
          riskIfOmitted: 'Injury from smoldering ground or sudden secondary flare-ups.'
        }
      },
      {
        id: `act-${id}-4`,
        category: 'SHARE',
        title: 'Report the safest known location to emergency responders',
        description: 'Once you are completely safe, contact local emergency services (112 in India) or the forest department. Share the nearest known landmark or safe location reference and report if anyone needs help.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Draft prepared',
        assignedRole: 'Reporting Party',
        actionType: 'COMMUNICATION',
        why: 'Responders need a safe landmark reference to dispatch crews efficiently.',
        inputUsed: extractedFacts.slice(0, 2).map(f => f.value).join(' • '),
        confidence: 50,
        nextStep: 'Call 112 (India) or local forest emergency services with the nearest landmark when safe.',
        missingPrerequisite: missingInformation.find(m => m.id.includes('location'))?.question || 'Nearest landmark',
        whatWouldChangeThis: 'When emergency responders confirm the incident report.',
        whyThisAction: {
          reasoning: 'Provides vital location cues to dispatchers without putting the caller in danger.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Call from a safe location away from the fire'],
          riskIfOmitted: 'Responders delayed finding the fire location.'
        },
        prefilledData: {
          contactName: 'Local Emergency Services (112) / Forest Department',
          draftMessage: `WILDFIRE REPORT: Fire observed in forest area. Landmark: [Nearest landmark]. Anyone in danger: [Status]. Reported from a safe location; unverified.`
        }
      },
      {
        id: `act-${id}-5`,
        category: 'VERIFY',
        title: 'Check essential status questions when safe',
        description: 'Only from a safe position, confirm if the fire is actively burning, whether anyone is in immediate danger, and note your nearest landmark to share with responders.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Reporting Party',
        actionType: 'CHECKLIST',
        why: 'Clear answers to essential triage questions help responders prioritize their deployment.',
        inputUsed: 'Essential wildfire triage questions',
        confidence: 50,
        nextStep: 'Answer the essential follow-up questions in the Missing Information section when safe.',
        missingPrerequisite: missingInformation[0]?.question || 'Active fire confirmation',
        whatWouldChangeThis: 'When emergency crews arrive on scene.',
        whyThisAction: {
          reasoning: 'Gathers key dispatch information safely.',
          drivingFacts: ['Essential Triage Questions'],
          prerequisites: ['Ensure you are in a safe position before answering'],
          riskIfOmitted: 'Emergency dispatchers lack critical details about people at risk.'
        },
        prefilledData: {
          draftMessage: 'TRIAGE CONFIRMATION: Fire active now: [Yes/No]. People in danger: [Yes/No]. Nearest landmark: [Describe].'
        }
      }
    ];
  } else if (isCloudSyncOutage) {
    actions = [
      {
        id: `act-${id}-1`,
        category: 'DO_NOW',
        title: 'Verify Cloud Provider Status Dashboard & Storage Gateway Connectivity',
        description: 'Cross-check the upstream CloudSync Pro status dashboard for reported degraded service status and inspect the local storage gateway for error code CS-503 (cloud storage unavailable). Do not force storage write operations while cloud volume state is degraded.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Systems Engineer / Cloud Admin',
        actionType: 'CHECKLIST',
        why: 'Heuristic guidance: error code CS-503 indicates an upstream or gateway outage; verifying status before attempting manual data transfers prevents file corruption.',
        inputUsed: extractedFacts[0]?.value || 'CloudSync Pro Error CS-503',
        confidence: 50,
        nextStep: 'Open cloud provider service health dashboard and confirm active incident scope for region.',
        missingPrerequisite: 'Access to cloud infrastructure dashboard',
        whatWouldChangeThis: 'If service status returns to operational or healthy.',
        whyThisAction: {
          reasoning: 'Verifying upstream cloud telemetry prevents executing destructive local remounts during a transient provider incident.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Check cloud provider incident status page'],
          riskIfOmitted: 'Unnecessary failovers or cache corruption during transient platform outages.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'chk-1', text: 'Verify CloudSync Pro provider status dashboard for region us-east', done: false },
            { id: 'chk-2', text: 'Inspect local storage gateway replication and mount logs for CS-503', done: false },
            { id: 'chk-3', text: 'Confirm customer blast radius across affected cloud storage volumes', done: false },
          ]
        }
      },
      {
        id: `act-${id}-2`,
        category: 'PREPARE',
        title: 'Inspect Storage Volume Gateway & Replication Mounts',
        description: 'Review local storage gateway telemetry, replication queues, and mount points to identify write-buffer backlog resulting from cloud storage unavailability.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Infrastructure Ops Lead',
        actionType: 'CHECKLIST',
        why: 'Heuristic guidance: buffered writes during a cloud storage outage can exhaust local cache if replication remains stalled.',
        inputUsed: extractedFacts[1]?.value || 'Cloud storage unavailable',
        confidence: 50,
        nextStep: 'Run storage gateway diagnostics to measure local queue depth and verify disk cache capacity.',
        missingPrerequisite: 'Gateway console access',
        whatWouldChangeThis: 'If local storage gateway automatically switches to fallback cache.',
        whyThisAction: {
          reasoning: 'Monitoring local queue buffers prevents silent disk full conditions during upstream outages.',
          drivingFacts: [extractedFacts[0]?.label || 'CloudSync Pro Outage'],
          prerequisites: ['Ensure gateway console access'],
          riskIfOmitted: 'Buffer exhaustion leading to catastrophic data loss in local gateway.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'chk-1', text: 'Check local buffer cache utilization percentage', done: false },
            { id: 'chk-2', text: 'Temporarily throttle batch background upload workers', done: false },
            { id: 'chk-3', text: 'Stage failover secondary storage endpoint credentials', done: false },
          ]
        }
      },
      {
        id: `act-${id}-3`,
        category: 'VERIFY',
        title: 'Resolve Missing Telemetry: Identify Affected Volumes and Workload Scope',
        description: 'Determine whether error CS-503 is isolated to specific storage pools or affects all client mount points across the deployment.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Cloud Storage Specialist',
        actionType: 'CHECKLIST',
        why: 'Heuristic guidance: precise blast radius assessment ensures targeted operational response rather than unnecessary global maintenance.',
        inputUsed: 'Truth Layer triage: Unresolved dependency',
        confidence: 50,
        nextStep: 'Audit active client mounts and verify which client systems are receiving CS-503 responses.',
        missingPrerequisite: missingInformation[0]?.question || 'Affected volume identifiers',
        whatWouldChangeThis: 'If provider confirms outage is limited to a single storage zone.',
        whyThisAction: {
          reasoning: 'External verification prevents acting on ungrounded assumptions or speculative inferences.',
          drivingFacts: ['Uncertain or Missing Information Triage'],
          prerequisites: ['Query affected client endpoints'],
          riskIfOmitted: 'Misidentifying unaffected storage clusters and triggering unnecessary downtime.'
        },
        prefilledData: {
          draftMessage: 'INCIDENT QUERY: Confirming affected storage volume IDs and workload impact for CS-503 event.'
        }
      },
      {
        id: `act-${id}-4`,
        category: 'SHARE',
        title: 'Broadcast Operational Status Notification to Dependent Teams',
        description: 'Publish an internal advisory notifying engineering and support teams that CloudSync Pro is experiencing degraded service (CS-503) and cloud storage is temporarily unavailable.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Draft prepared',
        assignedRole: 'Incident Communications Lead',
        actionType: 'COMMUNICATION',
        why: 'Heuristic guidance: keeps dependent service owners informed to prevent redundant support tickets and premature system restarts.',
        inputUsed: extractedFacts.slice(0, 2).map(f => f.value).join(' • '),
        confidence: 50,
        nextStep: 'Review status advisory draft and distribute to internal incident channel.',
        whatWouldChangeThis: 'If provider resolves incident before broadcast.',
        whyThisAction: {
          reasoning: 'Synchronizes dependent teams and customer support on upstream degraded status.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Confirm initial CS-503 diagnostic summary'],
          riskIfOmitted: 'Support teams fielding uncoordinated user complaints without root cause clarity.'
        },
        prefilledData: {
          contactName: 'Operations & Engineering Team',
          draftMessage: `OPERATIONAL INCIDENT ADVISORY [CloudSync Pro]: Degraded service status reported with error code CS-503 (cloud storage unavailable). Engineering is investigating gateway and provider telemetry.`
        }
      },
      {
        id: `act-${id}-5`,
        category: 'FOLLOW_UP',
        title: 'Execute Post-Restoration Data Integrity & Replication Audit',
        description: 'Once cloud storage status returns to healthy, verify pending sync queues, confirm zero byte corruption, and log post-incident recovery metrics.',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Reliability Engineer',
        actionType: 'PROCEDURAL',
        why: 'Heuristic guidance: ensures no data loss or desynchronization occurred during the CS-503 outage period.',
        inputUsed: 'Chronological event log',
        confidence: 50,
        nextStep: 'Schedule integrity checksum sweep after provider reports full restoration.',
        whatWouldChangeThis: 'If automated reconciliation completes with zero errors.',
        whyThisAction: {
          reasoning: 'Ensures long-term storage posture improvement and complete audit trail.',
          drivingFacts: ['Documented Incident Timeline'],
          prerequisites: ['Storage restoration verified by upstream provider'],
          riskIfOmitted: 'Undetected silent replication lag or desynchronized volume states.'
        }
      }
    ];
  } else if (isLifeSafetyHazard && urgency === 'CRITICAL') {
    actions = [
      {
        id: `act-${id}-1`,
        category: 'DO_NOW',
        title: 'Contact Local Emergency Services (In India, Call 112)',
        description: 'If there is immediate physical danger, severe hazard, or acute medical distress, contact official local emergency services immediately. SAARTHI provides decision support and does not dispatch emergency responders.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'On-Scene Individual / Safety Officer',
        actionType: 'COMMUNICATION',
        why: 'Heuristic guidance: immediate life-safety threats require direct contact with official emergency authorities (in India, call 112). SAARTHI cannot dispatch emergency services on your behalf.',
        inputUsed: extractedFacts[0]?.value || rawText.slice(0, 60),
        confidence: 50,
        nextStep: 'Place phone call directly to local emergency services (in India, call 112; in US, 911) and follow dispatcher instructions.',
        missingPrerequisite: 'Confirmation that official emergency services have been contacted',
        whatWouldChangeThis: 'If all individuals are verified in a safe location and no active hazard exists.',
        whyThisAction: {
          reasoning: 'Life-safety hazards require direct contact with emergency services rather than software workflow triage.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Ensure personal safety before making call'],
          riskIfOmitted: 'Delaying direct contact with emergency services during critical hazard situations endangers lives.'
        },
        prefilledData: {
          draftMessage: `EMERGENCY NOTES FOR DISPATCHER: Situation: ${rawText.slice(0, 100)}... Location: ${missingInformation[0]?.question || 'Confirm location with caller'}. (Self-reported by user; unverified).`,
        }
      },
      {
        id: `act-${id}-2`,
        category: 'PREPARE',
        title: 'Organize Critical Information for Arriving Responders',
        description: 'Compile stated occupant counts, hazards, and building access notes for emergency personnel upon their arrival.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'On-Scene Individual',
        actionType: 'CHECKLIST',
        why: 'Heuristic guidance: having concise on-scene notes ready aids emergency personnel without making unverified interventions.',
        inputUsed: extractedFacts[1]?.value || extractedFacts[0]?.value || 'Initial Report',
        confidence: 50,
        nextStep: 'Prepare access notes, entry gate codes, or medical histories to hand over to official responders.',
        missingPrerequisite: 'Official responders on scene',
        whatWouldChangeThis: 'If site is evacuated and handoff occurs at perimeter.',
        whyThisAction: {
          reasoning: 'Provides vital context to official emergency responders without performing dangerous unverified interventions.',
          drivingFacts: [extractedFacts[0]?.label || 'Initial Incident Report'],
          prerequisites: ['Maintain personal safety'],
          riskIfOmitted: 'Responders entering hazardous environment without reported context.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'chk-1', text: 'Confirm personal safety and evacuation perimeter', done: false },
            { id: 'chk-2', text: 'Prepare access codes or building entry instructions for responders', done: false },
            { id: 'chk-3', text: 'Note reported hazards and approximate locations for incoming team', done: false },
          ]
        }
      },
      {
        id: `act-${id}-3`,
        category: 'VERIFY',
        title: `Resolve Missing Telemetry: ${missingInformation[0]?.question.slice(0, 40)}...`,
        description: missingInformation[0]?.impact || 'Confirm critical missing information with on-scene contacts before taking further action.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Verification Specialist',
        actionType: 'CHECKLIST',
        why: 'Heuristic guidance: SAARTHI strictly requires independent verification before irreversible operational steps.',
        inputUsed: 'Truth Layer triage: Unresolved dependency',
        confidence: 50,
        nextStep: missingInformation[0]?.queryPrompt || 'Inquire with reporting party.',
        missingPrerequisite: 'Direct response from reporting individual',
        whatWouldChangeThis: 'If official responders take full command of scene communications.',
        whyThisAction: {
          reasoning: 'External verification prevents acting on ungrounded assumptions or speculative inferences.',
          drivingFacts: ['Uncertain or Missing Information Triage'],
          prerequisites: ['Establish contact with reporting party'],
          riskIfOmitted: 'Dispatching or redirecting support based on incorrect location or premise.'
        },
        prefilledData: {
          draftMessage: `VERIFICATION QUERY: ${missingInformation[0]?.queryPrompt || 'Please verify exact coordinates and status.'}`
        }
      },
      {
        id: `act-${id}-4`,
        category: 'SHARE',
        title: 'Share Informational Summary with Stakeholders',
        description: 'Distribute an informational brief detailing reported facts and unresolved information gaps to designated emergency contacts.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Draft prepared',
        assignedRole: 'Communications Coordinator',
        actionType: 'COMMUNICATION',
        why: 'Heuristic guidance: keeps stakeholders aligned while explicitly identifying reported facts as unverified narrative.',
        inputUsed: extractedFacts.slice(0, 2).map(f => f.value).join(' • '),
        confidence: 50,
        nextStep: 'Review draft brief to ensure unverified status is clearly stated before sending.',
        whatWouldChangeThis: 'If privacy restrictions limit disclosure.',
        whyThisAction: {
          reasoning: 'Synchronizes family or organizational contacts with reported situation details.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Verify emergency services have been called first'],
          riskIfOmitted: 'Conflicting secondary communications causing confusion.'
        },
        prefilledData: {
          contactName: 'Emergency Contact Group',
          draftMessage: `SAARTHI INFORMATIONAL BRIEF [${category} - ${urgency}]: ${situationDetected.slice(0, 100)}... Status: Unverified user narrative. Emergency services must be contacted directly.`
        }
      },
      {
        id: `act-${id}-5`,
        category: 'FOLLOW_UP',
        title: 'Track Emergency Timeline & Log Verified Handoff',
        description: 'Document timeline of calls placed, responder arrival times, and verified updates.',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Records Officer',
        actionType: 'PROCEDURAL',
        why: 'Heuristic guidance: maintaining a clear chronological log aids post-incident coordination and debriefing.',
        inputUsed: 'Chronological event log',
        confidence: 50,
        nextStep: 'Record responder arrival timestamp and unit details when available.',
        whatWouldChangeThis: 'If official debrief is handled through standard responder report.',
        whyThisAction: {
          reasoning: 'Maintains clear operational records and documents resolution milestones.',
          drivingFacts: ['Documented Incident Timeline'],
          prerequisites: ['Primary emergency response underway'],
          riskIfOmitted: 'Loss of critical timeline details for after-action review.'
        }
      }
    ];
  } else if (isCyberIncident) {
    actions = [
      {
        id: `act-${id}-1`,
        category: 'DO_NOW',
        title: 'Activate Incident Response & Preserve Evidence Logs',
        description: 'Notify the authorized Information Security Officer or CSIRT immediately. Contain potential exposure through established response procedures (such as isolating affected network segments or revoking compromised sessions) while strictly preserving audit logs, network captures, and digital evidence without destructive modification.',
        urgency: 'IMMEDIATE',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Information Security Lead / System Admin',
        actionType: 'PROCEDURAL',
        why: 'Heuristic guidance: rapid containment under established protocols prevents breach propagation while safeguarding digital forensics for regulatory and security analysis.',
        inputUsed: extractedFacts[0]?.value || rawText.slice(0, 60),
        confidence: 50,
        nextStep: 'Contact internal security operations lead and export immutable system logs.',
        missingPrerequisite: 'Authorized security team contact details',
        whatWouldChangeThis: 'If confirmed as a simulated penetration test or false alert.',
        whyThisAction: {
          reasoning: 'Breach containment requires disciplined response protocols and log preservation rather than physical emergency dispatch.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Identify point of contact for incident response team'],
          riskIfOmitted: 'Destruction of forensic logs or uncontrolled lateral movement.'
        },
        prefilledData: {
          draftMessage: `INCIDENT LOG [Cybersecurity]: Suspected data breach / security incident reported. Systems isolated per protocol; logs preserved for forensic review.`,
        }
      },
      {
        id: `act-${id}-2`,
        category: 'PREPARE',
        title: 'Compile Timeline & Affected Systems Inventory',
        description: 'Document initial detection timestamp, affected endpoints, user accounts, and observed indicators of compromise without altering file timestamps or evidence.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Incident Response Handler',
        actionType: 'CHECKLIST',
        why: 'Heuristic guidance: maintains an accurate forensic timeline to assist security investigations and regulatory disclosure.',
        inputUsed: extractedFacts[1]?.value || extractedFacts[0]?.value || 'Initial Report',
        confidence: 50,
        nextStep: 'Gather firewall, auth, and database access logs into a read-only secure repository.',
        missingPrerequisite: 'Affected system identifiers',
        whatWouldChangeThis: 'If automated EDR system completes snapshot capture.',
        whyThisAction: {
          reasoning: 'Detailed chronological evidence allows incident response specialists to assess attack vectors accurately.',
          drivingFacts: [extractedFacts[0]?.label || 'Initial Incident Report'],
          prerequisites: ['Ensure read-only access to relevant logs'],
          riskIfOmitted: 'Overwriting log buffers or losing transient forensic telemetry.'
        },
        prefilledData: {
          checklistItems: [
            { id: 'chk-1', text: 'Preserve firewall, proxy, and identity provider logs', done: false },
            { id: 'chk-2', text: 'Isolate affected host or segment from network if authorized', done: false },
            { id: 'chk-3', text: 'Document detection timestamp and initial anomalous indicator', done: false },
          ]
        }
      },
      {
        id: `act-${id}-3`,
        category: 'VERIFY',
        title: 'Verify Scope of Exposure with Security Team',
        description: 'Confirm data classifications involved (PII, credentials, financial records) and assess whether mandatory statutory notifications (e.g., CERT-In within 6 hours, GDPR) are applicable.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Compliance / Security Officer',
        actionType: 'CHECKLIST',
        why: 'Heuristic guidance: precise classification of exposed data determines statutory reporting deadlines and containment scope.',
        inputUsed: 'Truth Layer triage: Unresolved dependency',
        confidence: 50,
        nextStep: 'Consult data protection officer or lead counsel on regulatory disclosure triggers.',
        missingPrerequisite: 'Confirmation of affected data sets',
        whatWouldChangeThis: 'If forensic audit confirms no unauthorized data exfiltration occurred.',
        whyThisAction: {
          reasoning: 'External verification prevents either under-reporting or triggering premature false alarms.',
          drivingFacts: ['Uncertain or Missing Information Triage'],
          prerequisites: ['Receive preliminary findings from incident responders'],
          riskIfOmitted: 'Non-compliance with statutory breach notification timelines.'
        },
        prefilledData: {
          draftMessage: `BREACH ASSESSMENT: Requesting preliminary confirmation of affected data repositories and classification levels.`
        }
      },
      {
        id: `act-${id}-4`,
        category: 'SHARE',
        title: 'Coordinate Out-of-Band Incident Communications',
        description: 'Distribute structured status briefing strictly via secure out-of-band communication channels to authorized leadership and legal counsel.',
        urgency: 'HIGH',
        status: 'PENDING',
        executionReadiness: 'Draft prepared',
        assignedRole: 'Communications Coordinator',
        actionType: 'COMMUNICATION',
        why: 'Heuristic guidance: prevents alerting potential adversaries if primary communication channels are compromised.',
        inputUsed: extractedFacts.slice(0, 2).map(f => f.value).join(' • '),
        confidence: 50,
        nextStep: 'Verify authorized recipient list before dispatching confidential brief.',
        whatWouldChangeThis: 'If internal communications channels are verified secure.',
        whyThisAction: {
          reasoning: 'Protects incident coordination confidentiality during active compromise assessment.',
          drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
          prerequisites: ['Use verified out-of-band communication channel'],
          riskIfOmitted: 'Adversary interception of remediation plans.'
        },
        prefilledData: {
          contactName: 'Incident Management Group',
          draftMessage: `CONFIDENTIAL INCIDENT BRIEF: Suspected security incident under triage. Primary status: Unverified user report. Response team engaged.`
        }
      },
      {
        id: `act-${id}-5`,
        category: 'FOLLOW_UP',
        title: 'Document Containment Milestones & Post-Incident Audit',
        description: 'Log all remediation steps, credential rotations, patch verifications, and root-cause analysis findings into the incident record.',
        urgency: 'SCHEDULED',
        status: 'PENDING',
        executionReadiness: 'Suggested next action',
        assignedRole: 'Records / Compliance Lead',
        actionType: 'PROCEDURAL',
        why: 'Heuristic guidance: comprehensive post-incident documentation ensures organizational accountability and regulatory compliance.',
        inputUsed: 'Chronological event log',
        confidence: 50,
        nextStep: 'Schedule root-cause analysis and evidence review with incident response team.',
        whatWouldChangeThis: 'If investigation concludes no security policy violation occurred.',
        whyThisAction: {
          reasoning: 'Ensures long-term posture improvement and complete audit trail.',
          drivingFacts: ['Documented Incident Timeline'],
          prerequisites: ['Containment verified'],
          riskIfOmitted: 'Incomplete audit trails for regulatory inquiries.'
        }
      }
    ];
  } else {
    actions = [
        {
          id: `act-${id}-1`,
          category: 'DO_NOW',
          title: 'Document Incident Details & Review Pending Deadlines',
          description: 'Compile stated facts, timestamps, and reference details into an organized record. Avoid taking irreversible operational or legal actions until facts are independently verified.',
          urgency: urgency === 'HIGH' ? 'HIGH' : 'MEDIUM',
          status: 'PENDING',
          executionReadiness: 'Suggested next action',
          assignedRole: 'Lead Coordinator / User',
          actionType: 'CHECKLIST',
          why: 'Heuristic recommendation: preserves critical documentation without prematurely committing to irreversible actions before verification.',
          inputUsed: extractedFacts[0]?.value || rawText.slice(0, 60),
          confidence: 50,
          nextStep: 'Consolidate notices, messages, and timeline notes before consulting qualified specialists.',
          missingPrerequisite: missingInformation[0]?.question || 'Independent verification of records',
          whatWouldChangeThis: 'If official counterparty records or qualified counsel confirm prior resolution.',
          whyThisAction: {
            reasoning: 'Organizing narrative facts prevents missed deadlines while avoiding unverified commitments.',
            drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
            prerequisites: ['Gather existing messages or paperwork'],
            riskIfOmitted: 'Risk of misplacing critical timeline evidence or acting on incomplete assumptions.'
          },
          prefilledData: {
            draftMessage: `RECORD MEMORANDUM [${category}]: Situation logged: ${rawText.slice(0, 80)}... Status: Unverified user narrative. Awaiting independent record check.`,
          }
        },
        {
          id: `act-${id}-2`,
          category: 'PREPARE',
          title: 'Organize Supporting Records & Required Materials',
          description: 'Assemble available documents, notices, contact details, or safety supplies before formal review.',
          urgency: 'HIGH',
          status: 'PENDING',
          executionReadiness: 'Suggested next action',
          assignedRole: 'Logistics / Records Lead',
          actionType: 'CHECKLIST',
          why: 'Heuristic recommendation: preparing existing documentation reduces turnaround latency once verified procedures are initiated.',
          inputUsed: extractedFacts[1]?.value || extractedFacts[0]?.value || 'Initial Report',
          confidence: 50,
          nextStep: 'Gather available notices, receipts, or items into an accessible folder.',
          missingPrerequisite: 'Official reference or case identifier',
          whatWouldChangeThis: 'If formal procedural submission is waived or not required.',
          whyThisAction: {
            reasoning: 'Having documentation prepared speeds resolution when interacting with official representatives.',
            drivingFacts: [extractedFacts[0]?.label || 'Initial Incident Report'],
            prerequisites: ['Check available personal or company files'],
            riskIfOmitted: 'Unnecessary delay when official review or specialist consultation occurs.'
          },
          prefilledData: {
            checklistItems: [
              { id: 'chk-1', text: 'Gather original notices, receipts, or incident statements', done: false },
              { id: 'chk-2', text: 'Confirm primary contact information and reference numbers', done: false },
              { id: 'chk-3', text: 'Review procedural requirements with appropriate authority', done: false },
            ]
          }
        },
        {
          id: `act-${id}-3`,
          category: 'VERIFY',
          title: `Resolve Missing Information: ${missingInformation[0]?.question.slice(0, 40)}...`,
          description: missingInformation[0]?.impact || 'Confirm critical missing information with authorized parties before authorizing irreversible steps.',
          urgency: 'HIGH',
          status: 'PENDING',
          executionReadiness: 'Suggested next action',
          assignedRole: 'Verification Specialist',
          actionType: 'CHECKLIST',
          why: 'Heuristic recommendation: SAARTHI strictly advises independent verification before irreversible operational or legal decisions.',
          inputUsed: 'Truth Layer triage: Unresolved information dependency',
          confidence: 50,
          nextStep: missingInformation[0]?.queryPrompt || 'Query records department or authorized authority.',
          missingPrerequisite: 'Direct response from authorized records or personnel',
          whatWouldChangeThis: 'If official counterpart database provides verified telemetry directly.',
          whyThisAction: {
            reasoning: 'External verification prevents acting on ungrounded assumptions or speculative inferences.',
            drivingFacts: ['Uncertain or Missing Information Triage'],
            prerequisites: ['Identify authorized point of contact'],
            riskIfOmitted: 'Taking actions based on false premises or incomplete information.'
          },
          prefilledData: {
            draftMessage: `INFORMATION VERIFICATION QUERY: ${missingInformation[0]?.queryPrompt || 'Please verify exact details and current status.'}`
          }
        },
        {
          id: `act-${id}-4`,
          category: 'SHARE',
          title: 'Share Informational Summary with Stakeholders',
          description: 'Distribute an informational brief detailing reported facts and unresolved information gaps to designated team members.',
          urgency: 'HIGH',
          status: 'PENDING',
          executionReadiness: 'Draft prepared',
          assignedRole: 'Communications Coordinator',
          actionType: 'COMMUNICATION',
          why: 'Heuristic recommendation: keeps stakeholders aligned while explicitly distinguishing reported assertions from verified facts.',
          inputUsed: extractedFacts.slice(0, 2).map(f => f.value).join(' • '),
          confidence: 50,
          nextStep: 'Review draft brief to ensure unverified status is clearly stated before sending.',
          whatWouldChangeThis: 'If privacy or privilege restrictions limit disclosure.',
          whyThisAction: {
            reasoning: 'Synchronizes all participating parties on current findings and open questions.',
            drivingFacts: extractedFacts.slice(0, 2).map(f => f.label),
            prerequisites: ['Confirm recipient list and authorization'],
            riskIfOmitted: 'Parallel uncoordinated actions and conflicting assumptions.'
          },
          prefilledData: {
            contactName: 'Incident Stakeholder Group',
            draftMessage: `SAARTHI INFORMATIONAL BRIEF [${category} - ${urgency}]: ${situationDetected.slice(0, 100)}... Status: Unverified user narrative. View board for open questions.`
          }
        },
        {
          id: `act-${id}-5`,
          category: 'FOLLOW_UP',
          title: 'Track Resolution Milestones & Maintain Incident Log',
          description: 'Maintain a chronological log of actions, received verifications, and upcoming milestones.',
          urgency: 'SCHEDULED',
          status: 'PENDING',
          executionReadiness: 'Suggested next action',
          assignedRole: 'Records Officer',
          actionType: 'PROCEDURAL',
          why: 'Heuristic recommendation: structured milestone tracking ensures accountability and auditable records.',
          inputUsed: 'Chronological timeline log',
          confidence: 50,
          nextStep: 'Record outcome notes and timestamps as updates arrive.',
          whatWouldChangeThis: 'If the matter is concluded with no further follow-up required.',
          whyThisAction: {
            reasoning: 'Maintains clear operational records and documents resolution milestones.',
            drivingFacts: ['Documented Incident Timeline'],
            prerequisites: ['Initial triage completed'],
            riskIfOmitted: 'Loss of incident context across shifts or follow-up handoffs.'
          }
        }
      ];
  }

  // 8. Graph Nodes
  const graphNodes: GraphNode[] = [
    {
      id: `gn-${id}-1`,
      stage: 'INPUT',
      title: `Raw ${inputType.toUpperCase()} Ingestion`,
      detail: `${rawText.slice(0, 48)}...`,
      status: urgency === 'CRITICAL' ? 'urgent' : 'normal',
      targetIds: [`gn-${id}-2`],
      iconName: inputType === 'voice' ? 'Mic' : inputType === 'document' ? 'FileText' : 'MessageSquare'
    },
    {
      id: `gn-${id}-2`,
      stage: 'UNDERSTAND',
      title: 'Domain Intent Extraction',
      detail: `${category} • Urgency: ${urgency}`,
      status: 'normal',
      targetIds: [`gn-${id}-3`, `gn-${id}-4`],
      iconName: 'Brain'
    },
    {
      id: `gn-${id}-3`,
      stage: 'FACTS',
      title: 'Extracted Narrative Entities',
      detail: `${extractedFacts.length} extracted (${providedCount} provided, ${uncertainCount} uncertain)`,
      status: verifiedCount > 0 ? 'verified' : 'normal',
      targetIds: [`gn-${id}-5`],
      iconName: 'ShieldAlert'
    },
    {
      id: `gn-${id}-4`,
      stage: 'VERIFICATION',
      title: 'Truth Layer Triage',
      detail: `${providedCount} provided, ${uncertainCount} uncertain, 0 verified, ${missingInformation.length} missing gaps`,
      status: 'missing',
      targetIds: [`gn-${id}-5`],
      iconName: 'CheckCircle2'
    },
    {
      id: `gn-${id}-5`,
      stage: 'INTENT',
      title: 'Structured Mission Intent',
      detail: primaryIntent.slice(0, 60),
      status: 'primary',
      targetIds: [`gn-${id}-6`, `gn-${id}-7`],
      iconName: 'Target'
    },
    {
      id: `gn-${id}-6`,
      stage: 'ACTIONS',
      title: actions[0]?.title.slice(0, 32) || 'Primary Directive',
      detail: actions[0]?.nextStep.slice(0, 48) || 'Review next steps',
      status: urgency === 'CRITICAL' ? 'urgent' : 'normal',
      targetIds: [],
      iconName: 'Zap'
    },
    {
      id: `gn-${id}-7`,
      stage: 'ACTIONS',
      title: 'Action Center Delegation',
      detail: `${actions.length} structured action recommendations generated`,
      status: 'normal',
      targetIds: [],
      iconName: 'Layers'
    }
  ];

  // 9. Build Action Pack
  const actionPack: ActionPackData = {
    situationSummary: situationDetected,
    keyFacts: extractedFacts.slice(0, 4).map(f => ({
      label: f.label,
      value: f.value,
      status: f.status,
    })),
    missingInformation: missingInformation.map(m => m.question),
    recommendedActions: actions.map(a => ({
      title: a.title,
      nextStep: a.nextStep,
      readiness: a.executionReadiness,
      category: a.category,
    })),
    checklist: actions.map((a, i) => ({
      id: `chk-${id}-${i}`,
      text: `${a.title}: ${a.nextStep}`,
      completed: false,
    })),
    questionsToAsk: missingInformation.map(m => m.queryPrompt),
    informationToShare: `SAARTHI INFORMATIONAL BRIEF [${category}]: ${situationDetected}\nPrimary Intent: ${primaryIntent}\nNote: Based on unverified user input; independent confirmation required.`,
    generatedAt: timestamp,
  };

  return {
    id,
    title,
    category,
    timestamp,
    inputType,
    rawInput: rawText,
    engineUsed: 'deterministic-demo',
    metadata: {
      ...metadata,
      wordCount: rawText.split(/\s+/).filter(Boolean).length,
    },
    situationDetected,
    primaryIntent,
    secondaryIntents,
    urgency,
    urgencyReasoning,
    extractedFacts,
    missingInformation,
    assumptions: [
      'Narrative facts are classified as PROVIDED based on user input and have not been independently verified.',
      'Urgency is assessed by a simple keyword heuristic; it will produce false-positives and false-negatives and is not a reliable emergency classifier.',
      'Input Completeness score reflects the density and coherence of user-supplied text (heuristic), not calibrated accuracy.',
      'Fact Grounding and Verification Certainty are 0% until an external verification source confirms a fact.',
      'Operational recommendations are advisory workflows and do not replace professional emergency, legal, or medical authorities.'
    ],
    overallConfidence,
    confidenceBreakdown: {
      inputCoherence,
      factGrounding,
      verificationCertainty,
    },
    safetyDisclaimer: isForestFire
      ? 'If anyone is in immediate danger, call local emergency services immediately (in India, call 112). Move away from fire and smoke. Do not attempt to fight a spreading fire. SAARTHI is a decision-support tool and does not dispatch emergency responders.'
      : isLifeSafetyHazard
      ? 'If anyone is in immediate physical danger, contact local emergency services immediately (in India, call 112). SAARTHI provides decision support and does not dispatch emergency responders.'
      : isOcrFailureNotice
      ? 'OCR EXTRACTION ADVISORY: Automated text detection could not extract legible text from this image. Please review the image, upload a clearer copy, or enter details manually before relying on analysis.'
      : isCloudSyncOutage
      ? 'OPERATIONAL INCIDENT ADVISORY: Cloud service degradation (CS-503) detected from telemetry image. Verify external provider status dashboards and confirm storage failover paths before initiating data migration.'
      : isCyberIncident
      ? 'CYBERSECURITY INCIDENT ADVISORY: Potential security incident detected. Follow established containment procedures, preserve forensic logs, and notify authorized security personnel. SAARTHI provides workflow decision support and does not execute network interventions.'
      : 'DECISION SUPPORT ADVISORY: SAARTHI provides structured workflow recommendations based on user input. Stated facts have not been independently verified. Consult qualified professionals before taking irreversible legal, financial, or operational actions.',
    actions,
    graphNodes,
    tags: [category, urgency, inputType.toUpperCase()],
    actionPack,
  };
}
