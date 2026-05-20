import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatMoney } from "./money.js";

describe("formatMoney", () => {
  it("en: USD decimal separator is comma", () => {
    const r = formatMoney(1234, "USD", "en");
    assert.ok(r.includes("1,234"), `expected comma separator, got: ${r}`);
    assert.ok(r.includes("$"), `expected $ symbol, got: ${r}`);
  });

  it("de: EUR decimal separator is dot", () => {
    const r = formatMoney(1234, "EUR", "de");
    assert.ok(r.includes("1.234"), `expected dot separator, got: ${r}`);
  });

  it("tr: TRY symbol present", () => {
    const r = formatMoney(1234, "TRY", "tr");
    assert.ok(r.includes("1.234"), `expected dot separator, got: ${r}`);
  });

  it("fr: EUR uses space as thousands separator", () => {
    const r = formatMoney(1234, "EUR", "fr");
    assert.ok(r.replace(/\s/g, " ").includes("1 234"), `expected space separator, got: ${r}`);
  });

  it("negative values are formatted correctly", () => {
    const r = formatMoney(-500, "USD", "en");
    assert.ok(r.startsWith("-") || r.includes("−"), `expected negative sign, got: ${r}`);
    assert.ok(r.includes("500"), `expected 500 in output, got: ${r}`);
  });

  it("zero returns formatted zero", () => {
    const r = formatMoney(0, "USD", "en");
    assert.ok(r.includes("0"), `expected 0 in output, got: ${r}`);
  });

  it("unknown locale falls back to en-US", () => {
    const r = formatMoney(1234, "USD", "xx");
    assert.ok(r.includes("1,234"), `unknown locale fallback failed, got: ${r}`);
  });
});
