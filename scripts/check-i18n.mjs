import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../messages");

function flatKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === "object" && v !== null && !Array.isArray(v)
      ? flatKeys(v, key)
      : [key];
  });
}

const ref = JSON.parse(readFileSync(join(dir, "en.json"), "utf-8"));
const refKeys = new Set(flatKeys(ref));
const locales = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""))
  .filter((l) => l !== "en");

let failed = false;
for (const locale of locales) {
  const data = JSON.parse(readFileSync(join(dir, `${locale}.json`), "utf-8"));
  const keys = new Set(flatKeys(data));
  const missing = [...refKeys].filter((k) => !keys.has(k));
  if (missing.length) {
    console.error(`[${locale}] ${missing.length} missing key(s):`, missing.slice(0, 10));
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`✓ i18n parity OK — ${refKeys.size} keys across ${locales.length + 1} locales`);
