// lecfetch — Phase 4: thin orchestrator. Data lives in info.ts,
// presentation lives in render.ts, and this file only wires them up.

import { buildRows } from "./info.js";
import { render } from "./render.js";

async function main(): Promise<void> {
  console.log(render(await buildRows()));
}

void main();
