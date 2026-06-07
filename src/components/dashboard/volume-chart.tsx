"use client";

import { memo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import type { VolumeTrendPoint } from "@/types";

interface VolumeChartProps {
  data: VolumeTrendPoint[];
}

function VolumeChartComponent({ data }: VolumeChartProps) {
  return (
    <DashboardPanel
      title="Exercise Volume"
      accentClassName="bg-accent"
      contentClassName="pt-5"
    >
      {data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-muted-foreground">
          Log exercises to see volume trends
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
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
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
              }
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
                const volume = typeof value === "number" ? value : 0;
                return [`${volume.toLocaleString()} lbs`, "Volume"];
              }}
            />
            <Area
              type="monotone"
              dataKey="totalVolume"
              stroke="oklch(0.72 0.13 190)"
              strokeWidth={3}
              fill="oklch(0.72 0.13 190 / 0.18)"
              activeDot={{
                r: 6,
                fill: "oklch(0.72 0.13 190)",
                stroke: "oklch(0.96 0.01 95)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </DashboardPanel>
  );
}

export const VolumeChart = memo(VolumeChartComponent);
