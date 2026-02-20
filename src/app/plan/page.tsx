import { PageHeader } from "@/components/layout/page-header";
import { WeeklyPlanGrid } from "@/components/plan/weekly-plan-grid";
import { getWeeklyPlan } from "@/actions/plan-actions";

export default async function PlanPage() {
  const plan = await getWeeklyPlan();

  return (
    <div>
      <PageHeader
        title="Weekly Plan"
        description="Your 7-day training schedule"
      />
      <WeeklyPlanGrid plan={plan} />
    </div>
  );
}
