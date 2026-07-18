import type { Node } from "../../models/Graph";

interface Point {
  x: number;
  y: number;
}

interface DraftEdgeProps {
  fromNode?: Node;
  to: Point;
}

export function DraftEdge({ fromNode, to }: DraftEdgeProps) {
  if (!fromNode) {
    return null;
  }

  return (
    <line
      x1={fromNode.x}
      y1={fromNode.y}
      x2={to.x}
      y2={to.y}
      stroke="#64748b"
      strokeWidth={2}
      pointerEvents="none"
    />
  );
}
