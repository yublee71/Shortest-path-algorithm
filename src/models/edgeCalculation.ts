import type { Node, Edge } from "./Graph";

export function calculateDistanceWeight(fromNode: Node, toNode: Node) {
  const euclideanDistance = Math.hypot(
    fromNode.x - toNode.x,
    fromNode.y - toNode.y
  );
  const EDGE_WEIGHT_DISPLAY_SCALE = 10;

  return Math.max(1, Math.round(euclideanDistance / EDGE_WEIGHT_DISPLAY_SCALE));
}

export function hasReverseEdge(edges: Edge[], edge: Edge) {
  return edges.some(
    (otherEdge) =>
      otherEdge.fromNodeId === edge.toNodeId &&
      otherEdge.toNodeId === edge.fromNodeId
  );
}
