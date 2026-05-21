import Link from "next/link";
import { generate } from "@/lib/generate-proof";
import { SAMPLE_PACK } from "@/lib/sample";

export default function ExamplesPage() {
  const generated = generate(SAMPLE_PACK);
  return (
    <div className="container">
      <h1 className="h1">Examples</h1>
      <p className="dim">
        A reviewer-facing sample built from the ProofChain self-application. Open the builder to
        edit it, or copy the Markdown directly.
      </p>

      <div className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>Sample: ProofChain self-application</h2>
        <p className="dim">
          ProofChain was built end-to-end with Hermes Agent. This sample uses the project itself
          as the application so reviewers can compare claims to inspectable artifacts in this
          repository.
        </p>
        <p>
          <Link href="/builder" className="btn">
            Open in builder
          </Link>
        </p>
        <pre className="output">{generated.markdown}</pre>
      </div>

      <div className="card">
        <h2 className="h2" style={{ marginTop: 0 }}>Short grant answer</h2>
        <p className="dim">
          Trimmed to a 1,200-character target so it fits Xiaomi MiMo Orbit and similar
          application forms.
        </p>
        <pre className="output">{generated.grantAnswer}</pre>
      </div>
    </div>
  );
}
