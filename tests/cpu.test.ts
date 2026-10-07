import { test } from "node:test";
import * as assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseCpuInfo } from "../src/modules/cpu.js";

test("parseCpuInfo returns model and logical count", () => {
  const content = readFileSync(new URL("./fixtures/cpuinfo", import.meta.url), "utf8");
  const parsed = parseCpuInfo(content);

  assert.match(parsed ?? "", /Intel\(R\) Core\(TM\) i5-10310U/);
  assert.match(parsed ?? "", /\(8 logical\)/);
});
