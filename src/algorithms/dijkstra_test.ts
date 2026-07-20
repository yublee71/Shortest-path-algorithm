import { buildAdjacencyList, type Edge, type Node } from "../models/Graph";
import { dijkstra } from "./dijkstra";

const nodes: Node[] = [
  { id: "A", x: 0, y: 0 },
  { id: "B", x: 0, y: 0 },
  { id: "C", x: 0, y: 0 },
  { id: "D", x: 0, y: 0 },
  { id: "E", x: 0, y: 0 },
  { id: "Z", x: 0, y: 0 },
];

const edges: Edge[] = [
  { id: "A-B", nodeA: "A", nodeB: "B", weight: 4 },
  { id: "A-C", nodeA: "A", nodeB: "C", weight: 2 },
  { id: "B-C", nodeA: "B", nodeB: "C", weight: 1 },
  { id: "B-D", nodeA: "B", nodeB: "D", weight: 5 },
  { id: "C-D", nodeA: "C", nodeB: "D", weight: 8 },
  { id: "C-E", nodeA: "C", nodeB: "E", weight: 10 },
  { id: "D-E", nodeA: "D", nodeB: "E", weight: 2 },
  { id: "D-Z", nodeA: "D", nodeB: "Z", weight: 6 },
  { id: "E-Z", nodeA: "E", nodeB: "Z", weight: 3 },
];

const adjacencyList = buildAdjacencyList(nodes, edges);

console.log(
  dijkstra({
    nodes,
    adjacencyList,
    sourceNodeId: "A",
    targetNodeId: "Z",
  })
);
