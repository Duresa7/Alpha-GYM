import { PageHeader } from "@/components/layout/page-header";
import { QuickEntryForm } from "@/components/log/quick-entry-form";
import { getExerciseNames } from "@/actions/exercise-actions";
import { getTodayFocusData } from "@/actions/plan-actions";

interface LogPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LogPage({ searchParams }: LogPageProps) {
  const params = searchParams ? await searchParams : {};
  const plannedParam = Array.isArray(params.planned) ? params.planned[0] : params.planned;

  const [exerciseNames, todayFocus] = await Promise.all([
    getExerciseNames(),
    getTodayFocusData(),
  ]);

  const plannedOptions = [
    ...(todayFocus.workout ? [todayFocus.workout] : []),
    ...todayFocus.carriedForward,
  ].filter((workout, index, array) => array.findIndex((entry) => entry.id === workout.id) === index);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Log Workout"
        description="Start from today’s assignment or log a free workout when the day goes off-script."
      />
      <QuickEntryForm
        exerciseNames={exerciseNames}
        plannedWorkouts={plannedOptions}
        initialPlannedWorkoutId={plannedParam ? Number(plannedParam) : undefined}
      />
    </div>
  );
}
