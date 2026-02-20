import { StatCard } from "./stat-card";
import {
  Dumbbell,
  Bike,
  Timer,
  Scale,
  TrendingDown,
  ArrowUpDown,
} from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Exercises"
        value={stats.totalExercises}
        icon={Dumbbell}
        color="orange"
      />
      <StatCard
        title="Cardio Sessions"
        value={stats.totalCardioSessions}
        icon={Bike}
        color="orange"
      />
      <StatCard
        title="Cardio Minutes"
        value={stats.totalCardioMinutes}
        icon={Timer}
        color="orange"
      />
      <StatCard
        title="Current Weight"
        value={stats.currentWeight ? `${stats.currentWeight} lbs` : "--"}
        icon={Scale}
        color="green"
      />
      <StatCard
        title="Starting Weight"
        value={stats.startingWeight ? `${stats.startingWeight} lbs` : "--"}
        icon={TrendingDown}
        color="muted"
      />
      <StatCard
        title="Weight Change"
        value={
          stats.weightChange !== null
            ? `${stats.weightChange > 0 ? "+" : ""}${stats.weightChange} lbs`
            : "--"
        }
        icon={ArrowUpDown}
        color={
          stats.weightChange !== null
            ? stats.weightChange < 0
              ? "green"
              : "orange"
            : "muted"
        }
      />
    </div>
  );
}
