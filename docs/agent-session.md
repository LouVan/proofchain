# Agent Session Transcript

This document is a stage-level summary of the Hermes Agent session that produced ProofChain end-to-end. It is kept in the repository as evidence that the project was authored through a structured AI-assisted workflow rather than ad-hoc chat.

The session was operated by the user **Sylus** (Telegram: Louwak) using **Hermes Agent** as the orchestrator. The underlying model channel was the user's 9Router relay, and the agent persona used persistent memory and a skill registry across stages.

---

## Stage 1 — Spec

**Inputs**

- Xiaomi MiMo Orbit application form: https://100t.xiaomimimo.com/
- Prior-art reference: HakimIqbal/agentproof
- Agent's existing skills: `crypto-safety`, `evm-onchain-monitoring`, `hermes-agent`
- User constraints: latency-sensitive, slow iterative pace, deterministic output preferred over LLM-call-on-render

**Decisions**

- Scope reduced from on-chain attestation to client-only web app to fit a single-session build window.
- Domain model formalized as `ProjectProfile + AgentWorkflow + Claim[] + Evidence[]`.
- Claim chain modeled as a directed bipartite graph where each `Evidence.supports[]` lists claim IDs.

**Output artifact**

- `lib/types.ts` (domain model)

---

## Stage 2 — Codegen

**Inputs**

- Domain model from Stage 1
- Visual reference: dark, dense, monospace-leaning layout (cf. Linear, Vercel docs)

**Decisions**

- Next.js 15 App Router, no API routes, no server actions. All state on the client.
- React 19 RC for forward compatibility.
- `react-flow` for claim graph visualization.
- Generator implemented as a pure function with no time, randomness, or network calls.

**Output artifacts**

- `lib/generate-proof.ts` (Markdown + grant-answer + critique)
- `lib/sample.ts` (the ProofChain self-application as fixture input)
- `app/page.tsx` (landing)
- `app/builder/page.tsx` (interactive builder)
- `app/builder/ClaimGraph.tsx` (graph component, client-only)
- `app/examples/page.tsx` (reviewer-facing sample)
- `app/globals.css` (design tokens, dark theme)

---

## Stage 3 — Critique

**Inputs**

- Stage 2 output
- Reviewer expectations inferred from the MiMo Orbit form text ("the more detailed, the higher the approval rate")

**Decisions**

- Critique heuristic encoded as deterministic checks rather than an LLM call, so the score is reproducible and reviewable.
- Severity tiers: `block` (-20), `warn` (-8), `info` (-2). Score floor 0, ceiling 100.
- Triggered checks: short problem (<40 chars), missing impact, no public links, short pipeline (<80 chars), missing verification, fewer than 3 claims, unmapped claims, unused evidence.

**Output artifacts**

- `critiquePack` function in `lib/generate-proof.ts`
- "Reviewer Self-Check" section appended to every generated proof pack

---

## Stage 4 — Verification

**Inputs**

- Stage 3 output
- Local toolchain: Node 22, pnpm 9

**Verification gates**

- `pnpm typecheck` (TypeScript strict mode)
- `pnpm build` (Next.js production build)
- Deterministic snapshot of the sample generator output, frozen to `public/examples/sample.md`

**Decisions**

- Snapshot regeneration is part of the build, so any drift in generator output is caught at build time.
- Commits are scoped to one concern each so that the history mirrors the agent stages above.

**Output artifacts**

- `public/examples/sample.md` (frozen sample)
- Final commit history

---

## Commit history mapping

| Commit | Stage |
| --- | --- |
| `chore: initial scaffold` | 0 |
| `feat: add domain types` | 1 |
| `feat: deterministic proof generator + critique` | 2-3 |
| `feat: builder UI with claim graph` | 2 |
| `feat: examples page with frozen sample` | 4 |
| `docs: add PRD, README, and agent session transcript` | 4 |

The transcript above is intentionally summarized rather than verbatim. The point is to show the structure of the agent session so reviewers can audit the workflow without reading raw chat.
