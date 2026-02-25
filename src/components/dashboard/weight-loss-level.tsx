"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Target, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setWeightGoal } from "@/actions/goal-actions";
import type { WeightLossLevel, WeightGoalStatus } from "@/types";

interface WeightLossLevelProps {
  level: WeightLossLevel;
  goalStatus: WeightGoalStatus;
}

export function WeightLossLevelCard({
  level,
  goalStatus,
}: WeightLossLevelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [goalInput, setGoalInput] = useState(
    goalStatus.goalWeight ? String(goalStatus.goalWeight) : ""
  );

  const handleSaveGoal = useCallback(() => {
    const weight = Number(goalInput);
    if (!weight || weight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    startTransition(async () => {
      try {
        await setWeightGoal(weight);
        toast.success("Weight goal updated!");
        setShowGoalDialog(false);
        router.refresh();
      } catch {
        toast.error("Failed to save goal");
      }
    });
  }, [goalInput, router]);

  return (
    <>
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

          {/* Divider */}
          <div className="border-t border-black/5" />

          {/* Goal Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {goalStatus.goalWeight ? (
              <>
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

                {/* Goal Progress Bar */}
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
                      style={{
                        width: `${goalStatus.progressPercent}%`,
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGoalDialog(true)}
                    className="cursor-pointer text-xs text-foreground/40 hover:text-foreground"
                  >
                    Edit Goal
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex w-full flex-col items-center gap-3 py-2">
                <p className="text-sm text-foreground/40">
                  Set a weight goal to track your progress
                </p>
                <Button
                  onClick={() => setShowGoalDialog(true)}
                  className="cursor-pointer"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Set Weight Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Set/Edit Goal Dialog */}
      <Dialog
        open={showGoalDialog}
        onOpenChange={(open) => {
          if (!open && !isPending) setShowGoalDialog(false);
        }}
      >
        <DialogContent showCloseButton={!isPending}>
          <DialogHeader>
            <DialogTitle>Set Weight Goal</DialogTitle>
            <DialogDescription>
              Enter your target weight. You&apos;ll earn XP for every 0.1 lb
              lost from your starting weight.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="mb-1.5 block text-sm font-medium">
              Goal Weight (lbs)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g. 170"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGoalDialog(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveGoal}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isPending ? "Saving..." : "Save Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
