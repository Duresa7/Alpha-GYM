import { PageHeader } from "@/components/layout/page-header";
import { ExerciseListComponent } from "@/components/exercises/exercise-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExerciseList } from "@/actions/exercise-actions";
import { EXERCISE_CATEGORIES } from "@/lib/constants";

export default async function ExercisesPage() {
  const allExercises = await getExerciseList();

  return (
    <div>
      <PageHeader
        title="Exercise Library"
        description="Reference list of all exercises in your program"
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="cursor-pointer">
            All ({allExercises.length})
          </TabsTrigger>
          {EXERCISE_CATEGORIES.map((cat) => {
            const count = allExercises.filter(
              (e) => e.category === cat.value
            ).length;
            return (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="cursor-pointer"
              >
                {cat.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ExerciseListComponent exercises={allExercises} />
        </TabsContent>
        {EXERCISE_CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="mt-4">
            <ExerciseListComponent
              exercises={allExercises.filter((e) => e.category === cat.value)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
