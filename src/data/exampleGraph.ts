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
    { id: "A-B", fromNodeId: "A", toNodeId: "B", weight: 4 },
    { id: "A-C", fromNodeId: "A", toNodeId: "C", weight: 2 },
    { id: "B-C", fromNodeId: "B", toNodeId: "C", weight: 1 },
    { id: "B-D", fromNodeId: "B", toNodeId: "D", weight: 5 },
    { id: "C-D", fromNodeId: "C", toNodeId: "D", weight: 8 },
    { id: "C-E", fromNodeId: "C", toNodeId: "E", weight: 10 },
    { id: "D-E", fromNodeId: "D", toNodeId: "E", weight: 2 },
    { id: "D-F", fromNodeId: "D", toNodeId: "F", weight: 6 },
    { id: "E-F", fromNodeId: "E", toNodeId: "F", weight: 3 },
  ] satisfies Edge[],
} as const;
