import type { Node } from "../../models/Graph";

interface NodesProps {
  nodes: Node[];
  radius: number;
  onMouseDown: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onClick: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
  onContextMenu: (event: React.MouseEvent<SVGGElement>, node: Node) => void;
}

export function Nodes({
  nodes,
  radius,
  onMouseDown,
  onClick,
  onContextMenu,
}: NodesProps) {
  return (
    <>
      {nodes.map((node) => (
        <g
          key={node.id}
          onMouseDown={(event) => onMouseDown(event, node)}
          onClick={(event) => onClick(event, node)}
          onContextMenu={(event) => onContextMenu(event, node)}
          style={{ cursor: "pointer" }}
        >
          <circle cx={node.x} cy={node.y} r={radius} fill="steelblue" />
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
      ))}
    </>
  );
}
