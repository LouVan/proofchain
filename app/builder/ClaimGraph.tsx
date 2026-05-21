"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Position,
  type Node,
  type Edge
} from "reactflow";
import "reactflow/dist/style.css";
import type { ProofPack } from "@/lib/types";

interface Props {
  pack: ProofPack;
  unmappedClaims: string[];
}

// Lays out claim nodes on the left and evidence nodes on the right.
// Edges go from each evidence node to the claims it supports.
export default function ClaimGraph({ pack, unmappedClaims }: Props) {
  const { nodes, edges } = useMemo(() => {
    const claimNodes: Node[] = pack.claims.map((c, i) => {
      const unmapped = unmappedClaims.includes(c.id);
      return {
        id: `claim-${c.id}`,
        position: { x: 0, y: i * 90 },
        data: {
          label: `${c.id}: ${truncate(c.text, 60)}`
        },
        style: {
          background: unmapped ? "#3a1f1f" : "#1c2027",
          color: "#e6eaf0",
          border: `1px solid ${unmapped ? "#ff7a7a" : "#2a2f38"}`,
          borderRadius: 6,
          fontSize: 12,
          padding: 8,
          width: 240
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Right
      };
    });

    const evidenceNodes: Node[] = pack.evidence.map((e, i) => ({
      id: `ev-${e.id}`,
      position: { x: 360, y: i * 70 },
      data: {
        label: `${e.id} [${e.kind}]: ${truncate(e.label, 50)}`
      },
      style: {
        background: "#14171c",
        color: "#7cf0a9",
        border: "1px solid #2a2f38",
        borderRadius: 6,
        fontSize: 12,
        padding: 8,
        width: 240
      },
      sourcePosition: Position.Left,
      targetPosition: Position.Left
    }));

    const edgeList: Edge[] = [];
    for (const e of pack.evidence) {
      for (const cid of e.supports) {
        edgeList.push({
          id: `e-${e.id}-${cid}`,
          source: `ev-${e.id}`,
          target: `claim-${cid}`,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#5cc8ff" },
          style: { stroke: "#5cc8ff" }
        });
      }
    }

    return { nodes: [...claimNodes, ...evidenceNodes], edges: edgeList };
  }, [pack, unmappedClaims]);

  return (
    <div className="graph-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2a2f38" gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
