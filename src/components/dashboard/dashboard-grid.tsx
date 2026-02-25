"use client";

import { useState, useCallback, type ReactNode } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGrid = WidthProvider(Responsive);

const STORAGE_KEY = "alpha-gym-dashboard-layout";

interface PanelConfig {
  key: string;
  component: ReactNode;
  defaultLayout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  };
}

interface DashboardGridProps {
  panels: PanelConfig[];
}

function loadSavedLayouts(): ReactGridLayout.Layouts | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveLayouts(layouts: ReactGridLayout.Layouts) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  } catch {
    // ignore
  }
}

export function DashboardGrid({ panels }: DashboardGridProps) {
  const savedLayouts = loadSavedLayouts();

  const defaultLayouts: ReactGridLayout.Layouts = {
    lg: panels.map((p) => ({
      i: p.key,
      ...p.defaultLayout,
      minW: p.defaultLayout.minW ?? 1,
      minH: p.defaultLayout.minH ?? 2,
    })),
    md: panels.map((p) => ({
      i: p.key,
      x: p.defaultLayout.w >= 4 ? 0 : p.defaultLayout.x >= 2 ? p.defaultLayout.x - 2 : p.defaultLayout.x,
      y: p.defaultLayout.y,
      w: Math.min(p.defaultLayout.w, 2),
      h: p.defaultLayout.h,
      minW: 1,
      minH: p.defaultLayout.minH ?? 2,
    })),
    sm: panels.map((p) => ({
      i: p.key,
      x: 0,
      y: p.defaultLayout.y,
      w: 1,
      h: p.defaultLayout.h,
      minW: 1,
      minH: p.defaultLayout.minH ?? 2,
    })),
  };

  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>(
    savedLayouts || defaultLayouts
  );

  const handleLayoutChange = useCallback(
    (
      _layout: ReactGridLayout.Layout[],
      allLayouts: ReactGridLayout.Layouts
    ) => {
      setLayouts(allLayouts);
      saveLayouts(allLayouts);
    },
    []
  );

  return (
    <ResponsiveGrid
      className="dashboard-grid"
      layouts={layouts}
      breakpoints={{ lg: 1024, md: 768, sm: 0 }}
      cols={{ lg: 4, md: 2, sm: 1 }}
      rowHeight={100}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".panel-drag-handle"
      isResizable={true}
      isDraggable={true}
      margin={[16, 16] as [number, number]}
      containerPadding={[0, 0] as [number, number]}
    >
      {panels.map((panel) => (
        <div key={panel.key} className="dashboard-tile">
          <div className="panel-drag-handle" title="Drag to reposition">
            <span className="panel-drag-dots">⠿</span>
          </div>
          <div className="dashboard-tile-content">
            {panel.component}
          </div>
        </div>
      ))}
    </ResponsiveGrid>
  );
}
