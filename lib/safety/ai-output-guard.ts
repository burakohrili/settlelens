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
      // Filter all text fields, not just negotiation_strategy
      for (const field of ["notes"] as const) {
        if (typeof parsed[field] === "string") {
          const { safe: fieldSafe } = guardAIOutput(parsed[field] as string);
          if (!fieldSafe) parsed[field] = "[Content filtered for compliance]";
        }
      }
      parsed.notes = (parsed.notes || "") + " [Review recommended by SettleLens safety system]";
      if (Array.isArray(parsed.key_risks)) {
        parsed.key_risks = (parsed.key_risks as unknown[]).map((r) => {
          if (typeof r !== "string") return r;
          const { safe: rSafe } = guardAIOutput(r);
          return rSafe ? r : "[Risk filtered]";
        });
      }
      return JSON.stringify(parsed);
    } catch {
      return raw;
    }
  }
  return raw;
}
