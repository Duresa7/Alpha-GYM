"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardPanelProps {
  title: string;
  accentClassName: string;
  children: ReactNode;
  contentClassName?: string;
  headerContent?: ReactNode;
}

export function DashboardPanel({
  title,
  accentClassName,
  children,
  contentClassName = "relative z-10 space-y-6 pt-6",
  headerContent,
}: DashboardPanelProps) {
  return (
    <Card className="app-surface panel-hover group relative overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <span className="absolute inset-0 z-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 border-b border-black/5 pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl tracking-wide text-foreground drop-shadow-sm">
            <span className={`h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${accentClassName}`} />
            {title}
          </CardTitle>
          {headerContent}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
