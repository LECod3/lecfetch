import { test } from "node:test";
import * as assert from "node:assert/strict";
import { mapArch } from "../src/modules/arch.js";

test("mapArch maps Node arch names", () => {
  assert.equal(mapArch("x64"), "x86_64");
  assert.equal(mapArch("arm64"), "aarch64");
  assert.equal(mapArch("unknown"), "unknown");
});
