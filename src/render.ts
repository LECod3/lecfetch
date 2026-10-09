// Turn rows into the final text. Returning a string (instead of printing
// directly) keeps this layer testable and leaves stdout to the caller.
export function render(rows: Array<[string, string]>): string {
  const width = Math.max(...rows.map(([label]) => label.length));
  const lines = rows.map(
    ([label, value]) => `${label.padStart(width)}  ${value}`,
  );

  return ["lecfetch", ...lines].join("\n");
}
