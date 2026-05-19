"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

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
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(true), 50);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

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
    <div
      role="img"
      aria-label={t("ariaLabel", { scenarios: ariaLabel })}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            {scenarios.map((s, i) => (
              <linearGradient key={s.name} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.18} />
                <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
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
            <Area
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              fill={`url(#grad-${i})`}
              dot={{ r: 4, fill: COLORS[i % COLORS.length] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Mobile: text summary of Year 10 values */}
      <div className="md:hidden mt-3 space-y-1">
        {scenarios.map((s, i) => {
          const lastPoint = s.data[s.data.length - 1];
          return (
            <p key={s.name} className="font-ui text-xs text-[var(--brown)] flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="font-semibold text-[var(--navy)]">{s.name}</span>
              <span>·</span>
              <span>{t("yearLabel", { label: 10 })}: {fmtShort(lastPoint?.value ?? 0, currency)}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
