import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { generate } from "../lib/generate-proof";
import { SAMPLE_PACK } from "../lib/sample";

// Regenerate the frozen sample. Used during the verification stage so any drift
// in the generator output shows up as a diff in version control.
const out = generate(SAMPLE_PACK);
const target = join(process.cwd(), "public", "examples", "sample.md");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, out.markdown, "utf8");
console.log(`Wrote ${target} (${out.markdown.length} chars, score ${out.critique.score}/100)`);
