import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecentActivityEntry } from "@/types";

interface RecentActivityProps {
  entries: RecentActivityEntry[];
}

const typeLabels: Record<string, string> = {
  exercise_only: "Resistance",
  cardio_only: "Cardio",
  both: "Hybrid",
  rest_day: "Rest Day",
};

const typeColors: Record<string, string> = {
  exercise_only: "bg-primary/10 text-primary border-primary/20",
  cardio_only: "bg-accent/10 text-[#0284c7] border-accent/20",
  both: "bg-[#d946ef]/10 text-[#c026d3] border-[#d946ef]/20",
  rest_day: "bg-black/5 text-foreground/50 border-black/10",
};

export function RecentActivity({ entries }: RecentActivityProps) {
  return (
    <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 border-b border-black/5 pb-4">
        <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-6">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white/50 p-8 text-center text-foreground/40">
            <p>No workouts logged yet.</p>
            <p className="text-sm mt-1">Head to Log Workout to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <div
                key={`${entry.date}-${i}`}
                className="group/item relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/5 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-white to-black/5 border border-black/10 shadow-sm">
                    <span className="text-xs font-bold uppercase text-foreground/50">
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-lg font-black text-foreground">
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground/90">
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })} Session
                    </span>
                    {entry.notes && (
                      <span className="mt-1 line-clamp-1 max-w-[250px] text-xs text-foreground/50">
                        {entry.notes}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`font-semibold tracking-wider px-3 py-1 ${typeColors[entry.workoutType] || typeColors.rest_day}`}
                  >
                    {typeLabels[entry.workoutType] || entry.workoutType}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
