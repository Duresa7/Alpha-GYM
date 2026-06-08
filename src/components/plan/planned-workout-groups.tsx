"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
          <CardHeader className="border-b border-border pb-4">
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
                className="rounded-md border border-border bg-secondary p-4"
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
                {workout.status === "pending" ? (
                  <Link href={`/workout/${workout.id}`} className="mt-3 inline-flex">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  </Link>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {workout.items.slice(0, 4).map((item) => (
                    <Badge key={item.id} variant="outline">
                      {item.groupLabel ? `${item.groupLabel}: ` : ""}
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
