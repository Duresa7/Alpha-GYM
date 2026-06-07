"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  contentClassName = "space-y-5 pt-5",
  headerContent,
}: DashboardPanelProps) {
  return (
    <Card className="app-surface panel-hover h-full">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl text-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-sm", accentClassName)} />
            {title}
          </CardTitle>
          {headerContent}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
