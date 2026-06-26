import type { Node } from "./graph";

interface GraphCanvasProps {
  nodes: Node[];
  onAddNode: (x: number, y: number) => void;
  onDeleteNode: (id: string) => void;
}

export function GraphCanvas({
  nodes,
  onAddNode,
  onDeleteNode,
}: GraphCanvasProps) {
  const width = 600;
  const height = 400;

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    onAddNode(event.clientX - bounds.left, event.clientY - bounds.top);
  };

  return (
    <svg
      width={width}
      height={height}
      onClick={handleCanvasClick}
      style={{
        border: "1px solid #ccc",
        cursor: "crosshair",
      }}
    >
      {nodes.map((node) => (
        <g
          key={node.id}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteNode(node.id);
          }}
          style={{ cursor: "pointer" }}
        >
          <circle cx={node.x} cy={node.y} r={20} fill="steelblue" />
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
    </svg>
  );
}
