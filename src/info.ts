import { get as getOs } from "./modules/os.js";
import { get as getKernel } from "./modules/kernel.js";
import { get as getHostname } from "./modules/hostname.js";
import { get as getCpu } from "./modules/cpu.js";
import { get as getMemory } from "./modules/memory.js";
import { get as getUptime } from "./modules/uptime.js";
import { get as getArch } from "./modules/arch.js";
import { get as getShell } from "./modules/shell.js";
import { get as getTerminal } from "./modules/terminal.js";

// Build the list of [label, value] rows. This layer only decides which
// data lecfetch shows and in what order; it never touches the console.
export async function buildRows(): Promise<Array<[string, string]>> {
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
