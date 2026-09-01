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
  currentlyVisitingEdgesId?: string[];
}

export interface AlgorithmInput {
  nodes: Node[];
  edges: Edge[];
  sourceNodeId: string;
  targetNodeId?: string;
}

export interface AlgorithmResult {
  algorithmId: AlgorithmId;
  steps: AlgorithmStep[];
  path?: string;
  finalPathEdgeIds: string[];
  totalDistance?: number;
  visitedNodeCount?: number;
  edgeCheckCount: number;
  hasReachableNegativeCycle?: boolean;
}

export function getFinalPathEdgeIds(pathNodeIds: string[]): string[] {
  return pathNodeIds.slice(0, -1).map((nodeId, index) => {
    return `${nodeId}-${pathNodeIds[index + 1]}`;
  });
}
