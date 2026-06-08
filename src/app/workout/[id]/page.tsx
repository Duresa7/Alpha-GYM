import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getPlannedWorkoutById } from "@/actions/plan-actions";
import { PageHeader } from "@/components/layout/page-header";
import { ActiveWorkout } from "@/components/workout/active-workout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  if (workout.status === "completed") {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title={workout.title}
          description="This workout is already logged."
        />
        <Card className="app-surface">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-lg font-semibold">Already completed</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              You&apos;ve already logged this workout. Re-logging would create a
              duplicate session.
            </p>
            <Button asChild className="cursor-pointer">
              <Link href="/history">View in history</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
