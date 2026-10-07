import { test } from "node:test";
import * as assert from "node:assert/strict";
import { parseMemory } from "../src/modules/memory.js";

test("parseMemory returns used/total memory", () => {
  const content = [
    "MemTotal:      16384256 kB",
    "MemAvailable:   8174188 kB",
    "",
  ].join("\n");

  assert.equal(parseMemory(content), "7.8 GiB / 15.6 GiB");
});
