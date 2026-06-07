import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "orange" | "green" | "muted" | "blue" | "magenta";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "orange",
}: StatCardProps) {
  const colorMaps = {
    orange: "border-primary/45 bg-primary/10 text-primary",
    green: "border-emerald-500/35 bg-emerald-500/10 text-emerald-400",
    blue: "border-cyan-500/35 bg-cyan-500/10 text-cyan-300",
    magenta: "border-fuchsia-500/35 bg-fuchsia-500/10 text-fuchsia-300",
    muted: "border-border bg-secondary text-muted-foreground",
  };

  return (
    <Card className="app-surface panel-hover">
      <CardContent className="flex min-h-28 items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="metric-label">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground font-[family-name:var(--font-barlow-condensed)]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border",
            colorMaps[color]
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={2.4} />
        </div>
      </CardContent>
    </Card>
  );
}
