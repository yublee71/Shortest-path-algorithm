import { Select } from "@mantine/core";
import {
  type AlgorithmId,
  type AlgorithmResult,
  type AlgorithmStep,
  getAlgorithmLabel,
} from "../models/Algorithm";
import type { Node } from "../models/Graph";

type PracticeNextNodeStatus = "idle" | "correct" | "wrong";

interface AlgorithmExplanationProps {
  className?: string;
  nodes: Node[];
  isAlgorithmMode: boolean;
  selectedAlgorithm: AlgorithmId | null;
  algorithmResult: AlgorithmResult | null;
  isPracticeMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  algorithmSteps: AlgorithmStep[];
  currentStepIndex: number;
  showExplanationTable: boolean;
  showPracticeNextNodeSelect: boolean;
  hasCompletedPracticeStep: boolean;
  practiceNextNodeValue: string;
  practiceNextNodeStatus: PracticeNextNodeStatus;
  onPracticeNextNodeChange: (nodeId: string) => void;
}

function getIterationLabel(step: AlgorithmStep | undefined): string | null {
  if (
    !step ||
    !("iteration" in step) ||
    !("totalIterations" in step) ||
    step.currentlyVisitingEdgesId?.length === 0
  ) {
    return null;
  }

  const { iteration, totalIterations } = step;

  return `Iteration ${iteration} / ${totalIterations}`;
}

export function AlgorithmExplanation({
  className,
  nodes,
  isAlgorithmMode,
  selectedAlgorithm,
  algorithmResult,
  isPracticeMode,
  sourceNodeId,
  targetNodeId,
  algorithmSteps,
  currentStepIndex,
  showExplanationTable,
  showPracticeNextNodeSelect,
  hasCompletedPracticeStep,
  practiceNextNodeValue,
  practiceNextNodeStatus,
  onPracticeNextNodeChange,
}: AlgorithmExplanationProps) {
  const currentStep = algorithmSteps[currentStepIndex];
  const isFinalStep = currentStepIndex === algorithmSteps.length - 1;
  const hasNoPath = isFinalStep && algorithmResult?.path === "";
  const iterationLabel = getIterationLabel(currentStep);
  const algorithm = getAlgorithmLabel(selectedAlgorithm);
  const mode = isPracticeMode ? "Practice Mode" : "Run Mode";

  const formatDistance = (distance: number | undefined) => {
    if (distance === undefined) {
      return "";
    }

    return distance === Infinity ? "∞" : distance;
  };

  const formatPreviousNodes = (nodeId: string) => {
    const previousNodes = currentStep?.previousNodes;

    if (!previousNodes || !sourceNodeId) {
      return "";
    }

    const path: string[] = [];

    let currentNodeId: string | undefined | null = nodeId;

    while (currentNodeId !== undefined && currentNodeId !== null) {
      path.push(currentNodeId);
      currentNodeId = previousNodes[currentNodeId];
    }

    path.reverse();

    if (path[0] !== sourceNodeId) {
      return "";
    }

    return path.join(", ");
  };
  const nextNodeOptions = nodes
    .filter((node) => !currentStep?.visitedNodesId?.includes(node.id))
    .map((node) => ({
      value: node.id,
      label: node.id,
    }));

  return (
    <div className={className}>
      {isAlgorithmMode && (
        <aside>
          {algorithm && (
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  color: "grey",
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                {mode}
              </div>
              <h2 style={{ fontSize: "20px", margin: 0 }}>{algorithm}</h2>
            </div>
          )}
          {(!sourceNodeId ||
            !targetNodeId ||
            (isPracticeMode && showPracticeNextNodeSelect)) && (
            <div
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid #ccc",
                padding: "10px",
                color: "blue",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {!sourceNodeId ? "Please select source node" : ""}
              {sourceNodeId && !targetNodeId ? "Please select target node" : ""}
              {isPracticeMode && showPracticeNextNodeSelect && (
                <div>
                  <p
                    style={{
                      color: "blue",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Please select next visiting node
                  </p>
                  <Select
                    searchable
                    data={nextNodeOptions}
                    value={practiceNextNodeValue || null}
                    onChange={(value) => {
                      onPracticeNextNodeChange(value ?? "");
                    }}
                    disabled={hasCompletedPracticeStep}
                    placeholder=""
                    maxDropdownHeight={140}
                    styles={{
                      input: {
                        borderColor:
                          practiceNextNodeStatus === "correct"
                            ? "#2f9e44"
                            : practiceNextNodeStatus === "wrong"
                            ? "#e03131"
                            : "#ccc",
                        backgroundColor:
                          practiceNextNodeStatus === "correct"
                            ? "#d3f9d8"
                            : practiceNextNodeStatus === "wrong"
                            ? "#ffe3e3"
                            : "white",
                      },
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {showExplanationTable && (
            <>
              {iterationLabel && (
                <p style={{ fontWeight: "bold", margin: "0 0 10px" }}>
                  {iterationLabel}
                </p>
              )}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "10px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ccc" }}>Node</th>
                    <th style={{ border: "1px solid #ccc" }}>Distance</th>
                    <th style={{ border: "1px solid #ccc" }}>Previous Nodes</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {nodes.map((node) => {
                    const isVisited = currentStep?.visitedNodesId?.includes(
                      node.id
                    );
                    const isTargetNodeRow =
                      currentStepIndex === algorithmSteps.length - 1 &&
                      node.id === targetNodeId;

                    return (
                      <tr
                        key={node.id}
                        style={{
                          backgroundColor: isTargetNodeRow
                            ? "#fcffe4"
                            : isVisited
                            ? "#f1f3f5"
                            : "transparent",
                        }}
                      >
                        <td style={{ border: "1px solid #ccc" }}>{node.id}</td>
                        <td style={{ border: "1px solid #ccc" }}>
                          {formatDistance(currentStep?.distances[node.id])}
                        </td>
                        <td style={{ border: "1px solid #ccc" }}>
                          {formatPreviousNodes(node.id)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
          {isFinalStep && (
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: "70px",
                resize: "vertical",
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "10px",
                fontWeight: "bold",
                backgroundColor: "#fcffe4",
              }}
            >
              {hasNoPath ? (
                <p style={{ color: "darkred" }}>
                  No path found from source to target.
                </p>
              ) : (
                <>
                  <p>Shortest path: {algorithmResult?.path}</p>
                  <p>Total distance: {algorithmResult?.totalDistance}</p>
                </>
              )}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
