import { readFile } from "../lib/readFile.js";
import { formatBytes } from "../lib/format.js";

function parseMeminfoValue(content: string, key: string): number | null {
  const regex = new RegExp(`^${key}:\\s+(\\d+)\\s+kB$`, "m");
  const match = content.match(regex);

  if (match === null || match[1] === undefined) {
    return null;
  }

  const kb = Number(match[1]);

  return Number.isNaN(kb) ? null : kb * 1024;
}

export function parseMemory(content: string): string | null {
  const total = parseMeminfoValue(content, "MemTotal");
  const available = parseMeminfoValue(content, "MemAvailable");

  if (total === null || available === null) {
    return null;
  }

  const used = total - available;

  return `${formatBytes(used)} / ${formatBytes(total)}`;
}

export async function get(): Promise<string | null> {
  const content = await readFile("/proc/meminfo");

  return content === null ? null : parseMemory(content);
}
