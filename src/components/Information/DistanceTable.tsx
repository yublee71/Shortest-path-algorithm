import type { AlgorithmStep } from "../../models/Algorithm";
import type { Node } from "../../models/Graph";

interface DistanceTableProps {
  nodes: Node[];
  currentStep: AlgorithmStep | undefined;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  currentStepIndex: number;
  totalStepCount: number;
}

function formatDistance(distance: number | undefined) {
  if (distance === undefined) {
    return "";
  }

  return distance === Infinity ? "∞" : distance;
}

function formatPreviousNodes(
  nodeId: string,
  currentStep: AlgorithmStep | undefined,
  sourceNodeId: string | null
) {
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
}

export function DistanceTable({
  nodes,
  currentStep,
  sourceNodeId,
  targetNodeId,
  currentStepIndex,
  totalStepCount,
}: DistanceTableProps) {
  return (
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
          const isVisited = currentStep?.visitedNodesId?.includes(node.id);
          const isTargetNodeRow =
            currentStepIndex === totalStepCount - 1 && node.id === targetNodeId;

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
                {formatPreviousNodes(node.id, currentStep, sourceNodeId)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
