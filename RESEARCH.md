# Why LastMinBuddy is needed — the evidence base

This document collects the research that motivates LastMinBuddy and maps each finding to a product decision. Sources are peer-reviewed papers, meta-analyses, and reputable surveys. Where a claim is weakly supported or a source is paywalled, that is noted explicitly — please don't over-cite the soft ones.

---

## 1. The behaviour gap: students cram, and cram badly

Most students prepare in a way the science of learning predicts is suboptimal: **massed, last-minute study ("cramming")** combined with **low-utility techniques** (re-reading, highlighting).

- **Re-reading and highlighting rank among the *lowest*-utility techniques; practice testing and distributed practice rank *highest*.** Across 10 techniques reviewed for generalizability, practice testing and distributed practice received the top utility ratings.
  *Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving Students' Learning With Effective Learning Techniques. **Psychological Science in the Public Interest**, 14(1), 4–58.* — https://journals.sagepub.com/doi/abs/10.1177/1529100612453266

- **Cramming is common.** A 2024 study of medical students found **69.7%** reported cramming behaviour.
  *Daroedono, E., et al. (2024). **International Neuropsychiatric Disease Journal**, 21(4), 6–17.* — http://repository.uki.ac.id/14545/1/CrammingAnalysisBased.pdf
  ⚠️ *Limitation:* single-institution, single-country (Indonesia), medical students. Treat as illustrative, not a global rate. The broader, better-sampled signal is the time-pressure motivation reported in the HEPI 2025 survey (§5).

**Product implication:** meet students where they are (the night before) but redirect the limited time toward the highest-yield activities — ranking topics by exam frequency and drilling real past questions.

## 2. Practice testing / retrieval practice works — a lot

- **Testing beats restudying, and the gap grows with delay.** Students who took practice tests recalled **61%** of content a week later vs **40%** for those who restudied.
  *Roediger, H. L., & Karpicke, J. D. (2006). Test-Enhanced Learning. **Psychological Science**, 17(3), 249–255.* — https://pubmed.ncbi.nlm.nih.gov/16481625/

- **Meta-analytic effect size ≈ 0.50** across 272 independent effect sizes, robust across formats, subjects, and education levels.
  *Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the Use of Tests: A Meta-Analysis of Practice Testing. **Review of Educational Research**, 87(4), 659–701.* — https://journals.sagepub.com/doi/10.3102/0034654316689306

**Product implication:** past papers *are* practice tests on the real distribution. The topic browser + "Explain with AI" loop is retrieval practice with immediate, worked feedback.

## 3. Spacing beats massing (and we make the most of what's left)

- **Distributed practice reliably beats massed practice.** Meta-analysis of 839 assessments across 317 experiments; the optimal gap grows with the desired retention interval.
  *Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed Practice in Verbal Recall Tasks. **Psychological Bulletin**, 132(3), 354–380.* — https://pubmed.ncbi.nlm.nih.gov/16719566/

**Product implication:** LastMinBuddy can't add days, so it (a) concentrates effort on the highest-frequency, highest-mark topics and (b) is explicitly designed to make *starting earlier and revisiting* easy (sessions persist; Phase 4 adds saved answers and revisit-friendly workspaces).

## 4. Mark-aware model answers = the worked-example effect

- **Studying worked examples imposes lower cognitive load** than conventional problem solving for novices, because means–ends search consumes working memory needed for schema formation; worked examples produce faster, more accurate learning.
  *Sweller, J. (1988). Cognitive Load During Problem Solving. **Cognitive Science**, 12(2), 257–285.* — https://andymatuschak.org/files/papers/Sweller%20-%201988%20-%20Cognitive%20load%20during%20problem%20solving.pdf

**Product implication:** the AI Professor returns a structured, mark-scheme-shaped worked answer (depth scaled to the marks) with examiner keywords flagged — a worked example tuned to the exam, not a generic explanation.

## 5. Diagrams + audio = multimedia learning / dual-coding

- **People learn more deeply from words *and* pictures than from words alone** (the multimedia principle), with a median effect size around **d ≈ 1.67**; the theory is grounded in Paivio's dual-coding.
  *Mayer, R. E. (2017). Using multimedia for e-learning. **Journal of Computer Assisted Learning**, 33(5), 403–423.* — https://onlinelibrary.wiley.com/doi/10.1111/jcal.12197

**Product implication:** answers auto-generate diagrams (Mermaid / mind maps / charts); Deep Dive adds a concept image and audio narration so a concept can be encoded visually and verbally.

## 6. Students already study with AI — give it structure

- **92%** of UK undergraduates reported using AI tools in 2025 (up from 66% in 2024); **88%** had used generative AI to help with assessments (n = 1,041; surveyed Dec 2024).
  *Freeman, J. (2025). Student Generative AI Survey 2025. **HEPI / Kortext**, Policy Note 61.* — https://www.hepi.ac.uk/wp-content/uploads/2025/02/HEPI-Policy-Note-61.pdf

**Product implication:** the demand and behaviour already exist; the gap is *structure*. LastMinBuddy packages ad-hoc AI use into an exam strategy (what to study → answer to the marks → reinforce).

## 7. Market context

- The global **test-preparation EdTech** segment was valued at **USD 1.199 billion in 2024**, projected to grow ~**13% CAGR** through 2030.
  *Grand View Research (2024). Test Preparation — Education Technology Market.* — https://www.grandviewresearch.com/horizon/statistics/education-technology-market/software/test-preparation/global
  ⚠️ *Limitation:* the summary figure is visible on the landing page but the full dataset is paywalled; treat as indicative.

---

## Evidence → feature map

| Evidence | LastMinBuddy feature |
|---|---|
| Practice testing is highest-utility (Dunlosky 2013; Adesope 2017; Roediger & Karpicke 2006) | Past-paper topic browser + "Explain with AI" retrieval loop |
| Frequency/most-tested matters under time pressure | Frequency model, dashboard ranking, syllabus-gap detection |
| Worked-example effect (Sweller 1988) | Mark-aware structured model answers + Solver mode |
| Multimedia / dual-coding (Mayer 2017) | Auto-diagrams; Deep Dive image + audio |
| Spacing beats massing (Cepeda 2006) | Topic prioritisation; persistent sessions; (Phase 4) revisit-friendly saved answers |
| Students already use AI to study (HEPI 2025) | A structured, exam-specific workflow instead of ad-hoc prompting |

## Honest limitations

- **Causal claim is indirect.** The evidence supports the *components* (practice testing, worked examples, multimedia). LastMinBuddy has not itself been trialled; an A/B study on exam outcomes is future work.
- **Cramming-prevalence stat** (§1) is from a single cohort; use the HEPI time-pressure data as the more robust signal.
- **Market figure** (§7) is from a paywalled report's public summary.
- **AI accuracy.** Generated answers can be wrong; sources are surfaced precisely so users verify rather than trust blindly.

*Compiled June 2026. If you cite these in academic work, go to the primary sources above rather than relying on this summary.*
