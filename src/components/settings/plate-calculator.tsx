"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  calculatePlateBreakdown,
  DEFAULT_BAR_WEIGHT,
  DEFAULT_PLATE_INVENTORY,
  normalizePlateInventory,
  type PlateInventoryItem,
} from "@/lib/plates";

const PLATE_SETTINGS_KEY = "alpha-gym-plate-settings";
const PLATE_SETTINGS_EVENT = "alpha-gym-plate-settings";

interface PlateSettings {
  barWeight: number;
  inventory: PlateInventoryItem[];
}

const defaultPlateSettings: PlateSettings = {
  barWeight: DEFAULT_BAR_WEIGHT,
  inventory: DEFAULT_PLATE_INVENTORY,
};

let plateSettingsCache: { rawValue: string | null; settings: PlateSettings } | null =
  null;

function getDefaultPlateSettings(): PlateSettings {
  return defaultPlateSettings;
}

function readPlateSettings(): PlateSettings {
  if (typeof window === "undefined") {
    return getDefaultPlateSettings();
  }

  try {
    const saved = window.localStorage.getItem(PLATE_SETTINGS_KEY);
    if (plateSettingsCache?.rawValue === saved) {
      return plateSettingsCache.settings;
    }

    if (!saved) {
      plateSettingsCache = { rawValue: saved, settings: getDefaultPlateSettings() };
      return plateSettingsCache.settings;
    }

    const parsed = JSON.parse(saved) as Partial<PlateSettings>;
    const settings = {
      barWeight: Number(parsed.barWeight) || DEFAULT_BAR_WEIGHT,
      inventory: normalizePlateInventory(
        parsed.inventory?.length ? parsed.inventory : DEFAULT_PLATE_INVENTORY
      ),
    };
    plateSettingsCache = { rawValue: saved, settings };
    return settings;
  } catch {
    return getDefaultPlateSettings();
  }
}

function writePlateSettings(settings: PlateSettings) {
  const rawValue = JSON.stringify(settings);
  plateSettingsCache = { rawValue, settings };
  window.localStorage.setItem(PLATE_SETTINGS_KEY, rawValue);
  window.dispatchEvent(new Event(PLATE_SETTINGS_EVENT));
}

function subscribePlateSettings(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PLATE_SETTINGS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PLATE_SETTINGS_EVENT, onStoreChange);
  };
}

export function PlateCalculator() {
  const settings = useSyncExternalStore(
    subscribePlateSettings,
    readPlateSettings,
    getDefaultPlateSettings
  );
  const [targetWeight, setTargetWeight] = useState("225");

  const breakdown = useMemo(
    () =>
      calculatePlateBreakdown(
        Number(targetWeight) || settings.barWeight,
        settings.barWeight,
        settings.inventory
      ),
    [settings.barWeight, settings.inventory, targetWeight]
  );

  function updatePlate(index: number, patch: Partial<PlateInventoryItem>) {
    writePlateSettings({
      ...settings,
      inventory: normalizePlateInventory(
        settings.inventory.map((plate, plateIndex) =>
          plateIndex === index ? { ...plate, ...patch } : plate
        )
      ),
    });
  }

  return (
    <Card className="app-surface overflow-visible">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-3 font-[family-name:var(--font-barlow-condensed)] text-xl">
          <Calculator className="h-5 w-5 text-primary" />
          Plate Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Target Weight
            </label>
            <Input
              type="number"
              step="0.5"
              value={targetWeight}
              onChange={(event) => setTargetWeight(event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Bar Weight
            </label>
            <Input
              type="number"
              step="0.5"
              value={settings.barWeight}
              onChange={(event) =>
                writePlateSettings({
                  ...settings,
                  barWeight: Number(event.target.value) || DEFAULT_BAR_WEIGHT,
                })
              }
            />
          </div>
        </div>

        <div className="flat-tile">
          <p className="metric-label">Load Per Side</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {breakdown.plates.length ? (
              breakdown.plates.map((plate) => (
                <span
                  key={plate.weight}
                  className="rounded-md border border-primary/35 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"
                >
                  {plate.countPerSide} x {plate.weight}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Empty bar</span>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Loaded: {breakdown.loadedWeight} lbs
            {breakdown.isExact ? "" : ` (${Math.abs(breakdown.remainder)} lbs short)`}
          </p>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="metric-label">Plate Inventory (Pairs)</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => writePlateSettings(getDefaultPlateSettings())}
              className="cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {settings.inventory.map((plate, index) => (
              <div
                key={plate.weight}
                className="grid grid-cols-[1fr_88px] items-end gap-2 rounded-md border border-border bg-secondary p-3"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {plate.weight} lb
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={plate.weight}
                    onChange={(event) =>
                      updatePlate(index, { weight: Number(event.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Pairs</label>
                  <Input
                    type="number"
                    value={plate.pairs}
                    onChange={(event) =>
                      updatePlate(index, { pairs: Number(event.target.value) })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
