import { initializePaddle } from "@paddle/paddle-js";
import type { Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | null = null;

export async function getPaddle(): Promise<Paddle> {
  if (!paddleInstance) {
    const instance = await initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox") as "sandbox" | "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    });
    if (!instance) throw new Error("Paddle failed to initialize");
    paddleInstance = instance;
  }
  return paddleInstance;
}

export async function openCheckout(
  priceId: string,
  userId: string,
  email: string,
  onComplete?: () => void
): Promise<void> {
  const paddle = await getPaddle();
  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: { email },
    customData: { userId },
    settings: {
      theme: "light",
      displayMode: "overlay",
      successUrl: `${typeof window !== "undefined" ? window.location.origin : "https://settlelens.com"}/dashboard?upgraded=1`,
    },
  });
  if (onComplete) {
    // Paddle doesn't expose a reliable onComplete callback in overlay mode;
    // rely on the successUrl redirect or webhook for actual plan update.
    onComplete();
  }
}

export async function verifyPaddleSignature(
  rawBody: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) return false;

  const parts = signature.split(";").reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split("=");
    if (k && v) acc[k] = v;
    return acc;
  }, {});

  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signedPayload = `${ts}:${rawBody}`;
  const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expectedHex = Array.from(new Uint8Array(expected))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedHex === h1;
}

export function getPlanFromPriceId(priceId: string): string {
  const clarifiedId = process.env.PADDLE_CLARIFIED_PRICE_ID;
  const strategistId = process.env.PADDLE_STRATEGIST_PRICE_ID;
  const professionalId = process.env.PADDLE_PROFESSIONAL_PRICE_ID;
  if (!clarifiedId || !strategistId || !professionalId) {
    console.error("[paddle] CRITICAL: Price ID env vars not configured — silent downgrade risk");
  }
  if (priceId && clarifiedId && priceId === clarifiedId) return "clarified";
  if (priceId && strategistId && priceId === strategistId) return "strategist";
  if (priceId && professionalId && priceId === professionalId) return "professional";
  return "discovery";
}

export const PLAN_PRICE_IDS: Record<string, string> = {
  clarified: process.env.PADDLE_CLARIFIED_PRICE_ID ?? "",
  strategist: process.env.PADDLE_STRATEGIST_PRICE_ID ?? "",
  professional: process.env.PADDLE_PROFESSIONAL_PRICE_ID ?? "",
};
