"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  getDefaultDashboardLayout,
  readDashboardLayout,
  type DashboardLayoutSettings,
} from "@/lib/dashboard-layout";
import { cn } from "@/lib/utils";

interface PanelConfig {
  key: string;
  component: ReactNode;
  className?: string;
}

interface DashboardGridProps {
  panels: PanelConfig[];
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("alpha-gym-dashboard-layout", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("alpha-gym-dashboard-layout", onStoreChange);
  };
}

function getServerSnapshot(): DashboardLayoutSettings {
  return getDefaultDashboardLayout();
}

export function DashboardGrid({ panels }: DashboardGridProps) {
  const settings = useSyncExternalStore(
    subscribe,
    readDashboardLayout,
    getServerSnapshot
  );

  const visiblePanels = useMemo(() => {
    const byKey = new Map(panels.map((panel) => [panel.key, panel]));
    const ordered = [
      ...settings.order
        .map((key) => byKey.get(key))
        .filter((panel): panel is PanelConfig => Boolean(panel)),
      ...panels.filter((panel) => !settings.order.includes(panel.key)),
    ];

    return ordered.filter((panel) => !settings.hidden.includes(panel.key));
  }, [panels, settings.hidden, settings.order]);

  return (
    <div className="dashboard-grid">
      {visiblePanels.map((panel) => (
        <section key={panel.key} className={cn("min-w-0", panel.className)}>
          {panel.component}
        </section>
      ))}
    </div>
  );
}
