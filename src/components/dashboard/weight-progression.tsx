"use client";

import { memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Dumbbell, Minus, TrendingDown, TrendingUp } from "lucide-react";
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
      <div className="flex items-center gap-2 text-emerald-400">
        <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-bold">
          +{weightChange} lb (+{percentChange}%)
        </span>
      </div>
    );
  }

  if (weightChange < 0) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <TrendingDown className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-bold">
          {weightChange} lb ({percentChange}%)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Minus className="h-5 w-5" strokeWidth={2.5} />
      <span className="font-bold">No change</span>
    </div>
  );
}

function StrengthProgressionComponent({
  data,
  exerciseOptions,
  selectedExercise,
}: StrengthProgressionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentExercise = selectedExercise || exerciseOptions[0] || "";

  function handleExerciseChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("exercise", value);
    router.push(`/?${params.toString()}`);
  }

  if (exerciseOptions.length === 0) {
    return (
      <DashboardPanel
        title="Strength Progression"
        accentClassName="bg-fuchsia-400"
        contentClassName="pt-5"
      >
        <div className="flex h-[220px] items-center justify-center text-muted-foreground">
          Log exercises to see strength progression trends.
        </div>
      </DashboardPanel>
    );
  }

  const latest = data[data.length - 1];
  const chartData = data.filter((entry) => entry.weightChange !== null);

  return (
    <DashboardPanel
      title="Strength Progression"
      accentClassName="bg-fuchsia-400"
      headerContent={
        <select
          value={currentExercise}
          onChange={(event) => handleExerciseChange(event.target.value)}
          className="flat-field h-10 max-w-[180px]"
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
            <p className="metric-label">Selected Exercise</p>
            <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Dumbbell className="h-4 w-4 text-fuchsia-300" />
              {latest.exerciseName}
              <span className="text-muted-foreground">{latest.weightLbs} lb</span>
            </p>
            {latest.weightChange !== null && latest.percentChange !== null ? (
              <ProgressionIndicator
                weightChange={latest.weightChange}
                percentChange={latest.percentChange}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Need one more log for comparison.
              </p>
            )}
          </div>
          <div className="flat-tile text-center">
            <p className="metric-label">Running Avg Change</p>
            <p className="mt-2 text-xl font-bold text-fuchsia-300 font-[family-name:var(--font-barlow-condensed)]">
              {latest.runningAvgChange !== null
                ? `${latest.runningAvgChange} lb`
                : "--"}
            </p>
          </div>
        </div>
      ) : null}

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="oklch(0.32 0.018 250)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="oklch(0.72 0.02 95)"
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
              stroke="oklch(0.72 0.02 95)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value} lb`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.16 0.012 250)",
                border: "1px solid oklch(0.32 0.018 250)",
                borderRadius: "8px",
                color: "oklch(0.96 0.01 95)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
              }}
              itemStyle={{ fontWeight: 600, color: "oklch(0.96 0.01 95)" }}
              labelFormatter={(label) => formatDisplayDate(label)}
              formatter={(value) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value);
                return [`${numericValue > 0 ? "+" : ""}${numericValue} lb`];
              }}
            />
            <ReferenceLine y={0} stroke="oklch(0.45 0.018 250)" strokeDasharray="3 3" />
            <Bar dataKey="weightChange" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    (entry.weightChange ?? 0) > 0
                      ? "oklch(0.7 0.17 145)"
                      : (entry.weightChange ?? 0) < 0
                        ? "oklch(0.62 0.2 25)"
                        : "oklch(0.45 0.018 250)"
                  }
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="runningAvgChange"
              stroke="oklch(0.72 0.16 330)"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{
                r: 5,
                fill: "oklch(0.72 0.16 330)",
                stroke: "oklch(0.96 0.01 95)",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-muted-foreground">
          {currentExercise} needs at least two logs for progression.
        </div>
      )}
    </DashboardPanel>
  );
}

export const StrengthProgression = memo(StrengthProgressionComponent);
