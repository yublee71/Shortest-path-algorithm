import type { Edge, Node } from "./Graph";

export type AlgorithmId = "dijkstra" | "bellman-ford" | "a-star";

export const algorithmOptions: { id: AlgorithmId; label: string }[] = [
  { id: "dijkstra", label: "Dijkstra" },
  { id: "bellman-ford", label: "Bellman-Ford" },
  { id: "a-star", label: "A*" },
];

export function getAlgorithmLabel(algorithmId: AlgorithmId | null): string {
  return (
    algorithmOptions.find((algorithm) => algorithm.id === algorithmId)?.label ??
    ""
  );
}

export interface AlgorithmStep {
  currentVisitingNodesId?: string[];
  visitedNodesId?: string[];
  distances: Record<string, number>;
  previousNodes?: Record<string, string | null>;
  prevDistances?: Record<string, number>;
  altDistances?: Record<string, number>;
  totalDistance?: number;
  path?: string;
  currentlyVisitingEdgesId?: string[];
  nextVisitingNodeId?: string | null;
}

export interface AlgorithmInput {
  nodes: Node[];
  edges: Edge[];
  sourceNodeId: string;
  targetNodeId?: string;
}
