"use client";

import { memo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import type { WeightTrendPoint } from "@/types";

interface WeightChartProps {
  data: WeightTrendPoint[];
}

function WeightChartComponent({ data }: WeightChartProps) {
  return (
    <DashboardPanel
      title="Weight Loss Progression"
      accentClassName="bg-primary"
      contentClassName="pt-5"
    >
      {data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-muted-foreground">
          Log your weight to see trends
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="oklch(0.32 0.018 250)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="oklch(0.72 0.02 95)"
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
              stroke="oklch(0.72 0.02 95)"
              fontSize={12}
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.16 0.012 250)",
                border: "1px solid oklch(0.32 0.018 250)",
                borderRadius: "8px",
                color: "oklch(0.96 0.01 95)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
              }}
              itemStyle={{ color: "oklch(0.96 0.01 95)", fontWeight: 600 }}
              labelFormatter={(label) => {
                const d = new Date(label + "T00:00:00");
                return d.toLocaleDateString();
              }}
              formatter={(value) => {
                const weight = typeof value === "number" ? value : 0;
                return [`${weight} lbs`, "Weight"];
              }}
            />
            <Line
              type="monotone"
              dataKey="weightLbs"
              stroke="oklch(0.69 0.19 43)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.18 0.012 250)", stroke: "oklch(0.69 0.19 43)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "oklch(0.69 0.19 43)", stroke: "oklch(0.96 0.01 95)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </DashboardPanel>
  );
}

export const WeightChart = memo(WeightChartComponent);
