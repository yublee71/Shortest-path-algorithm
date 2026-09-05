import "./App.css";
import { useState } from "react";
import { type Edge, type Node } from "./models/Graph";
import { calculateDistanceWeight } from "./models/edgeCalculation";
import { GraphCanvas } from "./components/GraphCanvas/GraphCanvas";
import { Information } from "./components/Information/Information";
import { Buttons } from "./components/Buttons/Buttons";
import { exampleGraph } from "./data/exampleGraph";
import type {
  AlgorithmId,
  AlgorithmResult,
  AlgorithmStep,
} from "./models/Algorithm";
import { isCorrectDistanceInput, type PracticeHint } from "./models/Practice";

const MAX_NODE_COUNT = 15;

function getNextVisitingNodeId(step: AlgorithmStep | undefined) {
  if (!step || !("nextVisitingNodeId" in step)) {
    return undefined;
  }

  return step.nextVisitingNodeId as string | undefined;
}

function App() {
  const [nodes, setNodes] = useState<Node[]>(exampleGraph.nodes);
  const [edges, setEdges] = useState<Edge[]>(exampleGraph.edges);
  const [nextNodeIndex, setNextNodeIndex] = useState(exampleGraph.nodes.length);
  const [isAlgorithmMode, setIsAlgorithmMode] = useState(false);
  const [isRunMode, setIsRunMode] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmId | null>(null);
  const [compareAlgorithmIds, setCompareAlgorithmIds] = useState<AlgorithmId[]>(
    []
  );
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);
  const [algorithmResult, setAlgorithmResult] =
    useState<AlgorithmResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<AlgorithmResult[]>(
    []
  );
  const [selectedComparisonAlgorithmId, setSelectedComparisonAlgorithmId] =
    useState<AlgorithmId | null>(null);
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [practiceDistances, setPracticeDistances] = useState<
    Record<string, string>
  >({});
  const [hasCheckedPracticeStep, setHasCheckedPracticeStep] = useState(false);
  const [completedPracticeSteps, setCompletedPracticeSteps] = useState<
    Record<number, boolean>
  >({});
  const [practiceWrongCheckCounts, setPracticeWrongCheckCounts] = useState<
    Record<number, number>
  >({});
  const [practiceNextNodes, setPracticeNextNodes] = useState<
    Record<number, string>
  >({});

  const currentAlgorithmStep = algorithmSteps[currentStepIndex];
  const isCurrentPracticeStepCorrect =
    isPracticeMode &&
    sourceNodeId !== null &&
    targetNodeId !== null &&
    currentAlgorithmStep !== undefined &&
    nodes.every((node) => {
      return isCorrectDistanceInput(
        practiceDistances[`${currentStepIndex}:${node.id}`],
        currentAlgorithmStep.distances[node.id]
      );
    });
  const hasCompletedCurrentPracticeStep =
    completedPracticeSteps[currentStepIndex] === true;
  const shouldShowFeedback =
    hasCheckedPracticeStep || hasCompletedCurrentPracticeStep;
  const currentPracticeNextNodeId = getNextVisitingNodeId(currentAlgorithmStep);
  const needsPracticeNextNode =
    isPracticeMode &&
    currentStepIndex > 0 &&
    currentStepIndex < algorithmSteps.length - 1 &&
    currentPracticeNextNodeId !== undefined;
  const selectedPracticeNextNodeId = practiceNextNodes[currentStepIndex] ?? "";
  const isCurrentPracticeNextNodeCorrect =
    !needsPracticeNextNode ||
    selectedPracticeNextNodeId === currentPracticeNextNodeId;
  const isCurrentPracticeAnswerCorrect =
    isCurrentPracticeStepCorrect && isCurrentPracticeNextNodeCorrect;
  const shouldShowPracticeNextNodeSelect =
    needsPracticeNextNode && shouldShowFeedback && isCurrentPracticeStepCorrect;
  const shouldShowExplanationTable =
    !isPracticeMode ||
    hasCompletedCurrentPracticeStep ||
    (hasCheckedPracticeStep && isCurrentPracticeStepCorrect);
  const canGoToNextPracticeStep =
    hasCompletedCurrentPracticeStep || isCurrentPracticeAnswerCorrect;
  const selectedComparisonResult = comparisonResults.find(
    (result) => result.algorithmId === selectedComparisonAlgorithmId
  );
  const comparisonFinalPathEdgeIds =
    selectedComparisonResult?.finalPathEdgeIds ?? [];
  const practiceHints: PracticeHint[] = [];

  if (isPracticeMode && hasCheckedPracticeStep && currentAlgorithmStep) {
    for (const node of nodes) {
      const expectedDistance = currentAlgorithmStep.distances[node.id];
      const selectedDistance =
        practiceDistances[`${currentStepIndex}:${node.id}`];

      if (
        expectedDistance === undefined ||
        isCorrectDistanceInput(selectedDistance, expectedDistance)
      ) {
        continue;
      }

      const previousDistance = currentAlgorithmStep.prevDistances?.[node.id];
      const alternativeDistance =
        previousDistance !== undefined
          ? expectedDistance
          : currentAlgorithmStep.altDistances?.[node.id];
      const currentDistance =
        previousDistance ?? currentAlgorithmStep.distances[node.id];

      practiceHints.push({
        hintNumber: practiceHints.length + 1,
        nodeId: node.id,
        currentDistance,
        alternativeDistance,
        expectedDistance,
      });
    }
  }
  const practiceHintNumbers: Record<string, number> = {};

  for (const hint of practiceHints) {
    practiceHintNumbers[hint.nodeId] = hint.hintNumber;
  }
  const shouldShowPracticeCorrectAnswer =
    (practiceWrongCheckCounts[currentStepIndex] ?? 0) >= 2;

  const goToFirstStep = () => {
    setHasCheckedPracticeStep(false);
    setCurrentStepIndex(0);
  };

  const goToPreviousStep = () => {
    setHasCheckedPracticeStep(false);
    setCurrentStepIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const goToNextStep = () => {
    const nextStepIndex = Math.min(
      algorithmSteps.length - 1,
      currentStepIndex + 1
    );

    if (isPracticeMode) {
      if (isCurrentPracticeAnswerCorrect) {
        setCompletedPracticeSteps((currentSteps) => ({
          ...currentSteps,
          [currentStepIndex]: true,
        }));
      }

      setPracticeDistances((currentDistances) => {
        const nextDistances = { ...currentDistances };

        for (const node of nodes) {
          const currentStepKey = `${currentStepIndex}:${node.id}`;
          const nextStepKey = `${nextStepIndex}:${node.id}`;

          if (nextDistances[nextStepKey] === undefined) {
            nextDistances[nextStepKey] = nextDistances[currentStepKey] ?? "";
          }
        }

        return nextDistances;
      });
    }

    setHasCheckedPracticeStep(false);
    setCurrentStepIndex(nextStepIndex);
  };

  const goToLastStep = () => {
    setHasCheckedPracticeStep(false);
    setCurrentStepIndex(algorithmSteps.length - 1);
  };

  const checkPracticeStep = () => {
    setHasCheckedPracticeStep(true);

    if (isCurrentPracticeAnswerCorrect) {
      setCompletedPracticeSteps((currentSteps) => ({
        ...currentSteps,
        [currentStepIndex]: true,
      }));
    } else {
      setPracticeWrongCheckCounts((currentCounts) => ({
        ...currentCounts,
        [currentStepIndex]: (currentCounts[currentStepIndex] ?? 0) + 1,
      }));
    }
  };

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
    if (nodes.length >= MAX_NODE_COUNT) {
      window.alert("Nodes can only be created up to 15.");
      return null;
    }

    const id = generateNodeId(nextNodeIndex);

    setNodes((currentNodes) => [...currentNodes, { id, x, y }]);
    setNextNodeIndex((currentIndex) => currentIndex + 1);

    return id;
  };

  const deleteNode = (id: string) => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.fromNodeId !== id && edge.toNodeId !== id
      )
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
        if (edge.fromNodeId !== id && edge.toNodeId !== id) {
          return edge;
        }

        const fromNode = nodeById.get(edge.fromNodeId);
        const toNode = nodeById.get(edge.toNodeId);

        if (!fromNode || !toNode) {
          return edge;
        }

        const weight = calculateDistanceWeight(fromNode, toNode);

        return { ...edge, weight };
      })
    );
  };

  const addEdge = (fromNodeId: string, toNodeId: string, weight: number) => {
    if (fromNodeId === toNodeId) {
      return;
    }

    const edgeId = `${fromNodeId}-${toNodeId}`;

    setEdges((currentEdges) => {
      const edgeExists = currentEdges.some((edge) => edge.id === edgeId);

      if (edgeExists) {
        return currentEdges;
      }

      return [...currentEdges, { id: edgeId, fromNodeId, toNodeId, weight }];
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

  const canStartAlgorithmMode = () => {
    if (nodes.length < 2) {
      alert("Please add at least two nodes to run the algorithm.");
      return false;
    }
    if (edges.length === 0) {
      alert("Please add at least one edge to run the algorithm.");
      return false;
    }
    setIsAlgorithmMode(true);
    return true;
  };

  const canRunSelectedAlgorithm = (algorithmId: AlgorithmId) => {
    if (algorithmId === "dijkstra" && edges.some((edge) => edge.weight < 0)) {
      alert("Dijkstra cannot run with negative edge weights.");
      return false;
    }

    return true;
  };

  const onRunButtonClick = (algorithmId: AlgorithmId) => {
    if (!canRunSelectedAlgorithm(algorithmId)) {
      return;
    }

    if (!canStartAlgorithmMode()) {
      return;
    }
    setSelectedAlgorithm(algorithmId);
    setIsRunMode(true);
  };

  const onPracticeButtonClick = (algorithmId: AlgorithmId) => {
    if (!canRunSelectedAlgorithm(algorithmId)) {
      return;
    }

    if (!canStartAlgorithmMode()) {
      return;
    }
    setSelectedAlgorithm(algorithmId);
    setIsPracticeMode(true);
  };

  const toggleCompareAlgorithm = (algorithmId: AlgorithmId) => {
    setCompareAlgorithmIds((currentAlgorithmIds) => {
      if (currentAlgorithmIds.includes(algorithmId)) {
        return currentAlgorithmIds.filter(
          (currentAlgorithmId) => currentAlgorithmId !== algorithmId
        );
      }

      if (currentAlgorithmIds.length >= 2) {
        return currentAlgorithmIds;
      }

      return [...currentAlgorithmIds, algorithmId];
    });
  };

  const onCompareConfirmButtonClick = () => {
    if (compareAlgorithmIds.length !== 2) {
      return;
    }

    if (compareAlgorithmIds.includes("a-star")) {
      alert("A* is not implemented yet.");
      return;
    }

    if (
      !compareAlgorithmIds.every((algorithmId) =>
        canRunSelectedAlgorithm(algorithmId)
      )
    ) {
      return;
    }

    if (!canStartAlgorithmMode()) {
      return;
    }

    setIsCompareMode(true);
    setSelectedComparisonAlgorithmId(null);
  };

  const onBackToGraphEditButtonClick = () => {
    setSourceNodeId(null);
    setTargetNodeId(null);
    setIsAlgorithmMode(false);
    setIsRunMode(false);
    setIsPracticeMode(false);
    setIsCompareMode(false);
    setSelectedAlgorithm(null);
    setAlgorithmResult(null);
    setComparisonResults([]);
    setSelectedComparisonAlgorithmId(null);
    setAlgorithmSteps([]);
    setCurrentStepIndex(0);
    setPracticeDistances({});
    setHasCheckedPracticeStep(false);
    setCompletedPracticeSteps({});
    setPracticeWrongCheckCounts({});
    setPracticeNextNodes({});
    setCompareAlgorithmIds([]);
  };

  const onClearButtonClick = () => {
    setNodes([]);
    setEdges([]);
    setSourceNodeId(null);
    setTargetNodeId(null);
    setIsAlgorithmMode(false);
    setIsRunMode(false);
    setIsPracticeMode(false);
    setIsCompareMode(false);
    setSelectedAlgorithm(null);
    setNextNodeIndex(0);
    setAlgorithmResult(null);
    setComparisonResults([]);
    setSelectedComparisonAlgorithmId(null);
    setAlgorithmSteps([]);
    setCurrentStepIndex(0);
    setPracticeDistances({});
    setHasCheckedPracticeStep(false);
    setCompletedPracticeSteps({});
    setPracticeWrongCheckCounts({});
    setPracticeNextNodes({});
    setCompareAlgorithmIds([]);
  };

  const onLoadExampleGraphClick = () => {
    onClearButtonClick();
    setNodes(exampleGraph.nodes);
    setEdges(exampleGraph.edges);
    setNextNodeIndex(exampleGraph.nodes.length);
  };

  return (
    <div className="app-grid">
      <h1 className="app-heading">Shortest Path Algorithm</h1>
      <Buttons
        className="app-buttons"
        onRunButtonClick={onRunButtonClick}
        onPracticeButtonClick={onPracticeButtonClick}
        compareAlgorithmIds={compareAlgorithmIds}
        onCompareAlgorithmToggle={toggleCompareAlgorithm}
        onCompareConfirmButtonClick={onCompareConfirmButtonClick}
        onLoadExampleGraphClick={onLoadExampleGraphClick}
        onBackToGraphEditButtonClick={onBackToGraphEditButtonClick}
        onClearButtonClick={onClearButtonClick}
        isAlgorithmMode={isAlgorithmMode}
        isRunMode={isRunMode}
        isPracticeMode={isPracticeMode}
        isCompareMode={isCompareMode}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
        algorithmSteps={algorithmSteps}
        currentStepIndex={currentStepIndex}
        canGoToNextStep={!isPracticeMode || canGoToNextPracticeStep}
        hasCheckedPracticeStep={shouldShowFeedback}
        shouldSelectPracticeNextNode={
          shouldShowPracticeNextNodeSelect && !canGoToNextPracticeStep
        }
        onPracticeCheckButtonClick={checkPracticeStep}
        onFirstStep={goToFirstStep}
        onPreviousStep={goToPreviousStep}
        onNextStep={goToNextStep}
        onLastStep={goToLastStep}
      ></Buttons>
      <div className="app-canvas-area">
        <GraphCanvas
          key={isAlgorithmMode ? "algorithm" : "edit"}
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
          algorithmSteps={algorithmSteps}
          setAlgorithmSteps={setAlgorithmSteps}
          setAlgorithmResult={setAlgorithmResult}
          algorithmResult={algorithmResult}
          comparisonFinalPathEdgeIds={comparisonFinalPathEdgeIds}
          comparisonAlgorithmIds={compareAlgorithmIds}
          setComparisonResults={setComparisonResults}
          selectedAlgorithm={selectedAlgorithm}
          currentStepIndex={currentStepIndex}
          isPracticeMode={isPracticeMode}
          isCompareMode={isCompareMode}
          hasCheckedPracticeStep={shouldShowFeedback}
          hasCompletedPracticeStep={hasCompletedCurrentPracticeStep}
          practiceDistances={practiceDistances}
          practiceHintNumbers={practiceHintNumbers}
          onPracticeDistanceChange={(nodeId, distance) => {
            setPracticeDistances((currentDistances) => ({
              ...currentDistances,
              [`${currentStepIndex}:${nodeId}`]: distance,
            }));
          }}
        />
        <p className="practice-distance-hint">
          {isPracticeMode && sourceNodeId && targetNodeId
            ? "For infinity, enter ∞ or inf."
            : ""}
        </p>
      </div>
      <Information
        className="app-explanation"
        isAlgorithmMode={isAlgorithmMode}
        selectedAlgorithm={selectedAlgorithm}
        algorithmResult={algorithmResult}
        comparisonResults={comparisonResults}
        selectedComparisonAlgorithmId={selectedComparisonAlgorithmId}
        onComparisonPathClick={setSelectedComparisonAlgorithmId}
        nodes={nodes}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
        algorithmSteps={algorithmSteps}
        currentStepIndex={currentStepIndex}
        isPracticeMode={isPracticeMode}
        isCompareMode={isCompareMode}
        showExplanationTable={shouldShowExplanationTable}
        showPracticeNextNodeSelect={shouldShowPracticeNextNodeSelect}
        hasCompletedPracticeStep={hasCompletedCurrentPracticeStep}
        practiceHints={practiceHints}
        showPracticeCorrectAnswer={shouldShowPracticeCorrectAnswer}
        practiceNextNodeValue={selectedPracticeNextNodeId}
        practiceNextNodeStatus={
          shouldShowPracticeNextNodeSelect
            ? isCurrentPracticeNextNodeCorrect
              ? "correct"
              : selectedPracticeNextNodeId === ""
              ? "idle"
              : "wrong"
            : "idle"
        }
        onPracticeNextNodeChange={(nodeId) => {
          setPracticeNextNodes((currentNextNodes) => ({
            ...currentNextNodes,
            [currentStepIndex]: nodeId,
          }));
        }}
      />
    </div>
  );
}

export default App;
