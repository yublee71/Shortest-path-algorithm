import type { AlgorithmResult } from "../../models/Algorithm";

interface ResultProps {
  algorithmResult: AlgorithmResult | null;
}

export function Result({ algorithmResult }: ResultProps) {
  const hasNoPath = algorithmResult?.path === "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "70px",
        resize: "vertical",
        border: "1px solid #ccc",
        padding: "10px",
        marginTop: "10px",
        fontWeight: "bold",
        backgroundColor: "#fcffe4",
      }}
    >
      {hasNoPath ? (
        <p style={{ color: "darkred" }}>No path found from source to target.</p>
      ) : (
        <>
          <p>Shortest path: {algorithmResult?.path}</p>
          <p>Total distance: {algorithmResult?.totalDistance}</p>
        </>
      )}
    </div>
  );
}
