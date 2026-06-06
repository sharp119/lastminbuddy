<div align="center">

# 📘 LastMinBuddy

### Your last-minute exam buddy — study what matters, answer for the marks.

LastMinBuddy turns a pile of past papers into a **ranked "what to study" map**, flags **syllabus blind spots**, and generates **mark-scheme-ready answers** — complete with diagrams, examiner keywords, and sources. Then a **Deep Dive** re-explains anything as simple text, an image, or audio.

[Why it's needed](#-why-its-needed-the-evidence) · [Features](#-features) · [Quickstart](#-quickstart) · [How it works](#-how-it-works) · [Roadmap](#-roadmap)

</div>

---

## 🎯 The problem

Students don't revise the way the science says they should. They **cram** — massed, last-minute study — even though decades of research show that's the least durable way to learn. And when they do sit down, most "studying" is re-reading and highlighting: the *lowest*-utility techniques in the literature.

The highest-leverage things a student under time pressure can do are: **practice on the actual question distribution they'll face**, **rehearse retrieving answers**, and **study worked solutions**. Past papers are the perfect vehicle for all three — but raw PDFs don't tell you *which* topics matter, *how* they're marked, or *how* to answer them.

**LastMinBuddy is the layer that does.**

## 🔬 Why it's needed (the evidence)

> Full citations, links, and limitations are in **[RESEARCH.md](./RESEARCH.md)**.

- **Practice testing is a top-2, highest-utility study technique** — far above re-reading and highlighting. *(Dunlosky et al., 2013, Psychological Science in the Public Interest.)* A meta-analysis of 272 effect sizes puts the benefit of practice testing at **d ≈ 0.50** over non-testing controls. *(Adesope et al., 2017, Review of Educational Research.)*
- **Retrieval beats restudy, especially over time:** students who practised recall remembered **61% vs 40%** a week later. *(Roediger & Karpicke, 2006, Psychological Science.)*
- **Spacing beats cramming** — a meta-analysis of 839 assessments found distributed practice reliably outperforms massed practice. *(Cepeda et al., 2006, Psychological Bulletin.)* LastMinBuddy can't add days to the calendar, so it maximises the value of the hours that remain — by pointing them at the highest-yield topics and real retrieval practice.
- **Worked examples lower cognitive load** for novices versus unguided problem-solving, producing faster, more accurate learning. *(Sweller, 1988, Cognitive Science.)* That's exactly what a mark-aware model answer is.
- **Words + visuals beat words alone** (the multimedia principle, median **d ≈ 1.67**). *(Mayer, 2017, Journal of Computer Assisted Learning.)* Hence auto-diagrams and the Deep Dive image/audio modes.
- **Students are already studying with AI — but ad hoc.** In a 2025 survey of UK undergraduates, **92%** reported using AI tools and **88%** had used generative AI for assessments. *(HEPI / Kortext, 2025.)* LastMinBuddy gives that behaviour structure and an exam strategy.

**The thesis in one line:** the evidence says *practice-test on the real distribution and study worked answers*. LastMinBuddy is that workflow, built for the night before.

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 📊 | **Strategy dashboard** | Stat cards + unit-distribution and most-frequent-topic charts so the highest-yield topics are obvious in seconds. |
| 🗂️ | **Topic browser** | Topics grouped by unit, ranked by frequency, each showing every past variant with its paper and **marks**. |
| 🚦 | **Frequency model** | Very High / High / Medium / Low priority badges + occurrence counts. |
| 🕳️ | **Syllabus gaps** | Surfaces topics in the syllabus that have *not* appeared in past papers — your blind spots. |
| 🎓 | **AI Professor** | Generates a structured answer per question: summary, markdown body, diagrams, and sources. |
| 🎯 | **Mark-aware answering** | Answer depth scales to the marks (2–3 / 4–5 / 6+ rules), with examiner **keywords highlighted**. |
| 🧩 | **Solver mode** | For *Design / Draw / Calculate / Convert / Solve* questions: zero-fluff, step-by-step. |
| 📈 | **Auto-diagrams** | Mermaid flow/state diagrams, mind maps, and Recharts graphs rendered inline. |
| 🔥 | **Grounded sources** | Searches the web for the exact question and flags an "Exact Solution Found" match. |
| 🪄 | **Deep Dive** | Highlight any text → "Explain Simplified" (ELI5) or "Revision Notes", then generate a concept **image** (styles) and **audio** narration. |

## 🚀 Quickstart

**Prerequisites:** Node.js 20+ and a [Gemini API key](https://aistudio.google.com/app/apikey).

```bash
git clone https://github.com/sharp119/lastminbuddy.git
cd lastminbuddy
npm install

# add your key (server-side only — never shipped to the browser)
cp .env.example .env
#   then edit .env and set GEMINI_API_KEY=...

npm run dev        # http://localhost:5173
```

The dashboard and topic browser work **offline** on the seeded dataset. The AI Professor and Deep Dive features call Gemini through the local dev proxy (see below), so they need the key.

```bash
npm run build      # typecheck + production build
npm run preview    # preview the build
```

## 🏗️ How it works

```
Browser (React/Vite SPA)
   │  POST /api/gemini  { task: 'explain' | 'deepdive' | 'image' | 'audio', ... }
   ▼
Server proxy  ── injects GEMINI_API_KEY (server-side only) ──▶  Google Gemini API
   • dev:  Vite middleware (vite.config.ts)
   • prod: Vercel serverless function (api/gemini.ts)
   ▲
   └── shared logic in server/gemini.ts
```

**Key-safety by design.** The Gemini key is read from server env only and is **never** exposed in the client bundle — fixing the most common footgun in AI Studio exports. The same handler powers local dev (a Vite middleware) and production (`/api/gemini` on Vercel), so `npm run dev` runs the full stack with nothing but a local `.env`.

**Stack:** React 18 · TypeScript · Vite · Tailwind · Recharts · Mermaid · react-markdown + KaTeX. Model calls go to Gemini (`gemini-2.0-flash` for grounded answers; `2.5-flash` for Deep Dive; image and TTS models for visuals/audio).

### Project structure

```
lastminbuddy/
├─ api/gemini.ts          # Vercel serverless proxy
├─ server/gemini.ts       # shared Gemini logic (4 tasks) — key stays here
├─ src/
│  ├─ App.tsx             # app shell: sidebar + content + chat
│  ├─ data/constants.ts   # seeded dataset (replaced by Phase 3 pipeline)
│  ├─ lib/frequency.ts    # ranking, mark-bucketing, aggregation
│  ├─ services/aiClient.ts# thin client for /api/gemini
│  ├─ store/              # UI + Chat React contexts
│  └─ components/         # Sidebar, Dashboard, TopicCard, ChatModal, DeepDiveCard, …
├─ docs/PRD.md            # product requirements + phased roadmap
├─ docs/design.md         # design system + screens (Stitch-ready)
└─ RESEARCH.md            # the evidence base with citations
```

## 🗺️ Roadmap

Built as vertical slices (full detail in **[docs/PRD.md](./docs/PRD.md)**):

- **Phase 0 — Foundation** ✅ key-safe proxy, CI, typed build *(this repo)*
- **Phase 1 — Strategy core** ✅ dashboard, browser, syllabus gaps, mark-aware AI answers, diagrams
- **Phase 2 — Deep Dive** ✅ ELI5/notes + image + audio
- **Phase 3 — Dynamic analysis** ⏳ upload your own papers → auto extract, cluster, and rank (the differentiator)
- **Phase 4 — Accounts & multi-subject** ⏳ auth, workspaces, saved answers, export
- **Phase 5 — Retention** ⏳ self-test mode, sharing, performance

> **Note on the dataset:** the MVP ships a hand-curated demo dataset (one subject) so the app is fully usable out of the box. Phase 3 replaces it with the dynamic upload→analyze pipeline.

## 🔒 Security & cost notes

- The Gemini key is server-side only. Never commit `.env`.
- Web-grounded answers can still be wrong — sources are shown so you can verify. Treat generated answers as a strong first draft, not gospel.
- Image/audio generation incurs API cost and latency; both are on-demand.

## 📄 License

MIT — see [LICENSE](./LICENSE).
