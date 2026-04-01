import { Trophy, Zap, Target, TrendingDown } from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import type { WeightLossLevel, WeightGoalStatus } from "@/types";

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
      accentClassName="bg-[#f59e0b] text-[#f59e0b]"
    >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-[#f59e0b]/20 bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 shadow-[0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-md">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]/70">
                  LVL
                </p>
                <p className="text-3xl font-black font-[family-name:var(--font-barlow-condensed)] text-[#f59e0b]">
                  {level.level}
                </p>
              </div>
              <Trophy className="absolute -right-2 -top-2 h-5 w-5 text-[#f59e0b] opacity-60" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{level.title}</p>
              <p className="text-sm text-foreground/50">{level.totalXP} XP earned</p>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground/60">
                <Zap className="h-3.5 w-3.5 text-[#f59e0b]" />
                {level.level < 10
                  ? `${level.currentXP} / ${level.xpForNextLevel} XP`
                  : "MAX LEVEL"}
              </span>
              {level.level < 10 && (
                <span className="text-foreground/40">Level {level.level + 1}</span>
              )}
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                style={{ width: `${level.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {goalStatus.goalWeight ? (
          <>
            <div className="border-t border-black/5" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-black/5 bg-white/50 p-4">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
                  <Target className="h-3.5 w-3.5" />
                  Goal
                </p>
                <p className="mt-3 text-2xl font-black font-[family-name:var(--font-barlow-condensed)]">
                  {goalStatus.goalWeight} lbs
                </p>
                <p className="text-sm text-muted-foreground">
                  {goalStatus.remaining > 0
                    ? `${goalStatus.remaining} lbs remaining`
                    : "Goal reached"}
                </p>
              </div>
              <div className="rounded-xl border border-black/5 bg-white/50 p-4">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
                  <TrendingDown className="h-3.5 w-3.5" />
                  Lost So Far
                </p>
                <p className="mt-3 text-2xl font-black font-[family-name:var(--font-barlow-condensed)]">
                  {goalStatus.lostSoFar} lbs
                </p>
                <p className="text-sm text-muted-foreground">
                  {goalStatus.progressPercent}% of target
                </p>
              </div>
              <div className="rounded-xl border border-black/5 bg-white/50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
                  7-Day Average
                </p>
                <p className="mt-3 text-2xl font-black font-[family-name:var(--font-barlow-condensed)]">
                  {goalStatus.rollingAverage ? `${goalStatus.rollingAverage} lbs` : "--"}
                </p>
                <p className="text-sm text-muted-foreground">Smooths daily weigh-ins</p>
              </div>
              <div className="rounded-xl border border-black/5 bg-white/50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
                  Weekly Loss Rate
                </p>
                <p className="mt-3 text-2xl font-black font-[family-name:var(--font-barlow-condensed)]">
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
