import { Select } from "@mantine/core";
import type { Node } from "../../models/Graph";
import type { AlgorithmStep } from "../../models/Algorithm";

export type PracticeNextNodeStatus = "idle" | "correct" | "wrong";

interface NodeSelectionProps {
  nodes: Node[];
  currentStep: AlgorithmStep | undefined;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  isPracticeMode: boolean;
  showPracticeNextNodeSelect: boolean;
  hasCompletedPracticeStep: boolean;
  practiceNextNodeValue: string;
  practiceNextNodeStatus: PracticeNextNodeStatus;
  onPracticeNextNodeChange: (nodeId: string) => void;
}

export function NodeSelection({
  nodes,
  currentStep,
  sourceNodeId,
  targetNodeId,
  isPracticeMode,
  showPracticeNextNodeSelect,
  hasCompletedPracticeStep,
  practiceNextNodeValue,
  practiceNextNodeStatus,
  onPracticeNextNodeChange,
}: NodeSelectionProps) {
  const shouldShowPrompt =
    !sourceNodeId ||
    !targetNodeId ||
    (isPracticeMode && showPracticeNextNodeSelect);

  const nextNodeOptions = nodes
    .filter((node) => !currentStep?.visitedNodesId?.includes(node.id))
    .map((node) => ({
      value: node.id,
      label: node.id,
    }));

  if (!shouldShowPrompt) {
    return null;
  }

  return (
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
  );
}
