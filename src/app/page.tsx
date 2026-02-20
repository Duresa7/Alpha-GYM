import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  getStats,
  getWeightTrend,
  getVolumeTrend,
  getRecentActivity,
} from "@/actions/dashboard-actions";

export default async function DashboardPage() {
  const [stats, weightTrend, volumeTrend, recentActivity] = await Promise.all([
    getStats(),
    getWeightTrend(),
    getVolumeTrend(),
    getRecentActivity(5),
  ]);

  return (
    <div>
      <PageHeader title="Dashboard" description="Your fitness at a glance" />
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeightChart data={weightTrend} />
          <VolumeChart data={volumeTrend} />
        </div>
        <RecentActivity entries={recentActivity} />
      </div>
    </div>
  );
}
