import { Button } from "@mantine/core";
import type { DijkstraStep } from "../algorithms/dijkstra";

interface ButtonsProps {
  className?: string;
  onRunButtonClick: () => void;
  onPracticeButtonClick: () => void;
  onLoadExampleGraphClick: () => void;
  isAlgorithmMode: boolean;
  isRunMode: boolean;
  isPracticeMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  dijkstraSteps: DijkstraStep[];
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  canGoToNextStep: boolean;
  onClearButtonClick: () => void;
}

export function Buttons({
  className,
  onRunButtonClick,
  onPracticeButtonClick,
  onLoadExampleGraphClick,
  isAlgorithmMode,
  isRunMode,
  isPracticeMode,
  sourceNodeId,
  targetNodeId,
  dijkstraSteps,
  currentStepIndex,
  setCurrentStepIndex,
  canGoToNextStep,
  onClearButtonClick,
}: ButtonsProps) {
  return (
    <div className={className}>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button onClick={onRunButtonClick} disabled={isAlgorithmMode}>
          {isRunMode ? "Running" : "Run"}
        </Button>
        <Button onClick={onPracticeButtonClick} disabled={isAlgorithmMode}>
          {isPracticeMode ? "Practicing" : "Practice"}
        </Button>
        {!isAlgorithmMode && (
          <Button variant="light" onClick={onLoadExampleGraphClick}>
            Load Example
          </Button>
        )}
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
              disabled={
                currentStepIndex === dijkstraSteps.length - 1 ||
                !canGoToNextStep
              }
              onClick={() => {
                setCurrentStepIndex((currentStepIndex) =>
                  Math.min(dijkstraSteps.length - 1, currentStepIndex + 1)
                );
              }}
            >
              ❯
            </Button>
            {!isPracticeMode && (
              <Button
                disabled={currentStepIndex === dijkstraSteps.length - 1}
                onClick={() => {
                  setCurrentStepIndex(dijkstraSteps.length - 1);
                }}
              >
                ⏭︎
              </Button>
            )}
          </>
        )}
      </div>

      <Button color="orange" onClick={onClearButtonClick}>
        Clear
      </Button>
    </div>
  );
}
