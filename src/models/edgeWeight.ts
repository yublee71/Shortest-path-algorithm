export const EDGE_WEIGHT_DISPLAY_SCALE = 10;
export const EDGE_WEIGHT_INPUT_LIMIT = 100;

export function isValidEdgeWeight(value: number) {
  return (
    Number.isInteger(value) &&
    Math.abs(value) >= 1 &&
    Math.abs(value) <= EDGE_WEIGHT_INPUT_LIMIT
  );
}
