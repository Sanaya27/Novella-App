# Novella
**Where Hearts Sync and Stories Begin**

Privacy-first matching & chat with playful bio-signals: **Heart Sync**, **Voice Mood**, **Ghost Glimpse**, and a shared AR **Symbiosis Garden**.

---

## Table of Contents
- [Overview](#overview)
- [Core Features](#core-features)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Privacy & Safety](#privacy--safety)
- [Documentation Index](#documentation-index)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [License](#license)

---

## Overview
Novella brings emotion back to online connection. Beyond swipes and static chat, it blends ambient bio-signals and subtle cues to make conversations feel alive — and safe, inclusive, and consent-driven. The vision includes a shared AR garden that grows with your bond, on-device mood hints, and wearable-powered **Heart Sync**.

---

## Core Features
- **Profiles** — Create your profile, explore others, and connect.  
- **Flutter / Pass** — Tap **Flutter** to show interest; **Pass** hides a profile permanently.  
- **Heart Sync (opt-in)** — Wearable BPM turns into live butterfly flutters; when hearts align, a DNA swirl & butterfly burst appear.  
- **Chat with Cues** — “Nervousness/Shyness” via typing rhythm & pauses; ambient petals while browsing.  
- **Amora (Relationship Chatbot)** — Openers, ice-breakers, and gentle check-ins.  
- **Voice Mood Analyzer** — On-device tone cues (e.g., pollen = flirty, mist = calm).  
- **Symbiosis Garden (AR)** — A shared garden that unlocks rare butterflies as conversations deepen.  
- **Ghost Glimpse** — Spontaneous photos with blurred previews; **reply to unlock**, then they **fade after one view** (ephemeral, privacy-first).

---

## Repository Structure
├─ novella-app/ # Web client (app UI)
├─ novella-backend/ # Node.js backend prototype (REST / WebSockets)
├─ Components/ # Shared UI building blocks
├─ Pages/ # App/page-level views
├─ Entities/ # Domain models / helpers
├─ Novella/ # App-specific modules
├─ butterflies/ # Assets/animations for garden/flutters
├─ .html # Clickable logic demos (no build needed)
├─ api-integration-demo.jsx # API integration example
├─ NOVELLA_ & IMPLEMENTATION.md # Design & integration docs
├─ RUN_GUIDE.md # Local run notes
├─ LICENSE # MIT
└─ package-lock.json # Dependency lock (top-level)


---

## Tech Stack
- **Languages:** JavaScript (+ HTML prototypes)  
- **Frontend (web):** App under `novella-app/` with clickable HTML demos at repo root  
- **Backend (prototype):** Node.js under `novella-backend/` with real-time (WebSockets) envisioned  
- **Vision (mobile & AR):** React Native + Expo, Lottie/Reanimated, Three.js, ARKit/ARCore, HealthKit/Google Fit, WebSockets/BLE (future)

---

## Getting Started

### 1) Clone

git clone https://github.com/Sanaya27/Novella-App.git
cd Novella-App

## 2) Install dependencies
# Frontend
cd novella-app
npm install

# Backend (optional, if used)
cd ../novella-backend
npm install

## 3) Configure environment

Create .env files as needed (see Configuration)

## 4) Run locally

# Web app
cd novella-app
npm run dev   # or: npm start (match your package.json)

# Backend (optional)
cd ../novella-backend
npm run dev   # or: npm start

## Configuration

Novella requires at least one AI provider key for the Amora chatbot to generate realistic chat responses.

## Quick setup
cd novella-app
cp .env.example .env
# edit .env and add at least one key
npm start

## Environment Variables

| Variable                      | Required | Provider           |
| ----------------------------- | :------: | ------------------ |
| `REACT_APP_OPENAI_API_KEY`    |   No\*   | OpenAI (ChatGPT)   |
| `REACT_APP_ANTHROPIC_API_KEY` |   No\*   | Anthropic (Claude) |
| `REACT_APP_GEMINI_API_KEY`    |   No\*   | Google Gemini      |

* Provide any one key (or more). Amora will use the first available.

## .env Example
# OpenAI (get key: https://platform.openai.com/api-keys)
REACT_APP_OPENAI_API_KEY=sk-...

# Anthropic Claude (get key: https://console.anthropic.com/)
# REACT_APP_ANTHROPIC_API_KEY=claude-...

# Google Gemini (get key: https://makersuite.google.com/app/apikey)
# REACT_APP_GEMINI_API_KEY=gemini-...


Privacy & Safety

Consent by default — Heart Sync & Voice Mood are opt-in.

On-device first — Derive mood locally; send only labels (e.g., “calm/energetic”), not raw audio.

Ephemeral media — Ghost Glimpse is designed to vanish after a single view.

User control — Block/report, export data, delete account.

Security — TLS in transit; encrypt sensitive fields at rest.

Transparency — Document retention windows & third-party processors in PRIVACY.md (coming soon).

Documentation Index

Link these in your repo for developers:

NOVELLA_COMPLETE_SETUP.md

NOVELLA_CHAT_AI_INTEGRATION.md

NOVELLA_AI_PROMPT_SYSTEM.md

API_INTEGRATION_GUIDE.md

IMPROVED_CHAT_IMPLEMENTATION.md / FINAL_CHAT_IMPLEMENTATION.md / REALISTIC_CHAT_IMPLEMENTATION.md

CHAT_TROUBLESHOOTING.md

RUN_GUIDE.md


FAQ

Does Heart Sync share my raw heartbeat?
No. With consent, devices read BPM; only derived visuals (flutters, DNA swirl) are shown in chat — not raw BPM streams.

Is Voice Mood recording me?
No. Analysis is intended to run on-device; if any label is sent, it’s categorical only (e.g., “calm”).

Can I disable analytics or cues?
Yes — ship with toggles so users can disable mood/heartbeat cues entirely.

What happens to Ghost Glimpse after viewing?
It fades after one view. External capture is still possible; discourage misuse and allow reporting. (Implement server-side deletion & signed URLs with short TTLs.)





