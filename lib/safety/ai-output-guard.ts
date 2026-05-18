import { FORBIDDEN_AI_PHRASES } from "./forbidden-claims";

export function guardAIOutput(text: string): { safe: boolean; flaggedPhrases: string[] } {
  const lower = text.toLowerCase();
  const flagged = FORBIDDEN_AI_PHRASES.filter((phrase) => lower.includes(phrase.toLowerCase()));
  return { safe: flagged.length === 0, flaggedPhrases: flagged };
}

export function sanitizeAIOutput(raw: string): string {
  // Strip markdown code fences
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  // Extract JSON object — handles any preamble/postamble text the model adds
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    raw = raw.slice(firstBrace, lastBrace + 1);
  }
  const { safe } = guardAIOutput(raw);
  if (!safe) {
    try {
      const parsed = JSON.parse(raw);
      parsed.negotiation_strategy =
        "Based on the information entered, this scenario presents distinct financial considerations. We recommend discussing the specific points with a qualified legal professional.";
      parsed.notes =
        (parsed.notes || "") + " [Review recommended by SettleLens safety system]";
      return JSON.stringify(parsed);
    } catch {
      return raw;
    }
  }
  return raw;
}
