"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarPlus2, Loader2, SkipForward, Target } from "lucide-react";
import { toast } from "sonner";
import { carryForwardPlannedWorkout, skipPlannedWorkout } from "@/actions/plan-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        toast.error("Could not update today’s workout.");
      }
    });
  }

  return (
    <DashboardPanel
      title="Today's Focus"
      accentClassName="bg-emerald-500 text-emerald-500"
    >
        {workout ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
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
                {workout.items.slice(0, 6).map((item) => (
                  <Badge key={item.id} variant="outline">
                    {item.exerciseName}
                    {!item.isRequired ? " (opt)" : ""}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              <Link href={`/log?planned=${workout.id}`} className="w-full">
                <Button className="w-full cursor-pointer">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Start in Log
                </Button>
              </Link>
              <select
                value={skipReason}
                onChange={(event) => setSkipReason(event.target.value)}
                className="flex h-10 rounded-md border border-input bg-white/70 px-3 py-2 text-sm"
              >
                {SKIP_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    runAction(() => skipPlannedWorkout(workout.id, skipReason), "Workout skipped.")
                  }
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SkipForward className="mr-2 h-4 w-4" />}
                  Skip
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    runAction(() => carryForwardPlannedWorkout(workout.id), "Workout moved to tomorrow.")
                  }
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  <CalendarPlus2 className="mr-2 h-4 w-4" />
                  Move
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-8 text-center text-foreground/45">
            <p className="text-lg font-semibold">Nothing assigned today.</p>
            <p className="mt-2 text-sm">
              Use the plan builder to schedule a workout or log a free session anyway.
            </p>
            <Link href="/plan" className="mt-4 inline-flex">
              <Button variant="outline" className="cursor-pointer">
                <Target className="mr-2 h-4 w-4" />
                Open Plan Builder
              </Button>
            </Link>
          </div>
        )}

        {data.carriedForward.length > 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
              Carryovers
            </p>
            <div className="mt-3 space-y-2">
              {data.carriedForward.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-3 rounded-lg border border-black/5 bg-white/70 px-3 py-2">
                  <div>
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">From {entry.date}</p>
                  </div>
                  <Link href={`/log?planned=${entry.id}`}>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      Use Now
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
