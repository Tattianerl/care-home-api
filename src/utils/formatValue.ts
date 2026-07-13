export function formatValue(
  value: unknown,
  defaultValue = "-"
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return defaultValue;
  }

  return String(value);
}