import {
  algorithmOptions,
  getAlgorithmLabel,
  type AlgorithmResult,
} from "../../models/Algorithm";

interface ComparisonTableProps {
  comparisonResults: AlgorithmResult[];
}

function formatResultDistance(distance: number | undefined) {
  if (distance === undefined) {
    return "N/A";
  }

  return distance === Infinity ? "∞" : distance;
}

function formatResultPath(path: string | undefined) {
  if (path === undefined || path === "") {
    return "No path";
  }

  return path;
}

export function ComparisonTable({ comparisonResults }: ComparisonTableProps) {
  const sortedComparisonResults = algorithmOptions
    .map((algorithmOption) =>
      comparisonResults.find(
        (result) => result.algorithmId === algorithmOption.id
      )
    )
    .filter((result): result is AlgorithmResult => result !== undefined);

  if (sortedComparisonResults.length !== 2) {
    return null;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "10px",
      }}
    >
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc" }}></th>
          {sortedComparisonResults.map((result) => (
            <th key={result.algorithmId} style={{ border: "1px solid #ccc" }}>
              {getAlgorithmLabel(result.algorithmId)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody style={{ textAlign: "center" }}>
        <tr>
          <th style={{ border: "1px solid #ccc" }}>Distance</th>
          {sortedComparisonResults.map((result) => (
            <td
              key={`${result.algorithmId}-distance`}
              style={{ border: "1px solid #ccc" }}
            >
              {formatResultDistance(result.totalDistance)}
            </td>
          ))}
        </tr>
        <tr>
          <th style={{ border: "1px solid #ccc" }}>Path</th>
          {sortedComparisonResults.map((result) => (
            <td
              key={`${result.algorithmId}-path`}
              style={{ border: "1px solid #ccc" }}
            >
              {formatResultPath(result.path)}
            </td>
          ))}
        </tr>
        <tr>
          <th style={{ border: "1px solid #ccc" }}>Visited nodes</th>
          {sortedComparisonResults.map((result) => (
            <td
              key={`${result.algorithmId}-visited`}
              style={{ border: "1px solid #ccc" }}
            >
              {result.visitedNodeCount ?? "N/A"}
            </td>
          ))}
        </tr>
        <tr>
          <th style={{ border: "1px solid #ccc" }}>Edge checks</th>
          {sortedComparisonResults.map((result) => (
            <td
              key={`${result.algorithmId}-edge-checks`}
              style={{ border: "1px solid #ccc" }}
            >
              {result.edgeCheckCount}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
