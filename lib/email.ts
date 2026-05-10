import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@settlelens.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://settlelens.com";

type EmailPayload =
  | { type: "welcome"; to: string; name?: string }
  | { type: "upgrade-confirm"; to: string; userId: string; plan: string }
  | { type: "report-ready"; to: string; reportUrl: string }
  | { type: "payment-failed"; to: string }
  | { type: "subscription-cancelled"; to: string; endDate?: string }
  | { type: "waitlist-confirm"; to: string }
  | { type: "contact"; from: string; name: string; subject: string; message: string };

const DISCLAIMER =
  "<hr style='margin:24px 0;border:none;border-top:1px solid #D4C5B0'><p style='font-size:12px;color:#8B7355'>SettleLens provides financial scenario modeling for informational purposes only. Not legal or financial advice. &copy; SettleLens</p>";

function baseTemplate(content: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#F7F3EE;padding:32px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #D4C5B0">
<p style="color:#C8973A;font-size:20px;font-weight:700;margin:0 0 24px">SettleLens</p>
${content}
${DISCLAIMER}
</div></body></html>`;
}

function button(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:#1C2B3A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">${label}</a>`;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  try {
    let subject = "";
    let html = "";

    switch (payload.type) {
      case "welcome":
        subject = "Welcome to SettleLens — See Your Settlement Clearly";
        html = baseTemplate(`
          <h1 style="color:#1C2B3A;font-size:24px">Welcome${payload.name ? `, ${payload.name}` : ""}!</h1>
          <p style="color:#2E4D6B">You've taken the first step toward financial clarity in your divorce process.</p>
          <p style="color:#2E4D6B">Complete your profile to start modeling scenarios and understanding your financial position.</p>
          ${button("Complete Your Profile →", `${APP_URL}/onboarding/step-1`)}
          <p style="font-size:13px;color:#8B7355;margin-top:24px">SettleLens helps you organize and compare financial scenarios — not legal advice. We recommend working with a qualified family law attorney.</p>
        `);
        break;

      case "upgrade-confirm":
        subject = `Your SettleLens ${payload.plan} plan is now active`;
        html = baseTemplate(`
          <h1 style="color:#1C2B3A;font-size:24px">You're now on ${payload.plan}!</h1>
          <p style="color:#2E4D6B">Your subscription is active. You now have access to full financial scenario analysis and projections.</p>
          ${button("Go to Dashboard →", `${APP_URL}/dashboard`)}
        `);
        // Also notify support
        await resend.emails.send({
          from: FROM,
          to: "support@settlelens.com",
          subject: `[Internal] Plan upgrade: user ${payload.userId} → ${payload.plan}`,
          text: `User ID: ${payload.userId} upgraded to ${payload.plan} at ${new Date().toISOString()}`,
        });
        break;

      case "report-ready":
        subject = "Your SettleLens Financial Report is Ready";
        html = baseTemplate(`
          <h1 style="color:#1C2B3A;font-size:24px">Your report is ready</h1>
          <p style="color:#2E4D6B">Your financial scenario report has been generated. Download it to review your analysis.</p>
          ${button("Download PDF Report →", payload.reportUrl)}
          <p style="font-size:13px;color:#8B7355;margin-top:16px">This download link expires in 24 hours.</p>
        `);
        break;

      case "payment-failed":
        subject = "Action required: Update your SettleLens payment method";
        html = baseTemplate(`
          <h1 style="color:#E85252;font-size:24px">Payment failed</h1>
          <p style="color:#2E4D6B">We were unable to process your last payment. Please update your payment method to keep your subscription active.</p>
          ${button("Update Payment Method →", `${APP_URL}/settings/billing`)}
          <p style="font-size:13px;color:#8B7355;margin-top:16px">If you need help, contact support@settlelens.com.</p>
        `);
        break;

      case "subscription-cancelled":
        subject = "Your SettleLens subscription has been cancelled";
        html = baseTemplate(`
          <h1 style="color:#1C2B3A;font-size:24px">Subscription cancelled</h1>
          <p style="color:#2E4D6B">Your SettleLens subscription has been cancelled.${payload.endDate ? ` Your access continues until <strong>${payload.endDate}</strong>.` : ""}</p>
          <p style="color:#2E4D6B">Your scenarios and financial data remain available until your access period ends. You can resubscribe at any time.</p>
          ${button("View Your Data →", `${APP_URL}/dashboard`)}
        `);
        break;

      case "waitlist-confirm":
        subject = "You're on the SettleLens waitlist";
        html = baseTemplate(`
          <h1 style="color:#1C2B3A;font-size:24px">You're on the list!</h1>
          <p style="color:#2E4D6B">Thank you for your interest in SettleLens. We'll notify you as soon as we launch in your region.</p>
          <p style="color:#2E4D6B">In the meantime, you can explore how SettleLens works using the House Decision Simulator — no account required.</p>
          ${button("Try House Simulator →", `${APP_URL}/en/house-simulator`)}
        `);
        break;

      case "contact":
        subject = `[SettleLens Contact] ${payload.subject}`;
        html = baseTemplate(`
          <h1 style="color:#1C2B3A;font-size:20px">New contact form message</h1>
          <p><strong>From:</strong> ${payload.name} &lt;${payload.from}&gt;</p>
          <p><strong>Subject:</strong> ${payload.subject}</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #D4C5B0">
          <p style="white-space:pre-wrap;color:#2E4D6B">${payload.message}</p>
        `);
        await resend.emails.send({ from: FROM, to: "support@settlelens.com", subject, html });
        // Auto-reply to sender
        await resend.emails.send({
          from: FROM,
          to: payload.from,
          subject: "We received your message — SettleLens Support",
          html: baseTemplate(`
            <h1 style="color:#1C2B3A;font-size:24px">Message received</h1>
            <p style="color:#2E4D6B">Hi ${payload.name}, we received your message and will respond within 1–2 business days.</p>
            <p style="color:#8B7355;font-size:13px">For urgent matters, you can also reach us directly at support@settlelens.com.</p>
          `),
        });
        return; // already sent above, skip default send
    }

    if (subject && html) {
      await resend.emails.send({ from: FROM, to: payload.to, subject, html });
    }
  } catch {
    // Email errors must never break the main flow
  }
}
