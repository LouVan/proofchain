import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ProofChain — Reviewer-ready proof packs for AI builders",
  description:
    "Turn fragmented AI build evidence into a structured claim chain. Generate reviewer-ready Markdown for grants, hackathons, and model credits.",
  openGraph: {
    title: "ProofChain",
    description:
      "Reviewer-ready proof packs for AI-assisted builders. Map every claim to inspectable evidence.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="brand">ProofChain</Link>
          <div>
            <Link href="/builder">Builder</Link>
            <Link href="/examples">Examples</Link>
            <Link href="/PRD.md">PRD</Link>
            <a href="https://github.com/LouVan/proofchain" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </nav>
        {children}
        <footer className="container foot">
          ProofChain · Built with Hermes Agent · MIT License · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
