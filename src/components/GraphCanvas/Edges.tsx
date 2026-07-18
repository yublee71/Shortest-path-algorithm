import type { Edge, Node } from "../../models/Graph";

interface EdgesProps {
  edges: Edge[];
  nodeById: Map<string, Node>;
  onDeleteEdge: (id: string) => void;
}

export function Edges({ edges, nodeById, onDeleteEdge }: EdgesProps) {
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
              onDeleteEdge(edge.id);
            }}
            style={{ cursor: "pointer" }}
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
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        );
      })}
    </>
  );
}
