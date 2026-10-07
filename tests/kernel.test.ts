import { test } from "node:test";
import * as assert from "node:assert/strict";
import { parseKernel } from "../src/modules/kernel.js";

test("parseKernel trims newline", () => {
  assert.equal(parseKernel("7.0.0-38-generic\n"), "7.0.0-38-generic");
});
