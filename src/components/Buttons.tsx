import { Button } from "@mantine/core";
import type { DijkstraStep } from "../algorithms/dijkstra";

interface ButtonsProps {
  className?: string;
  onRunButtonClick: () => void;
  isAlgorithmMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  dijkstraSteps: DijkstraStep[];
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  onResetButtonClick: () => void;
}

export function Buttons({
  className,
  onRunButtonClick,
  isAlgorithmMode,
  sourceNodeId,
  targetNodeId,
  dijkstraSteps,
  currentStepIndex,
  setCurrentStepIndex,
  onResetButtonClick,
}: ButtonsProps) {
  return (
    <div className={className}>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button onClick={onRunButtonClick} disabled={isAlgorithmMode}>
          {isAlgorithmMode ? "Running" : "Run"}
        </Button>
        {sourceNodeId && targetNodeId && (
          <>
            <Button
              disabled={currentStepIndex === 0}
              onClick={() => {
                setCurrentStepIndex((currentStepIndex) =>
                  Math.max(0, currentStepIndex - 1)
                );
              }}
            >
              ❮
            </Button>
            <Button
              disabled={currentStepIndex === dijkstraSteps.length - 1}
              onClick={() => {
                setCurrentStepIndex((currentStepIndex) =>
                  Math.min(dijkstraSteps.length - 1, currentStepIndex + 1)
                );
              }}
            >
              ❯
            </Button>
            <Button
              disabled={currentStepIndex === dijkstraSteps.length - 1}
              onClick={() => {
                setCurrentStepIndex(dijkstraSteps.length - 1);
              }}
            >
              ⏭︎
            </Button>
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
      <Button color="orange" onClick={onResetButtonClick}>
        Reset
      </Button>
    </div>
  );
}
