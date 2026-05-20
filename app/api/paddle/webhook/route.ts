import { createAdminClient } from "@/lib/supabase/server";
import { verifyPaddleSignature, getPlanFromPriceId } from "@/lib/paddle";
import { sendEmail } from "@/lib/email";
import { writeAuditLog } from "@/lib/audit";

// Resolve user by paddle_customer_id stored in profiles
async function resolveUserByCustomerId(
  supabase: ReturnType<typeof createAdminClient>,
  paddleCustomerId: string | undefined
): Promise<string | undefined> {
  if (!paddleCustomerId) return undefined;
  const { data } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => { single: () => Promise<{ data: { id: string } | null }> };
      };
    };
  })
    .from("profiles")
    .select("id")
    .eq("paddle_customer_id", paddleCustomerId)
    .single();
  return data?.id;
}

// Resolve user by paddle_subscription_id — used as secondary lookup for subscription.updated
async function resolveUserBySubscriptionId(
  supabase: ReturnType<typeof createAdminClient>,
  subscriptionId: string | undefined
): Promise<string | undefined> {
  if (!subscriptionId) return undefined;
  const { data } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => { single: () => Promise<{ data: { id: string } | null }> };
      };
    };
  })
    .from("profiles")
    .select("id")
    .eq("paddle_subscription_id", subscriptionId)
    .single();
  return data?.id;
}

