markdown
# Novella
*Where Hearts Sync and Stories Begin*

> **Privacy-first matching & chat** with playful bio-signals: **Heart Sync**, **Voice Mood**, **Ghost Glimpse**, and a shared AR **Symbiosis Garden**.

---

## Table of Contents
- [Overview](#overview)
- [Core Features](#core-features)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Privacy & Safety](#privacy--safety)
- [FAQ](#faq)
- [License](#license)

---

## Overview
Novella brings emotion back to online connection. Beyond swipes and static chat, it blends ambient bio-signals and subtle cues to make conversations feel alive — and safe, inclusive, and consent-driven.

The product vision includes:
- A shared AR garden that grows with bonds, unlocking visual rewards.
- On-device mood hints and wearable-powered **Heart Sync** for consented presence signals.
- Ephemeral media and strong user controls for privacy.

---

## Core Features
- **Profiles** — Create a profile, explore others, and connect.
- **Flutter / Pass** — `Flutter` to show interest; `Pass` hides a profile permanently.
- **Heart Sync (opt-in)** — Wearable BPM drives gentle flutters. When hearts align, the UI shows a DNA swirl and a butterfly burst.
- **Chat with Cues** — Subtle typing/pausing cues (e.g., nervousness/shyness) and ambient petals while browsing.
- **Amora (Relationship Chatbot)** — Openers, ice-breakers, and gentle check-ins powered by an AI provider.
- **Voice Mood Analyzer** — On-device tone cues (labels only, e.g., "pollen" = flirty, "mist" = calm).
- **Symbiosis Garden (AR)** — A shared garden that grows as conversations deepen and can unlock rare butterflies or plants.
- **Ghost Glimpse** — Spontaneous, blurred previews that require a reply to unlock; media is ephemeral and intended to fade after a single view.

---

## Repository Structure


.
├─ novella-app/                    # Web client (app UI)
├─ novella-backend/                # Node.js backend prototype (REST / WebSockets)
├─ Components/                     # Shared UI building blocks
├─ Pages/                          # App / page-level views
├─ Entities/                       # Domain models / helpers
├─ Novella/                        # App-specific modules
├─ butterflies/                    # Assets / animations for garden / flutters
├─ *.html                          # Clickable logic demos (no build needed)
├─ api-integration-demo.jsx        # API integration example
├─ NOVELLA\_* & \_IMPLEMENTATION.md# Design & integration docs
├─ RUN\_GUIDE.md                    # Local run notes
├─ PRIVACY.md                      # Privacy / retention doc (draft)
├─ LICENSE                         # MIT
└─ package-lock.json               # Dependency lock (top-level)

`

---

## Tech Stack
- **Languages:** JavaScript, HTML
- **Frontend (web):** `novella-app/` — React / plain HTML demos for rapid prototyping
- **Backend (prototype):** Node.js (WebSockets for real-time features)
- **Vision (mobile & AR):** React Native + Expo, Lottie/Reanimated, Three.js, ARKit/ARCore (future)
- **Integrations (concept):** HealthKit / Google Fit / BLE for opt-in Heart Sync (on-device first)

---

## Getting Started
These instructions assume you cloned the repository at the repo root.

### 1) Clone
bash
git clone https://github.com/Sanaya27/Novella-App.git
cd Novella-App
`

### 2) Install dependencies

**Frontend**

bash
cd novella-app
npm install


**Backend (optional)**

bash
cd ../novella-backend
npm install


### 3) Configure environment (see [Configuration](#configuration))

### 4) Run locally

**Web app**

bash
cd novella-app
npm run dev   # or: npm start (see package.json scripts)


**Backend (optional)**

bash
cd novella-backend
npm run dev   # or: npm start


---

## Configuration

Novella requires at least one AI provider API key for the **Amora** chatbot to generate responses.

### Quick setup

From the `novella-app/` directory:

bash
cp .env.example .env
# then open .env and add at least one API key


### Environment Variables

|                      Variable |   Required  | Provider / Notes                                            |
| ----------------------------: | :---------: | :---------------------------------------------------------- |
|    `REACT_APP_OPENAI_API_KEY` | Recommended | OpenAI (ChatGPT) — optional if another provider is provided |
| `REACT_APP_ANTHROPIC_API_KEY` | Recommended | Anthropic (Claude)                                          |
|    `REACT_APP_GEMINI_API_KEY` | Recommended | Google Gemini                                               |

> **Note:** Amora will prefer the first available provider key in the order you configure. For local testing you can set a dummy key but some AI features may not work without a valid key.

### `.env.example`

env
# Example .env for novella-app
REACT_APP_OPENAI_API_KEY=
REACT_APP_ANTHROPIC_API_KEY=
REACT_APP_GEMINI_API_KEY=

# Optional flags
REACT_APP_DISABLE_MOOD_CUES=false
REACT_APP_ENABLE_GHOST_GLIMPSE=true


---

## Privacy & Safety

Privacy and consent are core to Novella's design:

1. **Consent by default** — Heart Sync, Voice Mood, and any biological signals are strictly opt-in.
2. **On-device processing first** — Wherever possible, raw signals (audio, BPM) are processed on-device and only categorical labels (e.g., `calm`, `energetic`) are shared if the user consents.
3. **Ephemeral media** — Ghost Glimpse is designed to be ephemeral (one view). Server-side policies should use short-lived signed URLs and immediate deletion where possible.
4. **User controls** — Users can block/report, toggle all cues, export/delete data, and fully disable analytics.
5. **Security** — TLS in transit, encryption at rest for sensitive fields, and minimized logging of personally-identifying signals.
6. **Transparency** — Include a clear `PRIVACY.md` that documents retention windows, processors, and third-party services.

---

## FAQ

**Q: Does Heart Sync share my raw heartbeat?**

text
No. With consent, Novella reads BPM from a wearable but only uses derived visuals or categorical signals in the UI — raw BPM streams are not transmitted.


**Q: Is Voice Mood recording me?**

text
No. Mood analysis is intended to run on-device. If labels are sent, they should be categorical only (e.g., calm, excited).


**Q: Can I disable analytics or cues?**

text
Yes — provide toggles so users can disable mood/heartbeat cues entirely.


**Q: What happens to Ghost Glimpse after viewing?**

text
It fades after a single view. Server-side deletion, signed URLs with short TTLs, and reporting tools are recommended.
Note: users can still screenshot or externally capture content — provide reporting & moderation flows.


---

## Contributing & Notes

text
- Use RUN_GUIDE.md for developer run notes and local seeds.
- Store long-form privacy & security details in PRIVACY.md.
- Keep prototypes (*.html) lightweight so contributors can play without a build step.


---

## License

text
This project is released under the MIT License — see the LICENSE file for details.


---

*Made with ❤ — grow responsibly.*


```
