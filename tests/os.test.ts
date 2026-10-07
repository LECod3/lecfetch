import { test } from "node:test";
import * as assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseOsRelease } from "../src/modules/os.js";

test("parseOsRelease extracts PRETTY_NAME", () => {
  const content = readFileSync(new URL("./fixtures/os-release", import.meta.url), "utf8");
  assert.equal(parseOsRelease(content), "Linux Mint 22.3");
});

test("parseOsRelease falls back to NAME", () => {
  assert.equal(parseOsRelease('NAME="Debian"\n'), "Debian");
});
