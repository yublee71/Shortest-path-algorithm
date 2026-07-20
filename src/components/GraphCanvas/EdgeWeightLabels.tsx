import type { Edge, Node } from "../../models/Graph";

interface EdgeWeightLabelsProps {
  edges: Edge[];
  nodeById: Map<string, Node>;
  isEditable: boolean;
  onDeleteEdge: (id: string) => void;
}

export function EdgeWeightLabels({
  edges,
  nodeById,
  isEditable,
  onDeleteEdge,
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

        return (
          <g
            key={`${edge.id}-weight`}
            transform={`translate(${midX}, ${midY}) rotate(${labelAngleDegrees})`}
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
            <text
              x={0}
              y={-10}
              fill="#111827"
              fontSize="12"
              fontWeight={400}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {edge.weight}
            </text>
          </g>
        );
      })}
    </>
  );
}
