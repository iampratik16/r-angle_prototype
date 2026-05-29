# MASTER PROMPT FOR CLAUDE CODE
## R Angle — AI-Powered Sales Monitoring Model (Interactive Prototype)

> **How to use this file:** Paste everything below the line into Claude Code as a single prompt. It is written to be self-contained, unambiguous, and buildable in one pass. Build the project in the order listed in Section 12 so nothing breaks.

---

## 0. ROLE & GOAL

You are a senior frontend engineer + product designer. Build a **fully clickable, demo-ready prototype** of an AI-powered **Sales Monitoring Model** for a client called **R Angle** (a "live space" / interior-design company based in Odisha, India, expanding state-wide).

This prototype will be shown live in a client meeting **tomorrow** to win project sign-off. It must:

1. Visually demonstrate **every component** of the proposed AI sales strategy (listed in Section 4) so the client clearly understands how the end system will work.
2. Feel like a **real, production-grade SaaS product** — not a wireframe. Professional, confident, polished.
3. Run **entirely on dummy data** (no backend, no real APIs, no auth). All "AI" behavior is simulated with scripted/timed logic and realistic mock data.
4. Build and run **with zero errors** on the first `npm run dev`.

**The single most important screen is the Live Call Monitoring & Sentiment Tracking module (Section 8). Treat it as the hero of the demo and give it the most polish, animation, and realism.**

---

## 1. TECH STACK (use exactly this — it is reliable and avoids build errors)

- **Vite + React 18** (JavaScript, not TypeScript — keep it simple and error-free)
- **Tailwind CSS** for all styling
- **lucide-react** for icons
- **recharts** for all charts/graphs
- **framer-motion** for animations (live meters, transitions, number tickers)
- **react-router-dom** for navigation between modules
- No backend. No database. No external network calls. Everything is local mock data + simulated logic.

Setup steps:
```bash
npm create vite@latest rangle-sales-monitor -- --template react
cd rangle-sales-monitor
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react recharts framer-motion react-router-dom
```
Configure Tailwind (`content` globs, base directives in `index.css`). Verify `npm run dev` runs cleanly before writing feature code.

---

## 2. DESIGN SYSTEM (professional, premium SaaS look)

**Aesthetic:** Modern enterprise analytics dashboard — think Linear / Vercel / a premium CRM. Clean, confident, lots of whitespace, soft shadows, rounded corners (rounded-xl/2xl), subtle borders, no clutter.

**Theme:** Light theme by default with an optional dark sidebar. Avoid generic flat blue everywhere.

**Color palette (define as CSS variables / Tailwind theme):**
- Primary brand: deep indigo/navy `#1E2761` (use for sidebar, headers, primary buttons)
- Accent: electric teal `#02C39A` (positive states, CTAs, active highlights)
- Background: `#F7F8FA` app canvas, `#FFFFFF` cards
- Text: `#0F172A` headings, `#475569` body, `#94A3B8` muted
- **Sentiment semantic colors (used consistently everywhere):**
  - Positive → green `#16A34A`
  - Neutral → amber `#F59E0B`
  - Negative → red `#DC2626`
- Score/heat: cold→hot gradient from `#3B82F6` (blue) → `#F59E0B` (amber) → `#DC2626`/`#16A34A` as appropriate.

**Typography:** Use `Inter` (or system sans). Big bold numbers for KPIs (text-3xl/4xl, font-bold), small uppercase tracking-wide labels for captions.

**Components to build as reusable React components:**
- `<StatCard>` — big number, label, delta chip (▲/▼ %), small icon in a colored circle.
- `<Card>` — white, rounded-2xl, border, soft shadow, padding.
- `<Badge>` — pill for status/sentiment/source/ICP tier (colored).
- `<ScoreBadge>` — colored 0–10 interest score chip.
- `<Sidebar>` + `<TopBar>` — persistent app shell.
- `<SentimentMeter>` — animated gauge/bar (hero component, see Section 8).
- `<ProgressRing>` / `<MiniSparkline>` for compact metrics.

