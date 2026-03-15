# 🚀 ProPost Assistant — Professional Post Assistant Maker

> **VS Code Copilot Builder Prompt & Full Project Guide**
> 
> A Chrome Extension that connects Gmail + LinkedIn with AI to auto-generate professional posts, curate domain-specific trends, and guide career decisions — with zero manual effort.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [VS Code Copilot Builder Prompt](#vs-code-copilot-builder-prompt)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [API Keys & OAuth Setup](#api-keys--oauth-setup)
- [Hackathon Demo Flow](#hackathon-demo-flow)
- [Roadmap / Future Features](#roadmap--future-features)

---

## 📌 Project Overview

**ProPost Assistant** is a Chrome Extension that eliminates the #1 pain point for working professionals:

> *"I got a certificate / finished a project / learned something new — but I never post it on LinkedIn because it's too much effort."*

The extension:
1. **Reads your Gmail** → detects achievements (certificates, completions, awards)
2. **Uses AI** → writes a polished, emoji-rich LinkedIn post with hashtags
3. **Posts to LinkedIn** → 1-click, done
4. **Curates a daily trend digest** → shows what top people in your domain are saying
5. **Guides career decisions** → "Should I follow this trend or skip it? Here's why."

**Target users:** IT professionals, government sector employees, business/startup people in India and globally.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Chrome Extension Popup                       │
│         Dashboard · Compose · Digest · Post 1-click             │
└──────────────┬────────────────────────────┬────────────────────┘
               │                            │
    ┌──────────▼──────────┐    ┌────────────▼──────────┐
    │   Post Generator    │    │     Trend Digest       │
    │  Email → post draft │    │   TL;DR · path advice  │
    └──────────┬──────────┘    └────────────┬──────────┘
               │                            │
               └──────────┬─────────────────┘
                          │
              ┌───────────▼────────────┐
              │     AI Core            │
              │  (Claude / GPT-4o)     │
              │  Summarise · Write     │
              │  Rank · Decide         │
              └─────┬─────────┬────────┘
                    │         │
       ┌────────────▼──┐  ┌───▼───────────────┐
       │  Gmail OAuth  │  │  LinkedIn OAuth    │
       │  Read + parse │  │  Post + read feed  │
       └───────────────┘  └────────────────────┘
                    │         │
       ┌────────────▼──┐  ┌───▼───────────────┐
       │Domain Selector│  │   Trend Feed       │
       │IT · Gov · Biz │  │Famous people·posts │
       └───────────────┘  └────────────────────┘
```

**Data flow:**
1. Gmail OAuth → fetch emails → AI detects achievement keywords
2. AI Core generates post draft with emojis + hashtags
3. User reviews → 1-click post to LinkedIn
4. LinkedIn OAuth + NewsAPI → Trend digest filtered by selected domain
5. AI summarises trends → Decision guide (follow vs skip)

---

---

```

"ProPost Assistant" — a Professional Post Assistant Maker.

=== PROJECT GOAL ===
A Chrome Extension (Manifest V3) that:
1. Authenticates with Gmail (Google OAuth 2.0) and LinkedIn (OAuth 2.0)
2. Reads Gmail inbox to detect achievement emails (certificates, completions, awards)
3. Uses Claude AI (claude-sonnet-4-6 via Anthropic API) to generate polished LinkedIn posts
4. Posts or copies the generated content to LinkedIn
5. Shows a daily trend digest of domain-specific content (IT / Government / Business)
6. Provides a career decision guide: "Should I follow this trend?"

=== ARCHITECTURE ===
- Chrome Extension (Manifest V3) — React + Vite frontend for the popup
- Node.js + Express backend (deployed to Railway or Render free tier)
- Anthropic Claude API for AI post generation
- Gmail API (Google OAuth) for reading emails
- LinkedIn API (OAuth 2.0) for posting
- NewsAPI.org + RSS for trend feed
- Supabase (free tier) for storing user preferences and achievement history

=== FOLDER STRUCTURE TO GENERATE ===

propost-assistant/
├── extension/                    # Chrome Extension (Manifest V3)
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/ (icon16.png, icon48.png, icon128.png)
│   ├── src/
│   │   ├── popup/
│   │   │   ├── App.jsx           # Main popup app (3 tabs: Compose, Digest, Timeline)
│   │   │   ├── tabs/
│   │   │   │   ├── ComposeTab.jsx     # Achievement → post draft UI
│   │   │   │   ├── DigestTab.jsx      # Trend digest UI
│   │   │   │   └── TimelineTab.jsx    # Achievement history
│   │   │   └── components/
│   │   │       ├── PostCard.jsx       # Generated post with copy/post buttons
│   │   │       ├── TrendCard.jsx      # Single trend item with decision guide
│   │   │       ├── DomainSelector.jsx # IT / Gov / Business multi-select
│   │   │       ├── ToneSelector.jsx   # Formal / Humble brag / Storytelling
│   │   │       └── PostScore.jsx      # Engagement score 0-100
│   │   ├── background/
│   │   │   └── service-worker.js     # Background tasks, OAuth token refresh
│   │   ├── content/
│   │   │   └── content-script.js     # Injected into LinkedIn for auto-fill
│   │   └── utils/
│   │       ├── gmail.js              # Gmail API calls
│   │       ├── linkedin.js           # LinkedIn API calls
│   │       ├── ai.js                 # Calls to backend AI endpoint
│   │       └── auth.js               # Chrome identity API OAuth flow
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── index.js              # Express app entry point
│   │   ├── routes/
│   │   │   ├── ai.js             # POST /api/generate-post
│   │   │   ├── digest.js         # GET /api/digest?domain=IT
│   │   │   ├── gmail.js          # POST /api/gmail/achievements
│   │   │   └── linkedin.js       # POST /api/linkedin/post
│   │   ├── services/
│   │   │   ├── claudeService.js       # Anthropic API integration
│   │   │   ├── gmailService.js        # Gmail API parsing
│   │   │   ├── linkedinService.js     # LinkedIn API posting
│   │   │   ├── trendService.js        # NewsAPI + RSS aggregation
│   │   │   └── scoreService.js        # Post engagement scoring
│   │   └── middleware/
│   │       ├── auth.js           # Token validation
│   │       └── rateLimiter.js    # API rate limiting
│   ├── .env.example
│   └── package.json
│
├── README.md
└── .gitignore

=== MANIFEST V3 (extension/public/manifest.json) ===
Generate manifest.json with:
- manifest_version: 3
- permissions: ["identity", "storage", "activeTab", "scripting"]
- host_permissions: ["https://mail.google.com/*", "https://www.linkedin.com/*", 
  "https://api.anthropic.com/*", "https://newsapi.org/*"]
- background service worker
- action popup pointing to index.html
- OAuth2 config with Google client_id placeholder

=== BACKEND ROUTES TO GENERATE ===

1. POST /api/generate-post
   Body: { emailContent: string, domain: string, tone: "formal"|"humbleBrag"|"storytelling", userBio: string }
   - Call Claude API with this system prompt:
     "You are a LinkedIn post expert for professionals in {domain}. 
      Generate a {tone} post from this achievement email. 
      Rules: 
      - Start with a strong hook line
      - Use 2-3 relevant emojis naturally in the text
      - Write 150-300 words
      - Add a line about lessons learned or impact
      - End with a question to drive engagement
      - Add 10-15 trending hashtags at the end
      - Format hashtags on a new line after the post body"
   - Return: { post: string, hashtags: string[], score: number }

2. GET /api/digest
   Query: domain (IT|Government|Business), limit (default 5)
   - Fetch from NewsAPI with domain-specific keywords:
     IT: "software engineering AI machine learning cybersecurity cloud"
     Government: "public policy digital india government scheme"  
     Business: "startup funding entrepreneurship market trends"
   - Also fetch from curated RSS feeds per domain
   - Call Claude to summarise each item in 2 sentences
   - Return: { items: [{ title, summary, url, source, decisionGuide: { shouldFollow: boolean, reason: string, effort: "low"|"medium"|"high", benefit: "low"|"medium"|"high" } }] }

3. POST /api/gmail/achievements
   Body: { accessToken: string }
   - Use Gmail API with search query: 
     "subject:(certificate OR completed OR congratulations OR achievement OR awarded OR passed) newer_than:30d"
   - Parse top 10 emails
   - Return: { achievements: [{ subject, from, date, snippet, emailId }] }

4. POST /api/linkedin/post  
   Body: { accessToken: string, postText: string }
   - Use LinkedIn Share API to post
   - Fallback: return a LinkedIn intent URL that pre-fills the post text
   - Return: { success: boolean, postUrl?: string, intentUrl: string }

5. GET /api/score
   Query: postText
   - Score the post 0-100 based on:
     hasEmoji (20pts), hasQuestion (15pts), hasHashtags (15pts), 
     wordCount 150-300 (20pts), hasHook (15pts), hasMention (15pts)
   - Return: { score: number, breakdown: object, tips: string[] }

=== FRONTEND POPUP (extension/src/popup/App.jsx) ===
Build a clean popup (400px wide, 580px tall) with:
- Header: ProPost logo + user avatar (from LinkedIn profile)
- Tab bar: 📝 Compose | 📰 Digest | 📅 Timeline
- Bottom: Settings icon

ComposeTab:
- "Scan Gmail" button → calls /api/gmail/achievements → shows list of achievement emails
- User clicks one → AI generates post draft
- Show PostCard with:
  - Generated post text (editable textarea)
  - Tone selector (Formal / Humble Brag / Storytelling) — regenerates on change
  - Post score bar (0-100) with colour: red<40, amber<70, green≥70
  - Emoji toggle (on/off)
  - Hashtags shown as removable chips
  - "Copy Post" button (copies to clipboard)
  - "Post to LinkedIn" button (opens LinkedIn with text pre-filled OR posts via API)

DigestTab:
- Domain selector chips at top (multi-select: IT, Government, Business)
- List of TrendCards, each showing:
  - Source + time ago
  - 2-sentence AI summary
  - Decision guide accordion: "Should you follow this trend?"
    → Shows: Benefit level, Effort level, 2-line reason, recommended action

TimelineTab:
- Chronological list of achievements detected from Gmail
- Each item shows: date, subject, "Draft Post" button
- Empty state: "No achievements yet — click Compose to scan Gmail"

=== CHROME OAUTH FLOW (extension/src/utils/auth.js) ===
Use chrome.identity.launchWebAuthFlow for both Google and LinkedIn:
- Google: scope = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile"
- LinkedIn: scope = "r_liteprofile r_emailaddress w_member_social"
- Store tokens in chrome.storage.local
- Auto-refresh Google token using chrome.identity.getAuthToken

=== AI PROMPT ENGINEERING (claudeService.js) ===
Use model: "claude-sonnet-4-6"
max_tokens: 1000

For post generation, build the prompt dynamically:
- Inject domain, tone, user's 2-line bio, email subject + snippet
- Add few-shot example of a good LinkedIn post for that tone
- Temperature: 0.8 for creative tones, 0.5 for formal

For trend decision guide:
- Prompt: "Given this trend in {domain}: '{trendTitle}'. 
  Respond in JSON: { shouldFollow: boolean, reason: string (max 30 words), 
  benefit: 'low'|'medium'|'high', effort: 'low'|'medium'|'high', 
  alternativePath: string (max 20 words) }"

=== STYLING ===
Use TailwindCSS for the popup UI.
Colour palette:
- Primary: #0A66C2 (LinkedIn blue)
- Secondary: #00A0DC  
- Success: #057642
- Warning: #B24020
- Background: #F3F2EF (LinkedIn off-white)
- Dark mode support via Tailwind dark: prefix

=== POST SCORE ALGORITHM (scoreService.js) ===
function calculatePostScore(postText) {
  let score = 0;
  const tips = [];
  
  // Emoji check (20 pts)
  const emojiRegex = /\p{Emoji}/gu;
  const emojiCount = (postText.match(emojiRegex) || []).length;
  if (emojiCount >= 2 && emojiCount <= 5) score += 20;
  else tips.push("Add 2-3 emojis for better engagement");
  
  // Question at end (15 pts)
  if (/\?[^?]*$/.test(postText)) score += 15;
  else tips.push("End with a question to drive comments");
  
  // Hashtags (15 pts)
  const hashtagCount = (postText.match(/#\w+/g) || []).length;
  if (hashtagCount >= 8) score += 15;
  else tips.push("Add at least 8 relevant hashtags");
  
  // Word count 150-300 (20 pts)
  const wordCount = postText.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 300) score += 20;
  else tips.push(`Ideal length: 150-300 words (yours: ${wordCount})`);
  
  // Strong hook (15 pts) — first line under 12 words, punchy
  const firstLine = postText.split('\n')[0];
  if (firstLine.split(' ').length <= 12) score += 15;
  else tips.push("Shorten your first line to under 12 words for a stronger hook");
  
  // Personal story signal (15 pts)
  const storyWords = ['I ', 'my ', 'we ', 'our ', 'learned', 'realized', 'excited'];
  if (storyWords.some(w => postText.toLowerCase().includes(w))) score += 15;
  else tips.push("Add a personal touch — use 'I' or 'my' to make it relatable");
  
  return { score, tips };
}

=== ACHIEVEMENT EMAIL DETECTION (gmailService.js) ===
Keywords to search Gmail for:
Primary: certificate, completed, congratulations, achievement, awarded, passed, finished
Secondary: badge, credential, certification, course, milestone, promotion, hackathon

Parse email to extract:
- Achievement title (from subject)
- Issuing organisation (from sender name / email domain)
- Date
- Any URLs to certificate images or credential pages

=== ENV VARIABLES (.env.example) ===
# AI
ANTHROPIC_API_KEY=your_key_here

# Google
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# LinkedIn  
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=https://your-backend.railway.app/auth/linkedin/callback

# News
NEWSAPI_KEY=your_key_here

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_key_here

# Server
PORT=3001
FRONTEND_ORIGIN=chrome-extension://your-extension-id

=== SUPABASE SCHEMA ===
Create these tables in Supabase:

users:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  google_id text UNIQUE
  linkedin_id text UNIQUE  
  name text
  avatar_url text
  domains text[] DEFAULT '{}'   -- selected domains
  created_at timestamptz DEFAULT now()

achievements:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id uuid REFERENCES users(id)
  email_subject text
  email_from text
  email_date date
  generated_post text
  post_score integer
  posted_to_linkedin boolean DEFAULT false
  created_at timestamptz DEFAULT now()

=== DELIVERABLES ===
Generate all files with complete working code.
After generating, provide:
1. Step-by-step setup instructions
2. How to load the extension in Chrome (chrome://extensions → developer mode → load unpacked)
3. How to deploy backend to Railway (one-click deploy command)
4. Hackathon demo script (3-minute walkthrough)

Do not use placeholder comments — write real, working code everywhere.
```

---

## ✨ Features

### Core Features (MVP — Build These First)

| Feature | Description | Priority |
|---|---|---|
| Gmail Achievement Scanner | Auto-detects certificates, completions from inbox | 🔴 P0 |
| AI Post Generator | Writes LinkedIn post from email content | 🔴 P0 |
| Domain Selector | Choose IT / Government / Business (multi-select) | 🔴 P0 |
| 1-Click Post | Copy or post directly to LinkedIn | 🔴 P0 |
| Hashtag Auto-Add | 10-15 trending hashtags added automatically | 🔴 P0 |

### Enhanced Features (Add for Hackathon Wow-Factor)

| Feature | Description | Priority |
|---|---|---|
| Tone Selector | Formal / Humble Brag / Storytelling | 🟡 P1 |
| Post Score (0-100) | Predicted engagement meter with tips | 🟡 P1 |
| Trend Digest | Daily curated insights from domain leaders | 🟡 P1 |
| Decision Guide | "Follow this trend?" with benefit/effort matrix | 🟡 P1 |
| Achievement Timeline | History of all detected achievements | 🟡 P1 |
| Emoji Toggle | Turn emojis on/off in generated post | 🟢 P2 |
| Multi-language | Hindi + English post generation | 🟢 P2 |
| Scheduled Posts | Auto-post at peak engagement times | 🟢 P2 |

---

## 🛠️ Tech Stack

```
Frontend (Extension Popup)
├── React 18 + Vite
├── TailwindCSS (styling)
├── Chrome Extension Manifest V3
└── chrome.identity API (OAuth)

Backend (API Server)
├── Node.js 20 + Express
├── Anthropic SDK (@anthropic-ai/sdk)
├── googleapis (Gmail API)
├── axios (LinkedIn API calls)
├── node-fetch + rss-parser (Trend feed)
└── @supabase/supabase-js

AI & Data
├── Claude claude-sonnet-4-6 (post generation, digest summarisation)
├── Gmail API v1 (email reading)
├── LinkedIn Share API v2 (posting)
├── NewsAPI.org (trend feed)
└── RSS Parser (curated newsletter feeds)

Infrastructure
├── Railway (backend deploy — free tier)
├── Supabase (database + auth — free tier)
└── Chrome Web Store (distribution)
```

---

## 📁 Folder Structure

```
propost-assistant/
├── extension/
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   ├── src/
│   │   ├── popup/
│   │   │   ├── App.jsx
│   │   │   ├── tabs/
│   │   │   │   ├── ComposeTab.jsx
│   │   │   │   ├── DigestTab.jsx
│   │   │   │   └── TimelineTab.jsx
│   │   │   └── components/
│   │   │       ├── PostCard.jsx
│   │   │       ├── TrendCard.jsx
│   │   │       ├── DomainSelector.jsx
│   │   │       ├── ToneSelector.jsx
│   │   │       └── PostScore.jsx
│   │   ├── background/
│   │   │   └── service-worker.js
│   │   ├── content/
│   │   │   └── content-script.js
│   │   └── utils/
│   │       ├── gmail.js
│   │       ├── linkedin.js
│   │       ├── ai.js
│   │       └── auth.js
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── ai.js
│   │   │   ├── digest.js
│   │   │   ├── gmail.js
│   │   │   └── linkedin.js
│   │   ├── services/
│   │   │   ├── claudeService.js
│   │   │   ├── gmailService.js
│   │   │   ├── linkedinService.js
│   │   │   ├── trendService.js
│   │   │   └── scoreService.js
│   │   └── middleware/
│   │       ├── auth.js
│   │       └── rateLimiter.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone and install

```bash
git clone https://github.com/yourusername/propost-assistant.git
cd propost-assistant

# Backend
cd backend && npm install
cp .env.example .env  # Fill in your API keys

# Extension
cd ../extension && npm install
npm run build
```

### 2. Load extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer Mode** (toggle top right)
3. Click **Load unpacked**
4. Select the `extension/dist` folder

### 3. Run backend locally

```bash
cd backend
npm run dev
# Server starts at http://localhost:3001
```

### 4. Deploy backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## 🔑 API Keys & OAuth Setup

### Google (Gmail API)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → Enable Gmail API
3. Credentials → OAuth 2.0 Client ID → Chrome Extension
4. Add your Extension ID as authorised origin
5. Copy `client_id` to `manifest.json` and `.env`

### LinkedIn API
1. Go to [linkedin.com/developers](https://www.linkedin.com/developers)
2. Create app → Request access to `Sign In with LinkedIn` + `Share on LinkedIn`
3. Add redirect URI: `https://your-backend.railway.app/auth/linkedin/callback`
4. Copy Client ID + Secret to `.env`

> ⚠️ **Hackathon shortcut:** LinkedIn posting API requires approval. Use the **intent URL fallback** — it opens LinkedIn compose with your post pre-filled. No API approval needed.
> ```
> https://www.linkedin.com/shareArticle?mini=true&text=YOUR_POST_TEXT
> ```

### Anthropic (Claude AI)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create key
3. Add to `.env` as `ANTHROPIC_API_KEY`

### NewsAPI
1. Go to [newsapi.org](https://newsapi.org) → free account
2. Copy API key to `.env` as `NEWSAPI_KEY`

---

## 🎯 Hackathon Demo Flow

> **3-minute live demo script for judges:**

**Minute 1 — The Problem**
> "Every professional gets certificates, finishes courses, does great work — but never posts about it on LinkedIn. Updating your profile takes 15-20 minutes. ProPost does it in 10 seconds."

**Minute 2 — The Demo**
1. Open extension → click "Scan Gmail"
2. Show list of detected achievement emails (certificate, course completion)
3. Click one → show AI-generated post appearing in real time
4. Show Post Score meter going up as hashtags are added
5. Change tone from Formal → Storytelling → show post rewrite
6. Click "Post to LinkedIn" → LinkedIn opens with post pre-filled

**Minute 3 — The Bonus**
1. Switch to Digest tab → show today's IT / AI trends
2. Expand one trend → show Decision Guide ("Should you follow this? Benefit: High, Effort: Medium")
3. Show Timeline tab → "Your achievement history, ready to post anytime"

---

## 🗺️ Roadmap / Future Features

- [ ] **Scheduled posting** — auto-post achievements at peak LinkedIn engagement times (Tue-Thu 8-10am)
- [ ] **Team mode** — HR teams can auto-generate employee achievement posts
- [ ] **Resume sync** — auto-update LinkedIn Experience section from Gmail
- [ ] **Competitor tracking** — monitor what competitors in your domain are posting
- [ ] **A/B post testing** — generate 2 versions, pick the higher-scoring one
- [ ] **Hindi + Regional language support** — post in your regional language
- [ ] **Mobile companion app** — React Native version for on-the-go posting
- [ ] **Slack / Teams integration** — detect achievements from workplace messages too

---

## 🏆 Why This Wins Hackathons

1. **Real pain, real users** — every LinkedIn user feels this problem
2. **Live demo moment** — judges watch an email become a polished post in seconds
3. **AI + OAuth + Extension** — three impressive tech integrations in one project
4. **Unique angle** — no existing tool combines Gmail detection + domain-specific career guidance
5. **India-relevant** — government sector + IT sector focus speaks to local judges

---

## 📄 License

MIT License — build freely, credit appreciated.

---

## 🤝 Contributing

PRs welcome! Especially for:
- New domain categories (Healthcare, Education, Legal)
- Additional email providers (Outlook, Yahoo)
- Better AI prompt tuning for specific tones

---

*Built with ❤️ for the grind-free professional.*
