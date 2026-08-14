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
  onClearButtonClick: () => void;
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
  onClearButtonClick,
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

      <Button color="orange" onClick={onClearButtonClick}>
        Clear
      </Button>
    </div>
  );
}
