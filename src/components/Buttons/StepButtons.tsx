import type { AlgorithmStep } from "../../models/Algorithm";
import { ButtonTooltip } from "./ButtonTooltip";

interface StepButtonsProps {
  sourceNodeId: string | null;
  targetNodeId: string | null;
  algorithmSteps: AlgorithmStep[];
  currentStepIndex: number;
  isPracticeMode: boolean;
  isCompareMode: boolean;
  canGoToNextStep: boolean;
  hasCheckedPracticeStep: boolean;
  shouldSelectPracticeNextNode: boolean;
  onPracticeCheckButtonClick: () => void;
  onFirstStep: () => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onLastStep: () => void;
}

export function StepButtons({
  sourceNodeId,
  targetNodeId,
  algorithmSteps,
  currentStepIndex,
  isPracticeMode,
  isCompareMode,
  canGoToNextStep,
  hasCheckedPracticeStep,
  shouldSelectPracticeNextNode,
  onPracticeCheckButtonClick,
  onFirstStep,
  onPreviousStep,
  onNextStep,
  onLastStep,
}: StepButtonsProps) {
  const isLastStep = currentStepIndex === algorithmSteps.length - 1;
  const canAdvancePracticeStep = hasCheckedPracticeStep && canGoToNextStep;
  const isPracticeActionDisabled =
    shouldSelectPracticeNextNode || (canAdvancePracticeStep && isLastStep);
  const practiceActionTooltip = shouldSelectPracticeNextNode
    ? "Select the next visiting node"
    : canAdvancePracticeStep
    ? "Go to the next step"
    : "Check your answer";

  if (!sourceNodeId || !targetNodeId || isCompareMode) {
    return null;
  }

  return (
    <>
      {!isPracticeMode && (
        <ButtonTooltip
          label="⏮︎"
          tooltipLabel="Go to the first step"
          disabled={currentStepIndex === 0}
          onClick={onFirstStep}
        />
      )}
      <ButtonTooltip
        label="❮"
        tooltipLabel="Go to the previous step"
        disabled={currentStepIndex === 0}
        onClick={onPreviousStep}
      />
      {isPracticeMode ? (
        <ButtonTooltip
          label={canAdvancePracticeStep ? "❯" : "Check"}
          tooltipLabel={practiceActionTooltip}
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
        />
      ) : (
        <ButtonTooltip
          label="❯"
          tooltipLabel="Go to the next step"
          disabled={isLastStep}
          onClick={onNextStep}
        />
      )}
      {!isPracticeMode && (
        <ButtonTooltip
          label="⏭︎"
          tooltipLabel="Go to the last step"
          disabled={isLastStep}
          onClick={onLastStep}
        />
      )}
    </>
  );
}
