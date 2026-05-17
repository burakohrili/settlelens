import { createAdminClient } from "@/lib/supabase/server";
import { verifyPaddleSignature, getPlanFromPriceId } from "@/lib/paddle";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") ?? "";

  // Signature verification — critical security check
  const valid = await verifyPaddleSignature(rawBody, signature);
  if (!valid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
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

  // Idempotency: skip already-processed events using a sentinel action key
  if (eventId) {
    const sentinelAction = `paddle_evt_${eventId}`;
    const { data: existing } = await (supabase as never as {
      from: (t: string) => {
        select: (s: string) => {
          eq: (c: string, v: string) => {
            limit: (n: number) => Promise<{ data: unknown[] | null }>;
          };
        };
      };
    })
      .from("audit_log")
      .select("id")
      .eq("action", sentinelAction)
      .limit(1);
    if (existing && existing.length > 0) {
      return Response.json({ received: true, skipped: "duplicate" });
    }
    // Record this event immediately so concurrent duplicates are rejected
    await (supabase as never as {
      from: (t: string) => { insert: (d: unknown) => Promise<unknown> };
    })
      .from("audit_log")
      .insert({ action: sentinelAction, metadata: { event_type: eventType }, user_visible: false });
  }

  switch (eventType) {
    case "transaction.completed": {
      const userId = (data.custom_data as Record<string, string> | null)?.userId;
      const items = data.items as Array<{ price: { id: string } }> | null;
      const priceId = items?.[0]?.price?.id;
      const plan = getPlanFromPriceId(priceId ?? "");

      if (userId && plan !== "discovery") {
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

        await (supabase as never as {
          from: (t: string) => { insert: (d: unknown) => Promise<unknown> };
        })
          .from("audit_log")
          .insert({
            user_id: userId,
            action: "plan_upgraded",
            metadata: { plan },
            user_visible: true,
            display_text: `Plan upgraded to ${plan}`,
          });

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
      const userId = (data.custom_data as Record<string, string> | null)?.userId;
      const items = data.items as Array<{ price: { id: string } }> | null;
      const plan = getPlanFromPriceId(items?.[0]?.price?.id ?? "");

      if (userId) {
        await (supabase as never as {
          from: (t: string) => {
            update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
          };
        })
          .from("profiles")
          .update({ plan_type: plan, paddle_subscription_id: data.id })
          .eq("id", userId);
      }
      break;
    }

    case "subscription.updated": {
      const userId = (data.custom_data as Record<string, string> | null)?.userId;
      const items = data.items as Array<{ price: { id: string } }> | null;
      const plan = getPlanFromPriceId(items?.[0]?.price?.id ?? "");

      if (userId) {
        await (supabase as never as {
          from: (t: string) => {
            update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
          };
        })
          .from("profiles")
          .update({ plan_type: plan })
          .eq("id", userId);
      }
      break;
    }

    case "subscription.canceled": {
      const subId = data.id as string;
      // Fetch email before downgrading
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
      // Downgrade plan
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
      // Send cancellation email
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
      // Subscription payment overdue — flag in audit log, send payment-failed email
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
        await (supabase as never as {
          from: (t: string) => { insert: (d: unknown) => Promise<unknown> };
        })
          .from("audit_log")
          .insert({
            user_id: pastDueProfile.data.id,
            action: "subscription_past_due",
            metadata: { subscription_id: subId },
            user_visible: false,
          });
        await sendEmail({ type: "payment-failed", to: pastDueProfile.data.email });
      }
      break;
    }

    case "subscription.paused": {
      // Subscription paused — downgrade to discovery and notify
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

        await (supabase as never as {
          from: (t: string) => { insert: (d: unknown) => Promise<unknown> };
        })
          .from("audit_log")
          .insert({
            user_id: pausedProfile.data.id,
            action: "subscription_paused",
            metadata: { subscription_id: subId },
            user_visible: false,
          });

        await sendEmail({ type: "subscription-cancelled", to: pausedProfile.data.email });
      }
      break;
    }

    case "refund.created": {
      // Refund issued — downgrade to discovery
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

          await (supabase as never as {
            from: (t: string) => { insert: (d: unknown) => Promise<unknown> };
          })
            .from("audit_log")
            .insert({
              user_id: refundProfile.data.id,
              action: "refund_processed",
              metadata: { customer_id: customerId },
              user_visible: false,
            });
        }
      }
      break;
    }
  }

  return Response.json({ received: true });
}
