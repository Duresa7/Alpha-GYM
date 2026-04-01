"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { TrendingUp, TrendingDown, Minus, Dumbbell } from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { formatDisplayDate, parseDateKey } from "@/lib/date";
import type { StrengthProgressionPoint } from "@/types";

interface StrengthProgressionProps {
  data: StrengthProgressionPoint[];
  exerciseOptions: string[];
  selectedExercise?: string;
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

export function StrengthProgression({
  data,
  exerciseOptions,
  selectedExercise,
}: StrengthProgressionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentExercise = selectedExercise || exerciseOptions[0] || "";

  if (exerciseOptions.length === 0) {
    return (
      <DashboardPanel
        title="Strength Progression"
        accentClassName="bg-[#8b5cf6] text-[#8b5cf6]"
        contentClassName="relative z-10 pt-6"
      >
          <div className="flex h-[200px] items-center justify-center text-foreground/40">
            Log exercises to see strength progression trends.
          </div>
      </DashboardPanel>
    );
  }

  const latest = data[data.length - 1];
  const chartData = data.filter((entry) => entry.weightChange !== null);

  function handleExerciseChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("exercise", value);
    router.push(`/?${params.toString()}`);
  }

  return (
    <DashboardPanel
      title="Strength Progression"
      accentClassName="bg-[#8b5cf6] text-[#8b5cf6]"
      headerContent={
          <select
            value={currentExercise}
            onChange={(event) => handleExerciseChange(event.target.value)}
            className="flex h-9 rounded-md border border-input bg-white/70 px-3 py-1 text-sm"
          >
            {exerciseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
      }
    >
        {latest ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
                Selected Exercise
              </p>
              <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Dumbbell className="h-4 w-4 text-[#8b5cf6]" />
                {latest.exerciseName}
                <span className="text-foreground/60">{latest.weightLbs} lb</span>
              </p>
              {latest.weightChange !== null && latest.percentChange !== null ? (
                <ProgressionIndicator
                  weightChange={latest.weightChange}
                  percentChange={latest.percentChange}
                />
              ) : (
                <p className="text-sm text-foreground/40">Need one more log for comparison.</p>
              )}
            </div>
            <div className="rounded-xl border border-black/5 bg-white/60 px-4 py-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                Running Avg Change
              </p>
              <p className="text-xl font-black font-[family-name:var(--font-barlow-condensed)] text-[#8b5cf6]">
                {latest.runningAvgChange !== null ? `${latest.runningAvgChange} lb` : "--"}
              </p>
            </div>
          </div>
        ) : null}

        {chartData.length > 0 ? (
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
                    const date = parseDateKey(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
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
                  labelFormatter={(label) => formatDisplayDate(label)}
                  formatter={(value) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value);
                    return [`${numericValue > 0 ? "+" : ""}${numericValue} lb`];
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
          </div>
        ) : (
          <div className="flex h-[220px] items-center justify-center text-foreground/40">
            {currentExercise} needs at least two logs for progression.
          </div>
        )}
    </DashboardPanel>
  );
}
