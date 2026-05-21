// Core domain types for ProofChain.
// A "claim chain" links each builder claim to inspectable evidence.

export type AgentTool =
  | "Hermes Agent"
  | "Claude Code"
  | "OpenCode"
  | "Codex"
  | "Cursor"
  | "Windsurf"
  | "Aider"
  | "Cline"
  | "OpenClaw"
  | "KiloCode"
  | "Other";

export type ModelSeries =
  | "MiMo"
  | "Claude"
  | "GPT"
  | "Gemini"
  | "DeepSeek"
  | "Doubao"
  | "MiniMax"
  | "Other";

export type EvidenceKind =
  | "github"
  | "demo"
  | "log"
  | "screenshot"
  | "artifact"
  | "commit"
  | "transcript";

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  label: string;
  url?: string;
  note?: string;
  // Which claim IDs this evidence supports (claim graph edges).
  supports: string[];
}

export interface Claim {
  id: string;
  text: string;
  // Confidence the builder would defend in review: high, med, low.
  confidence: "high" | "med" | "low";
}

export interface AgentWorkflow {
  tool: AgentTool;
  models: ModelSeries[];
  // Free-form description of the multi-agent / long-chain reasoning pipeline.
  pipeline: string;
  // Human verification steps the builder ran on agent output.
  verification: string;
}

export interface ProjectProfile {
  name: string;
  problem: string;
  users: string;
  impact: string;
  githubUrl?: string;
  demoUrl?: string;
}

export interface ProofPack {
  profile: ProjectProfile;
  workflow: AgentWorkflow;
  claims: Claim[];
  evidence: Evidence[];
  // Optional reviewer-friendly notes (limitations, scope).
  notes?: string;
}

// Output shapes -----------------------------------------------------

export interface GeneratedProof {
  markdown: string;
  // Short answer suitable for grant/credit application forms.
  grantAnswer: string;
  // Critique fields surface gaps before the builder submits.
  critique: CritiqueResult;
}

export interface CritiqueIssue {
  severity: "info" | "warn" | "block";
  field: string;
  message: string;
}

export interface CritiqueResult {
  score: number; // 0-100
  issues: CritiqueIssue[];
  unmappedClaims: string[]; // claim IDs with zero supporting evidence
  unusedEvidence: string[]; // evidence IDs supporting no claims
}
