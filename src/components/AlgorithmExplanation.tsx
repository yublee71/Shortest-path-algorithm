import type { Node } from "../models/Graph";

interface AlgorithmExplanationProps {
  nodes: Node[];
}

export function AlgorithmExplanation({ nodes }: AlgorithmExplanationProps) {
  return (
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
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Node</th>
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
          minHeight: "100px",
          resize: "vertical",
          border: "1px solid #ccc",
        }}
      />
    </aside>
  );
}
