import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EXERCISE_CATEGORY_BADGE_CLASSES,
  EXERCISE_CATEGORY_LABELS,
  EXERCISE_TRACKING_MODES,
} from "@/lib/constants";
import type { ExerciseListItem } from "@/types";

interface ExerciseListProps {
  exercises: ExerciseListItem[];
}

export function ExerciseListComponent({ exercises }: ExerciseListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="app-surface panel-hover">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{exercise.name}</p>
                {exercise.targetMuscles && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exercise.targetMuscles}
                  </p>
                )}
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {EXERCISE_TRACKING_MODES.find(
                    (mode) => mode.value === exercise.trackingMode
                  )?.label || exercise.trackingMode}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className={EXERCISE_CATEGORY_BADGE_CLASSES[exercise.category] || ""}
                >
                  {EXERCISE_CATEGORY_LABELS[exercise.category] || exercise.category}
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em]">
                  {exercise.trackingMode}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
