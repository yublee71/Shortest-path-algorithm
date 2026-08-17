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

      <Button color="orange" onClick={onClearButtonClick}>
        Clear
      </Button>
    </div>
  );
}
