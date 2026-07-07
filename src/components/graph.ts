export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  nodeA: string;
  nodeB: string;
  weight: number;
}

export function calculateDistanceWeight(nodeA: Node, nodeB: Node) {
  return Math.round(Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y));
}

