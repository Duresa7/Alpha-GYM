import { Target, TrendingDown, Trophy, Zap } from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import type { WeightGoalStatus, WeightLossLevel } from "@/types";

interface WeightLossLevelProps {
  level: WeightLossLevel;
  goalStatus: WeightGoalStatus;
}

export function WeightLossLevelCard({
  level,
  goalStatus,
}: WeightLossLevelProps) {
  return (
    <DashboardPanel
      title="Weight Loss Level"
      accentClassName="bg-amber-300"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md border border-amber-400/35 bg-amber-400/10">
            <div className="text-center">
              <p className="metric-label text-amber-200">LVL</p>
              <p className="text-3xl font-bold text-amber-200 font-[family-name:var(--font-barlow-condensed)]">
                {level.level}
              </p>
            </div>
            <Trophy className="absolute -right-2 -top-2 h-5 w-5 text-amber-200" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{level.title}</p>
            <p className="text-sm text-muted-foreground">
              {level.totalXP} XP earned
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-200" />
              {level.level < 10
                ? `${level.currentXP} / ${level.xpForNextLevel} XP`
                : "MAX LEVEL"}
            </span>
            {level.level < 10 && (
              <span className="text-muted-foreground">Level {level.level + 1}</span>
            )}
          </div>
          <div className="h-3 w-full overflow-hidden rounded-sm bg-secondary">
            <div
              className="h-full rounded-sm bg-amber-300 transition-[width] duration-500 ease-out"
              style={{ width: `${level.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {goalStatus.goalWeight ? (
        <>
          <div className="border-t border-border" />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="flat-tile">
              <p className="metric-label flex items-center gap-2">
                <Target className="h-3.5 w-3.5" />
                Goal
              </p>
              <p className="mt-3 text-2xl font-bold font-[family-name:var(--font-barlow-condensed)]">
                {goalStatus.goalWeight} lbs
              </p>
              <p className="text-sm text-muted-foreground">
                {goalStatus.remaining > 0
                  ? `${goalStatus.remaining} lbs remaining`
                  : "Goal reached"}
              </p>
            </div>
            <div className="flat-tile">
              <p className="metric-label flex items-center gap-2">
                <TrendingDown className="h-3.5 w-3.5" />
                Lost So Far
              </p>
              <p className="mt-3 text-2xl font-bold font-[family-name:var(--font-barlow-condensed)]">
                {goalStatus.lostSoFar} lbs
              </p>
              <p className="text-sm text-muted-foreground">
                {goalStatus.progressPercent}% of target
              </p>
            </div>
            <div className="flat-tile">
              <p className="metric-label">7-Day Average</p>
              <p className="mt-3 text-2xl font-bold font-[family-name:var(--font-barlow-condensed)]">
                {goalStatus.rollingAverage
                  ? `${goalStatus.rollingAverage} lbs`
                  : "--"}
              </p>
              <p className="text-sm text-muted-foreground">
                Smooths daily weigh-ins
              </p>
            </div>
            <div className="flat-tile">
              <p className="metric-label">Weekly Loss Rate</p>
              <p className="mt-3 text-2xl font-bold font-[family-name:var(--font-barlow-condensed)]">
                {goalStatus.weeklyLossRate !== null
                  ? `${goalStatus.weeklyLossRate} lbs`
                  : "--"}
              </p>
              <p className="text-sm text-muted-foreground">
                {goalStatus.forecastDaysToGoal
                  ? `${goalStatus.forecastDaysToGoal} days to goal`
                  : "Need more weigh-ins for forecast"}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </DashboardPanel>
  );
}
