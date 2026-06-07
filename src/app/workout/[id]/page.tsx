import { notFound } from "next/navigation";
import { getPlannedWorkoutById } from "@/actions/plan-actions";
import { PageHeader } from "@/components/layout/page-header";
import { ActiveWorkout } from "@/components/workout/active-workout";

interface ActiveWorkoutPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActiveWorkoutPage({
  params,
}: ActiveWorkoutPageProps) {
  const { id } = await params;
  const workout = await getPlannedWorkoutById(Number(id));

  if (!workout) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={workout.title}
        description="Tick off sets, let the rest timer run, and complete into history."
      />
      <ActiveWorkout workout={workout} />
    </div>
  );
}
