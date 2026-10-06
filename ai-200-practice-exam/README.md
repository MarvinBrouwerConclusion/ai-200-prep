# AI-200 Exam Simulator

English-language practice application for AI-200. Open `dist/index.html` in a browser to run it locally.

## Included

- 130 verified practice questions mapped to the current AI-200 skills outline
- Free preview questions from external practice providers are reworded and checked against technical documentation
- Full simulation: 50 questions in 100 minutes
- Quick assessment: 20 questions in 40 minutes
- Case study drill with scenario tabs and section review
- Study mode with immediate explanations
- Case studies with scenario tabs
- Single choice, multiple response, ordering, and locked Yes/No problem-solution items
- Review flags, question comments, section review, breaks, and Microsoft Learn links
- Estimated 0-1000 practice score and performance by domain
- Local attempt history stored in the browser

## Important

This is an independent study tool, not an official Microsoft product. Questions are original. The exact real-exam question count, order, case studies, and presence of labs can vary.

The 100-minute full simulation models Microsoft's associate/expert role-based exam profile without a lab. Microsoft says these exams usually contain 40–60 questions. Exams that may contain labs use a 120-minute exam profile. Check the real exam's introduction screen for its actual sections. For the official interface and question-type demonstration, use https://aka.ms/examdemo.

## Question-bank validation

Single-choice and multiple-response options are shuffled once per session, with correct-answer indexes remapped. Yes/No options retain their familiar order. Full simulations include case-study and locked items in the domain totals: 12 container, 14 data, 12 services, and 12 operations questions (24%, 28%, 24%, and 24%). The practice score is the percentage correct scaled to 1000, not Microsoft's scoring formula.

After changing the question bank or inline runtime, run `node scripts/build-inline.cjs` to update both embedded HTML versions, then `node scripts/check-questions.cjs` to check answer mappings, domain selection, and embedded-content consistency.

Technical review clarified Service Bus redelivery versus duplicate sends, ACR RBAC versus ABAC roles, App Service sidecar port configuration, Key Vault refresh and secret rotation, Cosmos DB consistency and vector-index limits, Python pagination, and SDK credentials versus Functions binding configuration. Question C13 now tests a concrete diagnostic action instead of requiring an arbitrary troubleshooting order.

## Primary references

- https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200
- https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience
- https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions
- https://learn.microsoft.com/en-us/shows/exam-readiness-zone/what-to-expect-on-your-microsoft-exam
