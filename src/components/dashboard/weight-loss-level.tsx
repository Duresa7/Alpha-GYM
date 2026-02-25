import { Trophy, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 border-b border-black/5 pb-4">
        <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
          Weight Loss Level
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-6 space-y-6">
        {/* Level + XP Section */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          {/* Level Badge */}
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
              <p className="text-lg font-bold text-foreground">
                {level.title}
              </p>
              <p className="text-sm text-foreground/50">
                {level.totalXP} XP earned
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground/60">
                <Zap className="h-3.5 w-3.5 text-[#f59e0b]" />
                {level.level < 10
                  ? `${level.currentXP} / ${level.xpForNextLevel} XP`
                  : "MAX LEVEL"}
              </span>
              {level.level < 10 && (
                <span className="text-foreground/40">
                  Level {level.level + 1}
                </span>
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

        {/* Goal Progress (display only) */}
        {goalStatus.goalWeight && (
          <>
            <div className="border-t border-black/5" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
                  <Target className="h-3.5 w-3.5" />
                  Goal: {goalStatus.goalWeight} lbs
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-lg font-semibold text-foreground">
                    {goalStatus.lostSoFar > 0
                      ? `${goalStatus.lostSoFar} lbs lost`
                      : "No progress yet"}
                  </p>
                  {goalStatus.remaining > 0 && (
                    <span className="text-sm text-foreground/40">
                      • {goalStatus.remaining} lbs remaining
                    </span>
                  )}
                  {goalStatus.remaining <= 0 &&
                    goalStatus.goalWeight &&
                    goalStatus.currentWeight && (
                      <span className="text-sm font-bold text-emerald-600">
                        🎉 Goal reached!
                      </span>
                    )}
                </div>
              </div>

              <div className="flex-1 sm:max-w-xs space-y-2">
                <div className="flex justify-between text-xs text-foreground/40">
                  <span>{goalStatus.startWeight} lbs</span>
                  <span className="font-semibold text-foreground/60">
                    {goalStatus.progressPercent}%
                  </span>
                  <span>{goalStatus.goalWeight} lbs</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    style={{ width: `${goalStatus.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
