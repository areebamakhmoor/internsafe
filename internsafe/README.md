# InternSafe 🔍

**Verify Before You Join.**

InternSafe is an AI-powered internship and job verification platform that gives every company a real-time Trust Score — built from multiple independent signals, not just a blacklist.


---

## The Problem

Fake internships are everywhere in India. Students receive professional-looking offer letters from companies that don't exist, never pay stipends, or disappear after collecting personal documents. There is no reliable, student-focused tool to verify legitimacy before joining.

## The Solution

InternSafe combines 4 independent signals into a single Trust Score (0–100):

| Signal | Weight | What it checks |
|---|---|---|
| 🏛️ MCA Registration | 25% | Official Indian company registration status |
| 🌐 Domain Age | 15% | How long the company's website has existed |
| 💼 LinkedIn Presence | 20% | Verified company page and employee count |
| 👥 Student Reports | 20% | Anonymous reports from other students |

Plus an **AI Offer Letter Analyser** powered by Gemini that scans your offer letter for red flags, missing clauses, and suspicious language.

---

## Features

- ✅ Real-time Trust Score with animated confidence meter
- ✅ Signal-by-signal breakdown with plain-English explanations
- ✅ AI offer letter analysis (paste any offer letter text)
- ✅ Anonymous community reporting system
- ✅ Shareable report URLs
- ✅ 24-hour result caching (no duplicate API calls)
- ✅ Fully responsive — works on mobile

---

## Tech Stack

**Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
**Backend:** Node.js + Express
**Database:** MongoDB Atlas
**AI:** Google Gemini API
**APIs:** MCA India, WHOIS, LinkedIn (via Google)
**Deploy:** Vercel (frontend) + Render (backend)

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Gemini API key (free at aistudio.google.com)

### Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`
Backend runs at `http://localhost:5000`

---

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=...
WHOIS_API_KEY=...
CLIENT_URL=http://localhost:5173
```

---

## Project Structure

```
internsafe/
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── TrustMeter.jsx     # Animated score circle
│       │   ├── SignalCard.jsx     # Individual signal display
│       │   └── OfferAnalyser.jsx  # AI offer letter tool
│       └── pages/
│           ├── Home.jsx           # Search page
│           ├── Result.jsx         # Trust score + signals
│           └── Report.jsx         # Community report form
└── server/                    # Node.js backend
    ├── signals/
    │   ├── mca.js             # MCA registration check
    │   ├── domain.js          # Domain age via WHOIS
    │   ├── linkedin.js        # LinkedIn presence
    │   └── community.js       # Student report aggregation
    ├── routes/
    │   ├── verify.js          # Main verification endpoint
    │   ├── offer.js           # Gemini offer analysis
    │   └── reports.js         # Report submission/fetch
    ├── fusion.js              # Weighted score calculation
    └── index.js               # Express app
```

---

## Assumptions

- MCA API public endpoint may have rate limits — we cache all results for 24 hours
- WHOIS lookup may fail for newly registered domains — graceful fallback to neutral score
- LinkedIn presence is checked via Google search (no official LinkedIn API key required)
- Community reports are anonymous — only a hash of the reporter identifier is stored, never the email itself
- Trust scores are informational only — not legal advice

---

## AI Collaboration

- **Google Gemini** — powers offer letter analysis, red flag extraction, and missing element detection
- **Claude (Anthropic)** — used during architecture planning and code review
- All AI outputs are clearly labelled in the UI

---

## Author

**Areeba Makhmoor**
BCA 5th Semester, GGSIPU
[LinkedIn](https://linkedin.com/in/areebamakhmoor) · [GitHub](https://github.com/areebamakhmoor) · [Portfolio](https://areebamakhmoor.github.io/aurora-trails)
