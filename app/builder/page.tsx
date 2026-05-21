"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type {
  ProofPack,
  Claim,
  Evidence,
  AgentTool,
  ModelSeries,
  EvidenceKind
} from "@/lib/types";
import { generate } from "@/lib/generate-proof";
import { SAMPLE_PACK } from "@/lib/sample";

// react-flow needs the window object, so only render it on the client.
const ClaimGraph = dynamic(() => import("./ClaimGraph"), { ssr: false });

const TOOLS: AgentTool[] = [
  "Hermes Agent",
  "Claude Code",
  "OpenCode",
  "Codex",
  "Cursor",
  "Windsurf",
  "Aider",
  "Cline",
  "OpenClaw",
  "KiloCode",
  "Other"
];
const MODELS: ModelSeries[] = [
  "MiMo",
  "Claude",
  "GPT",
  "Gemini",
  "DeepSeek",
  "Doubao",
  "MiniMax",
  "Other"
];
const KINDS: EvidenceKind[] = [
  "github",
  "demo",
  "log",
  "screenshot",
  "artifact",
  "commit",
  "transcript"
];

function newId(prefix: string, existing: { id: string }[]): string {
  let n = existing.length + 1;
  while (existing.some((x) => x.id === `${prefix}${n}`)) n++;
  return `${prefix}${n}`;
}

