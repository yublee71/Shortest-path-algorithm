import type { DijkstraStep } from "../algorithms/dijkstra";
import type { Node } from "../models/Graph";

interface AlgorithmExplanationProps {
  className?: string;
  nodes: Node[];
  isAlgorithmMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  dijkstraSteps: DijkstraStep[];
  currentStepIndex: number;
}

export function AlgorithmExplanation({
  className,
  nodes,
  isAlgorithmMode,
  sourceNodeId,
  targetNodeId,
  dijkstraSteps,
  currentStepIndex,
}: AlgorithmExplanationProps) {
  const currentStep = dijkstraSteps[currentStepIndex];

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

  return (
    <div className={className}>
      {isAlgorithmMode && (
        <aside>
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
                  currentStepIndex === dijkstraSteps.length - 1 &&
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
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "70px",
              resize: "vertical",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            {!sourceNodeId ? (
              <p style={{ color: "blue", fontWeight: "bold" }}>
                Please select source node
              </p>
            ) : (
              <p style={{ fontWeight: "bold" }}>
                Source:{" "}
                <span style={{ color: "darkblue" }}>{sourceNodeId}</span>
              </p>
            )}
            {sourceNodeId && !targetNodeId ? (
              <p style={{ color: "blue", fontWeight: "bold" }}>
                Please select target node
              </p>
            ) : (
              targetNodeId && (
                <p style={{ fontWeight: "bold" }}>
                  Target: <span style={{ color: "green" }}>{targetNodeId}</span>
                </p>
              )
            )}
          </div>
          {currentStepIndex === dijkstraSteps.length - 1 && (
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
              <p>Shortest path: {dijkstraSteps[currentStepIndex].path}</p>
              <p>
                Total distance: {dijkstraSteps[currentStepIndex].totalDistance}
              </p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
