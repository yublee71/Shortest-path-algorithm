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
}: NodesProps) {
  const distances = dijkstraSteps[currentStepIndex]?.distances || {};
  const prevDistances = dijkstraSteps[currentStepIndex]?.prevDistances || {};
  const altDistances = dijkstraSteps[currentStepIndex]?.altDistances || {};

  return (
    <>
      {nodes.map((node) => {
        const fillColor =
          node.id === sourceNodeId
            ? "darkblue"
            : node.id === targetNodeId
            ? "green"
            : dijkstraSteps[currentStepIndex]?.visitedNodesId?.includes(node.id)
            ? "rgb(11, 14, 19)"
            : dijkstraSteps[currentStepIndex]?.currentVisitingNodesId?.includes(
                node.id
              )
            ? "orange"
            : "steelblue";

        const stroke =
          node.id === sourceNodeId ||
          node.id === targetNodeId ||
          dijkstraSteps[currentStepIndex]?.visitedNodesId?.includes(node.id)
            ? "black"
            : "none";

        const strokeWidth =
          node.id === sourceNodeId ||
          node.id === targetNodeId ||
          dijkstraSteps[currentStepIndex]?.visitedNodesId?.includes(node.id)
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
            style={{ cursor: "pointer" }}
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
        const distance = distances[node.id];

        // const prevDistance =
        //   prevDistances[node.id] !== undefined
        //     ? prevDistances[node.id] + " → "
        //     : "";

        // const altDistance =
        //   altDistances[node.id] !== undefined
        //     ? " < " + altDistances[node.id]
        //     : "";

        return (
          <text
            key={node.id + "-distance"}
            x={node.x}
            y={node.y}
            dx="0.35em"
            dy="2.5em"
            fill="black"
            fontWeight="bold"
          >
            <tspan style={{ textDecoration: "line-through" }}>
              {prevDistances[node.id]}
            </tspan>
            {prevDistances[node.id] !== undefined ? " → " : ""}
            <tspan
              fill={
                prevDistances[node.id] !== undefined ||
                altDistances[node.id] !== undefined
                  ? "blue"
                  : "black"
              }
            >
              {distance}
            </tspan>
            {altDistances[node.id] !== undefined ? " < " : ""}
            <tspan style={{ textDecoration: "line-through" }}>
              {altDistances[node.id]}
            </tspan>
          </text>
        );
      })}
    </>
  );
}
