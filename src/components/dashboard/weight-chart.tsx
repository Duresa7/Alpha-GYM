"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeightTrendPoint } from "@/types";

interface WeightChartProps {
  data: WeightTrendPoint[];
}

export function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <span className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader className="relative z-10 border-b border-black/5 pb-4">
          <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
            Weight Loss Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pt-6">
          <div className="flex h-[300px] items-center justify-center text-foreground/40">
            Log your weight to see trends
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 border-b border-black/5 pb-4">
        <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-pulse" />
          Weight Loss Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-6">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,100,0,0.05)_0%,transparent_70%)]" />
        <ResponsiveContainer width="100%" height={300} className="relative z-10">
          <LineChart data={data}>
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
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`}
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
              itemStyle={{ color: "#000", fontWeight: 600 }}
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
              stroke="#ea580c"
              strokeWidth={3}
              dot={{ fill: "#fff", stroke: "#ea580c", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#ea580c", stroke: "#fff", strokeWidth: 2, className: "drop-shadow-[0_0_8px_rgba(234,88,12,0.6)]" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
