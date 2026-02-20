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
    orange: "text-orange-300",
    green: "text-green-300",
    muted: "text-sky-300",
  };

  return (
    <Card className="app-surface panel-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold font-[family-name:var(--font-barlow-condensed)]">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-gradient-to-br from-muted to-muted/60",
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
