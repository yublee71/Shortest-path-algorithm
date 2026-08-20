import { buildAdjacencyList, type Edge, type Node } from "../models/Graph";
import { bellmanFord } from "./bellmanford";
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
  { id: "A-B", fromNodeId: "A", toNodeId: "B", weight: 4 },
  { id: "A-C", fromNodeId: "A", toNodeId: "C", weight: 2 },
  { id: "B-C", fromNodeId: "B", toNodeId: "C", weight: 1 },
  { id: "B-D", fromNodeId: "B", toNodeId: "D", weight: 5 },
  { id: "C-D", fromNodeId: "C", toNodeId: "D", weight: 8 },
  { id: "C-E", fromNodeId: "C", toNodeId: "E", weight: 10 },
  { id: "D-E", fromNodeId: "D", toNodeId: "E", weight: 2 },
  { id: "D-Z", fromNodeId: "D", toNodeId: "Z", weight: 6 },
  { id: "E-Z", fromNodeId: "E", toNodeId: "Z", weight: 3 },
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

console.log(bellmanFord(nodes, edges, "A"));
