import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { writeAuditLog } from "./audit.js";

describe("writeAuditLog", () => {
  it("resolves without error when insert succeeds", async () => {
    const client = { from: () => ({ insert: async () => ({ error: null }) }) };
    await assert.doesNotReject(() => writeAuditLog(client, { action: "test" }, "ctx"));
  });

  it("retries once and resolves if second attempt succeeds", async () => {
    let calls = 0;
    const client = {
      from: () => ({
        insert: async () => {
          calls++;
          return calls === 1
            ? { error: { message: "transient", code: "503" } }
            : { error: null };
        },
      }),
    };
    await assert.doesNotReject(() => writeAuditLog(client, { action: "test" }, "ctx"));
    assert.strictEqual(calls, 2, "should have retried once");
  });

  it("does not throw when all retries fail", async () => {
    const client = {
      from: () => ({ insert: async () => ({ error: { message: "db down", code: "500" } }) }),
    };
    await assert.doesNotReject(() =>
      writeAuditLog(client, { action: "plan_upgraded", user_id: "abc123de-ffff-0000" }, "webhook")
    );
  });
});
