import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 30;

const anthropic = new Anthropic();

export async function GET() {
  const models = ["claude-haiku-4-5-20251001", "claude-3-5-haiku-20241022", "claude-3-haiku-20240307"];
  const results: Record<string, string> = {};

  for (const model of models) {
    try {
      const res = await anthropic.messages.create({
        model,
        max_tokens: 10,
        messages: [{ role: "user", content: "Say OK" }],
      });
      results[model] = `OK (${res.usage.output_tokens} tokens)`;
    } catch (err) {
      results[model] = err instanceof Error ? err.message.slice(0, 100) : String(err).slice(0, 100);
    }
  }

  return Response.json(results);
}
