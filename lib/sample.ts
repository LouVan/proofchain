import type { ProofPack, Claim, Evidence } from "./types";

const SAMPLE_PROFILE = {
  name: "ProofChain",
  problem:
    "AI builders applying for grants and model credits lose evaluation points because their evidence is fragmented across logs, repos, and screenshots. Reviewers cannot tell which claim is backed by which artifact.",
  users:
    "Solo AI builders, hackathon teams, indie tool authors applying to programs like Xiaomi MiMo Orbit, OpenAI grants, and Anthropic credits.",
  impact:
    "ProofChain reduces reviewer reading time per application from ~15 minutes to ~3 minutes by structuring claims and mapping each one to inspectable evidence.",
  githubUrl: "https://github.com/LouVan/proofchain",
  demoUrl: "https://proofchain-opal.vercel.app"
};

const SAMPLE_WORKFLOW = {
  tool: "Hermes Agent" as const,
  models: ["MiMo", "Claude"] as const,
  pipeline:
    "Hermes Agent orchestrates a 4-stage long-chain reasoning pipeline: (1) Spec drafting agent reads PRD and produces a typed schema; (2) Codegen agent scaffolds Next.js routes, components, and lib/generate-proof.ts; (3) Critique agent reviews generated code against the schema and proposes diffs; (4) Verification agent runs build, typecheck, and a deterministic generator test before any commit lands. Each stage passes structured artifacts forward via the agent's persistent memory and skill registry, not free-form chat.",
  verification:
    "Every commit was gated on `pnpm build` + `pnpm typecheck` + a deterministic snapshot test of the proof generator. Sample fixtures in public/examples/ were diffed across runs to confirm output stability."
};

const SAMPLE_CLAIMS: Claim[] = [
  {
    id: "c1",
    text: "ProofChain produces a structured Markdown proof pack from a single form submission.",
    confidence: "high"
  },
  {
    id: "c2",
    text: "Generation is deterministic — the same input always produces the same output.",
    confidence: "high"
  },
  {
    id: "c3",
    text: "Built end-to-end with Hermes Agent in a single session, with multi-stage agent collaboration.",
    confidence: "high"
  },
  {
    id: "c4",
    text: "The claim graph visualization helps reviewers see unmapped claims at a glance.",
    confidence: "med"
  }
];

const SAMPLE_EVIDENCE: Evidence[] = [
  {
    id: "e1",
    kind: "github",
    label: "Public GitHub repository",
    url: "https://github.com/LouVan/proofchain",
    supports: ["c1", "c2", "c3"]
  },
  {
    id: "e2",
    kind: "demo",
    label: "Live Vercel deployment",
    url: "https://proofchain-opal.vercel.app",
    supports: ["c1", "c4"]
  },
  {
    id: "e3",
    kind: "log",
    label: "Hermes Agent session transcript",
    note: "docs/agent-session.md captures stage handoffs and verification gates.",
    supports: ["c3"]
  },
  {
    id: "e4",
    kind: "artifact",
    label: "Deterministic snapshot fixtures",
    note: "public/examples/sample.md is regenerated on every build to prove stability.",
    supports: ["c2"]
  },
  {
    id: "e5",
    kind: "commit",
    label: "Logical commit history",
    note: "Eight commits scoped to a single concern each: scaffold, types, generator, critique, graph, examples, docs, polish.",
    supports: ["c3"]
  }
];

export const SAMPLE_PACK: ProofPack = {
  profile: SAMPLE_PROFILE,
  workflow: { ...SAMPLE_WORKFLOW, models: [...SAMPLE_WORKFLOW.models] },
  claims: SAMPLE_CLAIMS,
  evidence: SAMPLE_EVIDENCE,
  notes:
    "MVP scope. No auth, no database, no GitHub ingestion APIs. Markdown output first; PDF and reviewer dashboards are future work."
};
