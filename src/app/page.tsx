import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { WeightLossLevelCard } from "@/components/dashboard/weight-loss-level";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import { WeightProgression } from "@/components/dashboard/weight-progression";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  getStats,
  getWeightTrend,
  getVolumeTrend,
  getRecentActivity,
  getWeightProgression,
} from "@/actions/dashboard-actions";
import {
  getWeightLossLevel,
  getGoalStatus,
} from "@/actions/goal-actions";

export default async function DashboardPage() {
  const [stats, weightTrend, volumeTrend, recentActivity, progression, level, goalStatus] =
    await Promise.all([
      getStats(),
      getWeightTrend(),
      getVolumeTrend(),
      getRecentActivity(5),
      getWeightProgression(),
      getWeightLossLevel(),
      getGoalStatus(),
    ]);

  return (
    <div>
      <PageHeader title="Dashboard" description="Your fitness at a glance" />
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        <WeightLossLevelCard level={level} goalStatus={goalStatus} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeightChart data={weightTrend} />
          <VolumeChart data={volumeTrend} />
        </div>
        <WeightProgression data={progression} />
        <RecentActivity entries={recentActivity} />
      </div>
    </div>
  );
}
