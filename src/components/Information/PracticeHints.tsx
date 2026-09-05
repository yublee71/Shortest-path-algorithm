import type { PracticeHint } from "../../models/Practice";

interface PracticeHintsProps {
  hints: PracticeHint[];
  showCorrectAnswer: boolean;
}

function formatDistance(distance: number | undefined) {
  if (distance === undefined) {
    return "N/A";
  }

  return distance === Infinity ? "inf" : String(distance);
}

export function PracticeHints({ hints, showCorrectAnswer }: PracticeHintsProps) {
  if (hints.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBottom: "10px" }}>
      <h3 style={{ margin: "0 0 8px" }}>Hint</h3>
      <ol style={{ margin: 0, paddingLeft: "20px" }}>
        {hints.map((hint) => (
          <li key={hint.nodeId} value={hint.hintNumber}>
            {hint.nodeId}: current distance is{" "}
            {formatDistance(hint.currentDistance)}, alternative distance is{" "}
            {formatDistance(hint.alternativeDistance)}
            {showCorrectAnswer
              ? `, correct answer is ${formatDistance(hint.expectedDistance)}.`
              : "."}
          </li>
        ))}
      </ol>
    </section>
  );
}
