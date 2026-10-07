import { test } from "node:test";
import * as assert from "node:assert/strict";
import { parseHostname } from "../src/modules/hostname.js";

test("parseHostname trims newline", () => {
  assert.equal(parseHostname("Gneisenau\n"), "Gneisenau");
});
