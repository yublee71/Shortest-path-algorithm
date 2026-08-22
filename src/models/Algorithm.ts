export type AlgorithmId = "dijkstra" | "bellman-ford" | "a-star";

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
