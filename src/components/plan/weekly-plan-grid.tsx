"use client";

import { DayCard } from "./day-card";
import { DAY_ORDER } from "@/lib/constants";
import type { WeeklyPlanItem } from "@/types";

interface WeeklyPlanGridProps {
  plan: Record<string, WeeklyPlanItem[]>;
}

export function WeeklyPlanGrid({ plan }: WeeklyPlanGridProps) {
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {DAY_ORDER.map((day) => (
        <DayCard
          key={day}
          dayOfWeek={day}
          items={plan[day] || []}
          isToday={today === day}
        />
      ))}
    </div>
  );
}
