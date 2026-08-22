import type { AlgorithmStep } from "../../models/Algorithm";
import type { Edge, Node } from "../../models/Graph";
import { hasReverseEdge } from "../../models/edgeCalculation";

interface EdgesProps {
  edges: Edge[];
  nodeById: Map<string, Node>;
  isEditable: boolean;
  onDeleteEdge: (id: string) => void;
  algorithmSteps: AlgorithmStep[];
  currentStepIndex: number;
  nodeRadius: number;
}

function hasRelaxedEdge(step: AlgorithmStep, edgeId: string): boolean {
  if (!step || !("relaxedEdgesId" in step)) {
    return false;
  }

  return Array.isArray(step.relaxedEdgesId)
    ? step.relaxedEdgesId.includes(edgeId)
    : false;
}

export function Edges({
  edges,
  nodeById,
  isEditable,
  onDeleteEdge,
  algorithmSteps,
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
        const reverseEdge = hasReverseEdge(edges, edge);
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.hypot(dx, dy);
        const unitX = length === 0 ? 0 : dx / length;
        const unitY = length === 0 ? 0 : dy / length;
        const perpendicularX = -unitY;
        const perpendicularY = unitX;
        const curveOffset = reverseEdge ? 24 : 0;
        const lineStartX = fromNode.x + unitX * nodeRadius;
        const lineStartY = fromNode.y + unitY * nodeRadius;
        const isVisitingEdge =
          !isEditable &&
          algorithmSteps[currentStepIndex]?.currentlyVisitingEdgesId?.includes(
            edge.id
          );
        const isRelaxedEdge =
          !isEditable &&
          hasRelaxedEdge(algorithmSteps[currentStepIndex], edge.id);
        const edgeColor = isRelaxedEdge && !isVisitingEdge ? "grey" : "black";
        const arrowLength = isVisitingEdge ? 10 : 8;
        const arrowWidth = isVisitingEdge ? 10 : 8;
        const arrowTipX = toNode.x - unitX * nodeRadius;
        const arrowTipY = toNode.y - unitY * nodeRadius;
        const controlX =
          (lineStartX + arrowTipX) / 2 + perpendicularX * curveOffset;
        const controlY =
          (lineStartY + arrowTipY) / 2 + perpendicularY * curveOffset;
        const arrowDirectionX = reverseEdge ? arrowTipX - controlX : unitX;
        const arrowDirectionY = reverseEdge ? arrowTipY - controlY : unitY;
        const arrowDirectionLength = Math.hypot(
          arrowDirectionX,
          arrowDirectionY
        );
        const arrowUnitX =
          arrowDirectionLength === 0
            ? 0
            : arrowDirectionX / arrowDirectionLength;
        const arrowUnitY =
          arrowDirectionLength === 0
            ? 0
            : arrowDirectionY / arrowDirectionLength;
        const arrowBaseX = arrowTipX - arrowUnitX * arrowLength;
        const arrowBaseY = arrowTipY - arrowUnitY * arrowLength;
        const arrowPerpendicularX = -arrowUnitY;
        const arrowPerpendicularY = arrowUnitX;
        const arrowHalfWidth = arrowWidth / 2;
        const edgePath = reverseEdge
          ? `M ${lineStartX} ${lineStartY} Q ${controlX} ${controlY} ${arrowBaseX} ${arrowBaseY}`
          : `M ${lineStartX} ${lineStartY} L ${arrowBaseX} ${arrowBaseY}`;
        const hitPath = reverseEdge
          ? `M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY} ${toNode.x} ${toNode.y}`
          : `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
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
            <path
              d={hitPath}
              stroke="transparent"
              strokeWidth={12}
              fill="none"
            />
            <path
              d={edgePath}
              stroke={edgeColor}
              strokeWidth={isVisitingEdge ? 4 : 2}
              fill="none"
              pointerEvents="none"
            />
            <polygon
              points={arrowPoints}
              fill={edgeColor}
              pointerEvents="none"
            />
          </g>
        );
      })}
    </>
  );
}
