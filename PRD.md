# ProofChain — Product Requirements Document

## Problem

AI-assisted builders applying to grants, hackathons, and model-credit programs lose evaluation points because their evidence is fragmented. Real work lives across:

- terminal logs from agent sessions
- screenshots of agent UIs and dashboards
- commits across multiple repositories
- live demo URLs and ephemeral preview links
- generated artifacts (Markdown, code, images)

Reviewers cannot reconstruct the story in the time they have per application. Strong projects look weaker than they are. Programs like Xiaomi MiMo Orbit explicitly score on workflow detail and evidence quality, not just project quality.

## Audience

- Solo AI builders applying to credit programs (MiMo Orbit, OpenAI grants, Anthropic credits)
- Hackathon teams using AI agents in delivery workflows
- Open-source authors who need stronger proof-of-work artifacts
- Reviewers who want claims mapped to inspectable evidence

## Non-Goals

- Hosting or persisting user data
- Authentication, accounts, team workspaces
- PDF rendering or embedded reviewer dashboards
- Direct integration with GitHub, Vercel, or billing APIs

## Goals

1. Builder fills a single typed form: project profile, AI workflow, claims, evidence.
2. Each evidence item is mapped to one or more claims, forming a verifiable claim chain.
3. ProofChain produces two outputs deterministically: a Markdown proof pack and a short grant-answer paragraph.
4. A built-in critique heuristic surfaces weak applications before submission.
5. The whole product runs in the browser with no login, database, or API key.

## Domain Model

```
ProjectProfile  → name, problem, users, impact, github, demo
AgentWorkflow   → tool, models, pipeline, verification
Claim           → id, text, confidence (high|med|low)
Evidence        → id, kind, label, url?, note?, supports[claimId]
ProofPack       → profile + workflow + claims + evidence + notes
```

The claim chain is the directed bipartite graph from Evidence nodes to Claim nodes.

## Outputs

### Proof pack (Markdown)

Sections:

1. Project (problem, users, impact, links)
2. AI-assisted workflow (tool, models, pipeline, verification)
3. Claim chain (table: id | claim | confidence | supporting evidence)
4. Evidence (list: id, kind, label, link, supports)
5. Notes & limitations
6. Reviewer self-check (score, flagged issues)

### Grant answer (short)

A single paragraph, trimmed to ~1,200 characters, suitable for the Xiaomi MiMo application form's project description field.

## Critique Heuristic

Score starts at 100. Deductions:

| Severity | Deduction |
| --- | --- |
| block | -20 |
| warn | -8 |
| info | -2 |

Triggered checks:

- Problem statement < 40 characters → block
- Missing impact → warn
- No GitHub URL and no demo URL → block
- Pipeline description < 80 characters → warn
- Missing verification → warn
- Fewer than 3 claims → info
- Any claim with zero supporting evidence → block
- Any evidence supporting zero claims → info

The critique is rendered in the proof pack as a "Reviewer Self-Check" section so the application is calibrated when sent.

## Architecture

- Next.js 15 App Router, React 19, TypeScript strict mode
- All state lives in the client; no server actions, no API routes
- `lib/types.ts` — domain model
- `lib/generate-proof.ts` — pure deterministic generator (no time, no randomness)
- `lib/sample.ts` — the ProofChain self-application as a sample input
- `app/builder/` — interactive builder with claim graph
- `app/examples/` — reviewer-facing sample
- `react-flow` for the claim graph (rendered client-side only)

## Determinism

The generator is pure. The same `ProofPack` always produces the same `GeneratedProof`. No timestamps, no `Math.random`, no network calls, no environment lookups. This is a property reviewers can verify by running the project locally and comparing output to `public/examples/sample.md`.

## Why Hermes Agent

ProofChain was authored end-to-end through a Hermes Agent session that orchestrated four reasoning stages with persistent memory and a skill registry:

1. **Spec stage.** Read MiMo Orbit form, prior-art reference (AgentProof), and the agent's existing crypto/safety skills. Produced the typed schema in `lib/types.ts`.
2. **Codegen stage.** Generated the Next.js scaffolding, generator logic, and builder UI against the schema.
3. **Critique stage.** Reviewed the generator output and proposed the heuristic checks now encoded in `lib/generate-proof.ts`.
4. **Verification stage.** Ran `pnpm typecheck` and `pnpm build`, then froze the deterministic generator output as the snapshot fixture.

Each stage handed structured artifacts (schema, code, diffs, build logs) to the next. The commit history reflects this stage-by-stage progression.

## Future Work

- PDF rendering of the proof pack
- Hosted reviewer dashboards with shareable links
- Direct ingestion of GitHub repo metadata (commits, PRs, contributor stats)
- Optional on-chain attestation: hash the proof pack and post the digest to a low-cost L2 for tamper-evident proof
- Multi-language output (Mandarin, Indonesian) for non-English reviewer pools