// Log unresolvable events — ops visibility
async function logMappingMissing(
  supabase: ReturnType<typeof createAdminClient>,
  meta: {
    eventId?: string;
    eventType: string;
    customerId?: string;
    subscriptionId?: string;
    priceId?: string;
  }
) {
  console.error("[webhook] mapping_missing — no profile found", meta);
  await writeAuditLog(supabase, {
    action: "webhook_mapping_missing",
    metadata: meta,
    user_visible: false,
  }, "webhook:mapping_missing");
  if (meta.eventId) {
    await (supabase as never as {
      from: (t: string) => {
        update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
      };
    })
      .from("webhook_events")
      .update({ outcome: "mapping_missing" })
      .eq("event_id", meta.eventId);
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") ?? "";

  // Signature verification — critical security check
  const valid = await verifyPaddleSignature(rawBody, signature);
  if (!valid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Replay attack protection — reject webhooks with timestamp > 5 minutes old
  const sigParts = Object.fromEntries(
    signature.split(";").map((p) => { const [k, ...v] = p.split("="); return [k, v.join("=")] as [string, string]; })
  );
  const tsNum = parseInt(sigParts["ts"] ?? "0", 10);
  if (isNaN(tsNum) || Math.abs(Math.floor(Date.now() / 1000) - tsNum) > 300) {
    return Response.json({ error: "Timestamp out of range" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const eventType = event.event_type as string;
  const eventId = event.event_id as string | undefined;
  const data = event.data as Record<string, unknown>;

  // Idempotency: atomic INSERT into webhook_events (PRIMARY KEY = event_id).
  // On duplicate delivery Postgres returns error code 23505 — return early.
  if (eventId) {
    const { error: dedupErr } = await (supabase as never as {
      from: (t: string) => {
        insert: (d: unknown) => Promise<{ error: { code: string } | null }>;
      };
    })
      .from("webhook_events")
      .insert({ event_id: eventId, event_type: eventType, outcome: "processed" });

    if (dedupErr?.code === "23505") {
      return Response.json({ received: true, skipped: "duplicate" });
    }
    // Other DB errors: log and fail open — Paddle retries on non-2xx, avoid that
    if (dedupErr) {
      console.error("[webhook] idempotency insert failed", { code: dedupErr.code, eventId });
    }
  }

  switch (eventType) {
    case "transaction.completed": {
      const items = data.items as Array<{ price: { id: string } }> | null;
      const priceId = items?.[0]?.price?.id;
      if (!priceId) {
        return Response.json({ error: "Invalid webhook payload: missing price id" }, { status: 400 });
      }
      const plan = getPlanFromPriceId(priceId);
      const paddleCustomerId = data.customer_id as string | undefined;

      const userId = await resolveUserByCustomerId(supabase, paddleCustomerId);
      if (!userId) {
        await logMappingMissing(supabase, { eventId, eventType, customerId: paddleCustomerId, priceId });
        return Response.json({ received: true });
      }

      if (plan !== "discovery") {
        const updateData: Record<string, unknown> = {
          plan_type: plan,
          paddle_customer_id: data.customer_id,
        };

        // One-time plans: set expiry
        if (plan === "clarified") {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          updateData.plan_expires_at = expiresAt.toISOString();
        }
        if (plan === "strategist") {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 180);
          updateData.plan_expires_at = expiresAt.toISOString();
        }

        const profileResult = await (supabase as never as {
          from: (t: string) => {
            select: (s: string) => {
              eq: (c: string, v: string) => {
                single: () => Promise<{ data: { email: string } | null }>;
              };
            };
          };
        })
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .single();

        await (supabase as never as {
          from: (t: string) => {
            update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
          };
        })
          .from("profiles")
          .update(updateData)
          .eq("id", userId);

        await writeAuditLog(supabase, {
          user_id: userId,
          action: "plan_upgraded",
          metadata: { plan },
          user_visible: true,
          display_text: `Plan upgraded to ${plan}`,
        }, "webhook:transaction.completed");

        if (profileResult.data?.email) {
          await sendEmail({
            type: "upgrade-confirm",
            to: profileResult.data.email,
            userId,
            plan,
          });
        }
      }
      break;
    }

    case "subscription.activated": {
      const items = data.items as Array<{ price: { id: string } }> | null;
      const activatedPriceId = items?.[0]?.price?.id;
      if (!activatedPriceId) {
        return Response.json({ error: "Invalid webhook payload: missing price id" }, { status: 400 });
      }
      const plan = getPlanFromPriceId(activatedPriceId);
      const subCustomerId = data.customer_id as string | undefined;

      const subUserId = await resolveUserByCustomerId(supabase, subCustomerId);
      if (!subUserId) {
        await logMappingMissing(supabase, { eventId, eventType, customerId: subCustomerId, priceId: activatedPriceId });
        return Response.json({ received: true });
      }

      await (supabase as never as {
        from: (t: string) => {
          update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
        };
      })
        .from("profiles")
        .update({ plan_type: plan, paddle_subscription_id: data.id })
        .eq("id", subUserId);
      break;
    }

    case "subscription.updated": {
      const items = data.items as Array<{ price: { id: string } }> | null;
      const updatedPriceId = items?.[0]?.price?.id;
      if (!updatedPriceId) {
        return Response.json({ error: "Invalid webhook payload: missing price id" }, { status: 400 });
      }
      const plan = getPlanFromPriceId(updatedPriceId);
      const updCustomerId = data.customer_id as string | undefined;
      const subscriptionId = data.id as string | undefined;

      // Primary: customer_id lookup. Secondary: subscription_id (already stored from activation).
      const updUserId =
        (await resolveUserByCustomerId(supabase, updCustomerId)) ??
        (await resolveUserBySubscriptionId(supabase, subscriptionId));

      if (!updUserId) {
        await logMappingMissing(supabase, { eventId, eventType, customerId: updCustomerId, subscriptionId, priceId: updatedPriceId });
        return Response.json({ received: true });
      }

      await (supabase as never as {
        from: (t: string) => {
          update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
        };
      })
        .from("profiles")
        .update({ plan_type: plan })
        .eq("id", updUserId);
      break;
    }

    case "subscription.canceled": {
      const subId = data.id as string;
      const canceledProfile = await (supabase as never as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              single: () => Promise<{ data: { email: string } | null }>;
            };
          };
        };
      })
        .from("profiles")
        .select("email")
        .eq("paddle_subscription_id", subId)
        .single();
      await (supabase as never as {
        from: (t: string) => {
          update: (d: unknown) => {
            eq: (c: string, v: string) => Promise<unknown>;
          };
        };
      })
        .from("profiles")
        .update({ plan_type: "discovery", paddle_subscription_id: null })
        .eq("paddle_subscription_id", subId);
      if (canceledProfile.data?.email) {
        await sendEmail({ type: "subscription-cancelled", to: canceledProfile.data.email });
      }
      break;
    }

    case "payment.failed": {
      const customerId = data.customer_id as string | undefined;
      if (customerId) {
        const profileResult = await (supabase as never as {
          from: (t: string) => {
            select: (s: string) => {
              eq: (c: string, v: string) => {
                single: () => Promise<{ data: { email: string } | null }>;
              };
            };
          };
        })
          .from("profiles")
          .select("email")
          .eq("paddle_customer_id", customerId)
          .single();
        if (profileResult.data?.email) {
          await sendEmail({ type: "payment-failed", to: profileResult.data.email });
        }
      }
      break;
    }

    case "subscription.past_due": {
      const subId = data.id as string;
      const pastDueProfile = await (supabase as never as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              single: () => Promise<{ data: { email: string; id: string } | null }>;
            };
          };
        };
      })
        .from("profiles")
        .select("email,id")
        .eq("paddle_subscription_id", subId)
        .single();
      if (pastDueProfile.data) {
        await writeAuditLog(supabase, {
          user_id: pastDueProfile.data.id,
          action: "subscription_past_due",
          metadata: { subscription_id: subId },
          user_visible: false,
        }, "webhook:subscription.past_due");
        await sendEmail({ type: "payment-failed", to: pastDueProfile.data.email });
      }
      break;
    }

    case "subscription.paused": {
      const subId = data.id as string;
      const pausedProfile = await (supabase as never as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              single: () => Promise<{ data: { email: string; id: string } | null }>;
            };
          };
        };
      })
        .from("profiles")
        .select("email,id")
        .eq("paddle_subscription_id", subId)
        .single();
      if (pausedProfile.data) {
        await (supabase as never as {
          from: (t: string) => {
            update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
          };
        })
          .from("profiles")
          .update({ plan_type: "discovery" })
          .eq("paddle_subscription_id", subId);
        await writeAuditLog(supabase, {
          user_id: pausedProfile.data.id,
          action: "subscription_paused",
          metadata: { subscription_id: subId },
          user_visible: false,
        }, "webhook:subscription.paused");
        await sendEmail({ type: "subscription-cancelled", to: pausedProfile.data.email });
      }
      break;
    }

    case "refund.created": {
      const customerId = (data.customer as Record<string, string> | null)?.id ?? (data.customer_id as string | undefined);
      if (customerId) {
        const refundProfile = await (supabase as never as {
          from: (t: string) => {
            select: (s: string) => {
              eq: (c: string, v: string) => {
                single: () => Promise<{ data: { id: string } | null }>;
              };
            };
          };
        })
          .from("profiles")
          .select("id")
          .eq("paddle_customer_id", customerId)
          .single();
        if (refundProfile.data?.id) {
          await (supabase as never as {
            from: (t: string) => {
              update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
            };
          })
            .from("profiles")
            .update({ plan_type: "discovery", paddle_subscription_id: null, plan_expires_at: null })
            .eq("id", refundProfile.data.id);
          await writeAuditLog(supabase, {
            user_id: refundProfile.data.id,
            action: "refund_processed",
            metadata: { customer_id: customerId },
            user_visible: false,
          }, "webhook:refund.created");
        }
      }
      break;
    }
  }

  return Response.json({ received: true });
}
