import "./App.css";
import { useState } from "react";
import {
  calculateDistanceWeight,
  type Edge,
  type Node,
} from "./components/graph";
import { GraphCanvas } from "./components/GraphCanvas";

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nextNodeIndex, setNextNodeIndex] = useState(0);

  const generateNodeId = (index: number) => {
    let label = "";
    let current = index;

    while (current >= 0) {
      label = String.fromCharCode(65 + (current % 26)) + label;
      current = Math.floor(current / 26) - 1;
    }

    return label;
  };

  const addNode = (x: number, y: number) => {
    const id = generateNodeId(nextNodeIndex);

    setNodes((currentNodes) => [
      ...currentNodes,
      { id, x, y },
    ]);
    setNextNodeIndex((currentIndex) => currentIndex + 1);

    return id;
  };

  const deleteNode = (id: string) => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.nodeA !== id && edge.nodeB !== id)
    );
  };

  const moveNode = (id: string, x: number, y: number) => {
    const updatedNodes = nodes.map((node) =>
      node.id === id ? { ...node, x, y } : node
    );
    const nodeById = new Map(updatedNodes.map((node) => [node.id, node]));

    setNodes(updatedNodes);
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const nodeA = nodeById.get(edge.nodeA);
        const nodeB = nodeById.get(edge.nodeB);

        if (!nodeA || !nodeB) {
          return edge;
        }

        const weight = calculateDistanceWeight(nodeA, nodeB);

        return { ...edge, weight };
      })
    );
  };

  const addEdge = (
    firstNodeId: string,
    secondNodeId: string,
    weight: number
  ) => {
    if (firstNodeId === secondNodeId) {
      return;
    }

    const [nodeA, nodeB] = [firstNodeId, secondNodeId].sort();
    const edgeId = `${nodeA}-${nodeB}`;

    setEdges((currentEdges) => {
      const edgeExists = currentEdges.some((edge) => edge.id === edgeId);

      if (edgeExists) {
        return currentEdges;
      }

      return [
        ...currentEdges,
        { id: edgeId, nodeA, nodeB, weight },
      ];
    });
  };

  const deleteEdge = (id: string) => {
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <h1>Shortest Path Algorithm</h1>
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onMoveNode={moveNode}
        onAddEdge={addEdge}
        onDeleteEdge={deleteEdge}
      />
    </>
  );
}

export default App;
