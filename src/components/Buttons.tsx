import { Button, Menu } from "@mantine/core";
import type { DijkstraStep } from "../algorithms/dijkstra";

type AlgorithmId = "dijkstra" | "bellman-ford" | "a-star";

const algorithmOptions: { id: AlgorithmId; label: string }[] = [
  { id: "dijkstra", label: "Dijkstra" },
  { id: "bellman-ford", label: "Bellman-Ford" },
  { id: "a-star", label: "A*" },
];

interface ButtonsProps {
  className?: string;
  onRunButtonClick: () => void;
  onPracticeButtonClick: () => void;
  onLoadExampleGraphClick: () => void;
  onBackToGraphEditButtonClick: () => void;
  isAlgorithmMode: boolean;
  isRunMode: boolean;
  isPracticeMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  dijkstraSteps: DijkstraStep[];
  currentStepIndex: number;
  canGoToNextStep: boolean;
  hasCheckedPracticeStep: boolean;
  onPracticeCheckButtonClick: () => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onLastStep: () => void;
  onClearButtonClick: () => void;
}

export function Buttons({
  className,
  onRunButtonClick,
  onPracticeButtonClick,
  onLoadExampleGraphClick,
  onBackToGraphEditButtonClick,
  isAlgorithmMode,
  isRunMode,
  isPracticeMode,
  sourceNodeId,
  targetNodeId,
  dijkstraSteps,
  currentStepIndex,
  canGoToNextStep,
  hasCheckedPracticeStep,
  onPracticeCheckButtonClick,
  onPreviousStep,
  onNextStep,
  onLastStep,
  onClearButtonClick,
}: ButtonsProps) {
  const isLastStep = currentStepIndex === dijkstraSteps.length - 1;
  const canAdvancePracticeStep = hasCheckedPracticeStep && canGoToNextStep;
  const runAlgorithm = (algorithmId: AlgorithmId) => {
    if (algorithmId !== "dijkstra") {
      window.alert("This algorithm is not implemented yet.");
      return;
    }

    onRunButtonClick();
  };
  const practiceAlgorithm = (algorithmId: AlgorithmId) => {
    if (algorithmId !== "dijkstra") {
      window.alert("This algorithm is not implemented yet.");
      return;
    }

    onPracticeButtonClick();
  };

  return (
    <div className={className}>
      <div style={{ display: "flex", gap: "10px" }}>
        <Menu withinPortal position="bottom-start">
          <Menu.Target>
            <Button disabled={isAlgorithmMode}>
              {isRunMode ? "Running" : "Run"}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {algorithmOptions.map((algorithm) => (
              <Menu.Item
                key={algorithm.id}
                onClick={() => runAlgorithm(algorithm.id)}
              >
                {algorithm.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <Menu withinPortal position="bottom-start">
          <Menu.Target>
            <Button disabled={isAlgorithmMode}>
              {isPracticeMode ? "Practicing" : "Practice"}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {algorithmOptions.map((algorithm) => (
              <Menu.Item
                key={algorithm.id}
                onClick={() => practiceAlgorithm(algorithm.id)}
              >
                {algorithm.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        {!isAlgorithmMode && (
          <Button variant="light" onClick={onLoadExampleGraphClick}>
            Load Example
          </Button>
        )}
        {sourceNodeId && targetNodeId && (
          <>
            <Button disabled={currentStepIndex === 0} onClick={onPreviousStep}>
              ❮
            </Button>
            {isPracticeMode ? (
              <Button
                color={canAdvancePracticeStep ? "blue" : "cyan"}
                variant={canAdvancePracticeStep ? "filled" : "light"}
                disabled={canAdvancePracticeStep && isLastStep}
                onClick={() => {
                  if (!canAdvancePracticeStep) {
                    onPracticeCheckButtonClick();
                    return;
                  }

                  onNextStep();
                }}
              >
                {canAdvancePracticeStep ? "❯" : "Check"}
              </Button>
            ) : (
              <Button disabled={isLastStep} onClick={onNextStep}>
                ❯
              </Button>
            )}
            {!isPracticeMode && (
              <Button disabled={isLastStep} onClick={onLastStep}>
                ⏭︎
              </Button>
            )}
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {isAlgorithmMode && (
          <Button
            variant="light"
            color="orange"
            onClick={onBackToGraphEditButtonClick}
          >
            Back to graph edit
          </Button>
        )}
        <Button color="orange" onClick={onClearButtonClick}>
          Clear
        </Button>
      </div>
    </div>
  );
}
