import { ButtonTooltip } from "./ButtonTooltip";

interface GraphButtonsProps {
  isAlgorithmMode: boolean;
  onLoadExampleGraphClick: () => void;
  onBackToGraphEditButtonClick: () => void;
  onClearButtonClick: () => void;
}

export function GraphButtons({
  isAlgorithmMode,
  onLoadExampleGraphClick,
  onBackToGraphEditButtonClick,
  onClearButtonClick,
}: GraphButtonsProps) {
  return (
    <div className="graph-buttons">
      <div>
        <ButtonTooltip
          label="Load Example"
          tooltipLabel="Load a sample graph"
          variant="light"
          onClick={onLoadExampleGraphClick}
        />
      </div>
      <div className="graph-buttons-right">
        {isAlgorithmMode && (
          <ButtonTooltip
            label="Back to graph edit"
            tooltipLabel="Return to graph editing mode"
            variant="light"
            color="orange"
            onClick={onBackToGraphEditButtonClick}
          />
        )}
        <ButtonTooltip
          label="Clear"
          tooltipLabel="Clear the graph"
          color="orange"
          onClick={onClearButtonClick}
        />
      </div>
    </div>
  );
}
