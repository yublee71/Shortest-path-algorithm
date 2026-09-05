export interface PracticeHint {
  hintNumber: number;
  nodeId: string;
  currentDistance: number;
  alternativeDistance?: number;
  expectedDistance: number;
}

export function isInfinityInput(value: string) {
  const normalizedValue = value.trim().toLowerCase();

  return normalizedValue === "inf" || normalizedValue === "∞";
}

export function isCorrectDistanceInput(
  inputValue: string | undefined,
  actualDistance: number | undefined
) {
  if (inputValue === undefined) {
    return false;
  }

  const trimmedInputValue = inputValue.trim();

  if (trimmedInputValue === "") {
    return false;
  }

  if (actualDistance === undefined) {
    return false;
  }

  if (actualDistance === Infinity) {
    return isInfinityInput(trimmedInputValue);
  }

  return Number(trimmedInputValue) === actualDistance;
}
