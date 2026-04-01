import { StatCard } from "./stat-card";
import {
  ClipboardCheck,
  Flame,
  Scale,
  Timer,
  Activity,
  CalendarCheck2,
} from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Planned This Week"
        value={stats.plannedThisWeek}
        icon={ClipboardCheck}
        color="orange"
      />
      <StatCard
        title="Completed This Week"
        value={stats.completedThisWeek}
        icon={CalendarCheck2}
        color="green"
      />
      <StatCard
        title="Completion Rate"
        value={`${stats.completionRate}%`}
        icon={Flame}
        color="magenta"
      />
      <StatCard
        title="Current Streak"
        value={`${stats.currentStreak} day${stats.currentStreak === 1 ? "" : "s"}`}
        icon={Activity}
        color="blue"
      />
      <StatCard
        title="Current Weight"
        value={stats.currentWeight ? `${stats.currentWeight} lbs` : "--"}
        icon={Scale}
        color="green"
      />
      <StatCard
        title="Days Since Weigh-In"
        value={
          stats.daysSinceLastWeighIn !== null ? stats.daysSinceLastWeighIn : "--"
        }
        icon={Timer}
        color={stats.daysSinceLastWeighIn !== null && stats.daysSinceLastWeighIn <= 2 ? "green" : "muted"}
      />
    </div>
  );
}
