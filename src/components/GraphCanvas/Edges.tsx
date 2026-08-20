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
        const isVisitingEdge =
          !isEditable &&
          dijkstraSteps[currentStepIndex]?.currentlyVisitingEdgesId?.includes(
            edge.id
          );
        const arrowLength = isVisitingEdge ? 10 : 8;
        const arrowWidth = isVisitingEdge ? 10 : 8;
        const arrowTipX = toNode.x - unitX * nodeRadius;
        const arrowTipY = toNode.y - unitY * nodeRadius;
        const arrowBaseX = arrowTipX - unitX * arrowLength;
        const arrowBaseY = arrowTipY - unitY * arrowLength;
        const arrowPerpendicularX = -unitY;
        const arrowPerpendicularY = unitX;
        const arrowHalfWidth = arrowWidth / 2;
        const arrowPoints = [
          `${arrowTipX},${arrowTipY}`,
          `${arrowBaseX + arrowPerpendicularX * arrowHalfWidth},${
            arrowBaseY + arrowPerpendicularY * arrowHalfWidth
          }`,
          `${arrowBaseX - arrowPerpendicularX * arrowHalfWidth},${
            arrowBaseY - arrowPerpendicularY * arrowHalfWidth
          }`,
        ].join(" ");

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
              x2={arrowBaseX}
              y2={arrowBaseY}
              stroke="#000000"
              strokeWidth={isVisitingEdge ? 4 : 2}
              pointerEvents="none"
            />
            <polygon points={arrowPoints} pointerEvents="none" />
          </g>
        );
      })}
    </>
  );
}
