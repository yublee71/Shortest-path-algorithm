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
