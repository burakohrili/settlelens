"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

type ScenarioLine = {
  name: string;
  data: Array<{ year: number; value: number }>;
};

type Props = {
  scenarios: ScenarioLine[];
  currency: string;
};

const COLORS = ["#C8973A", "#2E4D6B", "#4FA86E"];

function fmtShort(n: number, currency: string): string {
  const abs = Math.abs(n);
  const symbol = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 })
    .format(0)
    .replace(/[\d,.\s]/g, "")
    .trim();
  if (abs >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${symbol}${(n / 1_000).toFixed(0)}K`;
  return `${symbol}${n.toFixed(0)}`;
}

export function ProjectionChart({ scenarios, currency }: Props) {
  const t = useTranslations("projectionChart");
  // Merge all scenario data into recharts format: [{ year, Scenario A, Scenario B, ... }]
  const years = [0, 1, 3, 5, 10];
  const chartData = years.map((yr) => {
    const point: Record<string, number> = { year: yr };
    scenarios.forEach((s) => {
      const match = s.data.find((d) => d.year === yr);
      point[s.name] = match?.value ?? 0;
    });
    return point;
  });

  const ariaLabel = scenarios.map((s) => s.name).join(", ");

  return (
    <div role="img" aria-label={t("ariaLabel", { scenarios: ariaLabel })}>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D4C5B0" />
        <XAxis
          dataKey="year"
          tickFormatter={(v) => t("yrLabel", { v })}
          tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#8B7355" }}
        />
        <YAxis
          tickFormatter={(v) => fmtShort(v, currency)}
          tick={{ fontSize: 10, fontFamily: "Inter, sans-serif", fill: "#8B7355" }}
          width={60}
        />
        <Tooltip
          formatter={(value, name) => [
            new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value)),
            name as string,
          ]}
          labelFormatter={(label) => t("yearLabel", { label })}
          contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderColor: "#D4C5B0" }}
        />
        <Legend wrapperStyle={{ fontFamily: "Inter, sans-serif", fontSize: 11 }} />
        {scenarios.map((s, i) => (
          <Line
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4, fill: COLORS[i % COLORS.length] }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}
