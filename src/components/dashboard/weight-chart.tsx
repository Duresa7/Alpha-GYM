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
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-lg">
            Weight Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Log your weight to see trends
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-lg">
          Weight Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
              domain={["auto", "auto"]}
              tickFormatter={(value) => `${value}`}
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
                const weight = typeof value === "number" ? value : 0;
                return [`${weight} lbs`, "Weight"];
              }}
            />
            <Line
              type="monotone"
              dataKey="weightLbs"
              stroke="#F97316"
              strokeWidth={2}
              dot={{ fill: "#F97316", r: 4 }}
              activeDot={{ r: 6, fill: "#FB923C" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
