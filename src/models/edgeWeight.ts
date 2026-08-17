export const EDGE_WEIGHT_DISPLAY_SCALE = 10;
export const EDGE_WEIGHT_INPUT_LIMIT = 100;

export function isValidEdgeWeight(value: number) {
  return (
    Number.isInteger(value) && value >= 1 && value <= EDGE_WEIGHT_INPUT_LIMIT
  );
}
