import { test } from "node:test";
import * as assert from "node:assert/strict";
import { parseTerminal } from "../src/modules/terminal.js";

test("parseTerminal prefers TERM_PROGRAM", () => {
  assert.equal(parseTerminal({ TERM_PROGRAM: "zed", TERM: "xterm-256color" }), "zed");
});

test("parseTerminal falls back to TERM", () => {
  assert.equal(parseTerminal({ TERM: "xterm-256color" }), "xterm-256color");
});

test("parseTerminal returns null when missing", () => {
  assert.equal(parseTerminal({}), null);
});
