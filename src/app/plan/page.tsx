import { addDays } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { PlanWorkspace } from "@/components/plan/plan-workspace";
import { getPlannedWorkoutsForRange, getWorkoutTemplates } from "@/actions/plan-actions";
import { formatDateKey } from "@/lib/date";

export default async function PlanPage() {
  const today = new Date();
  const [templates, plannedWorkouts] = await Promise.all([
    getWorkoutTemplates(),
    getPlannedWorkoutsForRange(formatDateKey(today), formatDateKey(addDays(today, 6))),
  ]);

  return (
    <div>
      <PageHeader
        title="Plan Builder"
        description="Create reusable templates, schedule workouts, and keep your week flexible."
      />
      <PlanWorkspace templates={templates} plannedWorkouts={plannedWorkouts} />
    </div>
  );
}
