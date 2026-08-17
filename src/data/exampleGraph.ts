import type { Edge, Node } from "../models/Graph";

export const exampleGraph = {
  nodes: [
    { id: "A", x: 80, y: 200 },
    { id: "B", x: 180, y: 120 },
    { id: "C", x: 180, y: 280 },
    { id: "D", x: 360, y: 120 },
    { id: "E", x: 360, y: 280 },
    { id: "Z", x: 500, y: 200 },
  ] satisfies Node[],
  edges: [
    { id: "A-B", nodeA: "A", nodeB: "B", weight: 4 },
    { id: "A-C", nodeA: "A", nodeB: "C", weight: 2 },
    { id: "B-C", nodeA: "B", nodeB: "C", weight: 1 },
    { id: "B-D", nodeA: "B", nodeB: "D", weight: 5 },
    { id: "C-D", nodeA: "C", nodeB: "D", weight: 8 },
    { id: "C-E", nodeA: "C", nodeB: "E", weight: 10 },
    { id: "D-E", nodeA: "D", nodeB: "E", weight: 2 },
    { id: "D-Z", nodeA: "D", nodeB: "Z", weight: 6 },
    { id: "E-Z", nodeA: "E", nodeB: "Z", weight: 3 },
  ] satisfies Edge[],
} as const;
