"use client";

import { useEffect, useState } from "react";

type Props = {
  score: number; // 1–10
};

const RADIUS = 50;
const CX = 60;
const CY = 62;
// Semicircle arc: from 180° (left) to 0° (right), rendered as top half
const ARC_LENGTH = Math.PI * RADIUS; // half circumference ≈ 157

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

function scoreColor(score: number): string {
  if (score <= 3) return "var(--gain)";
  if (score <= 6) return "var(--gold)";
  return "var(--danger)";
}

// Arc goes from -180° (left) to 0° (right) using our helper
const TRACK_PATH = describeArc(CX, CY, RADIUS, -180, 0);

export function RiskGauge({ score }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const clampedScore = Math.max(1, Math.min(10, score));
  // Fill ratio 0→1 based on score
  const fillRatio = mounted ? (clampedScore - 1) / 9 : 0;
  // stroke-dashoffset: full arc = ARC_LENGTH, empty = ARC_LENGTH, filled = ARC_LENGTH - fill
  const dashoffset = ARC_LENGTH - fillRatio * ARC_LENGTH;
  const color = scoreColor(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center h-14">
      <svg viewBox="0 0 120 70" width="110" height="65" aria-hidden="true">
        {/* Track */}
        <path
          d={TRACK_PATH}
          fill="none"
          stroke="#D4C5B0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Fill arc */}
        <path
          d={TRACK_PATH}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={dashoffset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.3s" }}
        />
        {/* Score label */}
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          fontFamily="DM Mono, monospace"
          fontSize="20"
          fontWeight="700"
          fill={color}
          style={{ transition: "fill 0.3s" }}
        >
          {clampedScore}
        </text>
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          fontFamily="DM Mono, monospace"
          fontSize="10"
          fill="#8B7355"
        >
          /10
        </text>
      </svg>
    </div>
  );
}
