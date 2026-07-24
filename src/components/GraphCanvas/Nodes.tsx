import type { Node } from "../../models/Graph";

interface NodesProps {
  nodes: Node[];
  radius: number;
  onMouseDown: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onClick: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onContextMenu: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  sourceNodeId: string | null;
  targetNodeId: string | null;
}

export function Nodes({
  nodes,
  radius,
  onMouseDown,
  onClick,
  onContextMenu,
  sourceNodeId,
  targetNodeId,
}: NodesProps) {
  return (
    <>
      {nodes.map((node) => {
        const fillColor =
          node.id === sourceNodeId
            ? "darkblue"
            : node.id === targetNodeId
            ? "green"
            : "steelblue";

        const stroke =
          node.id === sourceNodeId || node.id === targetNodeId
            ? "black"
            : "none";

        const strokeWidth =
          node.id === sourceNodeId || node.id === targetNodeId ? 2 : 0;

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
              {node.label}
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
    </>
  );
}
