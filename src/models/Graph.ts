export interface Node {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface Edge {
  id: string;
  nodeA: string;
  nodeB: string;
  weight: number;
}

export interface AdjacentNode {
  nodeId: string;
  weight: number;
}

export type AdjacencyList = Record<string, AdjacentNode[]>;

export function calculateDistanceWeight(nodeA: Node, nodeB: Node) {
  return Math.round(Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y));
}

export function buildAdjacencyList(nodes: Node[], edges: Edge[]) {
  const adjacencyList: AdjacencyList = {};

  for (const node of nodes) {
    adjacencyList[node.id] = [];
  }

  for (const edge of edges) {
    if (!adjacencyList[edge.nodeA] || !adjacencyList[edge.nodeB]) {
      continue;
    }

    adjacencyList[edge.nodeA].push({
      nodeId: edge.nodeB,
      weight: edge.weight,
    });

    adjacencyList[edge.nodeB].push({
      nodeId: edge.nodeA,
      weight: edge.weight,
    });
  }

  return adjacencyList;
}
