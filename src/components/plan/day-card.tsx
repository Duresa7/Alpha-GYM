import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DAY_LABELS, SECTION_COLORS } from "@/lib/constants";
import type { WeeklyPlanItem } from "@/types";

interface DayCardProps {
  dayOfWeek: string;
  items: WeeklyPlanItem[];
  isToday: boolean;
}

const sectionLabels: Record<string, string> = {
  strength: "Strength",
  cardio: "Cardio",
  core: "Core",
  circuit: "Circuit",
  mobility: "Mobility",
};

export function DayCard({ dayOfWeek, items, isToday }: DayCardProps) {
  const dayInfo = DAY_LABELS[dayOfWeek];

  // Group items by section
  const sections: Record<string, WeeklyPlanItem[]> = {};
  for (const item of items) {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  }

  return (
    <Card
      className={cn(
        "border-border bg-card transition-colors",
        isToday && "border-primary/50 ring-1 ring-primary/20"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-lg">
            {dayInfo?.label || dayOfWeek}
          </CardTitle>
          {isToday && (
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Today
            </Badge>
          )}
        </div>
        <CardDescription>{dayInfo?.focus}</CardDescription>
        <span className="text-xs text-muted-foreground">
          {dayInfo?.duration}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(sections).map(([section, sectionItems]) => (
          <div key={section}>
            <Badge
              variant="outline"
              className={cn(
                "mb-2 text-xs",
                SECTION_COLORS[section] || ""
              )}
            >
              {sectionLabels[section] || section}
            </Badge>
            <ul className="space-y-1">
              {sectionItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{item.exerciseName}</span>
                  {item.setsReps && (
                    <span className="text-xs text-muted-foreground">
                      {item.setsReps}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
