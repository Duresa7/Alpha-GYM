"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VolumeTrendPoint } from "@/types";

interface VolumeChartProps {
  data: VolumeTrendPoint[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  if (data.length === 0) {
    return (
      <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
        <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader className="relative z-10 border-b border-black/5 pb-4">
          <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
            Exercise Volume
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pt-6">
          <div className="flex h-[300px] items-center justify-center text-foreground/40">
            Log exercises to see volume trends
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 border-b border-black/5 pb-4">
        <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse" />
          Exercise Volume
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-6">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,180,255,0.05)_0%,transparent_70%)]" />
        <ResponsiveContainer width="100%" height={300} className="relative z-10">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
              }
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
                const volume = typeof value === "number" ? value : 0;
                return [
                  `${volume.toLocaleString()} lbs`,
                  "Volume",
                ];
              }}
            />
            <Area
              type="monotone"
              dataKey="totalVolume"
              stroke="#0284c7"
              strokeWidth={3}
              fill="url(#volumeGradient)"
              activeDot={{ r: 6, fill: "#0284c7", stroke: "#fff", strokeWidth: 2, className: "drop-shadow-[0_0_8px_rgba(2,132,199,0.5)]" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
