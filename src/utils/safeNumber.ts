/**
 * safeNumber utility
 * Filters NaN/Infinity and clamps the value within optional bounds.
 * Default bounds: min 0.1, max 99 (useful for percentages).
 * Additional optional bounds can be provided for change ranges (e.g., 1‑9999).
 */
export default function safeNumber(
  value: number,
  options?: {
    min?: number;
    max?: number;
    minChange?: number;
    maxChange?: number;
  }
): number {
  // Guard against NaN or non‑finite numbers
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return 0;
  }

  const { min = -Infinity, max = Infinity, minChange = -Infinity, maxChange = Infinity } = options ?? {};

  let result = value;
  // Clamp to provided min/max (percentage bounds by default)
  if (result < min) result = min;
  if (result > max) result = max;
  // Clamp to optional change range bounds
  if (result < minChange) result = minChange;
  if (result > maxChange) result = maxChange;

  return result;
}
