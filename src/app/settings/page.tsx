import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { getWeightGoal } from "@/actions/goal-actions";
import { getWaterGoal } from "@/actions/water-actions";

export default async function SettingsPage() {
  const [weightGoal, waterGoal] = await Promise.all([
    getWeightGoal(),
    getWaterGoal(),
  ]);

  return (
    <div>
      <PageHeader title="Settings" description="Configure your goals" />
      <SettingsForm
        currentWeightGoal={weightGoal}
        currentWaterGoal={waterGoal}
      />
    </div>
  );
}
