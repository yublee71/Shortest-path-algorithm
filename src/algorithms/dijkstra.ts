import type { AdjacencyList, Node } from "../models/Graph";

interface DijkstraProps {
  nodes: Node[];
  adjacencyList: AdjacencyList;
  sourceNodeId: string;
  targetNodeId: string;
}

export interface DijkstraResult {
  distance: number;
  path: string[];
}

export function dijkstra({
  nodes,
  adjacencyList,
  sourceNodeId,
  targetNodeId,
}: DijkstraProps): DijkstraResult {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const queue: Set<string> = new Set();

  for (const v of nodes) {
    dist[v.id] = Infinity;
    prev[v.id] = null;
    queue.add(v.id);
  }

  dist[sourceNodeId] = 0;

  while (queue.size > 0) {
    const u = getClosestNode(queue, dist);

    if (u === null || dist[u] === Infinity) {
      break;
    }

    if (u === targetNodeId) {
      break;
    }

    queue.delete(u);

    for (const neighbor of adjacencyList[u]) {
      const alt = dist[u] + neighbor.weight;
      if (alt < dist[neighbor.nodeId]) {
        dist[neighbor.nodeId] = alt;
        prev[neighbor.nodeId] = u;
      }
    }
  }

  const path: string[] = [];
  let currentNodeId: string | null = targetNodeId;

  if (prev[currentNodeId] === null && currentNodeId !== sourceNodeId) {
    throw new Error(
      `No path found from source "${sourceNodeId}" to target "${targetNodeId}".`
    );
  }

  while (currentNodeId !== null) {
    path.unshift(currentNodeId);
    currentNodeId = prev[currentNodeId];
  }

  console.log(
    `Shortest path from "${sourceNodeId}" to "${targetNodeId}":`,
    path
  );
  console.log(
    `Total distance from "${sourceNodeId}" to "${targetNodeId}":`,
    dist[targetNodeId]
  );

  return {
    distance: dist[targetNodeId],
    path: path,
  };
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
