import { useState } from "react";
import type { Edge, Node } from "./graph";

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onAddNode: (x: number, y: number) => string;
  onDeleteNode: (id: string) => void;
  onAddEdge: (firstNodeId: string, secondNodeId: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export function GraphCanvas({
  nodes,
  edges,
  onAddNode,
  onDeleteNode,
  onAddEdge,
}: GraphCanvasProps) {
  const width = 600;
  const height = 400;
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
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
    const point = getCanvasPoint(event);

    if (draftEdge) {
      const newNodeId = onAddNode(point.x, point.y);
      onAddEdge(draftEdge.from.id, newNodeId);
      setDraftEdge(null);
      return;
    }

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
      {edges.map((edge) => {
        const nodeA = nodeById.get(edge.nodeA);
        const nodeB = nodeById.get(edge.nodeB);

        if (!nodeA || !nodeB) {
          return null;
        }

        return (
          <line
            key={edge.id}
            x1={nodeA.x}
            y1={nodeA.y}
            x2={nodeB.x}
            y2={nodeB.y}
            stroke="#000000"
            strokeWidth={2}
          />
        );
      })}
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

            if (draftEdge) {
              onAddEdge(draftEdge.from.id, node.id);
              setDraftEdge(null);
              return;
            }

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
