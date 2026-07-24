import { useRef, useState } from "react";
import {
  calculateDistanceWeight,
  type Edge,
  type Node,
} from "../../models/Graph";
import { DraftEdge } from "./DraftEdge";
import { Edges } from "./Edges";
import { EdgeWeightLabels } from "./EdgeWeightLabels";
import { Nodes } from "./Nodes";

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  isEditable: boolean;
  onAddNode: (x: number, y: number) => string;
  onDeleteNode: (id: string) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onAddEdge: (
    firstNodeId: string,
    secondNodeId: string,
    weight: number
  ) => void;
  onDeleteEdge: (id: string) => void;
  sourceNodeId: string | null;
  targetNodeId: string | null;
  onSelectSourceNode: (id: string) => void;
  onSelectTargetNode: (id: string) => void;
}

interface Point {
  x: number;
  y: number;
}

interface DraftEdgeState {
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
  isEditable,
  onAddNode,
  onDeleteNode,
  onMoveNode,
  onAddEdge,
  onDeleteEdge,
  sourceNodeId,
  targetNodeId,
  onSelectSourceNode,
  onSelectTargetNode,
}: GraphCanvasProps) {
  const width = 600;
  const height = 400;
  const nodeRadius = 20;
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const [draftEdge, setDraftEdge] = useState<DraftEdgeState | null>(null);
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
    if (!isEditable) {
      return;
    }

    const point = getCanvasPoint(event);

    if (draftEdge) {
      const newNodeId = onAddNode(point.x, point.y);
      const fromNode = nodeById.get(draftEdge.fromNodeId);

      if (fromNode) {
        onAddEdge(
          draftEdge.fromNodeId,
          newNodeId,
          calculateDistanceWeight(fromNode, { id: newNodeId, ...point })
        );
      }

      setDraftEdge(null);
      return;
    }

    onAddNode(point.x, point.y);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditable) {
      return;
    }

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

  const handleNodeMouseDown = (
    event: React.MouseEvent<SVGGElement>,
    node: Node
  ) => {
    if (!isEditable) {
      return;
    }

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
  };

  const handleNodeClick = (
    event: React.MouseEvent<SVGGElement>,
    node: Node
  ) => {
    event.stopPropagation();

    if (!isEditable) {
      if (sourceNodeId === null) {
        onSelectSourceNode(node.id);
        node.label = "source";
      } else if (sourceNodeId !== node.id && targetNodeId === null) {
        onSelectTargetNode(node.id);
        node.label = "target";
      }
      return;
    }

    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }

    if (draftEdge) {
      const fromNode = nodeById.get(draftEdge.fromNodeId);

      if (fromNode) {
        onAddEdge(
          draftEdge.fromNodeId,
          node.id,
          calculateDistanceWeight(fromNode, node)
        );
      }

      setDraftEdge(null);
      return;
    }

    setDraftEdge({
      fromNodeId: node.id,
      to: { x: node.x, y: node.y },
    });
  };

  const handleNodeContextMenu = (
    event: React.MouseEvent<SVGGElement>,
    node: Node
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isEditable) {
      return;
    }

    setDraftEdge((currentDraftEdge) =>
      currentDraftEdge?.fromNodeId === node.id ? null : currentDraftEdge
    );
    onDeleteNode(node.id);
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
        cursor: isEditable ? "crosshair" : "default",
      }}
    >
      <Edges
        edges={edges}
        nodeById={nodeById}
        isEditable={isEditable}
        onDeleteEdge={onDeleteEdge}
      />
      {draftEdge && (
        <DraftEdge
          fromNode={nodeById.get(draftEdge.fromNodeId)}
          to={draftEdge.to}
        />
      )}
      <Nodes
        nodes={nodes}
        radius={nodeRadius}
        onMouseDown={handleNodeMouseDown}
        onClick={handleNodeClick}
        onContextMenu={handleNodeContextMenu}
        sourceNodeId={sourceNodeId}
        targetNodeId={targetNodeId}
      />
      <EdgeWeightLabels
        edges={edges}
        nodeById={nodeById}
        isEditable={isEditable}
        onDeleteEdge={onDeleteEdge}
      />
    </svg>
  );
}
