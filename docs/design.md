# LastMinBuddy — Design Specification (Stitch-ready)

Written to be handed to **Stitch** (Google's AI UI tool). Paste the design system once as theme context, then generate **one screen at a time** using its `>>> STITCH PROMPT` block.

## 1. Art direction
Clean, modern academic SaaS — a focused "study cockpit," not a playful EdTech toy. Bright, white, generous whitespace; indigo-led accents; colour used only where it carries meaning (frequency tiers, examiner keywords). Think Linear/Notion/Vercel polish with a studious edge.
**Vibe words:** clean, modern, academic, focused, indigo accent, soft shadows, rounded, data-forward, trustworthy.

## 2. Principles
Hierarchy by frequency · one primary action per surface · every async action has idle/loading/success/error states · reading comfort (large line-height, red examiner keywords) · deep work happens in focused modals over a blurred backdrop.

## 3. Design system (theme)
**Color**
- Primary indigo `#4F46E5` (hover `#4338CA`, soft `#EEF2FF`, ring `#6366F1`). Deep-dive accent gradient `#A855F7 → #4F46E5`.
- Neutrals: bg `#F8FAFC`, surface `#FFFFFF`, muted `#F1F5F9`, border `#E2E8F0`; text `#1E293B`/`#334155`/`#64748B`/`#94A3B8`; ink `#0F172A`.
- Frequency tiers — Very High red (`#FEE2E2`/`#991B1B`), High orange (`#FFEDD5`/`#9A3412`), Medium blue (`#DBEAFE`/`#1E40AF`), Low gray (`#F3F4F6`/`#1F2937`).
- Functional — examiner keyword `#D32F2F` (bold + underline, reserved for keywords); success/“Explain with AI” emerald `#059669`; syllabus-gap amber (`#FFFBEB`/`#FDE68A`/`#B45309`); "Exact Solution Found" `#EA580C` + 🔥; inline code `#DB2777` on `#F1F5F9`; chart palette `#6366F1 #8B5CF6 #EC4899 #14B8A6`; code block surface `#1E293B`.

**Typography:** Inter (UI + headings + body, weights 400–700), JetBrains Mono (code, paper tags, marks), KaTeX for math. Scale: Display 30/700 · H1 24/700 · H2 20/600 · H3 18/600 · Body 16/400 (line-height 1.7) · Caption 12 uppercase tracking-wide.

**Spacing/radius/elevation:** 8px grid; radius inputs/buttons 8px, cards 12px, large cards/modals 16–24px, pills full; shadows card `0 1px 3px rgba(15,23,42,.08)`, modal `0 24px 60px rgba(15,23,42,.25)`; dashed borders for upload zones and gap panels.

**Icons:** Lucide (1.5–2px). **Motion:** 150–200ms ease; modal fade+slide-up; popover fade+slide-from-bottom; respect `prefers-reduced-motion`.

## 4. Layout & navigation
Two-pane shell: fixed left **Sidebar** (logo "LastMinBuddy" + subject, nav = Dashboard, Unit 1–N) + scrolling content with a sticky top bar (title/subtitle left, search right). Deep work (AI Professor, Deep Dive, upload) in modals over a blurred dark backdrop.

## 5. Component library (with states)
Sidebar nav item (default/hover/active) · stat card · frequency badge (4 tiers) · topic card (collapsed/expanded/hover) · variant row (paper tag + marks tag + "Explain with AI") · syllabus-gap panel · chat modal (open/loading) · answer block (summary → sources → markdown w/ red keywords → diagrams → references) · source chip (+🔥 exact) · diagram block (rendered / parse-fallback) · text-selection toolbar · deep-dive card (loading/text/with images/playing) · style-picker popover · audio control (idle/generating/playing) · toast.

## 6. Screens (each with a Stitch prompt)

### S1 — Dashboard
Sidebar + sticky top bar ("Exam Analysis Dashboard" / "Overview of N papers" + search). Three stat cards (Total Topics, Questions Analyzed, High-Priority) then two chart cards (Unit Distribution donut; Most Frequent Topics horizontal bar).

```
>>> STITCH PROMPT
Design a dashboard for a clean, modern academic SaaS app "LastMinBuddy". Left fixed white sidebar with an indigo logo and nav items Dashboard (active, indigo-soft) and Unit 1–4 with small icons. Main area on slate-50. Sticky white top bar: bold title "Exam Analysis Dashboard", slate-500 subtitle "Overview of 5 papers", and a rounded search input with magnifier on the right. Content: a row of three white rounded-xl stat cards with soft shadows (uppercase slate-500 label + large slate-900 number): "Total Topics" 9, "Questions Analyzed" 23, "High-Priority Topics" 5. Below, two white rounded-xl cards: left "Unit Distribution" donut chart using #6366F1/#8B5CF6/#EC4899/#14B8A6; right "Most Frequent Topics" horizontal indigo bar chart. Inter font, generous whitespace, 12–16px radius, soft shadows.
```

### S2 — Topic browser + Syllabus Gaps
List of topic cards sorted Very High→Low; one expanded showing variant rows; amber "Syllabus Gaps" panel below.

```
>>> STITCH PROMPT
Design a topic-browser screen for "LastMinBuddy" with the same left sidebar (Unit 1 active). Top bar "Unit 1 Analysis" + subtitle + search. Body: a vertical list of white rounded-lg topic cards with soft shadows. Each header: bold title, a colored priority pill (Very High=red, High=orange, Medium=blue, Low=gray), a gray "15 Occurrences" pill, and a two-line slate-600 description with a chevron. Show one card EXPANDED into a slate-50 panel titled "EXAM VARIANTS": rows each with a monospace indigo tag ("Jan 2024"), an amber marks tag ("6 Marks"), the question text, and a right-aligned emerald link "Explain with AI" with a question-bubble icon. Below the list, a dashed divider then an amber panel "Syllabus Gaps" (BookX icon) listing topics not seen in past papers. Clean, data-forward, Inter.
```

### S3 — AI Professor (answer modal)
Large modal (~900px, 90vh) over blurred backdrop. Header: indigo Bot avatar "AI Professor" + close. Thread with user/AI bubbles; AI answer = SUMMARY → source chips (🔥 exact) → markdown body (red examiner keywords, tables, KaTeX, dark code blocks w/ copy) → diagram panel → references. Bottom: rounded input + indigo Send. Plus a loading variant ("Generating step-by-step solution…").

```
>>> STITCH PROMPT
Design a large focused chat modal "AI Professor" for "LastMinBuddy", centered over a blurred dark backdrop, white rounded-xl ~900px wide, 90vh. Header (slate-50): indigo rounded-square robot avatar, title "AI Professor", subtitle "Mark-aware, step-by-step solutions", close X. Body scrollable: show one AI answer card with a small uppercase indigo "SUMMARY" label + one bold sentence; a row of source chips where one has a red-orange "🔥 Exact Solution Found" badge; a formatted answer with headings, bullet lists, a markdown table, several **bold red underlined examiner keywords**, a dark code block (#1E293B) with language + Copy, and a flowchart diagram panel; ending with a numbered "Sources & References" list. Bottom: a large rounded input "Ask a follow-up question…" + indigo Send button. Also a loading variant: indigo robot avatar beside a white pill "Generating step-by-step solution…" with a spinner. Inter, large line-height, soft shadows.
```

### S4 — Deep Dive
(a) Small dark floating toolbar above selected text: "Explain Simplified" (pink wand) | "Revision Notes" (indigo book). (b) Deep-dive card: purple→indigo gradient avatar; "Deep Dive" + sparkles; markdown explanation; horizontal image carousel (each captioned with its style); action row "Draw Another" (opens style popover) + "Listen". Style popover lists Whimsical Illustration / Clean Infographic / ADHD Notebook / Custom + "Generate Visual".

```
>>> STITCH PROMPT
Design two pieces for "LastMinBuddy" Deep Dive on a light study app. (1) A small dark floating toolbar (slate-900, rounded-lg) above a text selection with two buttons split by a divider: "Explain Simplified" (pink wand icon) and "Revision Notes" (indigo book icon). (2) A "Deep Dive" card: a circular purple-to-indigo gradient avatar beside a card with a "Deep Dive" header + sparkles, a few explanation paragraphs (some keywords bold red), a horizontal carousel of two generated concept images (~280px) captioned "Style: Whimsical Illustration" and "Style: ADHD Notebook", and an action row of two pill buttons "Draw Another" (image icon + chevron) and "Listen" (speaker). Include a popover above "Draw Another" titled "Visual Style" listing Whimsical Illustration, Clean Infographic, ADHD Notebook, Custom Style, with a primary "Generate Visual" button. Clean, modern, Inter, soft shadows.
```

### S5 — Upload & Analysis (Phase 3)
Stepper Upload → Extract → Cluster → Review. File list with per-file status + progress; primary "Analyze". Review step: editable topic clusters (title, frequency pill, count, merge) + "Build My Study Map". Error variant for scanned PDFs.

```
>>> STITCH PROMPT
Design a multi-step "Analyze Past Papers" modal for "LastMinBuddy" over a blurred dashboard. Horizontal stepper Upload → Extract → Cluster → Review. Main: a list of uploaded PDF rows (file icon, name, status chip Queued/Extracting…/Done, small progress bar) with an overall progress bar and a primary indigo "Analyze" button. A "Review Topics" variant: scrollable white cards each with an editable title, frequency pill, occurrence count, and a merge affordance, plus a primary "Build My Study Map" button. Include an error notice "Couldn't read this PDF (it may be scanned) — try another file." Clean academic style, Inter, indigo accent, soft shadows.
```

### S6 — States
Empty (pre-upload, Phase 3) with "Upload past papers" CTA; loading skeletons for cards/charts; inline red error + Retry. Generate as variants of the dashboard.

## 7. Accessibility & responsive
WCAG AA contrast; keyboard nav with indigo focus rings; Esc closes modals; Enter sends; ARIA dialog + live region for "Generating…"; never rely on colour alone for frequency (pair with label). Breakpoints: desktop ≥1024 two-pane + side-by-side charts; tablet sidebar→icons, charts stack; mobile sidebar→top/hamburger, full-screen chat, long-press selection.

## 8. Asset checklist
Wordmark "LastMinBuddy" (light/dark), Lucide icons, empty-state illustration, favicon, Google Fonts (Inter + JetBrains Mono), KaTeX CSS.
