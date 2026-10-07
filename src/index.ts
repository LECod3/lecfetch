import { get as getOs } from "./modules/os.js";
import { get as getKernel } from "./modules/kernel.js";
import { get as getHostname } from "./modules/hostname.js";
import { get as getCpu } from "./modules/cpu.js";
import { get as getMemory } from "./modules/memory.js";
import { get as getUptime } from "./modules/uptime.js";
import { get as getArch } from "./modules/arch.js";
import { get as getShell } from "./modules/shell.js";
import { get as getTerminal } from "./modules/terminal.js";

async function buildRows(): Promise<Array<[string, string]>> {
  const [os, kernel, hostname, cpu, memory, uptime] = await Promise.all([
    getOs(),
    getKernel(),
    getHostname(),
    getCpu(),
    getMemory(),
    getUptime(),
  ]);

  return [
    ["OS", os ?? "unknown"],
    ["Kernel", kernel ?? "unknown"],
    ["Hostname", hostname ?? "unknown"],
    ["CPU", cpu ?? "unknown"],
    ["RAM", memory ?? "unknown"],
    ["Uptime", uptime ?? "unknown"],
    ["Arch", getArch()],
    ["Shell", getShell() ?? "unknown"],
    ["Terminal", getTerminal() ?? "unknown"],
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

async function main(): Promise<void> {
  print(await buildRows());
}

void main();
