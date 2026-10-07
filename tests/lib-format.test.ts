import { test } from "node:test";
import * as assert from "node:assert/strict";
import { formatBytes, formatUptime } from "../src/lib/format.js";

test("formatBytes converts bytes to GiB", () => {
  assert.equal(formatBytes(1024 ** 3), "1.0 GiB");
  assert.equal(formatBytes(2.5 * 1024 ** 3), "2.5 GiB");
});

test("formatUptime formats minutes and hours", () => {
  assert.equal(formatUptime(2237), "37m");
  assert.equal(formatUptime(7000), "1h 56m");
});
