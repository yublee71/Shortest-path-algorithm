import type {
  AlgorithmInput,
  AlgorithmResult,
  AlgorithmStep,
} from "../models/Algorithm";
import { getFinalPathEdgeIds } from "../models/Algorithm";

export interface BellmanFordStep extends AlgorithmStep {
  iteration: number;
  totalIterations: number;
  relaxedEdgesId: string[];
  skippedEdgesId: string[];
  hasReachableNegativeCycle?: boolean;
}

export function bellmanFord({
  nodes,
  edges,
  sourceNodeId,
  targetNodeId,
}: AlgorithmInput): AlgorithmResult {
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const bellmanFordSteps: BellmanFordStep[] = [];
  const totalIterations = nodes.length - 1;
  let edgeCheckCount = 0;

  for (const node of nodes) {
    distances[node.id] = node.id === sourceNodeId ? 0 : Infinity;
    previousNodes[node.id] = null;
  }

  bellmanFordSteps.push({
    iteration: 0,
    totalIterations,
    currentVisitingNodesId: [],
    currentlyVisitingEdgesId: [],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    prevDistances: {},
    altDistances: {},
    relaxedEdgesId: [],
    skippedEdgesId: [],
  });

  for (let i = 0; i < totalIterations; i++) {
    const relaxedEdgesId: string[] = [];

    for (const edge of edges) {
      const prevDistances: Record<string, number> = {};
      const altDistances: Record<string, number> = {};

      if (distances[edge.fromNodeId] === Infinity) {
        relaxedEdgesId.push(edge.id);
        edgeCheckCount += 1;

        bellmanFordSteps.push({
          iteration: i + 1,
          totalIterations,
          currentVisitingNodesId: [edge.fromNodeId, edge.toNodeId],
          currentlyVisitingEdgesId: [edge.id],
          distances: { ...distances },
          previousNodes: { ...previousNodes },
          prevDistances: {},
          altDistances: {},
          relaxedEdgesId: [...relaxedEdgesId],
          skippedEdgesId: [edge.id],
        });

        continue;
      } else {
        const nextDistance = distances[edge.fromNodeId] + edge.weight;

        if (distances[edge.toNodeId] > nextDistance) {
          prevDistances[edge.toNodeId] = distances[edge.toNodeId];
          distances[edge.toNodeId] = nextDistance;
          previousNodes[edge.toNodeId] = edge.fromNodeId;
        } else {
          altDistances[edge.toNodeId] = nextDistance;
        }
      }

      relaxedEdgesId.push(edge.id);
      edgeCheckCount += 1;

      bellmanFordSteps.push({
        iteration: i + 1,
        totalIterations,
        currentVisitingNodesId: [edge.fromNodeId, edge.toNodeId],
        currentlyVisitingEdgesId: [edge.id],
        distances: { ...distances },
        previousNodes: { ...previousNodes },
        prevDistances: { ...prevDistances },
        altDistances: { ...altDistances },
        relaxedEdgesId: [...relaxedEdgesId],
        skippedEdgesId: [],
      });
    }
  }

  const reachableNegativeCycle = edges.some((edge) => {
    if (distances[edge.fromNodeId] === Infinity) {
      return false;
    }

    return distances[edge.toNodeId] > distances[edge.fromNodeId] + edge.weight;
  });

  bellmanFordSteps.push({
    iteration: totalIterations,
    totalIterations,
    currentVisitingNodesId: [],
    currentlyVisitingEdgesId: [],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    prevDistances: {},
    altDistances: {},
    relaxedEdgesId: [],
    skippedEdgesId: [],
    hasReachableNegativeCycle: reachableNegativeCycle,
  });

  const pathNodeIds =
    targetNodeId === undefined || reachableNegativeCycle
      ? []
      : createPath(previousNodes, sourceNodeId, targetNodeId);

  return {
    algorithmId: "bellman-ford",
    steps: bellmanFordSteps,
    totalDistance:
      targetNodeId === undefined || reachableNegativeCycle
        ? undefined
        : distances[targetNodeId],
    path: pathNodeIds.length === 0 ? undefined : pathNodeIds.join(", "),
    finalPathEdgeIds: getFinalPathEdgeIds(pathNodeIds),
    edgeCheckCount,
    hasReachableNegativeCycle: reachableNegativeCycle,
  };
}

function createPath(
  previousNodes: Record<string, string | null>,
  sourceNodeId: string,
  targetNodeId: string
): string[] {
  const path: string[] = [];
  let currentNodeId: string | null = targetNodeId;

  while (currentNodeId !== null) {
    path.push(currentNodeId);
    currentNodeId = previousNodes[currentNodeId];
  }

  path.reverse();

  if (path[0] !== sourceNodeId) {
    return [];
  }

  return path;
}
