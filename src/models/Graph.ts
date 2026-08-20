export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  weight: number;
}

export interface AdjacentNode {
  nodeId: string;
  weight: number;
}

export type AdjacencyList = Record<string, AdjacentNode[]>;

export function calculateDistanceWeight(fromNode: Node, toNode: Node) {
  const euclideanDistance = Math.hypot(
    fromNode.x - toNode.x,
    fromNode.y - toNode.y
  );
  const EDGE_WEIGHT_DISPLAY_SCALE = 10;

  return Math.max(1, Math.round(euclideanDistance / EDGE_WEIGHT_DISPLAY_SCALE));
}

export function buildAdjacencyList(nodes: Node[], edges: Edge[]) {
  const adjacencyList: AdjacencyList = {};

  for (const node of nodes) {
    adjacencyList[node.id] = [];
  }

  for (const edge of edges) {
    if (!adjacencyList[edge.fromNodeId] || !adjacencyList[edge.toNodeId]) {
      continue;
    }

    adjacencyList[edge.fromNodeId].push({
      nodeId: edge.toNodeId,
      weight: edge.weight,
    });
  }

  return adjacencyList;
}
