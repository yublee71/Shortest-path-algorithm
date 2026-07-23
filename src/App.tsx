import "./App.css";
import { useEffect, useState } from "react";
import {
  buildAdjacencyList,
  calculateDistanceWeight,
  type Edge,
  type Node,
} from "./models/Graph";
import { GraphCanvas } from "./components/GraphCanvas/GraphCanvas";
import { Button } from "@mantine/core";

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nextNodeIndex, setNextNodeIndex] = useState(0);
  const [isAlgorithmMode, setIsAlgorithmMode] = useState(false);
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Adjacency list:", buildAdjacencyList(nodes, edges));
  }, [nodes, edges]);

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

    setNodes((currentNodes) => [...currentNodes, { id, x, y }]);
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

      return [...currentEdges, { id: edgeId, nodeA, nodeB, weight }];
    });
  };

  const deleteEdge = (id: string) => {
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== id));
  };

  const onRunButtonClick = () => {
    if (nodes.length < 2) {
      alert("Please add at least two nodes to run the algorithm.");
      return;
    }
    if (edges.length === 0) {
      alert("Please add at least one edge to run the algorithm.");
      return;
    }
    setIsAlgorithmMode(true);
  };

  return (
    <>
      <h1 style={{ marginBottom: "0px" }}>Shortest Path Algorithm</h1>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={onRunButtonClick} disabled={isAlgorithmMode}>
            {isAlgorithmMode ? "Running" : "Run"}
          </Button>
          {sourceNodeId && targetNodeId && (
            <>
              <Button>❮</Button>
              <Button>❯</Button>
            </>
          )}
        </div>
        {isAlgorithmMode && (
          <div>
            <span style={{ marginRight: "10px" }}>
              {sourceNodeId ? `Source: ${sourceNodeId}` : "Select source node"}
            </span>
            <span>
              {targetNodeId ? `Target: ${targetNodeId}` : "Select target node"}
            </span>
          </div>
        )}
      </div>
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        isEditable={!isAlgorithmMode}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onMoveNode={moveNode}
        onAddEdge={addEdge}
        onDeleteEdge={deleteEdge}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
        onSelectSourceNode={(id) => setSourceNodeId(id)}
        onSelectTargetNode={(id) => setTargetNodeId(id)}
      />
    </>
  );
}

export default App;
