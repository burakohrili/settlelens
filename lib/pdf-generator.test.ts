import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildReportHTML } from "./pdf-generator.js";

const XSS_PAYLOAD = '<script>alert("xss")</script>';

const baseData = {
  userName: "Test User",
  jurisdiction: "US-Equitable",
  date: "2026-01-01",
  lang: "en",
  assets: [],
  debts: [],
  currency: "USD",
  scenarios: [
    {
      name: XSS_PAYLOAD,
      net_worth_now: 100000,
      year1: 105000,
      year3: 115000,
      year5: 125000,
      year10: 150000,
      monthly_cashflow: 500,
      risk_score: 5,
      alimony_range_low: 0,
      alimony_range_high: 0,
      child_support_estimate: 0,
      negotiation_strategy: XSS_PAYLOAD,
      key_risks: [XSS_PAYLOAD],
      confidence_label_text: "",
    },
  ],
};

describe("buildReportHTML XSS escape", () => {
  it("script payload in scenario name is escaped", () => {
    const html = buildReportHTML(baseData);
    assert.ok(!html.includes('<script>alert'), "raw <script> tag found in scenario name — XSS not escaped");
    assert.ok(html.includes("&lt;script&gt;"), "escaped form &lt;script&gt; not found in output");
  });

  it("script payload in negotiation_strategy is escaped", () => {
    const html = buildReportHTML(baseData);
    assert.ok(!html.includes('<script>alert'), "raw <script> found in negotiation_strategy output");
  });

  it("no raw script tags anywhere in output", () => {
    const html = buildReportHTML(baseData);
    const scriptCount = (html.match(/<script>/g) ?? []).length;
    assert.strictEqual(scriptCount, 0, `found ${scriptCount} raw <script> tag(s) in rendered HTML`);
  });
});
