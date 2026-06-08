import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { WeightLossLevelCard } from "@/components/dashboard/weight-loss-level";
import { WaterTracker } from "@/components/dashboard/water-tracker";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import { StrengthProgression } from "@/components/dashboard/weight-progression";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { TodayFocusCard } from "@/components/dashboard/today-focus-card";
import { WeeklyCheckInCard } from "@/components/dashboard/weekly-check-in-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  getRecentActivity,
  getStats,
  getWeightTrend,
  getVolumeTrend,
  getStrengthProgression,
  getStrengthProgressionOptions,
  getWeeklyCheckInInsight,
} from "@/actions/dashboard-actions";
import { getWeightLossLevel, getGoalStatus } from "@/actions/goal-actions";
import { getTodayFocusData } from "@/actions/plan-actions";
import {
  getWaterIntakeStatus,
  getTodayWaterEntries,
} from "@/actions/water-actions";

interface DashboardPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = searchParams ? await searchParams : {};
  const selectedExercise = Array.isArray(params.exercise)
    ? params.exercise[0]
    : params.exercise;

  const [
    stats,
    weightTrend,
    volumeTrend,
    progressionOptions,
    level,
    goalStatus,
    waterStatus,
    waterEntries,
    todayFocus,
    checkInInsight,
    recentActivity,
  ] = await Promise.all([
    getStats(),
    getWeightTrend(),
    getVolumeTrend(),
    getStrengthProgressionOptions(),
    getWeightLossLevel(),
    getGoalStatus(),
    getWaterIntakeStatus(),
    getTodayWaterEntries(),
    getTodayFocusData(),
    getWeeklyCheckInInsight(),
    getRecentActivity(6),
  ]);

  const progression = await getStrengthProgression(
    selectedExercise || progressionOptions[0]
  );

  const panels = [
    {
      key: "today-focus",
      component: <TodayFocusCard data={todayFocus} />,
      className: "dashboard-span-2",
    },
    {
      key: "level",
      component: <WeightLossLevelCard level={level} goalStatus={goalStatus} />,
      className: "dashboard-span-2",
    },
    {
      key: "weight-chart",
      component: <WeightChart data={weightTrend} />,
      className: "dashboard-span-2",
    },
    {
      key: "water",
      component: <WaterTracker status={waterStatus} todayEntries={waterEntries} />,
      className: "dashboard-span-2",
    },
    {
      key: "volume-chart",
      component: <VolumeChart data={volumeTrend} />,
      className: "dashboard-span-2",
    },
    {
      key: "check-in",
      component: <WeeklyCheckInCard insight={checkInInsight} />,
      className: "dashboard-span-2",
    },
    {
      key: "strength-progression",
      component: (
        <StrengthProgression
          data={progression}
          exerciseOptions={progressionOptions}
          selectedExercise={selectedExercise || progressionOptions[0]}
        />
      ),
      className: "dashboard-span-4",
    },
    {
      key: "recent-activity",
      component: <RecentActivity entries={recentActivity} />,
      className: "dashboard-span-4",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="See today’s target, your weekly adherence, and whether your weight-loss pace is holding."
      />
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        <DashboardGrid panels={panels} />
      </div>
    </div>
  );
}
