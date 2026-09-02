import type { AlgorithmId, AlgorithmStep } from "../../models/Algorithm";
import { ModeButtons } from "./ModeButtons";
import { GraphButtons } from "./GraphButtons";
import { StepButtons } from "./StepButtons";

interface ButtonsProps {
  className?: string;
  onRunButtonClick: (algorithmId: AlgorithmId) => void;
  onPracticeButtonClick: (algorithmId: AlgorithmId) => void;
  compareAlgorithmIds: AlgorithmId[];
  onCompareAlgorithmToggle: (algorithmId: AlgorithmId) => void;
  onCompareConfirmButtonClick: () => void;
  onLoadExampleGraphClick: () => void;
  onBackToGraphEditButtonClick: () => void;
  isAlgorithmMode: boolean;
  isRunMode: boolean;
  isPracticeMode: boolean;
  isCompareMode: boolean;
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
  compareAlgorithmIds,
  onCompareAlgorithmToggle,
  onCompareConfirmButtonClick,
  onLoadExampleGraphClick,
  onBackToGraphEditButtonClick,
  isAlgorithmMode,
  isRunMode,
  isPracticeMode,
  isCompareMode,
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
  return (
    <div className={className}>
      <div className="upper-buttons">
        <ModeButtons
          onRunButtonClick={onRunButtonClick}
          onPracticeButtonClick={onPracticeButtonClick}
          compareAlgorithmIds={compareAlgorithmIds}
          onCompareAlgorithmToggle={onCompareAlgorithmToggle}
          onCompareConfirmButtonClick={onCompareConfirmButtonClick}
          isAlgorithmMode={isAlgorithmMode}
          isRunMode={isRunMode}
          isPracticeMode={isPracticeMode}
          isCompareMode={isCompareMode}
        />
        <StepButtons
          sourceNodeId={sourceNodeId}
          targetNodeId={targetNodeId}
          algorithmSteps={algorithmSteps}
          currentStepIndex={currentStepIndex}
          isPracticeMode={isPracticeMode}
          isCompareMode={isCompareMode}
          canGoToNextStep={canGoToNextStep}
          hasCheckedPracticeStep={hasCheckedPracticeStep}
          shouldSelectPracticeNextNode={shouldSelectPracticeNextNode}
          onPracticeCheckButtonClick={onPracticeCheckButtonClick}
          onFirstStep={onFirstStep}
          onPreviousStep={onPreviousStep}
          onNextStep={onNextStep}
          onLastStep={onLastStep}
        />
      </div>
      <GraphButtons
        isAlgorithmMode={isAlgorithmMode}
        onLoadExampleGraphClick={onLoadExampleGraphClick}
        onBackToGraphEditButtonClick={onBackToGraphEditButtonClick}
        onClearButtonClick={onClearButtonClick}
      />
    </div>
  );
}
