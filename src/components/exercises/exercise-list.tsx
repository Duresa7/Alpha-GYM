import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExerciseListItem } from "@/types";

interface ExerciseListProps {
  exercises: ExerciseListItem[];
}

const categoryColors: Record<string, string> = {
  calisthenics: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cardio: "bg-green-500/20 text-green-400 border-green-500/30",
  upper_body: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  lower_body: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const categoryLabels: Record<string, string> = {
  calisthenics: "Calisthenics",
  cardio: "Cardio",
  upper_body: "Upper Body",
  lower_body: "Lower Body",
};

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
                className={categoryColors[exercise.category] || ""}
              >
                {categoryLabels[exercise.category] || exercise.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
