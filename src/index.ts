// lecfetch — Phase 2 MVP: system info via the Node.js `node:os` API.
// Phase 3 will replace each of these values with a direct /proc or /etc read.

import {
  arch,
  cpus,
  freemem,
  hostname,
  release,
  totalmem,
  type,
  uptime,
} from "node:os";

// Maps Node's arch names to the ones `uname -m` prints (what neofetch shows).
const ARCH_ALIASES: Record<string, string> = {
  x64: "x86_64",
  arm64: "aarch64",
  arm: "armv7l",
  ia32: "i686",
};

// 1024 ** 3 = 1073741824: one gibibyte. Node reports bytes, humans read GiB.
function formatBytes(bytes: number): string {
  const gibibytes = bytes / 1024 ** 3;
  return `${gibibytes.toFixed(1)} GiB`;
}

// 2237 seconds -> "37m", 7000 seconds -> "1h 56m".
function formatUptime(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// cpus() returns one entry per logical CPU; all of them share the same model,
// so reading the first block is enough. The array may be empty on odd systems.
function cpuName(cpuList: ReturnType<typeof cpus>): string {
  const first = cpuList[0]; // noUncheckedIndexedAccess: CpuInfo | undefined
  return first?.model.trim() || "unknown";
}

function buildRows(): Array<[string, string]> {
  const cpuList = cpus();
  const total = totalmem();
  const free = freemem();

  return [
    ["OS", type()],
    ["Kernel", release()],
    ["Hostname", hostname()],
    ["CPU", `${cpuName(cpuList)} (${cpuList.length} logical)`],
    // Verified on Node 24: freemem() reads MemAvailable (not MemFree), so this
    // matches the accurate number already. Phase 3 still reads /proc/meminfo
    // directly to drop the node:os dependency.
    ["RAM", `${formatBytes(total - free)} / ${formatBytes(total)}`],
    ["Uptime", formatUptime(uptime())],
    ["Arch", ARCH_ALIASES[arch()] ?? arch()],
  ];
}

// Right-align the labels so both sides of the colon line up.
function print(rows: Array<[string, string]>): void {
  const width = Math.max(...rows.map(([label]) => label.length));

  console.log("lecfetch");
  for (const [label, value] of rows) {
    console.log(`${label.padStart(width)}  ${value}`);
  }
}

print(buildRows());
