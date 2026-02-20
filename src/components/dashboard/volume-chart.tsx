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
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-lg">
            Exercise Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Log exercises to see volume trends
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-lg">
          Exercise Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 25%)" />
            <XAxis
              dataKey="date"
              stroke="hsl(215 20% 65%)"
              fontSize={12}
              tickFormatter={(value) => {
                const d = new Date(value + "T00:00:00");
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              stroke="hsl(215 20% 65%)"
              fontSize={12}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(217 33% 17%)",
                border: "1px solid hsl(217 33% 25%)",
                borderRadius: "8px",
                color: "hsl(210 40% 98%)",
              }}
              labelFormatter={(label) => {
                const d = new Date(label + "T00:00:00");
                return d.toLocaleDateString();
              }}
              formatter={(value) => {
                const volume = typeof value === "number" ? value : 0;
                return [
                  `${volume.toLocaleString()} lbs`,
                  "Volume (weight x reps)",
                ];
              }}
            />
            <Area
              type="monotone"
              dataKey="totalVolume"
              stroke="#F97316"
              strokeWidth={2}
              fill="url(#volumeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
