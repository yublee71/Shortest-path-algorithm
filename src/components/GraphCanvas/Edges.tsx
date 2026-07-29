import type { DijkstraStep } from "../../algorithms/dijkstra";
import type { Edge, Node } from "../../models/Graph";

interface EdgesProps {
  edges: Edge[];
  nodeById: Map<string, Node>;
  isEditable: boolean;
  onDeleteEdge: (id: string) => void;
  dijkstraSteps: DijkstraStep[];
  currentStepIndex: number;
}

export function Edges({
  edges,
  nodeById,
  isEditable,
  onDeleteEdge,
  dijkstraSteps,
  currentStepIndex,
}: EdgesProps) {
  return (
    <>
      {edges.map((edge) => {
        const nodeA = nodeById.get(edge.nodeA);
        const nodeB = nodeById.get(edge.nodeB);

        if (!nodeA || !nodeB) {
          return null;
        }

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
              x1={nodeA.x}
              y1={nodeA.y}
              x2={nodeB.x}
              y2={nodeB.y}
              stroke="transparent"
              strokeWidth={12}
            />
            <line
              x1={nodeA.x}
              y1={nodeA.y}
              x2={nodeB.x}
              y2={nodeB.y}
              stroke="#000000"
              strokeWidth={
                !isEditable &&
                dijkstraSteps[
                  currentStepIndex
                ]?.currentlyVisitingEdgesId?.includes(edge.id)
                  ? 4
                  : 2
              }
              pointerEvents="none"
            />
          </g>
        );
      })}
    </>
  );
}
