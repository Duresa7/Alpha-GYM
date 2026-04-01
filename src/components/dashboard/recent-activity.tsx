"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteActivityLog } from "@/actions/dashboard-actions";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
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
  exercise_only: "bg-primary/10 text-primary border-primary/20",
  cardio_only: "bg-accent/10 text-[#0284c7] border-accent/20",
  both: "bg-[#d946ef]/10 text-[#c026d3] border-[#d946ef]/20",
  weight_only: "bg-[#f59e0b]/10 text-[#d97706] border-[#f59e0b]/20",
  rest_day: "bg-black/5 text-foreground/50 border-black/10",
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
      accentClassName="bg-[#10b981] text-[#10b981]"
      contentClassName="relative z-10 pt-6"
    >
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white/50 p-8 text-center text-foreground/40">
            <p>No workouts logged yet.</p>
            <p className="text-sm mt-1">Head to Log Workout to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group/item relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/5 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-white to-black/5 border border-black/10 shadow-sm">
                    <span className="text-xs font-bold uppercase text-foreground/50">
                      {formatDisplayDate(entry.date, { month: "short" })}
                    </span>
                    <span className="text-lg font-black text-foreground">
                      {formatDisplayDate(entry.date, { day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground/90">
                      {formatDisplayDate(entry.date, { weekday: "long" })} Session
                    </span>
                    {entry.notes && (
                      <span className="mt-1 line-clamp-1 max-w-[250px] text-xs text-foreground/50">
                        {entry.notes}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`font-semibold tracking-wider px-3 py-1 ${typeColors[entry.workoutType] || typeColors.rest_day}`}
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
                    className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-destructive"
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
