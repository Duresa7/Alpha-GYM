import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EXERCISE_CATEGORY_BADGE_CLASSES,
  EXERCISE_CATEGORY_LABELS,
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
              </div>
              <Badge
                variant="outline"
                className={EXERCISE_CATEGORY_BADGE_CLASSES[exercise.category] || ""}
              >
                {EXERCISE_CATEGORY_LABELS[exercise.category] || exercise.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
