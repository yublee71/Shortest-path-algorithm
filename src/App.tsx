import "./App.css";
import { useState } from "react";
import type { Node } from "./components/graph";
import { GraphCanvas } from "./components/GraphCanvas";

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
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
    setNodes((currentNodes) => [
      ...currentNodes,
      { id: generateNodeId(nextNodeIndex), x, y },
    ]);
    setNextNodeIndex((currentIndex) => currentIndex + 1);
  };

  const deleteNode = (id: string) => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
  };

  return (
    <>
      <h1>Shortest Path Algorithm</h1>
      <GraphCanvas
        nodes={nodes}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
      />
    </>
  );
}

export default App;
