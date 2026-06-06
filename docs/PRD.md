# LastMinBuddy — Product Requirements Document

> **One-liner:** an exam-strategy engine — turn past papers into a ranked "what to study" map and generate mark-ready answers, reinforced with diagrams and audio.

- **Owner:** sharp119 · **Status:** Draft v1 · **Repo:** `sharp119/lastminbuddy`
- The evidence behind every "why" below lives in [`/RESEARCH.md`](../RESEARCH.md).

## 1. Problem & users
Students cram with low-utility methods (re-reading, highlighting) when the evidence favours **practice testing on the real question distribution** and **studying worked answers**. Raw past-paper PDFs don't reveal what's most tested, how it's marked, or how to answer it. LastMinBuddy is that layer.

- **Primary user:** a student revising one subject with available past papers, often the night before.
- **Secondary:** tutors/study-group leads building revision material.

## 2. Goals / non-goals / metrics
**Goals:** (1) make "what to study" obvious in <10s; (2) generate answers shaped to the marks with diagrams + sources; (3) let users bring their own papers and auto-generate the analysis; (4) multi-modal learning of any concept.
**Non-goals (v1):** generic chatbot, flashcard/SRS app, proctoring, real-time collaboration.
**Metrics:** time-to-first-insight <10s · time-to-first-answer <12s · answer 👍 ≥75% · upload→analysis success ≥90% (Phase 3) · Deep Dives/session ≥2.

## 3. Principles
1. Marks are the unit of value. 2. Show, then explain (rank first). 3. Opinionated defaults, user can override. 4. Trust but verify (always show sources). 5. Multi-modal by default. 6. Ship vertical slices.

## 4. Feature catalog
F1 Topic browser · F2 Frequency model · F3 Dashboard · F4 Search/filter · F5 Syllabus gaps · F6 AI Professor (structured answers) · F7 Mark-aware answering · F8 Solver mode · F9 Examiner-keyword highlighting · F10 Auto-diagrams (mermaid/flow/recharts) · F11 Web grounding + "Exact Solution Found" · F12 Follow-up chat · F13 Deep Dive text (ELI5/notes) · F14 Deep Dive image (styles) · F15 Deep Dive audio · F16 Bring-your-own-papers grounding · F17 Session persistence · F18 Dynamic analysis pipeline · F19 Multi-subject workspaces · F20 Accounts · F21 Saved answers + export · F22 Answer feedback.

## 5. Roadmap — Build → Ship → Test
Each phase is a vertical slice that ends shippable behind a flag. **"Shipped"** = merged to `main`, deployed, behind a flag, phase tests green. Testing baseline every phase: unit (logic), component (states), E2E (primary journey), AI eval (schema + spot-check), manual QA + demo rehearsal.

### Phase 0 — Foundation ✅ (this repo)
- **Build:** key-safe server proxy (Vite middleware + Vercel function sharing `server/gemini.ts`); typed strict build; CI (typecheck + build); `.env.example`; deploy target.
- **Ship:** deployed app on the seeded dataset with the key server-side.
- **Test:** no key in client bundle; CI green on PR; app loads + one answer generates via proxy.

### Phase 1 — Strategy core (F1–F12) ✅
- **Build:** topic browser + frequency sort + search; dashboard (stats + pie + bar); syllabus gaps; AI Professor structured answers; mark-aware depth; solver mode; keyword highlighting; auto-diagrams with parse-fallback; grounding + sources/exact badge; follow-up chat.
- **Ship:** full browse→answer loop on the seeded subject.
- **Test:** sort/search correct; dashboard equals data; 3-mark concise vs 6-mark structured; solver triggers on "Design…"; every diagram renders or degrades; exact badge shows on verbatim match.

### Phase 2 — Deep Dive (F13–F15) ✅
- **Build:** text-selection menu → ELI5/notes; on-demand image (style presets + custom) as carousel; on-demand audio (TTS → WAV) with play/pause; persist generated media on the card.
- **Ship:** Deep Dive usable inside the answer modal.
- **Test:** selection >3 chars shows menu; ELI5 vs notes differ; image per preset; audio plays/pauses/replays; failures degrade gracefully.

### Phase 3 — Dynamic analysis pipeline (F16–F18) ⏳ — the differentiator
- **Build:** multi-PDF upload → Gemini extraction (questions {text, marks, paper}) with strict schema → cluster into topics → compute frequency + gaps → persist dataset + grounding cache → a review/merge step before locking.
- **Ship:** upload→dashboard for an arbitrary subject.
- **Test:** real 3-PDF upload yields correct topics/marks (golden file); extraction always valid JSON (auto-retry); counts equal extracted variants; bad/scanned PDF errors cleanly; session restores.

### Phase 4 — Accounts & multi-subject (F19–F22) ⏳
- **Build:** auth; per-user workspaces + subject switcher; saved answers + "Revision Pack" PDF export; 👍/👎 feedback → quality dashboard; data lifecycle (TTL, delete-my-data).
- **Ship:** multi-user app with subject switching and exports.
- **Test:** cross-user isolation; subject switch swaps dataset/session; export renders; feedback aggregates.

### Phase 5 — Retention ⏳
Self-test/quiz mode from topics; shareable study packs; onboarding tour; streaming answers + perf; mobile refinements. Each its own flagged slice.

## 6. Data model (target)
`Workspace`, `TopicGroup`/`QuestionVariant`, `AnalyzedPaper`, `Session` (grounding cache ref), `SavedAnswer`, `Feedback`. See `src/types.ts` for current shapes.

## 7. AI / prompt specs (summary)
Structured answer `{summary, answer_content, sources[], visuals[]}`; mark rules 2–3/4–5/6+; solver mode on Design/Draw/Calculate/Convert/Solve; mermaid ASCII-only + quoted labels; recharts JSON schema; grounding verbatim+concept with match_type; silent-source rule. Deep Dive ELI5 (analogy + variable breakdown + mnemonic) vs notes (definition + key points + exam context). Implemented in `server/gemini.ts`.

## 8. Risks & mitigations
Hardcoded analysis → Phase 3 makes it dynamic (labelled as demo until then). Client-exposed key → server proxy (done). Hallucination → sources shown + feedback loop. Diagram parse failures → fallback to code block. PDF extraction variance → validate/retry + clear errors. Generation latency → on-demand + skeletons.

## 9. Open questions
Default demo subject? Syllabus upload vs manual entry for gaps? Embedding vs LLM clustering for F18? Free-tier limits?
