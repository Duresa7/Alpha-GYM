export const DASHBOARD_LAYOUT_STORAGE_KEY = "alpha-gym-dashboard-cards";

export const DEFAULT_DASHBOARD_CARDS = [
  { key: "today-focus", label: "Today's Focus" },
  { key: "level", label: "Weight Loss Level" },
  { key: "weight-chart", label: "Weight Chart" },
  { key: "water", label: "Water Tracker" },
  { key: "volume-chart", label: "Volume Chart" },
  { key: "check-in", label: "Weekly Check-In" },
  { key: "strength-progression", label: "Strength Progression" },
  { key: "recent-activity", label: "Recent Activity" },
] as const;

export type DashboardCardKey = (typeof DEFAULT_DASHBOARD_CARDS)[number]["key"];

export interface DashboardLayoutSettings {
  order: string[];
  hidden: string[];
}

const defaultDashboardLayout: DashboardLayoutSettings = {
  order: DEFAULT_DASHBOARD_CARDS.map((card) => card.key),
  hidden: [],
};

let layoutCache:
  | { rawValue: string | null; settings: DashboardLayoutSettings }
  | null = null;

export function getDefaultDashboardLayout(): DashboardLayoutSettings {
  return defaultDashboardLayout;
}

export function normalizeDashboardLayout(
  settings: Partial<DashboardLayoutSettings> | null | undefined
): DashboardLayoutSettings {
  const defaults = getDefaultDashboardLayout();
  const validKeys = new Set(defaults.order);
  const order = [
    ...new Set([...(settings?.order ?? []), ...defaults.order]),
  ].filter((key) => validKeys.has(key));
  const hidden = [...new Set(settings?.hidden ?? [])].filter((key) =>
    validKeys.has(key)
  );

  return { order, hidden };
}

export function readDashboardLayout(): DashboardLayoutSettings {
  if (typeof window === "undefined") {
    return getDefaultDashboardLayout();
  }

  try {
    const saved = window.localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY);
    if (layoutCache?.rawValue === saved) {
      return layoutCache.settings;
    }

    const settings = normalizeDashboardLayout(saved ? JSON.parse(saved) : null);
    layoutCache = { rawValue: saved, settings };
    return settings;
  } catch {
    return getDefaultDashboardLayout();
  }
}

export function writeDashboardLayout(settings: DashboardLayoutSettings) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeDashboardLayout(settings);
  const rawValue = JSON.stringify(normalized);
  layoutCache = { rawValue, settings: normalized };
  window.localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, rawValue);
  window.dispatchEvent(new Event("alpha-gym-dashboard-layout"));
}
