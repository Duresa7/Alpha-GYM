import { PageHeader } from "@/components/layout/page-header";
import { HistoryTabs } from "@/components/history/history-tabs";
import { PersonalRecordsPanel } from "@/components/history/personal-records-panel";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  getExerciseLogs,
  getCardioLogs,
  getPersonalRecords,
  getWeightLogs,
} from "@/actions/history-actions";
import { getRecentActivity } from "@/actions/dashboard-actions";

export default async function HistoryPage() {
  const [exerciseLogs, cardioLogs, weightLogs, recentActivity, personalRecords] =
    await Promise.all([
      getExerciseLogs(),
      getCardioLogs(),
      getWeightLogs(),
      getRecentActivity(10),
      getPersonalRecords(),
    ]);

  return (
    <div>
      <PageHeader
        title="History"
        description="All your logged workout data"
      />
      <div className="space-y-6">
        <RecentActivity entries={recentActivity} />
        <PersonalRecordsPanel records={personalRecords} />
        <HistoryTabs
          exerciseLogs={exerciseLogs}
          cardioLogs={cardioLogs}
          weightLogs={weightLogs}
        />
      </div>
    </div>
  );
}
