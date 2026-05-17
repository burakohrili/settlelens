/**
 * Local dev server test script
 * Run: node scripts/test-local.mjs
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  env[key] = val;
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BASE = "http://localhost:3000";

function pass(msg) { console.log(`  ✓ ${msg}`); }
function fail(msg) { console.log(`  ✗ ${msg}`); }
function section(msg) { console.log(`\n── ${msg}`); }

// ── 1. Supabase reachable
section("Supabase connection");
try {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  r.ok ? pass(`Supabase reachable (${r.status})`) : fail(`Supabase returned ${r.status}`);
} catch (e) {
  fail(`Supabase unreachable: ${e.message}`);
}

// ── 2. Auth — sign in with test user
section("Auth (test@settlelens.com)");
let accessToken = null;
let userId = null;
try {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email: "test@settlelens.com", password: "TestUser123!" }),
  });
  const body = await r.json();
  if (body.access_token) {
    accessToken = body.access_token;
    userId = body.user?.id;
    pass(`Login OK — user: ${body.user?.email}, id: ${userId?.slice(0, 8)}...`);
  } else {
    fail(`Login failed: ${JSON.stringify(body)}`);
  }
} catch (e) {
  fail(`Login error: ${e.message}`);
}

if (!accessToken) {
  console.log("\n⚠ Cannot continue without auth token");
  process.exit(1);
}

// ── 3. Profile check
section("Profile data");
try {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const [profile] = await r.json();
  if (profile) {
    pass(`Profile found: country=${profile.country}, lang=${profile.preferred_language}, plan=${profile.plan_type}, onboarding=${profile.onboarding_completed}`);
    if (!profile.country) fail("country is NULL — currency fix won't work");
    if (!profile.preferred_language) fail("preferred_language is NULL — locale fix needs cookie fallback");
    if (!profile.onboarding_completed) fail("onboarding_completed is false — will redirect to step-1");
  } else {
    fail("No profile found for test user");
  }
} catch (e) {
  fail(`Profile fetch error: ${e.message}`);
}

// ── 4. Assets check
section("Assets");
try {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/assets?user_id=eq.${userId}&select=id,name,category,current_value`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const assets = await r.json();
  pass(`${assets.length} asset(s) found`);
  assets.forEach(a => console.log(`     • ${a.name} (${a.category}) = ${a.current_value}`));
} catch (e) {
  fail(`Assets fetch error: ${e.message}`);
}

// ── 5. Scenarios check
section("Scenarios");
let scenarioId = null;
try {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/scenarios?user_id=eq.${userId}&select=id,name,scenario_type`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const scenarios = await r.json();
  pass(`${scenarios.length} scenario(s) found`);
  scenarios.forEach(s => {
    console.log(`     • ${s.name} (${s.scenario_type}) — id: ${s.id}`);
    if (!scenarioId) scenarioId = s.id;
  });
} catch (e) {
  fail(`Scenarios fetch error: ${e.message}`);
}

// ── 6. Dev server — public page
section("Dev server pages");
try {
  const r = await fetch(`${BASE}/tr/login`);
  r.ok ? pass(`/tr/login → ${r.status}`) : fail(`/tr/login → ${r.status}`);
} catch (e) {
  fail(`Dev server unreachable: ${e.message}`);
}

// ── 7. Analyze API (with auth cookie simulation)
section("Analyze API");
if (scenarioId) {
  try {
    const r = await fetch(`${BASE}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass token as Authorization header — only works if API supports it
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ scenarioId }),
    });
    const body = await r.json();
    if (r.ok) {
      pass(`Analyze OK — risk_score=${body.data?.risk_score}, year10=${body.data?.year10}`);
    } else {
      fail(`Analyze failed (${r.status}): ${JSON.stringify(body)}`);
    }
  } catch (e) {
    fail(`Analyze error: ${e.message}`);
  }
} else {
  console.log("  — skipped (no scenario found)");
}

console.log("\n");
