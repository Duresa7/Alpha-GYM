import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "orange" | "green" | "muted";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "orange",
}: StatCardProps) {
  const colorClasses = {
    orange: "text-orange-400",
    green: "text-green-400",
    muted: "text-muted-foreground",
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold font-[family-name:var(--font-barlow-condensed)]">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-muted",
              colorClasses[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
