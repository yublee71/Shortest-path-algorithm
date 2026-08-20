import type { AdjacencyList, Node } from "../models/Graph";

interface DijkstraProps {
  nodes: Node[];
  adjacencyList: AdjacencyList;
  sourceNodeId: string;
  targetNodeId: string;
}

export interface DijkstraStep {
  currentVisitingNodesId?: string[];
  visitedNodesId?: string[];
  distances: Record<string, number>;
  previousNodes?: Record<string, string | null>;
  prevDistances?: Record<string, number>;
  altDistances?: Record<string, number>;
  totalDistance?: number;
  path?: string;
  currentlyVisitingEdgesId?: string[];
  isVisitingStep?: boolean;
  nextVisitingNodeId?: string | null;
}

// export interface DijkstraResult {
//   distance: number;
//   path: string[];
// }

export function dijkstra({
  nodes,
  adjacencyList,
  sourceNodeId,
  targetNodeId,
}: DijkstraProps): DijkstraStep[] {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const queue: Set<string> = new Set();
  const dijkstraSteps: DijkstraStep[] = [];

  for (const v of nodes) {
    dist[v.id] = Infinity;
    prev[v.id] = null;
    queue.add(v.id);
  }

  dist[sourceNodeId] = 0;

  const visitedNodesId: string[] = [];

  while (queue.size > 0) {
    const u = getClosestNode(queue, dist);

    if (u === null || dist[u] === Infinity) {
      break;
    }

    visitedNodesId.push(u);

    const currentStep = {
      visitedNodesId: [...visitedNodesId],
      distances: { ...dist },
      previousNodes: { ...prev },
      totalDistance: 0,
      path: "",
      isVisitingStep: u === sourceNodeId,
    };

    if (u === targetNodeId) {
      const path: string[] = [];
      let currentNodeId: string | undefined | null = targetNodeId;

      while (currentNodeId !== undefined && currentNodeId !== null) {
        path.push(currentNodeId);
        currentNodeId = prev[currentNodeId];
      }

      path.reverse();

      //   if (prev[currentNodeId] === null && currentNodeId !== sourceNodeId) {
      //     throw new Error(
      //       `No path found from source "${sourceNodeId}" to target "${targetNodeId}".`
      //     );
      //   }

      currentStep.totalDistance = dist[targetNodeId];
      currentStep.path = path.join(", ");
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

  return dijkstraSteps;
}

function getClosestNode(
  queue: Set<string>,
  dist: Record<string, number>
): string | null {
  let closestNode: string | null = null;
  let minDistance = Infinity;

  for (const node of queue) {
    if (dist[node] < minDistance) {
      minDistance = dist[node];
      closestNode = node;
    }
  }

  return closestNode;
}

//  1  function Dijkstra(Graph, source):
//  2
//  3      for each vertex v in Graph.Vertices:
//  4          dist[v] ← INFINITY
//  5          prev[v] ← UNDEFINED
//  6          add v to Q
//  7      dist[source] ← 0
//  8
//  9      while Q is not empty:
// 10          u ← vertex in Q with minimum dist[u]
// 11          Q.remove(u)
// 12
// 13          for each edge (u, v) in Graph:
// 14              alt ← dist[u] + Graph.Distance(u,v)
// 15              if alt < dist[v]:
// 16                  dist[v] ← alt
// 17                  prev[v] ← u
// 18
// 19      return dist[], prev[]
// To find the shortest path between vertices source and target, the search terminates after line 10 if u = target. The shortest path from source to target can be obtained by reverse iteration:

// 1  S ← empty sequence
// 2  u ← target
// 3  if prev[u] is defined or u = source:    // Proceed if the vertex is reachable
// 4      while u is defined:                 // Construct shortest path with stack S
// 5          S.push(u)                       // Push the vertex onto the stack
// 6          u ← prev[u]                     // Traverse from target to source
