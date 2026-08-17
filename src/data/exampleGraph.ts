import type { Edge, Node } from "../models/Graph";

export const exampleGraph = {
  nodes: [
    { id: "A", x: 80, y: 200 },
    { id: "B", x: 180, y: 120 },
    { id: "C", x: 180, y: 280 },
    { id: "D", x: 360, y: 120 },
    { id: "E", x: 360, y: 280 },
    { id: "F", x: 500, y: 200 },
  ] satisfies Node[],
  edges: [
    { id: "A-B", nodeA: "A", nodeB: "B", weight: 40 },
    { id: "A-C", nodeA: "A", nodeB: "C", weight: 20 },
    { id: "B-C", nodeA: "B", nodeB: "C", weight: 10 },
    { id: "B-D", nodeA: "B", nodeB: "D", weight: 50 },
    { id: "C-D", nodeA: "C", nodeB: "D", weight: 80 },
    { id: "C-E", nodeA: "C", nodeB: "E", weight: 100 },
    { id: "D-E", nodeA: "D", nodeB: "E", weight: 20 },
    { id: "D-F", nodeA: "D", nodeB: "F", weight: 60 },
    { id: "E-F", nodeA: "E", nodeB: "F", weight: 30 },
  ] satisfies Edge[],
} as const;
