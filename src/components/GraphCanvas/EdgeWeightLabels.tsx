import type { Edge, Node } from "../../models/Graph";
import {
  EDGE_WEIGHT_INPUT_LIMIT,
  toDisplayEdgeWeight,
} from "../../models/edgeWeight";
import type { EditingEdgeWeightState } from "./GraphCanvas";

interface EdgeWeightLabelsProps {
  edges: Edge[];
  nodeById: Map<string, Node>;
  isEditable: boolean;
  onDeleteEdge: (id: string) => void;
  editingEdgeWeight: EditingEdgeWeightState | null;
  onEditingEdgeWeightChange: (value: string) => void;
  onEditingEdgeWeightCommit: (value?: string) => void;
  onEditingEdgeWeightCancel: () => void;
  onStartEditingEdgeWeight: (id: string, currentWeight: number) => void;
}

export function EdgeWeightLabels({
  edges,
  nodeById,
  isEditable,
  onDeleteEdge,
  editingEdgeWeight,
  onEditingEdgeWeightChange,
  onEditingEdgeWeightCommit,
  onEditingEdgeWeightCancel,
  onStartEditingEdgeWeight,
}: EdgeWeightLabelsProps) {
  return (
    <>
      {edges.map((edge) => {
        const nodeA = nodeById.get(edge.nodeA);
        const nodeB = nodeById.get(edge.nodeB);

        if (!nodeA || !nodeB) {
          return null;
        }

        const midX = (nodeA.x + nodeB.x) / 2;
        const midY = (nodeA.y + nodeB.y) / 2;
        const edgeAngle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
        const labelAngle =
          edgeAngle > Math.PI / 2 || edgeAngle < -Math.PI / 2
            ? edgeAngle + Math.PI
            : edgeAngle;
        const labelAngleDegrees = (labelAngle * 180) / Math.PI;
        const isEditing = editingEdgeWeight?.edgeId === edge.id;
        const displayWeight = toDisplayEdgeWeight(edge.weight);

        return (
          <g
            key={`${edge.id}-weight`}
            transform={`translate(${midX}, ${midY}) rotate(${labelAngleDegrees})`}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => {
              event.stopPropagation();
              if (!isEditable) {
                return;
              }
              onStartEditingEdgeWeight(edge.id, edge.weight);
            }}
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
            {!isEditing && (
              <text
                x={0}
                y={-10}
                fontSize="12"
                fontWeight={400}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {displayWeight}
              </text>
            )}
            {isEditing && (
              <g>
                <foreignObject
                  x={-18}
                  y={-26}
                  width={36}
                  height={38}
                  style={{ overflow: "visible" }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <input
                      type="number"
                      min={1}
                      max={EDGE_WEIGHT_INPUT_LIMIT}
                      step={1}
                      autoFocus
                      value={editingEdgeWeight.value}
                      onChange={(event) =>
                        onEditingEdgeWeightChange(event.target.value)
                      }
                      onBlur={() => onEditingEdgeWeightCommit()}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          event.stopPropagation();
                          onEditingEdgeWeightCommit();
                          return;
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          event.stopPropagation();
                          onEditingEdgeWeightCancel();
                        }
                      }}
                      onClick={(event) => event.stopPropagation()}
                      onDoubleClick={(event) => event.stopPropagation()}
                      style={{
                        width: "100%",
                        height: "22px",
                        border: "solid 1px black",
                        fontSize: "12px",
                        textAlign: "center",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </foreignObject>
              </g>
            )}
          </g>
        );
      })}
    </>
  );
}
