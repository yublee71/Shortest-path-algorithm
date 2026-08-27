import { Button, Menu, Tooltip } from "@mantine/core";
import type { ReactNode } from "react";
import { algorithmOptions } from "../models/Algorithm";
import type { AlgorithmId, AlgorithmStep } from "../models/Algorithm";

interface ButtonsProps {
  className?: string;
  onRunButtonClick: (algorithmId: AlgorithmId) => void;
  onPracticeButtonClick: (algorithmId: AlgorithmId) => void;
  onLoadExampleGraphClick: () => void;
  onBackToGraphEditButtonClick: () => void;
  isAlgorithmMode: boolean;
  isRunMode: boolean;
  isPracticeMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  algorithmSteps: AlgorithmStep[];
  currentStepIndex: number;
  canGoToNextStep: boolean;
  hasCheckedPracticeStep: boolean;
  shouldSelectPracticeNextNode: boolean;
  onPracticeCheckButtonClick: () => void;
  onFirstStep: () => void;
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
  algorithmSteps,
  currentStepIndex,
  canGoToNextStep,
  hasCheckedPracticeStep,
  shouldSelectPracticeNextNode,
  onPracticeCheckButtonClick,
  onFirstStep,
  onPreviousStep,
  onNextStep,
  onLastStep,
  onClearButtonClick,
}: ButtonsProps) {
  const isLastStep = currentStepIndex === algorithmSteps.length - 1;
  const canAdvancePracticeStep = hasCheckedPracticeStep && canGoToNextStep;
  const isPracticeActionDisabled =
    shouldSelectPracticeNextNode || (canAdvancePracticeStep && isLastStep);
  const practiceActionTooltip = shouldSelectPracticeNextNode
    ? "Select the next visiting node"
    : canAdvancePracticeStep
    ? "Go to the next step"
    : "Check your answer";
  const withTooltip = (label: string, control: ReactNode) => (
    <Tooltip label={label} withArrow openDelay={400}>
      <span>{control}</span>
    </Tooltip>
  );

  const runAlgorithm = (algorithmId: AlgorithmId) => {
    if (algorithmId === "a-star") {
      window.alert("This algorithm is not implemented yet.");
      return;
    }

    onRunButtonClick(algorithmId);
  };

  const practiceAlgorithm = (algorithmId: AlgorithmId) => {
    if (algorithmId === "a-star") {
      window.alert("This algorithm is not implemented yet.");
      return;
    }

    onPracticeButtonClick(algorithmId);
  };

  return (
    <div className={className}>
      <div style={{ display: "flex", gap: "10px" }}>
        {withTooltip(
          "Select an algorithm and run it",
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
        )}
        {withTooltip(
          "Practice the algorithm step by step",
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
        )}
        {!isAlgorithmMode &&
          withTooltip(
            "Load a sample graph",
            <Button variant="light" onClick={onLoadExampleGraphClick}>
              Load Example
            </Button>
          )}
        {sourceNodeId && targetNodeId && (
          <>
            {!isPracticeMode &&
              withTooltip(
                "Go to the first step",
                <Button disabled={currentStepIndex === 0} onClick={onFirstStep}>
                  ⏮︎
                </Button>
              )}
            {withTooltip(
              "Go to the previous step",
              <Button
                disabled={currentStepIndex === 0}
                onClick={onPreviousStep}
              >
                ❮
              </Button>
            )}
            {isPracticeMode
              ? withTooltip(
                  practiceActionTooltip,
                  <Button
                    color={canAdvancePracticeStep ? "blue" : "cyan"}
                    variant={canAdvancePracticeStep ? "filled" : "light"}
                    disabled={isPracticeActionDisabled}
                    onClick={() => {
                      if (shouldSelectPracticeNextNode) {
                        return;
                      }

                      if (!canAdvancePracticeStep) {
                        onPracticeCheckButtonClick();
                        return;
                      }

                      onNextStep();
                    }}
                  >
                    {canAdvancePracticeStep ? "❯" : "Check"}
                  </Button>
                )
              : withTooltip(
                  "Go to the next step",
                  <Button disabled={isLastStep} onClick={onNextStep}>
                    ❯
                  </Button>
                )}
            {!isPracticeMode &&
              withTooltip(
                "Go to the last step",
                <Button disabled={isLastStep} onClick={onLastStep}>
                  ⏭︎
                </Button>
              )}
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {isAlgorithmMode &&
          withTooltip(
            "Return to graph editing mode",
            <Button
              variant="light"
              color="orange"
              onClick={onBackToGraphEditButtonClick}
            >
              Back to graph edit
            </Button>
          )}
        {withTooltip(
          "Clear the graph",
          <Button color="orange" onClick={onClearButtonClick}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
