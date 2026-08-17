export const EDGE_WEIGHT_DISPLAY_SCALE = 10;
export const EDGE_WEIGHT_INPUT_LIMIT = 100;

export function toDisplayEdgeWeight(weight: number) {
  return Math.max(1, Math.round(weight / EDGE_WEIGHT_DISPLAY_SCALE));
}

export function toStoredEdgeWeight(displayWeight: number) {
  return displayWeight * EDGE_WEIGHT_DISPLAY_SCALE;
}

export function isValidEdgeWeight(value: number) {
  return (
    Number.isInteger(value) && value >= 1 && value <= EDGE_WEIGHT_INPUT_LIMIT
  );
}
