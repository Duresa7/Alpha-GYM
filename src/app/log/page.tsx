import { PageHeader } from "@/components/layout/page-header";
import { QuickEntryForm } from "@/components/log/quick-entry-form";
import { getExerciseNames } from "@/actions/exercise-actions";

export default async function LogPage() {
  const exerciseNames = await getExerciseNames();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Log Workout"
        description="Record your exercises, cardio, and body weight"
      />
      <QuickEntryForm exerciseNames={exerciseNames} />
    </div>
  );
}