export default function BuilderPage() {
  const [pack, setPack] = useState<ProofPack>(emptyPack());
  const [tab, setTab] = useState<"pack" | "answer" | "graph">("pack");

  const generated = useMemo(() => generate(pack), [pack]);

  const update = (patch: Partial<ProofPack>) => setPack((p) => ({ ...p, ...patch }));
  const updateProfile = (patch: Partial<ProofPack["profile"]>) =>
    setPack((p) => ({ ...p, profile: { ...p.profile, ...patch } }));
  const updateWorkflow = (patch: Partial<ProofPack["workflow"]>) =>
    setPack((p) => ({ ...p, workflow: { ...p.workflow, ...patch } }));

  const addClaim = () =>
    update({
      claims: [
        ...pack.claims,
        { id: newId("c", pack.claims), text: "", confidence: "med" }
      ]
    });
  const updateClaim = (id: string, patch: Partial<Claim>) =>
    update({
      claims: pack.claims.map((c) => (c.id === id ? { ...c, ...patch } : c))
    });
  const removeClaim = (id: string) =>
    update({
      claims: pack.claims.filter((c) => c.id !== id),
      evidence: pack.evidence.map((e) => ({
        ...e,
        supports: e.supports.filter((s) => s !== id)
      }))
    });

  const addEvidence = () =>
    update({
      evidence: [
        ...pack.evidence,
        {
          id: newId("e", pack.evidence),
          kind: "github",
          label: "",
          supports: []
        }
      ]
    });
  const updateEvidence = (id: string, patch: Partial<Evidence>) =>
    update({
      evidence: pack.evidence.map((e) => (e.id === id ? { ...e, ...patch } : e))
    });
  const removeEvidence = (id: string) =>
    update({ evidence: pack.evidence.filter((e) => e.id !== id) });

  const toggleSupport = (eid: string, claimId: string) => {
    const ev = pack.evidence.find((e) => e.id === eid);
    if (!ev) return;
    const has = ev.supports.includes(claimId);
    updateEvidence(eid, {
      supports: has ? ev.supports.filter((s) => s !== claimId) : [...ev.supports, claimId]
    });
  };

  const toggleModel = (m: ModelSeries) => {
    const has = pack.workflow.models.includes(m);
    updateWorkflow({
      models: has ? pack.workflow.models.filter((x) => x !== m) : [...pack.workflow.models, m]
    });
  };

  const loadSample = () => setPack(structuredClone(SAMPLE_PACK));
  const reset = () => setPack(emptyPack());

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const download = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scoreClass =
    generated.critique.score >= 75
      ? ""
      : generated.critique.score >= 50
        ? "warn"
        : "block";

  return (
    <div className="container">
      <h1 className="h1">Proof Pack Builder</h1>
      <p className="dim">
        Fill in your project, AI workflow, claims, and evidence. ProofChain generates a reviewer
        dossier and a short grant answer, plus a self-check before you submit.
      </p>

      <div style={{ margin: "16px 0" }}>
        <button className="btn ghost" onClick={loadSample} type="button">
          Load sample
        </button>{" "}
        <button className="btn ghost" onClick={reset} type="button">
          Reset
        </button>
      </div>

      <section className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>1. Project profile</h2>
        <label>Project name</label>
        <input
          type="text"
          value={pack.profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          placeholder="ProofChain"
        />
        <label>Problem</label>
        <textarea
          value={pack.profile.problem}
          onChange={(e) => updateProfile({ problem: e.target.value })}
          placeholder="What pain point does this solve?"
        />
        <label>Users</label>
        <textarea
          value={pack.profile.users}
          onChange={(e) => updateProfile({ users: e.target.value })}
          placeholder="Who uses this?"
        />
        <label>Impact</label>
        <textarea
          value={pack.profile.impact}
          onChange={(e) => updateProfile({ impact: e.target.value })}
          placeholder="Quantify the impact if you can."
        />
        <div className="row">
          <div>
            <label>GitHub URL</label>
            <input
              type="url"
              value={pack.profile.githubUrl ?? ""}
              onChange={(e) => updateProfile({ githubUrl: e.target.value || undefined })}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label>Live demo URL</label>
            <input
              type="url"
              value={pack.profile.demoUrl ?? ""}
              onChange={(e) => updateProfile({ demoUrl: e.target.value || undefined })}
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>2. AI-assisted workflow</h2>
        <label>Tool</label>
        <select
          value={pack.workflow.tool}
          onChange={(e) => updateWorkflow({ tool: e.target.value as AgentTool })}
        >
          {TOOLS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label>Model series (multi-select)</label>
        <div>
          {MODELS.map((m) => (
            <span
              key={m}
              className={`chip ${pack.workflow.models.includes(m) ? "active" : ""}`}
              onClick={() => toggleModel(m)}
              role="button"
            >
              {m}
            </span>
          ))}
        </div>
        <label>Pipeline (long-chain reasoning, multi-agent stages)</label>
        <textarea
          value={pack.workflow.pipeline}
          onChange={(e) => updateWorkflow({ pipeline: e.target.value })}
          placeholder="Describe the agent stages, handoffs, and reasoning depth."
        />
        <label>Verification</label>
        <textarea
          value={pack.workflow.verification}
          onChange={(e) => updateWorkflow({ verification: e.target.value })}
          placeholder="How did you verify agent output? Tests, builds, manual review?"
        />
      </section>

      <section className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>3. Claims</h2>
        <p className="dim" style={{ marginTop: 0 }}>
          Each claim should be a specific, defensible statement reviewers can check.
        </p>
        {pack.claims.map((c) => (
          <div key={c.id} className="card" style={{ background: "var(--surface-2)" }}>
            <div className="row">
              <div style={{ flex: 0, minWidth: 60 }}>
                <label>ID</label>
                <input type="text" value={c.id} disabled />
              </div>
              <div>
                <label>Text</label>
                <textarea
                  value={c.text}
                  onChange={(e) => updateClaim(c.id, { text: e.target.value })}
                />
              </div>
              <div style={{ flex: 0, minWidth: 110 }}>
                <label>Confidence</label>
                <select
                  value={c.confidence}
                  onChange={(e) =>
                    updateClaim(c.id, {
                      confidence: e.target.value as Claim["confidence"]
                    })
                  }
                >
                  <option value="high">high</option>
                  <option value="med">med</option>
                  <option value="low">low</option>
                </select>
              </div>
            </div>
            <button
              className="btn ghost"
              type="button"
              onClick={() => removeClaim(c.id)}
              style={{ marginTop: 8 }}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="btn" onClick={addClaim} type="button">
          + Add claim
        </button>
      </section>

      <section className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>4. Evidence</h2>
        <p className="dim" style={{ marginTop: 0 }}>
          Each evidence item should map to one or more claims. Unmapped claims and unused evidence
          are flagged in the critique.
        </p>
        {pack.evidence.map((e) => (
          <div key={e.id} className="card" style={{ background: "var(--surface-2)" }}>
            <div className="row">
              <div style={{ flex: 0, minWidth: 60 }}>
                <label>ID</label>
                <input type="text" value={e.id} disabled />
              </div>
              <div style={{ flex: 0, minWidth: 130 }}>
                <label>Kind</label>
                <select
                  value={e.kind}
                  onChange={(ev) =>
                    updateEvidence(e.id, { kind: ev.target.value as EvidenceKind })
                  }
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Label</label>
                <input
                  type="text"
                  value={e.label}
                  onChange={(ev) => updateEvidence(e.id, { label: ev.target.value })}
                />
              </div>
            </div>
            <label>URL (optional)</label>
            <input
              type="url"
              value={e.url ?? ""}
              onChange={(ev) => updateEvidence(e.id, { url: ev.target.value || undefined })}
            />
            <label>Note (optional)</label>
            <textarea
              value={e.note ?? ""}
              onChange={(ev) => updateEvidence(e.id, { note: ev.target.value || undefined })}
            />
            <label>Supports claims</label>
            <div>
              {pack.claims.length === 0 && <span className="dim">Add claims first.</span>}
              {pack.claims.map((c) => (
                <span
                  key={c.id}
                  className={`chip ${e.supports.includes(c.id) ? "active" : ""}`}
                  onClick={() => toggleSupport(e.id, c.id)}
                  role="button"
                >
                  {c.id}
                </span>
              ))}
            </div>
            <button
              className="btn ghost"
              type="button"
              onClick={() => removeEvidence(e.id)}
              style={{ marginTop: 8 }}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="btn" onClick={addEvidence} type="button">
          + Add evidence
        </button>
      </section>

      <section className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>5. Notes & limitations (optional)</h2>
        <textarea
          value={pack.notes ?? ""}
          onChange={(ev) => update({ notes: ev.target.value || undefined })}
          placeholder="Be honest about scope. Reviewers reward calibration."
        />
      </section>

      <section className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>6. Reviewer self-check</h2>
        <div className={`score ${scoreClass}`}>
          <span className="num">{generated.critique.score}</span>
          <span className="dim">/ 100</span>
        </div>
        {generated.critique.issues.length === 0 ? (
          <p className="dim">No issues flagged.</p>
        ) : (
          <ul className="issues">
            {generated.critique.issues.map((i, idx) => (
              <li key={idx}>
                <span className={`severity-${i.severity}`}>[{i.severity.toUpperCase()}]</span>{" "}
                <strong>{i.field}</strong>: {i.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>7. Output</h2>
        <div className="tabs">
          <button className={tab === "pack" ? "active" : ""} onClick={() => setTab("pack")}>
            Proof pack (Markdown)
          </button>
          <button className={tab === "answer" ? "active" : ""} onClick={() => setTab("answer")}>
            Grant answer
          </button>
          <button className={tab === "graph" ? "active" : ""} onClick={() => setTab("graph")}>
            Claim graph
          </button>
        </div>
        {tab === "pack" && (
          <>
            <pre className="output">{generated.markdown}</pre>
            <div style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => copyToClipboard(generated.markdown)} type="button">
                Copy
              </button>{" "}
              <button
                className="btn ghost"
                onClick={() => download(generated.markdown, `${pack.profile.name || "proofpack"}.md`)}
                type="button"
              >
                Download .md
              </button>
            </div>
          </>
        )}
        {tab === "answer" && (
          <>
            <pre className="output">{generated.grantAnswer}</pre>
            <div style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => copyToClipboard(generated.grantAnswer)} type="button">
                Copy
              </button>
            </div>
          </>
        )}
        {tab === "graph" && (
          <ClaimGraph pack={pack} unmappedClaims={generated.critique.unmappedClaims} />
        )}
      </section>
    </div>
  );
}

function emptyPack(): ProofPack {
  return {
    profile: { name: "", problem: "", users: "", impact: "" },
    workflow: { tool: "Hermes Agent", models: [], pipeline: "", verification: "" },
    claims: [],
    evidence: []
  };
}
