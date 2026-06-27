import { useState } from "react";
import type { Node } from "./graph";

interface GraphCanvasProps {
  nodes: Node[];
  onAddNode: (x: number, y: number) => void;
  onDeleteNode: (id: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export function GraphCanvas({
  nodes,
  onAddNode,
  onDeleteNode,
}: GraphCanvasProps) {
  const width = 600;
  const height = 400;
  const [draftEdge, setDraftEdge] = useState<{
    from: Node;
    to: Point;
  } | null>(null);

  const getCanvasPoint = (event: React.MouseEvent<SVGSVGElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  };

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (draftEdge) {
      setDraftEdge(null);
      return;
    }

    const point = getCanvasPoint(event);
    onAddNode(point.x, point.y);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!draftEdge) {
      return;
    }

    setDraftEdge({
      ...draftEdge,
      to: getCanvasPoint(event),
    });
  };

  return (
    <svg
      width={width}
      height={height}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      style={{
        border: "1px solid #ccc",
        cursor: "crosshair",
      }}
    >
      {draftEdge && (
        <line
          x1={draftEdge.from.x}
          y1={draftEdge.from.y}
          x2={draftEdge.to.x}
          y2={draftEdge.to.y}
          stroke="#64748b"
          strokeWidth={2}
          pointerEvents="none"
        />
      )}
      {nodes.map((node) => (
        <g
          key={node.id}
          onClick={(event) => {
            event.stopPropagation();
            setDraftEdge({
              from: node,
              to: { x: node.x, y: node.y },
            });
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setDraftEdge((currentDraftEdge) =>
              currentDraftEdge?.from.id === node.id ? null : currentDraftEdge
            );
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
