"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteActivityLog } from "@/actions/dashboard-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDisplayDate } from "@/lib/date";
import type { RecentActivityEntry } from "@/types";

interface RecentActivityProps {
  entries: RecentActivityEntry[];
}

const typeLabels: Record<string, string> = {
  exercise_only: "Resistance",
  cardio_only: "Cardio",
  both: "Hybrid",
  weight_only: "Weigh-In",
  rest_day: "Rest Day",
};

const typeColors: Record<string, string> = {
  exercise_only: "bg-primary/10 text-primary border-primary/25",
  cardio_only: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  both: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/25",
  weight_only: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  rest_day: "bg-secondary text-muted-foreground border-border",
};

export function RecentActivity({ entries }: RecentActivityProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = useCallback(
    async (id: number) => {
      setDeletingId(id);
      try {
        await deleteActivityLog(id);
        toast.success("Activity entry deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete entry");
      } finally {
        setDeletingId(null);
      }
    },
    [router]
  );

  return (
    <DashboardPanel
      title="Recent Activity"
      accentClassName="bg-emerald-400"
      contentClassName="pt-5"
    >
      {entries.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-secondary p-6 text-center text-muted-foreground">
          <p>No workouts logged yet.</p>
          <p className="mt-1 text-sm">Head to Log Workout to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-3 rounded-md border border-border bg-secondary/70 p-3 transition-[background-color,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/35 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border border-border bg-card">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {formatDisplayDate(entry.date, { month: "short" })}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {formatDisplayDate(entry.date, { day: "numeric" })}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {entry.title ||
                      `${formatDisplayDate(entry.date, { weekday: "long" })} Session`}
                  </p>
                  {entry.notes ? (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {entry.notes}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={typeColors[entry.workoutType] || typeColors.rest_day}
                >
                  {typeLabels[entry.workoutType] || entry.workoutType}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  aria-label="Delete activity"
                  title="Delete activity"
                  className="h-9 w-9 cursor-pointer text-muted-foreground hover:text-destructive"
                >
                  {deletingId === entry.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardPanel>
  );
}
