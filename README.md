# SAARTHI

> **From Human Intent to Verified Action.**

A Gemini-powered web application that acts as a universal bridge between messy human intent and complex systems. The system transforms unstructured real-world input into structured, transparent, and actionable plans.

---

## 🌟 Core Concept

```
INPUT (Text / Voice / Image / Document)
  ↓
Understand (Acoustic, Stress, & Semantic Parsing)
  ↓
Structure (Entity & Telemetry Extraction)
  ↓
Verify (Tri-State Truth Triage: Verified vs Uncertain vs Missing)
  ↓
Decide (Intent Resolution & Urgency Calibration)
  ↓
Action (Prioritized Multi-Disciplinary Action Center)
```

---

## 🚀 Key Features

1. **Central Interaction: "Tell me what happened."**
   - **Type**: Unstructured natural language narratives.
   - **Speak**: Web Speech API live microphone transcription + animated audio waveform.
   - **Upload Image**: Inspection/damage photos with automated OCR grounding.
   - **Upload Document**: Incident logs, PagerDuty transcripts, and reports.

2. **Grounded Deep Analysis Flow**
   - **Situation Detected**: Real-world ground truth synthesis.
   - **Intent**: Primary goal and secondary operational constraints.
   - **Urgency**: Calibrated tiers (`CRITICAL`, `HIGH`, `MODERATE`, `LOW`) with reasoning.
   - **Extracted Facts (Tri-State Triage)**:
     - `✓ Verified`: Directly stated and grounded.
     - `⚠ Uncertain`: Speculative or ambiguous language flagged.
     - `? Missing`: Crucial missing dependencies isolated (The AI **NEVER** invents missing facts).
   - **Confidence Score**: Calibrated index with input coherence, fact grounding, and certainty breakdown.
   - **Strict Operational Advisory**: Clear disclaimer that operational triage does not replace clinical medical diagnosis.

3. **Intelligent Action Center**
   - Prioritized cards across 5 categories:
     - **DO NOW**: Immediate life-safety and isolation actions.
     - **PREPARE**: Equipment, checklists, staging, and protective measures.
     - **VERIFY**: Targeted telemetry queries and badge checkups.
     - **SHARE**: Communications payloads and tactical briefs.
     - **FOLLOW UP**: Audit trails, compliance, and retrospective documentation.
   - **"Why this action?" Explainability Engine**: Shows algorithmic reasoning, driving facts, prerequisites, and operational risks if omitted.

4. **Signature Feature: Intent → Action Graph Visualization**
   - Interactive 6-stage cognitive pipeline tracing input through understanding, facts, verification, intent, and recommended actions.
   - Live **"Simulate Graph Flow"** playback animation for competition demos.

5. **Competition Live Demo Mode**
   - 3 pre-loaded real-world scenarios ready for 1-click evaluation without requiring an API key:
     1. *Industrial Flash Flood & Chemical Containment* (Panicked voice radio).
     2. *Sub-Zero Winter Fall & Blackout* (Frantic neighbor distress text).
     3. *Database Exfiltration & Credential Exposure* (SEV-1 DevOps incident dump).
   - **Zero-Key Guarantee**: Runs with built-in semantic extraction or live Gemini API (`gemini-2.5-flash`, `gemini-1.5-pro`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism Design System
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Micro-interactions**: Canvas Confetti
- **Lightweight Repository**: Total source and bundle footprint is < 1 MB (well below the 10 MB limit).

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
The application will be live at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Gemini API Configuration

You can use SAARTHI completely in **Zero-Key Mode** out of the box, or add your Google Gemini API key:
- **Option A**: Click the **Settings** gear icon in the top right of the application and enter your Gemini API key.
- **Option B**: Set `VITE_GEMINI_API_KEY=your_key_here` in a `.env` file.