**Motion:** Subtle fade/slide on mount (framer-motion), animated number count-ups on KPIs, smooth transitions on the live meter. Nothing gaudy.

---

## 3. APP SHELL & NAVIGATION

Persistent left **sidebar** (R Angle logo/wordmark at top — just stylized text "R∆ Angle" + tagline "AI Sales Intelligence") with nav items, and a top bar showing the page title, a fake global search, a "Live: 3 calls active" pulse indicator, and a user avatar ("Ar. Ratan Agarwal — Founder").

**Sidebar navigation (each is a route/page):**
1. **Dashboard** (Overview) — `/`
2. **Lead Intelligence** (ICP & Segmentation) — `/leads`
3. **Intent Scoring Engine** — `/scoring`
4. **🔴 Live Call Monitoring** — `/live` *(visually emphasized in the sidebar with a pulsing red dot / "LIVE" badge)*
5. **Pitch Guidance & CRM** — `/pitch`
6. **Performance & Incentives (ISM)** — `/performance`
7. **Founder Control Layer** — `/founder`
8. **Implementation Roadmap** — `/implementation`

Highlight the active route. Make the **Live Call Monitoring** item stand out (it's the centerpiece).

---

## 4. STRATEGY COMPONENTS THAT MUST ALL APPEAR (source of truth — do not omit any)

This prototype is derived from the client's approved strategy deck. **Every item below must be visibly represented in the UI.** Use this as a checklist.

**A. Company & Workflow context**
- R Angle = Odisha live-space company, expanding statewide.
- Integrated tech stack to display as "Connected Systems": **Dezylo & Project Studio** (Project Mgmt), **Privyr & AI Sensi/WhatsApp** (Lead Mgmt), **Tranzact** (Financial, API-enabled).
- Current 5-stage sales workflow: (1) Lead Generation [Facebook, WhatsApp, LinkedIn → Privyr] → (2) Sales Team Follow-Up → (3) Site-Visit Customers [₹500 collected → qualified → visit scheduled] → (4) No-Site-Visit Customers [budget-focused → 2–3 site options → budget calculator] → (5) Design Phase [budget approval → Design Team → advance collection → 99% conversion].

**B. The core problem (must be shown as the "why")**
- Founder achieves **100% lead conversion**; sales team operates at **4% (25:1 lead-to-conversion ratio)**.
- Pain points: sales-team dependency, objection-handling gap, inability to communicate USPs, need for automated + monitored process.

**C. ICP & Lead Segmentation**
- Lead segregation via interaction analysis + ICP matching.
- ICP / Hot Lead definition: **LinkedIn users, Semi-HNIs, married couples aged 25–30+**.
- Smart routing: high-value leads → senior team; others → sales reps.

**D. Intent Scoring Engine**
- Interest Score range **0–10**.
- Routing rule: **Score > 5 → Team Leaders & Managers**; **Score < 5 → Sales Team & Telecallers**.
- Scoring inputs: **sentiment analysis (NLP), call-duration tracking, site-visit payment (₹500) signal, interest level**.

**E. Real-Time Monitoring & Dynamic Adjustment** ⭐
- AI live call monitoring with **real-time sentiment analysis (positive / neutral / negative)**.
- Dynamic score updates: **positive sentiment + longer calls automatically increase the Interest Score**.
- Call-duration tracking as an engagement/commitment signal.
- Negative sentiment **instantly triggers CRM-suggested corrective responses**.

**F. Sales CRM with Live Pitch Guidance**
- AI recommends optimal phrases **during the call**.
- Visual feedback: **RED box = suggested phrase NOT used** by salesperson; **GREEN box = correct phrase spoken → score increases**.
- Each correct usage increases Interest Score & conversion probability.
- **Escalation logic:** rep ignores recommendations → escalate; unresolved objections → escalate; lead routed to **Ar. Ratan Agarwal (Founder)**; zero loss of premium opportunities.

**G. Performance Tracking & Incentive Model**
- Flow: AI Pitch Generation → Live Listening → Compliance Tracking (spoken words vs AI pitch) → Performance Routing.
- Performance routing: **high compliance → "cream" leads + incentives**; **low compliance → corrective action + low-quality leads**.
- **ISM (Individual Sales Metric)** scoring: points updated per call and over time; benchmarked against **team average**, **best performer**, and **real-time metrics**.

**H. Founder Control Layer**
- **Founder defines → AI enforces** for: Pitch Structure, Problem-Solving Logic, Upselling Strategy.
- AI Managed Services team: **AI Strategist** (audit & solution design), **ML Engineer** (model building & deployment), **Data Engineer** (pipeline & integration).
- Expected impact: **30% productivity gains** across departments, **25% revenue growth** via AI-driven insights.

---

## 5. DUMMY DATA (create a single `src/data/mockData.js`)

Create realistic Indian/Odisha-context mock data. Suggested volumes: ~40 leads, 6 sales reps, 3 team leaders, 1 founder. Use ₹ currency. Examples of fields:

**Leads** (array of ~40):
```
{
  id, name (realistic Indian names),
  source: "LinkedIn" | "WhatsApp" | "Facebook",
  icpTier: "Hot" | "Warm" | "Cold",
  icpReason: e.g. "LinkedIn user, Semi-HNI, married couple 28",
  interestScore: 0–10 (float ok),
  sentimentTrend: "positive" | "neutral" | "negative",
  stage: "Lead Gen" | "Follow-Up" | "Site Visit" | "No-Visit/Budget" | "Design Phase",
  sitePaid: boolean (₹500 signal),
  budget: ₹ range,
  assignedTo: rep or team-leader name,
  routedTo: "Senior Team" | "Sales Rep",
  lastCallDuration: seconds,
  conversionProbability: %,
}
```

**Sales Reps / Team** (array):
```
{ id, name, role: "Telecaller" | "Sales Rep" | "Team Leader" | "Founder",
  ismScore, complianceRate %, callsToday, avgSentiment, conversionRate %,
  tier: "Top Performer" | "On Track" | "Needs Coaching", incentiveEarned ₹ }
```
Include **Ar. Ratan Agarwal — Founder** with 100% conversion (escalation target). Make team reps average ~4% conversion so the founder-vs-team gap from the strategy is visible.

**Call transcript script** (for the live demo — see Section 8): a scripted array of ~14–18 conversation turns between a Sales Rep and a Customer about an interior/live-space project, each turn tagged with sentiment, a score delta, and (where relevant) an AI-suggested phrase + whether the rep "used" it.

**KPI / time-series data** for charts (sentiment distribution over week, conversion funnel counts, ISM trend lines, score distribution histogram).

Keep all numbers internally consistent with the strategy (e.g., founder 100%, team ~4%, 99% design-phase conversion, 30% productivity / 25% revenue impact).

---

## 6. MODULE 1 — DASHBOARD (Overview) `/`

The executive command center. Sections top-to-bottom:

1. **Header strip:** "R Angle — AI Sales Command Center", date, "All systems connected" status.
2. **KPI row (StatCards with animated count-up):** Total Active Leads, Hot Leads (ICP-matched), Avg Interest Score, Today's Conversion %, Active Live Calls, Escalations Today.
3. **The Problem, Visualized** — a side-by-side comparison card: **Founder 100% conversion** vs **Sales Team 4% (25:1 ratio)**. Use a bold contrast visual (two big rings/bars). Caption: "Why R Angle needs AI-driven monitoring." This sells the project.
4. **Sales Pipeline / Workflow funnel** — the 5-stage workflow (Lead Gen → Follow-Up → Site Visit → No-Visit/Budget → Design Phase) as a funnel or stepped flow with counts and the ₹500 + 99%-conversion markers.
5. **Live Sentiment Snapshot** — donut of positive/neutral/negative across today's calls (semantic colors) + a "3 calls live now" link to the Live module.
6. **Connected Systems** — small badges/logos (text) for Dezylo, Project Studio, Privyr, AI Sensi (WhatsApp), Tranzact, each with a green "Connected" dot.
7. **Expected Impact** — two highlighted callouts: **30% Productivity Gains**, **25% Revenue Growth**.

---

## 7. MODULE 2 — LEAD INTELLIGENCE (ICP & Segmentation) `/leads`

- **Filter/segment bar:** by source (LinkedIn/WhatsApp/Facebook), ICP tier (Hot/Warm/Cold), routing, stage, score range.
- **Lead table** (sortable): name, source badge, ICP tier badge, ICP reason, interest ScoreBadge (0–10, colored), sentiment trend, ₹500-paid indicator, routedTo, conversion probability. Row click → side drawer with lead detail + "interaction analysis" mini-timeline.
- **ICP definition card:** clearly state the Hot Lead ICP = "LinkedIn users • Semi-HNIs • Married couples aged 25–30+", with a count of how many current leads match.
- **Smart Routing visual:** a clear two-lane split graphic — "High-value leads → Senior Team" vs "Others → Sales Reps" — with live counts.
- **Segmentation chart:** breakdown of leads by source and by ICP tier (recharts).

---

## 8. MODULE 3 — 🔴 LIVE CALL MONITORING & SENTIMENT TRACKING `/live`  ⭐ HERO SCREEN

> **This is the most important screen in the entire prototype. Spend the most effort here. It must feel genuinely "live" and impressive.** It demonstrates strategy components **E and F** together.

### 8.1 Layout
A real-time "live call cockpit". Three zones:

**LEFT — Call Context Panel**
- Active customer card (name, ICP tier, source, budget, stage).
- Sales rep on the call (name, role, today's compliance %).
- **Call duration timer** ticking up live (mm:ss), with a label "Engagement signal: longer call → higher interest."

**CENTER — Sentiment + Transcript (the star)**
- **Big animated SENTIMENT METER at the top** — the dominant visual. A smooth gauge or horizontal segmented bar that moves in **real time** between Negative (red) ↔ Neutral (amber) ↔ Positive (green) as the call "progresses." Show the current sentiment label large and bold, color-coded. Animate transitions smoothly with framer-motion.
- **Live sentiment timeline / sparkline** under the meter showing how sentiment has moved across the call so far (a line that grows as the call plays).
- **Live transcript feed** below: conversation turns appear one-by-one on a timer (simulate real-time), each bubble color-tinted by its sentiment (green/amber/red left border). Auto-scroll to newest.

**RIGHT — Live Interest Score + AI Pitch Guidance**
- **Live Interest Score (0–10)** big number with a progress ring, updating as the call plays. When positive sentiment + longer duration occur, the score visibly **ticks up** with a small "+0.4" animation. This directly demonstrates "positive sentiment + longer calls automatically increase Interest Score."
- **Routing indicator:** shows whether current score crosses the **>5 → Senior Team** threshold; animate the badge flipping from "Sales Rep" to "Senior Team / Team Leader" if it crosses 5.
- **AI Live Pitch Guidance panel** (component F):
  - The AI surfaces a **suggested phrase** at relevant moments ("Recommended: 'Our in-house design team guarantees on-time delivery — that's our core USP.'").
  - **GREEN box** when the rep speaks the recommended phrase correctly → show "✓ Phrase used — Score +0.5" and bump the score.
  - **RED box** when the rep **ignores/misses** the suggested phrase → "✗ Suggested phrase not used" + a subtle warning.
  - On **negative sentiment**, instantly surface a **corrective response suggestion** (component E) in a highlighted alert ("Customer hesitant on price → suggest: 'Let me show you our flexible budget calculator…'").

### 8.2 The simulation engine (how to make it feel live)
- Drive the whole screen from the **scripted transcript array** in mockData. On a timer (e.g., every 2.5s), advance to the next turn:
  - Append the turn to the transcript, update the sentiment meter to that turn's sentiment, push a point to the sentiment timeline, apply that turn's score delta to the live Interest Score, increment call duration, and trigger any GREEN/RED pitch-guidance event or corrective alert attached to that turn.
- Add **Play / Pause / Restart** controls and a "▶ Simulate live call" button so the presenter can start it on cue during the meeting. Optionally a speed toggle (1x/2x).
- Script the call to tell a story: starts neutral → customer raises a price objection (sentiment dips to negative, AI fires a corrective suggestion) → rep uses the recommended phrase (GREEN box, score rises) → at one point rep ignores a suggestion (RED box) → customer warms up (sentiment turns positive, duration long, score crosses 5) → **routing flips to Senior Team** → an **escalation event** triggers near the end.

### 8.3 Escalation (component F)
- An **"Escalate to Founder" flow**: if the rep ignores recommendations or an objection stays unresolved, show an animated alert → "Escalating to Ar. Ratan Agarwal (Founder) — premium opportunity protected." Include a small toast/notification. This proves "zero loss of premium opportunities."

### 8.4 Other live calls
- A small list/tabs of "Other active calls (2)" the presenter can switch to, each with its own mini sentiment state — reinforces that monitoring is fleet-wide, not a single call.

**Make this screen unmistakably the highlight: largest sentiment visual, smoothest animation, clearest cause-and-effect between sentiment → score → routing → escalation.**

---

## 9. MODULE 4 — PITCH GUIDANCE & CRM `/pitch`

Static/explanatory companion to the live screen (component F, the CRM view):
- **Pitch library:** founder-approved pitches & objection-handling scripts (cards), each with the "correct phrase," the USP it communicates, and the score impact.
- **Red/Green legend demonstration:** a clear explainer card showing the GREEN box (correct phrase spoken → score increases) vs RED box (suggested phrase not used) with example states.
- **Escalation rules card:** the three escalation triggers (rep ignores recommendations / unresolved objection / premium lead) → routed to Ar. Ratan Agarwal.
- **Recent guidance events table:** per-call log of which suggested phrases were used vs missed, with rep names and resulting score deltas.

---

## 10. MODULE 5 — PERFORMANCE & INCENTIVES (ISM) `/performance`

Demonstrates component G.

- **AI Pitch → Live Listening → Compliance → Routing** shown as a 4-step horizontal process flow with icons.
- **ISM Leaderboard table:** reps ranked by **ISM score**, with compliance %, calls today, avg sentiment, conversion %, tier badge (Top Performer / On Track / Needs Coaching), incentive earned (₹).
- **Performance Routing visual:** two lanes — **High compliance → "Cream" leads + Incentives** (green) vs **Low compliance → Corrective action + Low-quality leads** (red). Map each rep into a lane.
- **Benchmark comparison chart:** each rep's ISM vs **team average** vs **best performer** (recharts bar or radar).
- **ISM trend line:** ISM over time for a selected rep (improvement after coaching).
- Reinforce the founder-vs-team gap (100% vs ~4%) as the baseline the system is closing.

---

## 11. MODULE 6 — FOUNDER CONTROL LAYER `/founder`  +  MODULE 7 — IMPLEMENTATION `/implementation`

**Founder Control Layer (component H):**
- Three "Founder defines → AI enforces" editable-looking cards: **Pitch Structure**, **Problem-Solving Logic**, **Upselling Strategy**. Show founder-entered rules on the left and "AI enforces across N reps" on the right with a toggle (Active/Enforced). Make them look configurable (text areas / toggles) even though it's mock.
- A line conveying: "The founder's 100%-conversion playbook, scaled to the entire team via AI."

**Implementation Roadmap (`/implementation`):**
- **AI Managed Services team** cards: **AI Strategist** (audit & solution design), **ML Engineer** (model building & deployment), **Data Engineer** (pipeline & integration).
- A simple **phased timeline** (e.g., Phase 1 Data & Integration → Phase 2 Scoring & Sentiment Models → Phase 3 Live Guidance & CRM → Phase 4 Optimization) — purely illustrative.
- **Expected Impact** callouts again: **30% productivity**, **25% revenue growth**.

---

## 12. BUILD ORDER (follow exactly to avoid errors)

1. Scaffold Vite+React, install deps, configure Tailwind, confirm `npm run dev` runs.
2. Build the design-system primitives (`Card`, `StatCard`, `Badge`, `ScoreBadge`, layout `Sidebar`+`TopBar`) and the theme/colors.
3. Create `src/data/mockData.js` with all datasets + the scripted call transcript.
4. Wire `react-router-dom` with all 8 routes and a working sidebar.
5. Build Dashboard.
6. Build Lead Intelligence, then Intent Scoring Engine.
7. **Build the Live Call Monitoring screen (Section 8) — give it the most time and polish.**
8. Build Pitch Guidance, Performance/ISM, Founder Control, Implementation.
9. Final pass: responsive layout, consistent spacing, animated count-ups, verify no console errors/warnings.

---

## 13. INTENT SCORING ENGINE `/scoring` (detail for step 6)

- **Score formula explainer card:** Interest Score (0–10) = weighted blend of **sentiment (NLP)**, **call duration**, **₹500 site-visit payment signal**, and **interest level**. Show the weights visually (stacked bar / contribution breakdown per lead).
- **Routing threshold visual:** a 0–10 scale with a line at **5** — above → "Team Leaders & Managers", below → "Sales Team & Telecallers". Plot current leads as dots on the scale.
- **Score distribution histogram** of all leads (recharts).
- **Interactive lead picker:** select a lead → see its score breakdown and where it routes.

---

## 14. ACCEPTANCE CRITERIA (must all be true)

- [ ] `npm install` then `npm run dev` runs with **no errors and no red console warnings**.
- [ ] All 8 routes load and the sidebar navigates between them; active route highlighted; Live item visually emphasized.
- [ ] **Every checklist item in Section 4 (A–H) is visibly represented** somewhere in the UI.
- [ ] The **Live Call Monitoring** screen plays a simulated call where: sentiment meter moves in real time; transcript streams; Interest Score updates live; positive sentiment + duration raise the score; a negative moment fires a corrective suggestion; GREEN (phrase used) and RED (phrase missed) boxes both appear; score crossing 5 flips routing to Senior Team; an escalation to **Ar. Ratan Agarwal** triggers.
- [ ] Founder 100% vs Team 4% (25:1) contrast appears on the Dashboard.
- [ ] ISM leaderboard, compliance, and cream-vs-corrective routing appear in Performance.
- [ ] 30% productivity / 25% revenue impact appear.
- [ ] UI looks like a premium SaaS product: consistent spacing, rounded cards, soft shadows, semantic sentiment colors, animated KPIs. No placeholder "lorem ipsum", no broken images, no overflowing text.
- [ ] Entirely offline — no real network/API calls.

---

## 15. NOTES & GUARDRAILS FOR YOU (Claude Code)

- Prefer simple, robust React patterns (functional components, hooks, `useState`/`useEffect`/`useRef` for the simulation timer). Clean up timers on unmount.
- Keep all simulated "AI" logic transparent and deterministic from the scripted data — do not attempt real ML or real network calls.
- If a library import would risk a build error, choose the simpler reliable option; **a clean-building impressive demo beats a fancy broken one.**
- Use realistic Indian names, ₹ amounts, and Odisha context throughout.
- Add a tiny "Prototype — demo data" tag in the footer/topbar so the client knows it's illustrative.
- Comment the simulation engine clearly so it can be tweaked live if needed.

**Begin now. Build the complete project, then print the run command and a short summary of what was built, module by module, and explicitly confirm each Section 4 component is present.**
