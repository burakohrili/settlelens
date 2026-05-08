import { FORBIDDEN_AI_PHRASES } from "./forbidden-claims";

export function guardAIOutput(text: string): { safe: boolean; flaggedPhrases: string[] } {
  const lower = text.toLowerCase();
  const flagged = FORBIDDEN_AI_PHRASES.filter((phrase) => lower.includes(phrase.toLowerCase()));
  return { safe: flagged.length === 0, flaggedPhrases: flagged };
}

export function sanitizeAIOutput(raw: string): string {
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
