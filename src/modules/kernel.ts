import { readFile } from "../lib/readFile.js";

export function parseKernel(content: string): string | null {
  const trimmed = content.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function get(): Promise<string | null> {
  const content = await readFile("/proc/sys/kernel/osrelease");

  return content === null ? null : parseKernel(content);
}
