import "./App.css";
import { useState } from "react";
import type { Edge, Node } from "./components/graph";
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
    setNodes((currentNodes) =>
      currentNodes.map((node) => (node.id === id ? { ...node, x, y } : node))
    );
  };

  const addEdge = (firstNodeId: string, secondNodeId: string) => {
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
        { id: edgeId, nodeA, nodeB },
      ];
    });
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
      />
    </>
  );
}

export default App;
