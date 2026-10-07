import { readFile } from "../lib/readFile.js";

// Read PRETTY_NAME from /etc/os-release, falling back to NAME.
export function parseOsRelease(content: string): string | null {
  const lines = content.split("\n");

  for (const line of lines) {
    if (line.startsWith("PRETTY_NAME=")) {
      const value = line.slice("PRETTY_NAME=".length).trim();
      return value.replace(/^"(.*)"$/, "$1");
    }
  }

  for (const line of lines) {
    if (line.startsWith("NAME=")) {
      const value = line.slice("NAME=".length).trim();
      return value.replace(/^"(.*)"$/, "$1");
    }
  }

  return null;
}

export async function get(): Promise<string | null> {
  const content = await readFile("/etc/os-release");

  return content === null ? null : parseOsRelease(content);
}
