import { buildAdjacencyList } from "../models/Graph";
import type {
  AlgorithmInput,
  AlgorithmResult,
  AlgorithmStep,
} from "../models/Algorithm";
import { getFinalPathEdgeIds } from "../models/Algorithm";

export interface DijkstraStep extends AlgorithmStep {
  isVisitingStep?: boolean;
  nextVisitingNodeId?: string;
}

export function dijkstra({
  nodes,
  edges,
  sourceNodeId,
  targetNodeId,
}: AlgorithmInput & { targetNodeId: string }): AlgorithmResult {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const queue: Set<string> = new Set();
  const dijkstraSteps: DijkstraStep[] = [];
  let path = "";
  let totalDistance = Infinity;
  let edgeCheckCount = 0;
  let finalPathEdgeIds: string[] = [];

  for (const v of nodes) {
    dist[v.id] = Infinity;
    prev[v.id] = null;
    queue.add(v.id);
  }

  dist[sourceNodeId] = 0;

  const visitedNodesId: string[] = [];

  while (queue.size > 0) {
    const u = getClosestNode(queue, dist);

    if (u === undefined || dist[u] === Infinity) {
      break;
    }

    visitedNodesId.push(u);

    const currentStep = {
      visitedNodesId: [...visitedNodesId],
      distances: { ...dist },
      previousNodes: { ...prev },
      isVisitingStep: u === sourceNodeId || u === targetNodeId,
    };

    if (u === targetNodeId) {
      const pathNodes: string[] = [];
      let currentNodeId: string | undefined | null = targetNodeId;

      while (currentNodeId !== undefined && currentNodeId !== null) {
        pathNodes.push(currentNodeId);
        currentNodeId = prev[currentNodeId];
      }

      pathNodes.reverse();

      totalDistance = dist[targetNodeId];
      path = pathNodes.join(", ");
      finalPathEdgeIds = getFinalPathEdgeIds(pathNodes);
      dijkstraSteps.push(currentStep);
      break;
    }

    dijkstraSteps.push(currentStep);

    queue.delete(u);

    const currentVisitingNodesId = adjacencyList[u].map(
      (neighbor) => neighbor.nodeId
    );
    const currentlyVisitingEdgesId: string[] = [];

    const prevDist: Record<string, number> = {};
    const altDist: Record<string, number> = {};

    for (const neighbor of adjacencyList[u]) {
      if (!queue.has(neighbor.nodeId)) {
        continue;
      }
      const alt = dist[u] + neighbor.weight;
      const edgeId = `${u}-${neighbor.nodeId}`;

      currentlyVisitingEdgesId.push(edgeId);
      edgeCheckCount += 1;
      if (alt < dist[neighbor.nodeId]) {
        prevDist[neighbor.nodeId] = dist[neighbor.nodeId];
        dist[neighbor.nodeId] = alt;
        prev[neighbor.nodeId] = u;
      } else {
        altDist[neighbor.nodeId] = alt;
      }
    }

    const nextVisitingNodeId = getClosestNode(queue, dist);

    dijkstraSteps.push({
      visitedNodesId: [...visitedNodesId],
      currentVisitingNodesId: [...currentVisitingNodesId],
      prevDistances: { ...prevDist },
      altDistances: { ...altDist },
      distances: { ...dist },
      previousNodes: { ...prev },
      currentlyVisitingEdgesId: [...currentlyVisitingEdgesId],
      nextVisitingNodeId,
    });
  }

  return {
    algorithmId: "dijkstra",
    steps: dijkstraSteps,
    path,
    finalPathEdgeIds,
    totalDistance,
    visitedNodeCount: visitedNodesId.length,
    edgeCheckCount,
  };
}

function getClosestNode(
  queue: Set<string>,
  dist: Record<string, number>
): string | undefined {
  let closestNode: string | undefined = undefined;
  let minDistance = Infinity;

  for (const node of queue) {
    if (dist[node] < minDistance) {
      minDistance = dist[node];
      closestNode = node;
    }
  }

  return closestNode;
}
