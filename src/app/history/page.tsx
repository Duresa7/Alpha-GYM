import { PageHeader } from "@/components/layout/page-header";
import { HistoryTabs } from "@/components/history/history-tabs";
import {
  getExerciseLogs,
  getCardioLogs,
  getWeightLogs,
} from "@/actions/history-actions";

export default async function HistoryPage() {
  const [exerciseLogs, cardioLogs, weightLogs] = await Promise.all([
    getExerciseLogs(),
    getCardioLogs(),
    getWeightLogs(),
  ]);

  return (
    <div>
      <PageHeader
        title="History"
        description="All your logged workout data"
      />
      <HistoryTabs
        exerciseLogs={exerciseLogs}
        cardioLogs={cardioLogs}
        weightLogs={weightLogs}
      />
    </div>
  );
}
