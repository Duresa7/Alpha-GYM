"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_DASHBOARD_CARDS,
  getDefaultDashboardLayout,
  readDashboardLayout,
  writeDashboardLayout,
  type DashboardLayoutSettings as DashboardLayoutSettingsValue,
} from "@/lib/dashboard-layout";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("alpha-gym-dashboard-layout", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("alpha-gym-dashboard-layout", onStoreChange);
  };
}

export function DashboardLayoutSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    readDashboardLayout,
    getDefaultDashboardLayout
  );

  const cardLabels = useMemo(
    () =>
      new Map<string, string>(
        DEFAULT_DASHBOARD_CARDS.map((card) => [card.key, card.label])
      ),
    []
  );

  function commit(next: DashboardLayoutSettingsValue) {
    writeDashboardLayout(next);
  }

  function moveCard(key: string, direction: -1 | 1) {
    const index = settings.order.indexOf(key);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= settings.order.length) {
      return;
    }

    const nextOrder = [...settings.order];
    [nextOrder[index], nextOrder[targetIndex]] = [
      nextOrder[targetIndex],
      nextOrder[index],
    ];
    commit({ ...settings, order: nextOrder });
  }

  function toggleCard(key: string) {
    const hidden = settings.hidden.includes(key)
      ? settings.hidden.filter((entry) => entry !== key)
      : [...settings.hidden, key];

    commit({ ...settings, hidden });
  }

  return (
    <Card className="app-surface overflow-visible">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl">
          Dashboard Cards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {settings.order.map((key, index) => {
          const isHidden = settings.hidden.includes(key);

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary p-3"
            >
              <div>
                <p className="font-semibold">{cardLabels.get(key) ?? key}</p>
                <p className="text-xs text-muted-foreground">
                  {isHidden ? "Hidden on dashboard" : "Visible on dashboard"}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => moveCard(key, -1)}
                  disabled={index === 0}
                  className="cursor-pointer"
                  aria-label="Move card up"
                  title="Move card up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => moveCard(key, 1)}
                  disabled={index === settings.order.length - 1}
                  className="cursor-pointer"
                  aria-label="Move card down"
                  title="Move card down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={isHidden ? "outline" : "default"}
                  size="icon-sm"
                  onClick={() => toggleCard(key)}
                  className="cursor-pointer"
                  aria-label={isHidden ? "Show card" : "Hide card"}
                  title={isHidden ? "Show card" : "Hide card"}
                >
                  {isHidden ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={() => commit(getDefaultDashboardLayout())}
          className="min-h-11 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Dashboard Layout
        </Button>
      </CardContent>
    </Card>
  );
}
