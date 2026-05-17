import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: true,
    timeout: 30_000,
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 20_000 });
  const pdf = await page.pdf({
    format: "A4",
    margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    printBackground: true,
  });
  await browser.close();
  return Buffer.from(pdf);
}

type ReportData = {
  userName: string;
  jurisdiction: string;
  date: string;
  lang: string;
  assets: Array<{ name: string; category: string; current_value: number; owned_by: string; crypto_token?: string; crypto_quantity?: number; crypto_exchange?: string }>;
  debts: Array<{ name: string; category: string; balance: number; monthly_payment: number }>;
  scenarios: Array<{
    name: string;
    net_worth_now: number;
    year1: number;
    year3: number;
    year5: number;
    year10: number;
    monthly_cashflow: number;
    risk_score: number;
    alimony_range_low: number;
    alimony_range_high: number;
    child_support_estimate: number;
    negotiation_strategy: string;
    key_risks: string[];
    confidence_label_text: string;
  }>;
  currency: string;
};

function fmt(n: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function riskColor(score: number): string {
  if (score >= 7) return "#E85252";
  if (score >= 4) return "#C8973A";
  return "#4FA86E";
}

export function buildReportHTML(data: ReportData): string {
  const { userName, jurisdiction, date, assets, debts, scenarios, currency } = data;

  const totalAssets = assets.reduce((s, a) => s + (a.current_value || 0), 0);
  const totalDebts = debts.reduce((s, d) => s + (d.balance || 0), 0);
  const netWorth = totalAssets - totalDebts;

  const scenariosHTML = scenarios
    .map(
      (s, i) => `
      <div class="scenario-block" style="break-inside:avoid;">
        <h3 style="color:#1C2B3A;border-bottom:2px solid #C8973A;padding-bottom:4px;">Scenario ${i + 1}: ${s.name}</h3>
        <p style="font-size:11px;color:#6b6b6b;font-style:italic;margin-top:0;">${s.confidence_label_text}</p>
        <table class="data-table">
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Net Worth Now</td><td>${fmt(s.net_worth_now, currency)}</td></tr>
          <tr><td>Year 1 Projection</td><td>${fmt(s.year1, currency)}</td></tr>
          <tr><td>Year 3 Projection</td><td>${fmt(s.year3, currency)}</td></tr>
          <tr><td>Year 5 Projection</td><td>${fmt(s.year5, currency)}</td></tr>
          <tr><td>Year 10 Projection</td><td>${fmt(s.year10, currency)}</td></tr>
          <tr><td>Monthly Cash Flow</td><td>${fmt(s.monthly_cashflow, currency)}/mo</td></tr>
          <tr><td>Risk Score</td><td style="color:${riskColor(s.risk_score)};font-weight:bold;">${s.risk_score}/10</td></tr>
          <tr><td>Alimony Estimate Range</td><td>${fmt(s.alimony_range_low, currency)} – ${fmt(s.alimony_range_high, currency)}/mo</td></tr>
          <tr><td>Child Support Estimate</td><td>${fmt(s.child_support_estimate, currency)}/mo</td></tr>
        </table>
        ${s.key_risks?.length ? `<p><strong>Key Risks:</strong> ${(s.key_risks as string[]).join("; ")}</p>` : ""}
        ${s.negotiation_strategy ? `<p><strong>Financial Positioning Note:</strong> ${s.negotiation_strategy}</p>` : ""}
      </div>`
    )
    .join("<hr style='margin:24px 0;border-color:#D4C5B0;'>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #333; background: #fff; }
  .cover { background: #1C2B3A; color: #fff; padding: 40px; min-height: 200px; }
  .cover h1 { font-size: 28px; color: #C8973A; letter-spacing: 2px; }
  .cover h2 { font-size: 16px; color: #d0d0d0; margin-top: 8px; }
  .cover .meta { margin-top: 20px; font-size: 11px; color: #a0b0c0; line-height: 1.8; }
  .disclaimer-box { background: #FFF3F3; border: 2px solid #E85252; padding: 10px 14px; margin: 20px 0; border-radius: 4px; }
  .disclaimer-box p { color: #E85252; font-weight: bold; font-size: 11px; }
  h2 { font-size: 16px; color: #1C2B3A; margin: 20px 0 10px; }
  h3 { font-size: 13px; color: #1C2B3A; margin: 16px 0 8px; }
  .data-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
  .data-table th { background: #1C2B3A; color: #fff; padding: 6px 10px; text-align: left; }
  .data-table td { padding: 5px 10px; border-bottom: 1px solid #e8e8e8; }
  .data-table tr:nth-child(even) td { background: #f7f3ee; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 12px 0; }
  .summary-card { border: 1px solid #D4C5B0; border-radius: 6px; padding: 12px; text-align: center; }
  .summary-card .label { font-size: 10px; color: #8B7355; text-transform: uppercase; letter-spacing: 0.5px; }
  .summary-card .value { font-size: 18px; font-weight: bold; color: #1C2B3A; margin-top: 4px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #D4C5B0; font-size: 9px; color: #999; }
  section { margin-bottom: 24px; }
</style>
</head>
<body>

<div class="cover">
  <h1>SettleLens</h1>
  <h2>Financial Analysis Report</h2>
  <div class="meta">
    <div>Prepared for: ${userName}</div>
    <div>Date: ${date}</div>
    <div>Jurisdiction: ${jurisdiction}</div>
    <div>Scenarios analyzed: ${scenarios.length}</div>
  </div>
</div>

<div style="padding:0 2px;">

<div class="disclaimer-box">
  <p>FINANCIAL MODELING ONLY — NOT LEGAL OR FINANCIAL ADVICE</p>
  <p style="font-weight:normal;margin-top:4px;">This report is an attorney-ready financial overview for personal planning purposes. It does not constitute legal advice, predict court outcomes, or guarantee any settlement result. Always consult a qualified family law attorney before making decisions.</p>
</div>

<section>
  <h2>Net Worth Summary</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Total Assets</div>
      <div class="value">${fmt(totalAssets, currency)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Debts</div>
      <div class="value" style="color:#E85252;">${fmt(totalDebts, currency)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Net Worth</div>
      <div class="value" style="color:${netWorth >= 0 ? "#4FA86E" : "#E85252"};">${fmt(netWorth, currency)}</div>
    </div>
  </div>
</section>

<section>
  <h2>Assets</h2>
  <table class="data-table">
    <tr><th>Name</th><th>Category</th><th>Current Value</th><th>Owned By</th></tr>
    ${assets.map((a) => `<tr><td>${a.name}</td><td>${a.category}</td><td>${fmt(a.current_value, currency)}</td><td>${a.owned_by}</td></tr>`).join("")}
  </table>
  ${assets.some((a) => a.category === "crypto") ? `
  <div style="margin-top:10px;background:#FFF8E1;border:1px solid #F59E0B;border-radius:6px;padding:10px;font-size:11px;color:#92400E;">
    <strong>⚠ Crypto Asset Notice:</strong> Cryptocurrency values are highly volatile and user-stated.
    Professional appraisal is recommended for any legal proceedings.
    ${assets.filter((a) => a.category === "crypto").map((a) => {
      const extra = [];
      if (a.crypto_token) extra.push(`Token: ${a.crypto_token}`);
      if (a.crypto_quantity) extra.push(`Qty: ${Number(a.crypto_quantity).toFixed(8)}`);
      if (a.crypto_exchange) extra.push(`Held at: ${a.crypto_exchange}`);
      return `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #F59E0B;">${a.name}${extra.length ? " — " + extra.join(" | ") : ""}</div>`;
    }).join("")}
  </div>` : ""}
</section>

<section>
  <h2>Debts</h2>
  <table class="data-table">
    <tr><th>Name</th><th>Category</th><th>Balance</th><th>Monthly Payment</th></tr>
    ${debts.map((d) => `<tr><td>${d.name}</td><td>${d.category}</td><td>${fmt(d.balance, currency)}</td><td>${fmt(d.monthly_payment, currency)}/mo</td></tr>`).join("")}
  </table>
</section>

<section>
  <h2>Scenario Analysis</h2>
  ${scenariosHTML}
</section>

<div class="footer">
  <p>Generated by SettleLens — Financial Scenario Modeling for Divorce Preparation | settlelens.com</p>
  <p style="margin-top:4px;">SettleLens provides financial modeling for informational purposes only. This is not legal advice, financial advice, or a court document. Jurisdiction-specific property rules have been applied as assumptions only. Always verify with a qualified family law attorney in your jurisdiction.</p>
  <p style="margin-top:4px;">Report generated: ${date} | Data entered by user — SettleLens has not independently verified any values.</p>
</div>

</div>
</body>
</html>`;
}
