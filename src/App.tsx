import "./App.css";
import { useState } from "react";
import { calculateDistanceWeight, type Edge, type Node } from "./models/Graph";
import { GraphCanvas } from "./components/GraphCanvas/GraphCanvas";
import { type DijkstraStep } from "./algorithms/dijkstra";
import { AlgorithmExplanation } from "./components/AlgorithmExplanation";
import { Buttons } from "./components/Buttons";
import { exampleGraph } from "./data/exampleGraph";

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nextNodeIndex, setNextNodeIndex] = useState(0);
  const [isAlgorithmMode, setIsAlgorithmMode] = useState(false);
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);
  //   const [dijkstraResult, setDijkstraResult] = useState<DijkstraResult | null>(
  // null
  //   );
  const [dijkstraSteps, setDijkstraSteps] = useState<DijkstraStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

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

  const updateEdgeWeight = (id: string, weight: number) => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => (edge.id === id ? { ...edge, weight } : edge))
    );
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

  const onClearButtonClick = () => {
    setNodes([]);
    setEdges([]);
    setSourceNodeId(null);
    setTargetNodeId(null);
    setIsAlgorithmMode(false);
    setNextNodeIndex(0);
    setDijkstraSteps([]);
    setCurrentStepIndex(0);
  };

  const onLoadExampleGraphClick = () => {
    setNodes(exampleGraph.nodes);
    setEdges(exampleGraph.edges);
    setSourceNodeId(null);
    setTargetNodeId(null);
    setIsAlgorithmMode(false);
    setNextNodeIndex(exampleGraph.nodes.length);
    setDijkstraSteps([]);
    setCurrentStepIndex(0);
  };

  return (
    <div className="app-grid">
      <h1 className="app-heading">Shortest Path Algorithm</h1>
      <Buttons
        className="app-buttons"
        onRunButtonClick={onRunButtonClick}
        onLoadExampleGraphClick={onLoadExampleGraphClick}
        onClearButtonClick={onClearButtonClick}
        isAlgorithmMode={isAlgorithmMode}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
        dijkstraSteps={dijkstraSteps}
        currentStepIndex={currentStepIndex}
        setCurrentStepIndex={setCurrentStepIndex}
      ></Buttons>
      <GraphCanvas
        className="app-canvas"
        nodes={nodes}
        edges={edges}
        isEditable={!isAlgorithmMode}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onMoveNode={moveNode}
        onAddEdge={addEdge}
        onDeleteEdge={deleteEdge}
        onUpdateEdgeWeight={updateEdgeWeight}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
        onSelectSourceNode={(id) => setSourceNodeId(id)}
        onSelectTargetNode={(id) => setTargetNodeId(id)}
        dijkstraSteps={dijkstraSteps}
        setDijkstraSteps={setDijkstraSteps}
        currentStepIndex={currentStepIndex}
      />
      <AlgorithmExplanation
        className="app-explanation"
        isAlgorithmMode={isAlgorithmMode}
        nodes={nodes}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
        dijkstraSteps={dijkstraSteps}
        currentStepIndex={currentStepIndex}
      />
      {/* {dijkstraSteps && (
        <div style={{ marginTop: "10px" }}>
          <p>
            Shortest path from {sourceNodeId} to {targetNodeId}:{" "}
            {dijkstraSteps.path.join(" → ")}
          </p>
          <p>Total distance: {dijkstraSteps.distance}</p>
        </div>
      )} */}
    </div>
  );
}

export default App;
