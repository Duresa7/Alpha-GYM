import { PageHeader } from "@/components/layout/page-header";
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
      <SettingsForm settings={settings} />
    </div>
  );
}
