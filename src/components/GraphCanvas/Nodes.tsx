import { useState } from "react";
import type { DijkstraStep } from "../../algorithms/dijkstra";
import type { Node } from "../../models/Graph";

interface NodesProps {
  nodes: Node[];
  radius: number;
  onMouseDown: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onClick: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onContextMenu: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  dijkstraSteps: DijkstraStep[];
  currentStepIndex: number;
  isEditable: boolean;
  isPracticeMode: boolean;
}

export function Nodes({
  nodes,
  radius,
  onMouseDown,
  onClick,
  onContextMenu,
  sourceNodeId,
  targetNodeId,
  dijkstraSteps,
  currentStepIndex,
  isEditable,
  isPracticeMode,
}: NodesProps) {
  const [practiceDistances, setPracticeDistances] = useState<
    Record<string, string>
  >({});
  const currentStep = dijkstraSteps[currentStepIndex];
  const distances = currentStep?.distances || {};
  const prevDistances = currentStep?.prevDistances || {};
  const altDistances = currentStep?.altDistances || {};
  const distanceOptions = Array.from({ length: 101 }, (_, index) => index);

  const formatDistance = (distance: number | undefined) => {
    if (distance === undefined) {
      return undefined;
    }

    return distance === Infinity ? "\u221e" : String(distance);
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
          return (
            <foreignObject
              key={`${node.id}-practice-distance`}
              x={node.x - 25}
              y={node.y + radius + 8}
              width={50}
              height={28}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <select
                value={practiceDistances[node.id] ?? ""}
                onChange={(event) => {
                  setPracticeDistances((currentDistances) => ({
                    ...currentDistances,
                    [node.id]: event.target.value,
                  }));
                }}
                style={{
                  width: "50px",
                  height: "24px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                <option value=""></option>
                <option value="Infinity">{"\u221e"}</option>
                {distanceOptions.map((distance) => (
                  <option key={distance} value={distance}>
                    {distance}
                  </option>
                ))}
              </select>
            </foreignObject>
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
              fill={
                prevDistance !== undefined || altDistance !== undefined
                  ? "blue"
                  : "black"
              }
            >
              {distance}
            </tspan>
            {altDistance !== undefined ? " < " : ""}
            <tspan style={{ textDecoration: "line-through" }}>
              {altDistance}
            </tspan>
          </text>
        );
      })}
    </>
  );
}
