# ProofChain

**Reviewer-ready proof packs for AI-assisted builders.**

ProofChain turns fragmented AI-build evidence (terminal logs, screenshots, commits, demo URLs) into a structured Markdown dossier with an explicit claim-to-evidence chain. It is built for solo developers and teams applying to AI grants, hackathons, and model-credit programs like Xiaomi MiMo Orbit, where reviewers reward calibrated, inspectable evidence over polished prose.

## Live project

- Live demo: https://proofchain-opal.vercel.app
- Builder: https://proofchain-opal.vercel.app/builder
- Examples: https://proofchain-opal.vercel.app/examples
- Public PRD: [PRD.md](./PRD.md)
- GitHub: https://github.com/LouVan/proofchain

> The deployment URL above goes live as soon as the repository is connected to Vercel. The repo is the source of truth.

## Why this exists

AI-assisted building is now common, but proof is still fragmented. Reviewers see screenshots, repo links, and chat logs and have to reconstruct the story by hand. ProofChain solves that review gap by structuring four things every program asks for:

1. What did you build, and for whom?
2. Which AI tools and models did you use, and how?
3. What concrete claims are you making about the work?
4. Which artifact backs each claim?

## What ProofChain generates

**Inputs**

- Project profile — name, problem, users, impact, public links
- AI workflow — tool, model series, pipeline, verification method
- Claims — discrete, defensible statements with confidence levels
- Evidence — typed artifacts (GitHub, demo, log, screenshot, artifact, commit, transcript) mapped to one or more claims

**Outputs**

- A structured Markdown proof pack (six sections, including a reviewer self-check)
- A concise grant-answer paragraph trimmed to ~1,200 characters
- A claim-graph visualization that highlights unmapped claims in red

## Differentiators vs. plain note-taking

- **Claim-evidence mapping.** Every claim is pinned to one or more evidence items. Unmapped claims are flagged and shown as red nodes in the graph.
- **Critique heuristic.** A built-in reviewer self-check assigns a 0-100 score and surfaces blocking issues (short problem statements, missing impact, no public links, undefended claims) before submission.
- **Deterministic output.** The generator is pure: same input always produces the same output. No timestamps, no randomness, no network calls. Reviewers can clone the repo and reproduce the sample.
- **Built with Hermes Agent.** The entire app was authored end-to-end through a 4-stage Hermes Agent session (spec → codegen → critique → verification), with each stage represented as a discrete commit.

## Quickstart

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000` and click **Builder**.

Click **Load sample** to populate the form with the ProofChain self-application, then explore the **Claim graph** tab.

## Production build

```bash
pnpm build
pnpm start
```

## Project layout

```text
app/
  page.tsx              Landing page
  layout.tsx            Root layout, navigation
  globals.css           Dark theme, design tokens
  builder/
    page.tsx            Interactive proof-pack builder
    ClaimGraph.tsx      Claim graph (react-flow, client-only)
  examples/
    page.tsx            Reviewer-facing sample
lib/
  types.ts              Domain model
  generate-proof.ts     Deterministic generator + critique
  sample.ts             Self-application sample input
public/
  examples/sample.md    Frozen sample output (regenerable)
docs/
  agent-session.md      Hermes Agent stage-by-stage transcript
PRD.md                  Public product requirements
```

## Built with Hermes Agent

ProofChain is the output of a single Hermes Agent session that ran a 4-stage reasoning pipeline:

1. **Spec stage** — Read the MiMo Orbit form, the AgentProof reference, and the agent's crypto-safety skills. Produced the typed schema (`lib/types.ts`).
2. **Codegen stage** — Generated Next.js routes, generator logic, and the builder UI against the schema.
3. **Critique stage** — Reviewed generator output and proposed the heuristic checks now in `lib/generate-proof.ts`.
4. **Verification stage** — Ran `pnpm typecheck`, `pnpm build`, and froze the deterministic generator output as `public/examples/sample.md`.

Each stage handed structured artifacts forward via the agent's persistent memory and skill registry, not free-form chat. The commit history reflects this progression. See `docs/agent-session.md` for the stage-level transcript.

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript strict mode
- react-flow (claim graph)
- pnpm
- Vercel deployment

## Status

MVP. Markdown output first. No auth, no database, no GitHub ingestion APIs. Future work: PDF rendering, hosted reviewer dashboards, direct GitHub repo metadata ingestion, optional on-chain attestation, multi-language output. See [PRD.md](./PRD.md).

## License

MIT.
