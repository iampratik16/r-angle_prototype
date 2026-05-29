# R∆ Angle — AI Sales Intelligence

An interactive, demo-ready prototype of an **AI-powered Sales Monitoring Model** for **R Angle**, a "live space" / interior-design company based in Odisha, India, expanding statewide.

It demonstrates the full proposed AI sales strategy — lead intelligence, intent scoring, **live call sentiment monitoring**, pitch guidance, performance/incentive tracking, founder control, and rollout roadmap — as a polished, production-grade SaaS experience.

> **100% offline.** No backend, no database, no real APIs. All "AI" behavior is simulated with scripted, deterministic logic over realistic mock data.

## ✨ Highlights

- **🔴 Live Call Monitoring (hero screen)** — a real-time call cockpit with an animated sentiment meter, streaming transcript, live Interest Score, GREEN/RED pitch-guidance feedback, automatic Sales-Rep → Senior-Team routing, and founder escalation — all driven by a scripted simulation engine with Play / Pause / Restart / speed controls.
- Animated KPIs, soft-shadow cards, semantic sentiment colors, and a premium enterprise-analytics aesthetic.
- Founder **100%** vs Sales-Team **4%** (25:1) conversion gap visualized as the core "why".

## 🧱 Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) (JavaScript)
- [Tailwind CSS](https://tailwindcss.com/) v3
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/) — charts & graphs
- [Framer Motion](https://www.framer.com/motion/) — animations
- [lucide-react](https://lucide.dev/) — icons

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

```bash
npm run build    # production build
npm run preview  # preview the production build
```

## 🗺️ Modules / Routes

| Route | Module |
| --- | --- |
| `/` | Dashboard — executive command center |
| `/leads` | Lead Intelligence — ICP & segmentation |
| `/scoring` | Intent Scoring Engine (0–10) |
| `/live` | **🔴 Live Call Monitoring & Sentiment Tracking (hero)** |
| `/pitch` | Pitch Guidance & CRM |
| `/performance` | Performance & Incentives (ISM) |
| `/founder` | Founder Control Layer |
| `/implementation` | Implementation Roadmap |

## 📁 Project Structure

```
src/
├── components/      # Sidebar, TopBar, SentimentMeter, ui primitives
├── data/mockData.js # all dummy data + scripted live-call transcript
├── lib/utils.js     # formatting & color helpers
├── pages/           # one file per module/route
└── App.jsx          # app shell + routing
```

---

*Prototype — demo data only. Built to illustrate the proposed system.*
