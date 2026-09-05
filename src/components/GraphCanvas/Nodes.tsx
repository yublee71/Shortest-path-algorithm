import { TextInput } from "@mantine/core";
import type { AlgorithmStep } from "../../models/Algorithm";
import type { Node } from "../../models/Graph";
import { isCorrectDistanceInput } from "../../models/Practice";

interface NodesProps {
  nodes: Node[];
  radius: number;
  onMouseDown: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onClick: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onContextMenu: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  algorithmSteps: AlgorithmStep[];
  currentStepIndex: number;
  isEditable: boolean;
  isPracticeMode: boolean;
  hasCheckedPracticeStep: boolean;
  hasCompletedPracticeStep: boolean;
  practiceDistances: Record<string, string>;
  practiceHintNumbers: Record<string, number>;
  onPracticeDistanceChange: (nodeId: string, distance: string) => void;
}

export function Nodes({
  nodes,
  radius,
  onMouseDown,
  onClick,
  onContextMenu,
  sourceNodeId,
  targetNodeId,
  algorithmSteps,
  currentStepIndex,
  isEditable,
  isPracticeMode,
  hasCheckedPracticeStep,
  hasCompletedPracticeStep,
  practiceDistances,
  practiceHintNumbers,
  onPracticeDistanceChange,
}: NodesProps) {
  const currentStep = algorithmSteps[currentStepIndex];
  const distances = currentStep?.distances || {};
  const prevDistances = currentStep?.prevDistances || {};
  const altDistances = currentStep?.altDistances || {};

  const formatDistance = (distance: number | undefined) => {
    if (distance === undefined) {
      return undefined;
    }

    return distance === Infinity ? "∞" : String(distance);
  };

  return (
    <>
      {nodes.map((node) => {
        const isVisited = currentStep?.visitedNodesId?.includes(node.id);
        const isCurrentVisiting = currentStep?.currentVisitingNodesId?.includes(
          node.id
        );

        const fillColor =
          node.id === sourceNodeId
            ? "darkblue"
            : node.id === targetNodeId && isVisited
            ? "rgb(0, 95, 0)"
            : node.id === targetNodeId
            ? "green"
            : isVisited
            ? "rgb(11, 14, 19)"
            : isCurrentVisiting
            ? "orange"
            : "steelblue";

        const stroke =
          node.id === sourceNodeId || node.id === targetNodeId || isVisited
            ? "black"
            : "none";

        const strokeWidth =
          node.id === sourceNodeId || node.id === targetNodeId || isVisited
            ? 2
            : 0;

        const label =
          node.id === sourceNodeId
            ? "Source"
            : node.id === targetNodeId
            ? "Target"
            : "";
        return (
          <g
            key={node.id}
            onMouseDown={(event) => onMouseDown(event, node)}
            onClick={(event) => onClick(event, node)}
            onContextMenu={(event) => onContextMenu(event, node)}
            style={{
              cursor:
                !isEditable && sourceNodeId && targetNodeId
                  ? "default"
                  : "pointer",
            }}
          >
            <text
              x={node.x}
              y={node.y}
              dy="-2em"
              textAnchor="middle"
              pointerEvents="none"
              fill="black"
              fontSize="14"
            >
              {label}
            </text>
            <circle
              cx={node.x}
              cy={node.y}
              r={radius}
              fill={fillColor}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            <text
              x={node.x}
              y={node.y}
              dy="0.35em"
              fill="white"
              fontSize="14"
              textAnchor="middle"
              pointerEvents="none"
            >
              {node.id}
            </text>
          </g>
        );
      })}
      {nodes.map((node) => {
        if (isPracticeMode && sourceNodeId && targetNodeId) {
          const selectedDistance =
            practiceDistances[`${currentStepIndex}:${node.id}`] ?? "";
          const actualDistance = currentStep?.distances[node.id];
          const isCorrect =
            hasCheckedPracticeStep &&
            isCorrectDistanceInput(selectedDistance, actualDistance);
          const isWrong =
            hasCheckedPracticeStep &&
            actualDistance !== undefined &&
            !isCorrect;
          const hintNumber = practiceHintNumbers[node.id];
          const feedbackIcon =
            isCorrect ? "✓" : isWrong && hintNumber ? hintNumber : "";

          return (
            <g key={`${node.id}-practice-distance`}>
              {feedbackIcon && (
                <text
                  x={node.x - 38}
                  y={node.y + radius + 27}
                  textAnchor="end"
                  pointerEvents="none"
                  fill={isCorrect ? "#2f9e44" : "#e03131"}
                  fontSize="14"
                  fontWeight="900"
                >
                  {feedbackIcon}
                </text>
              )}
              <foreignObject
                x={node.x - 35}
                y={node.y + radius + 8}
                width={70}
                height={32}
                onClick={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <TextInput
                  value={selectedDistance}
                  onChange={(event) => {
                    onPracticeDistanceChange(
                      node.id,
                      event.currentTarget.value
                    );
                  }}
                  disabled={hasCompletedPracticeStep}
                  placeholder=""
                  size="s"
                  w={70}
                  styles={{
                    input: {
                      minHeight: 24,
                      height: 24,
                      borderColor: isCorrect
                        ? "#2f9e44"
                        : isWrong
                        ? "#e03131"
                        : "#ccc",
                      backgroundColor: isCorrect
                        ? "#d3f9d8"
                        : isWrong
                        ? "#ffe3e3"
                        : "white",
                      color: "black",
                      fontWeight: 700,
                      textAlign: "center",
                    },
                  }}
                />
              </foreignObject>
            </g>
          );
        }

        const distance = formatDistance(distances[node.id]);
        const prevDistance = formatDistance(prevDistances[node.id]);
        const altDistance = formatDistance(altDistances[node.id]);

        return (
          <text
            key={`${node.id}-distance`}
            x={node.x}
            y={node.y}
            dx="0.35em"
            dy="2.5em"
            fill="black"
            fontWeight="bold"
          >
            <tspan style={{ textDecoration: "line-through" }}>
              {prevDistance}
            </tspan>
            {prevDistance !== undefined ? " → " : ""}
            <tspan
              fill={prevDistance !== undefined ? "blue" : "black"}
            >
              {distance}
            </tspan>
            {altDistance !== undefined ? " ≤ " : ""}
            <tspan
              fill="blue"
              style={{ textDecoration: "line-through" }}
            >
              {altDistance}
            </tspan>
          </text>
        );
      })}
    </>
  );
}
