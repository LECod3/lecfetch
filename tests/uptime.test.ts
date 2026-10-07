import { test } from "node:test";
import * as assert from "node:assert/strict";
import { parseUptime } from "../src/modules/uptime.js";

test("parseUptime reads first value and formats it", () => {
  assert.equal(parseUptime("2237.10 15669.23\n"), "37m");
  assert.equal(parseUptime("7000.0 0.0\n"), "1h 56m");
});
