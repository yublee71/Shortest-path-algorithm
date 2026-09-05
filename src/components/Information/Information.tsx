import {
  type AlgorithmId,
  type AlgorithmResult,
  type AlgorithmStep,
  getAlgorithmLabel,
} from "../../models/Algorithm";
import type { Node } from "../../models/Graph";
import type { PracticeHint } from "../../models/Practice";
import { InformationHeader } from "./InformationHeader";
import { ComparisonTable } from "./ComparisonTable";
import { Result } from "./Result";
import { DistanceTable } from "./DistanceTable";
import { NodeSelection, type PracticeNextNodeStatus } from "./NodeSelection";
import { PracticeHints } from "./PracticeHints";

interface InformationProps {
  className?: string;
  nodes: Node[];
  isAlgorithmMode: boolean;
  selectedAlgorithm: AlgorithmId | null;
  algorithmResult: AlgorithmResult | null;
  comparisonResults: AlgorithmResult[];
  selectedComparisonAlgorithmId: AlgorithmId | null;
  onComparisonPathClick: (algorithmId: AlgorithmId) => void;
  isPracticeMode: boolean;
  isCompareMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  algorithmSteps: AlgorithmStep[];
  currentStepIndex: number;
  showExplanationTable: boolean;
  showPracticeNextNodeSelect: boolean;
  hasCompletedPracticeStep: boolean;
  practiceHints: PracticeHint[];
  showPracticeCorrectAnswer: boolean;
  practiceNextNodeValue: string;
  practiceNextNodeStatus: PracticeNextNodeStatus;
  onPracticeNextNodeChange: (nodeId: string) => void;
}

function getIterationLabel(step: AlgorithmStep | undefined): string | null {
  if (
    !step ||
    !("iteration" in step) ||
    !("totalIterations" in step) ||
    step.currentlyVisitingEdgesId?.length === 0
  ) {
    return null;
  }

  const { iteration, totalIterations } = step;

  return `Iteration ${iteration} / ${totalIterations}`;
}

export function Information({
  className,
  nodes,
  isAlgorithmMode,
  selectedAlgorithm,
  algorithmResult,
  comparisonResults,
  selectedComparisonAlgorithmId,
  onComparisonPathClick,
  isPracticeMode,
  isCompareMode,
  sourceNodeId,
  targetNodeId,
  algorithmSteps,
  currentStepIndex,
  showExplanationTable,
  showPracticeNextNodeSelect,
  hasCompletedPracticeStep,
  practiceHints,
  showPracticeCorrectAnswer,
  practiceNextNodeValue,
  practiceNextNodeStatus,
  onPracticeNextNodeChange,
}: InformationProps) {
  const currentStep = algorithmSteps[currentStepIndex];
  const isFinalStep = currentStepIndex === algorithmSteps.length - 1;
  const iterationLabel = getIterationLabel(currentStep);
  const algorithm = getAlgorithmLabel(selectedAlgorithm);
  const mode = isCompareMode
    ? "Comparison Mode"
    : isPracticeMode
    ? "Practice Mode"
    : "Basic Mode";
  const title = isCompareMode ? "Comparison" : algorithm;

  if (!isAlgorithmMode) {
    return <div className={className}></div>;
  }

  return (
    <div className={className}>
      <aside>
        {title && <InformationHeader mode={mode} title={title} />}
        <NodeSelection
          nodes={nodes}
          currentStep={currentStep}
          sourceNodeId={sourceNodeId}
          targetNodeId={targetNodeId}
          isPracticeMode={isPracticeMode}
          showPracticeNextNodeSelect={showPracticeNextNodeSelect}
          hasCompletedPracticeStep={hasCompletedPracticeStep}
          practiceNextNodeValue={practiceNextNodeValue}
          practiceNextNodeStatus={practiceNextNodeStatus}
          onPracticeNextNodeChange={onPracticeNextNodeChange}
        />
        {isCompareMode && (
          <ComparisonTable
            comparisonResults={comparisonResults}
            selectedComparisonAlgorithmId={selectedComparisonAlgorithmId}
            onComparisonPathClick={onComparisonPathClick}
          />
        )}
        {!isCompareMode && isPracticeMode && (
          <PracticeHints
            hints={practiceHints}
            showCorrectAnswer={showPracticeCorrectAnswer}
          />
        )}
        {!isCompareMode && showExplanationTable && (
          <>
            {iterationLabel && (
              <p style={{ fontWeight: "bold", margin: "0 0 10px" }}>
                {iterationLabel}
              </p>
            )}
            <DistanceTable
              nodes={nodes}
              currentStep={currentStep}
              sourceNodeId={sourceNodeId}
              targetNodeId={targetNodeId}
              currentStepIndex={currentStepIndex}
              totalStepCount={algorithmSteps.length}
            />
          </>
        )}
        {!isCompareMode && isFinalStep && (
          <Result algorithmResult={algorithmResult} />
        )}
      </aside>
    </div>
  );
}
