import { test } from "node:test";
import * as assert from "node:assert/strict";
import { render } from "../src/render.js";

test("render prints the title plus aligned rows", () => {
  const rows: Array<[string, string]> = [
    ["OS", "Linux Mint 22.3"],
    ["Hostname", "Gneisenau"],
  ];

  const expected = [
    "lecfetch",
    "      OS  Linux Mint 22.3",
    "Hostname  Gneisenau",
  ].join("\n");

  assert.equal(render(rows), expected);
});

test("render handles a single row", () => {
  assert.equal(render([["OS", "Linux"]]), "lecfetch\nOS  Linux");
});
