import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecentActivityEntry } from "@/types";

interface RecentActivityProps {
  entries: RecentActivityEntry[];
}

const typeLabels: Record<string, string> = {
  exercise_only: "Exercise",
  cardio_only: "Cardio",
  both: "Both",
  rest_day: "Rest Day",
};

const typeColors: Record<string, string> = {
  exercise_only: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  cardio_only: "bg-green-500/20 text-green-400 border-green-500/30",
  both: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  rest_day: "bg-muted text-muted-foreground border-border",
};

export function RecentActivity({ entries }: RecentActivityProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-lg">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-muted-foreground">
            No workouts logged yet. Start tracking!
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <div
                key={`${entry.date}-${i}`}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {new Date(entry.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                  <Badge
                    variant="outline"
                    className={typeColors[entry.workoutType] || ""}
                  >
                    {typeLabels[entry.workoutType] || entry.workoutType}
                  </Badge>
                </div>
                {entry.notes && (
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {entry.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
