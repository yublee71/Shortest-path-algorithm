import type { DijkstraStep } from "../../algorithms/dijkstra";
import type { Edge, Node } from "../../models/Graph";

interface EdgesProps {
  edges: Edge[];
  nodeById: Map<string, Node>;
  isEditable: boolean;
  onDeleteEdge: (id: string) => void;
  dijkstraSteps: DijkstraStep[];
  currentStepIndex: number;
  nodeRadius: number;
}

export function Edges({
  edges,
  nodeById,
  isEditable,
  onDeleteEdge,
  dijkstraSteps,
  currentStepIndex,
  nodeRadius,
}: EdgesProps) {
  return (
    <>
      <defs>
        <marker
          id="edge-arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#000000" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const fromNode = nodeById.get(edge.fromNodeId);
        const toNode = nodeById.get(edge.toNodeId);

        if (!fromNode || !toNode) {
          return null;
        }
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.hypot(dx, dy);
        const unitX = length === 0 ? 0 : dx / length;
        const unitY = length === 0 ? 0 : dy / length;
        const lineStartX = fromNode.x + unitX * nodeRadius;
        const lineStartY = fromNode.y + unitY * nodeRadius;
        const lineEndX = toNode.x - unitX * nodeRadius;
        const lineEndY = toNode.y - unitY * nodeRadius;

        return (
          <g
            key={edge.id}
            onClick={(event) => event.stopPropagation()}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();

              if (!isEditable) {
                return;
              }

              onDeleteEdge(edge.id);
            }}
            style={{ cursor: isEditable ? "pointer" : "default" }}
          >
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="transparent"
              strokeWidth={12}
            />
            <line
              x1={lineStartX}
              y1={lineStartY}
              x2={lineEndX}
              y2={lineEndY}
              stroke="#000000"
              strokeWidth={
                !isEditable &&
                dijkstraSteps[
                  currentStepIndex
                ]?.currentlyVisitingEdgesId?.includes(edge.id)
                  ? 4
                  : 2
              }
              markerEnd="url(#edge-arrowhead)"
              pointerEvents="none"
            />
          </g>
        );
      })}
    </>
  );
}
