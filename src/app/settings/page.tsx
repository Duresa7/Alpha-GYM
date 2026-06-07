import { PageHeader } from "@/components/layout/page-header";
import { DashboardLayoutSettings } from "@/components/settings/dashboard-layout-settings";
import { PlateCalculator } from "@/components/settings/plate-calculator";
import { SettingsForm } from "@/components/settings/settings-form";
import { getGoalSettings } from "@/actions/goal-actions";

export default async function SettingsPage() {
  const settings = await getGoalSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Tune the targets that drive adherence, weigh-ins, hydration, and movement."
      />
      <div className="space-y-6">
        <SettingsForm settings={settings} />
        <DashboardLayoutSettings />
        <PlateCalculator />
      </div>
    </div>
  );
}
