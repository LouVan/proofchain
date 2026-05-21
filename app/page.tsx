import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <h1>Turn AI build evidence into a claim chain reviewers can verify.</h1>
        <p className="lead">
          ProofChain helps grant applicants, hackathon teams, and model-credit seekers turn messy
          screenshots, terminal logs, repos, and demos into a structured proof pack. Each claim is
          mapped to inspectable evidence, with a built-in reviewer self-check so weak applications
          get caught before submission.
        </p>
        <div style={{ marginTop: 22 }}>
          <Link href="/builder" className="btn">Open the builder</Link>
          {" "}
          <Link href="/examples" className="btn ghost">View examples</Link>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Claim chain</h3>
          <p className="dim">
            Every claim links to one or more evidence items. Unmapped claims are flagged so
            reviewers never see an undefended assertion.
          </p>
        </div>
        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Critique mode</h3>
          <p className="dim">
            ProofChain runs a heuristic review against your draft and surfaces blocking issues
            before you submit. Score, flagged fields, gaps in evidence.
          </p>
        </div>
        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Two outputs</h3>
          <p className="dim">
            Generate a long-form Markdown dossier or a concise grant-answer paragraph trimmed to
            common application length limits.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 className="h2">Why this exists</h2>
        <p className="dim">
          Programs like Xiaomi MiMo Orbit, OpenAI grants, and Anthropic credits all ask the same
          question: <em>show us what you built and how AI agents helped</em>. Strong projects look
          weaker than they are when reviewers have to reconstruct the story from a pile of
          screenshots and links. ProofChain fixes that by structuring claims and pinning each one
          to inspectable evidence, then self-checking the result before submission.
        </p>
        <h2 className="h2">Built with Hermes Agent</h2>
        <p className="dim">
          The entire web app, schema, generator, and critique heuristics were authored end-to-end
          through a Hermes Agent session. Hermes orchestrated a 4-stage long-chain reasoning
          pipeline (spec → codegen → critique → verification) with persistent memory and a skill
          registry across stages. The repository commit history reflects each stage as a discrete,
          reviewable change.
        </p>
      </section>
    </div>
  );
}
