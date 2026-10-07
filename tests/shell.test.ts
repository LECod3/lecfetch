import { test } from "node:test";
import * as assert from "node:assert/strict";
import { parseShell } from "../src/modules/shell.js";

test("parseShell extracts basename from SHELL", () => {
  assert.equal(parseShell({ SHELL: "/bin/bash" }), "bash");
});

test("parseShell returns null when missing", () => {
  assert.equal(parseShell({}), null);
});
