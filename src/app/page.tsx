import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { WeightLossLevelCard } from "@/components/dashboard/weight-loss-level";
import { WaterTracker } from "@/components/dashboard/water-tracker";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import { WeightProgression } from "@/components/dashboard/weight-progression";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import {
  getStats,
  getWeightTrend,
  getVolumeTrend,
  getWeightProgression,
} from "@/actions/dashboard-actions";
import {
  getWeightLossLevel,
  getGoalStatus,
} from "@/actions/goal-actions";
import {
  getWaterIntakeStatus,
  getTodayWaterEntries,
} from "@/actions/water-actions";

export default async function DashboardPage() {
  const [stats, weightTrend, volumeTrend, progression, level, goalStatus, waterStatus, waterEntries] =
    await Promise.all([
      getStats(),
      getWeightTrend(),
      getVolumeTrend(),
      getWeightProgression(),
      getWeightLossLevel(),
      getGoalStatus(),
      getWaterIntakeStatus(),
      getTodayWaterEntries(),
    ]);

  const panels = [
    {
      key: "level",
      component: <WeightLossLevelCard level={level} goalStatus={goalStatus} />,
      defaultLayout: { x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    },
    {
      key: "water",
      component: <WaterTracker status={waterStatus} todayEntries={waterEntries} />,
      defaultLayout: { x: 2, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    },
    {
      key: "weight-chart",
      component: <WeightChart data={weightTrend} />,
      defaultLayout: { x: 0, y: 4, w: 2, h: 4, minW: 2, minH: 3 },
    },
    {
      key: "volume-chart",
      component: <VolumeChart data={volumeTrend} />,
      defaultLayout: { x: 2, y: 4, w: 2, h: 4, minW: 2, minH: 3 },
    },
    {
      key: "weight-progression",
      component: <WeightProgression data={progression} />,
      defaultLayout: { x: 0, y: 8, w: 4, h: 4, minW: 2, minH: 3 },
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Your fitness at a glance" />
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        <DashboardGrid panels={panels} />
      </div>
    </div>
  );
}
