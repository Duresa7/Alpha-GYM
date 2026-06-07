"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarPlus2, Loader2, Play, SkipForward, Target } from "lucide-react";
import { toast } from "sonner";
import { carryForwardPlannedWorkout, skipPlannedWorkout } from "@/actions/plan-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { SKIP_REASONS } from "@/lib/constants";
import type { TodayFocusData } from "@/types";

interface TodayFocusCardProps {
  data: TodayFocusData;
}

export function TodayFocusCard({ data }: TodayFocusCardProps) {
  const router = useRouter();
  const [skipReason, setSkipReason] = useState<string>(SKIP_REASONS[0]);
  const [isPending, startTransition] = useTransition();
  const workout = data.workout;

  function runAction(action: () => Promise<unknown>, successMessage: string) {
    startTransition(async () => {
      try {
        await action();
        toast.success(successMessage);
        router.refresh();
      } catch {
        toast.error("Could not update today's workout.");
      }
    });
  }

  return (
    <DashboardPanel title="Today's Focus" accentClassName="bg-emerald-400">
      {workout ? (
        <>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-bold">{workout.title}</p>
                <p className="text-sm text-muted-foreground">
                  {workout.estimatedDurationMin
                    ? `${workout.estimatedDurationMin} min planned`
                    : "Flexible session"}
                </p>
              </div>
              <Badge variant="outline">{workout.status.replace("_", " ")}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {workout.items.slice(0, 7).map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.groupLabel ? `${item.groupLabel}: ` : ""}
                  {item.exerciseName}
                  {!item.isRequired ? " (opt)" : ""}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
            <Link href={`/workout/${workout.id}`} className="w-full">
              <Button className="min-h-11 w-full cursor-pointer">
                <Play className="h-4 w-4" />
                Start Workout
              </Button>
            </Link>
            <Link href={`/log?planned=${workout.id}`} className="w-full">
              <Button variant="outline" className="min-h-11 w-full cursor-pointer">
                <ArrowRight className="h-4 w-4" />
                Open in Log
              </Button>
            </Link>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <select
              value={skipReason}
              onChange={(event) => setSkipReason(event.target.value)}
              className="flat-field"
            >
              {SKIP_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() =>
                runAction(
                  () => skipPlannedWorkout(workout.id, skipReason),
                  "Workout skipped."
                )
              }
              disabled={isPending}
              className="min-h-11 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SkipForward className="h-4 w-4" />
              )}
              Skip
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                runAction(
                  () => carryForwardPlannedWorkout(workout.id),
                  "Workout moved to tomorrow."
                )
              }
              disabled={isPending}
              className="min-h-11 cursor-pointer"
            >
              <CalendarPlus2 className="h-4 w-4" />
              Move
            </Button>
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-secondary p-6 text-center text-muted-foreground">
          <p className="text-lg font-semibold text-foreground">
            Nothing assigned today.
          </p>
          <p className="mt-2 text-sm">
            Schedule a workout or log a free session.
          </p>
          <Link href="/plan" className="mt-4 inline-flex">
            <Button variant="outline" className="cursor-pointer">
              <Target className="h-4 w-4" />
              Open Plan Builder
            </Button>
          </Link>
        </div>
      )}

      {data.carriedForward.length > 0 ? (
        <div className="flat-tile">
          <p className="metric-label">Carryovers</p>
          <div className="mt-3 space-y-2">
            {data.carriedForward.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
              >
                <div>
                  <p className="font-medium">{entry.title}</p>
                  <p className="text-xs text-muted-foreground">From {entry.date}</p>
                </div>
                <Link href={`/workout/${entry.id}`}>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Start
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </DashboardPanel>
  );
}
