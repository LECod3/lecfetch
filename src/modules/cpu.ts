import { readFile } from "../lib/readFile.js";

function getField(block: string, key: string): string | null {
  const match = block.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, "m"));

  if (match === null || match[1] === undefined) {
    return null;
  }

  return match[1].trim();
}

export function parseCpuInfo(content: string): string | null {
  const blocks = content
    .split(/\n\s*\n/)
    .filter((block) => block.trim().length > 0);

  const firstBlock = blocks[0];

  if (firstBlock === undefined) {
    return null;
  }

  const modelName =
    getField(firstBlock, "model name") ??
    getField(firstBlock, "Processor") ??
    getField(firstBlock, "Hardware");

  if (modelName === null) {
    return null;
  }

  const logicalCount = blocks.filter((block) =>
    /^processor\s*:/m.test(block),
  ).length;

  return `${modelName} (${logicalCount} logical)`;
}

export async function get(): Promise<string | null> {
  const content = await readFile("/proc/cpuinfo");

  return content === null ? null : parseCpuInfo(content);
}
