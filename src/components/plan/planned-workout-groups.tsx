"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDate } from "@/lib/date";
import type { PlannedWorkout } from "@/types";
import { statusTone } from "./plan-workspace-shared";

interface PlannedWorkoutGroupsProps {
  groupedWorkouts: Record<string, PlannedWorkout[]>;
}

export function PlannedWorkoutGroups({
  groupedWorkouts,
}: PlannedWorkoutGroupsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Object.entries(groupedWorkouts).map(([date, workouts]) => (
        <Card key={date} className="app-surface">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3 text-lg font-[family-name:var(--font-barlow-condensed)]">
              <span>
                {formatDisplayDate(date, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <Badge variant="outline">{workouts.length} planned</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="rounded-xl border border-black/5 bg-white/50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{workout.title}</p>
                    {workout.estimatedDurationMin ? (
                      <p className="text-sm text-muted-foreground">
                        {workout.estimatedDurationMin} min
                      </p>
                    ) : null}
                  </div>
                  <Badge
                    variant="outline"
                    className={statusTone[workout.status]}
                  >
                    {workout.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workout.items.slice(0, 4).map((item) => (
                    <Badge key={item.id} variant="outline">
                      {item.exerciseName}
                      {!item.isRequired ? " (optional)" : ""}
                    </Badge>
                  ))}
                </div>
                {workout.notes ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {workout.notes}
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
