import { test } from "node:test";
import * as assert from "node:assert/strict";
import { buildRows } from "../src/info.js";

test("buildRows returns one row per label in order", async () => {
  const rows = await buildRows();
  const labels = rows.map(([label]) => label);

  assert.deepEqual(labels, [
    "OS",
    "Kernel",
    "Hostname",
    "CPU",
    "RAM",
    "Uptime",
    "Arch",
    "Shell",
    "Terminal",
  ]);
});

test("buildRows values are never empty strings", async () => {
  const rows = await buildRows();

  for (const [, value] of rows) {
    assert.ok(value.length > 0);
  }
});
