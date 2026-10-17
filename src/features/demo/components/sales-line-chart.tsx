"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatARS } from "../model/demo-model";

type SalesLineChartProps = {
  values: number[];
  labels: string[];
  className?: string;
};

const WIDTH = 560;
const HEIGHT = 200;
const PAD = { top: 12, right: 12, bottom: 26, left: 66 };

/** Catmull-Rom spline converted to cubic Béziers: a smooth "monotone-like" line. */
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function niceMax(value: number): number {
  const step = 30000;
  return Math.max(step, Math.ceil(value / step) * step);
}

/** Lightweight SVG version of the Konta dashboard chart (Recharts in the app). */
export function SalesLineChart({ values, labels, className }: SalesLineChartProps) {
  const reduce = useReducedMotion();
  const max = niceMax(Math.max(...values));
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const points = values.map((v, i): [number, number] => [
    PAD.left + (innerW * i) / (values.length - 1),
    PAD.top + innerH - (innerH * v) / max,
  ]);
  const line = smoothPath(points);
  const area = `${line} L ${points.at(-1)![0]} ${PAD.top + innerH} L ${points[0][0]} ${PAD.top + innerH} Z`;
  const ticks = [0, 1, 2, 3].map((i) => (max / 3) * i);
  const last = points.at(-1)!;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      role="img"
      aria-label={`Ventas de los últimos 7 días. Hoy: ${formatARS(values.at(-1)!)}`}
    >
      <defs>
        <linearGradient id="sales-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => {
        const y = PAD.top + innerH - (innerH * t) / max;
        return (
          <g key={t}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="var(--border)" strokeDasharray="4 4" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">
              {formatARS(t)}
            </text>
          </g>
        );
      })}
      {labels.map((label, i) => (
        <text key={label} x={points[i][0]} y={HEIGHT - 6} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
          {label}
        </text>
      ))}
      <motion.path
        d={area}
        fill="url(#sales-fill)"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1, d: area }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth={3}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1, d: line }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <motion.circle
        r={5}
        fill="var(--chart-1)"
        stroke="white"
        strokeWidth={2}
        initial={false}
        animate={{ cx: last[0], cy: last[1] }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </svg>
  );
}
