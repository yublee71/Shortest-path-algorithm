import { useRef, useState } from "react";
import type { Edge, Node } from "./graph";

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onAddNode: (x: number, y: number) => string;
  onDeleteNode: (id: string) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onAddEdge: (firstNodeId: string, secondNodeId: string) => void;
}

interface Point {
  x: number;
  y: number;
}

interface DraftEdge {
  fromNodeId: string;
  to: Point;
}

interface DragState {
  nodeId: string;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  hasMoved: boolean;
}

export function GraphCanvas({
  nodes,
  edges,
  onAddNode,
  onDeleteNode,
  onMoveNode,
  onAddEdge,
}: GraphCanvasProps) {
  const width = 600;
  const height = 400;
  const nodeRadius = 20;
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const [draftEdge, setDraftEdge] = useState<DraftEdge | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const suppressNextClickRef = useRef(false);

  const getCanvasPoint = (event: React.MouseEvent<SVGElement>): Point => {
    const bounds = svgRef.current?.getBoundingClientRect();

    if (!bounds) {
      return { x: 0, y: 0 };
    }

    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  };

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const point = getCanvasPoint(event);

    if (draftEdge) {
      const newNodeId = onAddNode(point.x, point.y);
      onAddEdge(draftEdge.fromNodeId, newNodeId);
      setDraftEdge(null);
      return;
    }

    onAddNode(point.x, point.y);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const point = getCanvasPoint(event);
    const dragState = dragStateRef.current;

    if (dragState) {
      const hasMoved =
        dragState.hasMoved ||
        Math.abs(point.x - dragState.startX) > 2 ||
        Math.abs(point.y - dragState.startY) > 2;

      dragStateRef.current = { ...dragState, hasMoved };

      if (hasMoved) {
        const x = Math.min(
          Math.max(point.x - dragState.offsetX, nodeRadius),
          width - nodeRadius
        );
        const y = Math.min(
          Math.max(point.y - dragState.offsetY, nodeRadius),
          height - nodeRadius
        );

        onMoveNode(dragState.nodeId, x, y);
      }

      return;
    }

    if (!draftEdge) {
      return;
    }

    setDraftEdge({
      ...draftEdge,
      to: point,
    });
  };

  const handleCanvasMouseUp = () => {
    if (dragStateRef.current?.hasMoved) {
      suppressNextClickRef.current = true;
    }

    dragStateRef.current = null;
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
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
      {draftEdge &&
        (() => {
          const fromNode = nodeById.get(draftEdge.fromNodeId);
          if (!fromNode) {
            return null;
          }
          return (
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={draftEdge.to.x}
              y2={draftEdge.to.y}
              stroke="#64748b"
              strokeWidth={2}
              pointerEvents="none"
            />
          );
        })()}
      {nodes.map((node) => (
        <g
          key={node.id}
          onMouseDown={(event) => {
            if (event.button !== 0) {
              return;
            }

            event.stopPropagation();
            const point = getCanvasPoint(event);
            dragStateRef.current = {
              nodeId: node.id,
              offsetX: point.x - node.x,
              offsetY: point.y - node.y,
              startX: point.x,
              startY: point.y,
              hasMoved: false,
            };
          }}
          onClick={(event) => {
            event.stopPropagation();

            if (suppressNextClickRef.current) {
              suppressNextClickRef.current = false;
              return;
            }

            if (draftEdge) {
              onAddEdge(draftEdge.fromNodeId, node.id);
              setDraftEdge(null);
              return;
            }

            setDraftEdge({
              fromNodeId: node.id,
              to: { x: node.x, y: node.y },
            });
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setDraftEdge((currentDraftEdge) =>
              currentDraftEdge?.fromNodeId === node.id ? null : currentDraftEdge
            );
            onDeleteNode(node.id);
          }}
          style={{ cursor: "pointer" }}
        >
          <circle cx={node.x} cy={node.y} r={nodeRadius} fill="steelblue" />
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
      {edges.map((edge) => {
        const nodeA = nodeById.get(edge.nodeA);
        const nodeB = nodeById.get(edge.nodeB);

        if (!nodeA || !nodeB) {
          return null;
        }

        const weight = Math.round(
          Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y)
        );
        const midX = (nodeA.x + nodeB.x) / 2;
        const midY = (nodeA.y + nodeB.y) / 2;
        const edgeAngle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
        const labelAngle =
          edgeAngle > Math.PI / 2 || edgeAngle < -Math.PI / 2
            ? edgeAngle + Math.PI
            : edgeAngle;
        const labelAngleDegrees = (labelAngle * 180) / Math.PI;

        return (
          <g
            key={`${edge.id}-weight`}
            transform={`translate(${midX}, ${midY}) rotate(${labelAngleDegrees})`}
          >
            <text
              x={0}
              y={-10}
              fill="#111827"
              fontSize="12"
              fontWeight={400}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {weight}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
