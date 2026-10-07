const ARCH_ALIASES: Record<string, string> = {
  x64: "x86_64",
  arm64: "aarch64",
  arm: "armv7l",
  ia32: "i686",
};

// Map Node's arch names to the ones `uname -m` prints.
export function mapArch(archName: string): string {
  return ARCH_ALIASES[archName] ?? archName;
}

export function get(): string {
  return mapArch(process.arch);
}
