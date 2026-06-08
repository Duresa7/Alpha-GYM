import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PersonalRecord } from "@/types";

interface PersonalRecordsPanelProps {
  records: PersonalRecord[];
}

export function PersonalRecordsPanel({ records }: PersonalRecordsPanelProps) {
  return (
    <Card className="app-surface">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl">
          <Trophy className="h-5 w-5 text-primary" />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        {records.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-secondary p-6 text-center text-muted-foreground">
            Log strength sets to build PRs and estimated 1RM history.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {records.map((record) => (
              <div
                key={record.exerciseName}
                className="rounded-md border border-border bg-secondary p-4"
              >
                <p className="font-semibold text-foreground">
                  {record.exerciseName}
                </p>
                <div className="mt-3 grid gap-3 text-sm">
                  <div>
                    <p className="metric-label">Best Weight</p>
                    <p className="font-semibold">
                      {record.bestWeight} lbs
                      <span className="ml-2 text-muted-foreground">
                        {record.bestWeightDate}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="metric-label">Estimated 1RM</p>
                    <p className="font-semibold">
                      {record.bestEstimatedOneRepMax} lbs
                      <span className="ml-2 text-muted-foreground">
                        {record.bestEstimatedOneRepMaxDate}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="metric-label">Best Volume</p>
                    <p className="font-semibold">
                      {record.bestVolume.toLocaleString()} lbs
                      <span className="ml-2 text-muted-foreground">
                        {record.bestVolumeDate}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
