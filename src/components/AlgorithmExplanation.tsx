import type { Node } from "../models/Graph";

interface AlgorithmExplanationProps {
  className?: string;
  nodes: Node[];
  isAlgorithmMode: boolean;
  sourceNodeId: string | null;
  targetNodeId: string | null;
}

export function AlgorithmExplanation({
  className,
  nodes,
  isAlgorithmMode,
  sourceNodeId,
  targetNodeId,
}: AlgorithmExplanationProps) {
  return (
    <div className={className}>
      {isAlgorithmMode && (
        <aside>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "10px",
              padding: "6px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  Node
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  Distance
                </th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {" "}
                  Previous Nodes
                </th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              {nodes.map((node) => (
                <tr key={node.id}>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                    {node.id}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}></td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "70px",
              resize: "vertical",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            {!sourceNodeId ? (
              <p style={{ color: "blue", fontWeight: "bold" }}>
                Please select source node
              </p>
            ) : (
              <p style={{ fontWeight: "bold" }}>Source: {sourceNodeId}</p>
            )}
            {sourceNodeId && !targetNodeId ? (
              <p style={{ color: "blue", fontWeight: "bold" }}>
                Please select target node
              </p>
            ) : (
              targetNodeId && (
                <p style={{ fontWeight: "bold" }}>Target: {targetNodeId}</p>
              )
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
