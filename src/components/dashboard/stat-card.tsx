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
    orange: {
      text: "text-primary",
      glow: "shadow-[0_0_15px_rgba(255,100,0,0.3)]",
      bg: "bg-primary/5 border-primary/20",
      accent: "from-primary/15",
    },
    green: {
      text: "text-[#059669]",
      glow: "shadow-[0_0_15px_rgba(5,150,105,0.3)]",
      bg: "bg-[#059669]/5 border-[#059669]/20",
      accent: "from-[#059669]/15",
    },
    blue: {
      text: "text-[#0284c7]",
      glow: "shadow-[0_0_15px_rgba(2,132,199,0.3)]",
      bg: "bg-[#0284c7]/5 border-[#0284c7]/20",
      accent: "from-[#0284c7]/15",
    },
    magenta: {
      text: "text-[#c026d3]",
      glow: "shadow-[0_0_15px_rgba(192,38,211,0.3)]",
      bg: "bg-[#c026d3]/5 border-[#c026d3]/20",
      accent: "from-[#c026d3]/15",
    },
    muted: {
      text: "text-foreground/50",
      glow: "shadow-[0_0_10px_rgba(0,0,0,0.05)]",
      bg: "bg-black/5 border-black/10",
      accent: "from-black/5",
    },
  };

  const style = colorMaps[color];

  return (
    <Card className="app-surface panel-hover group relative overflow-hidden p-[1px]">
      {/* Animated gradient border effect */}
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <CardContent className="relative z-10 box-border h-full w-full rounded-[var(--radius)] bg-gradient-to-br from-white/90 to-white/40 p-6 pt-7 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="z-20 flex flex-col gap-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/50">
              {title}
            </p>
            <p className="mt-2 text-4xl font-black font-[family-name:var(--font-barlow-condensed)] text-foreground drop-shadow-sm">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "relative z-20 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-300 group-hover:scale-110",
              style.bg,
              style.glow
            )}
          >
            <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-50", style.accent)} />
            <Icon className={cn("relative z-10 h-6 w-6", style.text)} strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Subtle background glow element */}
        <div className={cn("absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl transition-all duration-500 group-hover:opacity-60", style.bg, "opacity-[0.15]")} />
      </CardContent>
    </Card>
  );
}
