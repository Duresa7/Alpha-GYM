"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeightProgressionPoint } from "@/types";

interface WeightProgressionProps {
  data: WeightProgressionPoint[];
}

function ProgressionIndicator({
  weightChange,
  percentChange,
}: {
  weightChange: number;
  percentChange: number;
}) {
  if (weightChange > 0) {
    return (
      <div className="flex items-center gap-2 text-emerald-600">
        <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-bold">
          +{weightChange} lb (+{percentChange}%)
        </span>
      </div>
    );
  }
  if (weightChange < 0) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <TrendingDown className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-bold">
          {weightChange} lb ({percentChange}%)
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-foreground/50">
      <Minus className="h-5 w-5" strokeWidth={2.5} />
      <span className="font-bold">No change</span>
    </div>
  );
}

export function WeightProgression({ data }: WeightProgressionProps) {
  if (data.length === 0) {
    return (
      <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader className="relative z-10 border-b border-black/5 pb-4">
          <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
            Weight Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pt-6">
          <div className="flex h-[200px] items-center justify-center text-foreground/40">
            Log exercises to see weight progression trends
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data
    .filter((d) => d.weightChange !== null)
    .map((d) => ({
      date: d.date,
      exerciseName: d.exerciseName,
      weightLbs: d.weightLbs,
      weightChange: d.weightChange,
      percentChange: d.percentChange,
      runningAvgChange: d.runningAvgChange,
    }));

  const latest = data[data.length - 1];
  const hasComparison = latest.weightChange !== null;

  // Calculate overall stats
  const changesWithValues = data.filter((d) => d.weightChange !== null);
  const positiveCount = changesWithValues.filter((d) => d.weightChange! > 0).length;
  const negativeCount = changesWithValues.filter((d) => d.weightChange! < 0).length;
  const overallAvg =
    changesWithValues.length > 0
      ? Math.round(
          (changesWithValues.reduce((sum, d) => sum + d.weightChange!, 0) /
            changesWithValues.length) *
            10
        ) / 10
      : 0;

  return (
    <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 border-b border-black/5 pb-4">
        <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-pulse" />
          Weight Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-6 space-y-6">
        {/* Latest entry status */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
              Latest Entry
            </p>
            <p className="text-lg font-semibold text-foreground">
              {latest.exerciseName}{" "}
              <span className="text-foreground/60">— {latest.weightLbs} lb</span>
            </p>
            {hasComparison ? (
              <ProgressionIndicator
                weightChange={latest.weightChange!}
                percentChange={latest.percentChange!}
              />
            ) : (
              <p className="text-sm text-foreground/40">No comparison available</p>
            )}
          </div>

          {/* Mini stats */}
          {changesWithValues.length > 0 && (
            <div className="flex gap-4">
              <div className="rounded-xl border border-black/5 bg-white/60 px-4 py-2.5 text-center backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Increases
                </p>
                <p className="text-lg font-black text-emerald-600 font-[family-name:var(--font-barlow-condensed)]">
                  {positiveCount}
                </p>
              </div>
              <div className="rounded-xl border border-black/5 bg-white/60 px-4 py-2.5 text-center backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Decreases
                </p>
                <p className="text-lg font-black text-red-500 font-[family-name:var(--font-barlow-condensed)]">
                  {negativeCount}
                </p>
              </div>
              <div className="rounded-xl border border-black/5 bg-white/60 px-4 py-2.5 text-center backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                  Avg Change
                </p>
                <p
                  className={`text-lg font-black font-[family-name:var(--font-barlow-condensed)] ${
                    overallAvg > 0
                      ? "text-emerald-600"
                      : overallAvg < 0
                        ? "text-red-500"
                        : "text-foreground/50"
                  }`}
                >
                  {overallAvg > 0 ? "+" : ""}
                  {overallAvg} lb
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trend chart */}
        {chartData.length > 0 && (
          <div>
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
            <ResponsiveContainer width="100%" height={280} className="relative z-10">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="rgba(0,0,0,0.4)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => {
                    const d = new Date(value + "T00:00:00");
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis
                  stroke="rgba(0,0,0,0.4)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${value} lb`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    backdropFilter: "blur(12px)",
                    color: "#000",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontWeight: 600 }}
                  labelFormatter={(label) => {
                    const d = new Date(label + "T00:00:00");
                    return d.toLocaleDateString();
                  }}
                  formatter={(value) => {
                    const num = typeof value === "number" ? value : Number(value);
                    return [`${num > 0 ? "+" : ""}${num} lb`];
                  }}
                />
                <ReferenceLine y={0} stroke="rgba(0,0,0,0.15)" strokeDasharray="3 3" />
                <Bar dataKey="weightChange" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        (entry.weightChange ?? 0) > 0
                          ? "rgba(16, 185, 129, 0.7)"
                          : (entry.weightChange ?? 0) < 0
                            ? "rgba(239, 68, 68, 0.7)"
                            : "rgba(0, 0, 0, 0.15)"
                      }
                    />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="runningAvgChange"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  strokeDasharray="6 3"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#8b5cf6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-center gap-6 text-xs text-foreground/50">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-emerald-500/70" />
                Increase
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-red-500/70" />
                Decrease
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-6 rounded-sm border-b-2 border-dashed border-[#8b5cf6]" />
                Running Avg
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
