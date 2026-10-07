import { readFile } from "../lib/readFile.js";
import { formatUptime } from "../lib/format.js";

// /proc/uptime format: "<seconds-since-boot> <total-idle-seconds>"
export function parseUptime(content: string): string | null {
  const firstValue = content.trim().split(/\s+/)[0];

  if (firstValue === undefined) {
    return null;
  }

  const seconds = Number(firstValue);

  if (Number.isNaN(seconds)) {
    return null;
  }

  return formatUptime(seconds);
}

export async function get(): Promise<string | null> {
  const content = await readFile("/proc/uptime");

  return content === null ? null : parseUptime(content);
}
