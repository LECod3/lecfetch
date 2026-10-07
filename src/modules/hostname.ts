import { readFile } from "../lib/readFile.js";

export function parseHostname(content: string): string | null {
  const trimmed = content.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function get(): Promise<string | null> {
  const content = await readFile("/proc/sys/kernel/hostname");

  return content === null ? null : parseHostname(content);
}
