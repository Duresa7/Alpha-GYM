export interface PlateInventoryItem {
  weight: number;
  pairs: number;
}

export interface PlateBreakdownItem {
  weight: number;
  countPerSide: number;
}

export interface PlateBreakdown {
  targetWeight: number;
  barWeight: number;
  loadedWeight: number;
  perSideTarget: number;
  remainder: number;
  isExact: boolean;
  plates: PlateBreakdownItem[];
}

export const DEFAULT_BAR_WEIGHT = 45;

export const DEFAULT_PLATE_INVENTORY: PlateInventoryItem[] = [
  { weight: 45, pairs: 4 },
  { weight: 35, pairs: 1 },
  { weight: 25, pairs: 2 },
  { weight: 10, pairs: 2 },
  { weight: 5, pairs: 2 },
  { weight: 2.5, pairs: 2 },
];

export function normalizePlateInventory(
  inventory: PlateInventoryItem[]
): PlateInventoryItem[] {
  return inventory
    .filter((item) => Number.isFinite(item.weight) && item.weight > 0)
    .map((item) => ({
      weight: Math.round(item.weight * 10) / 10,
      pairs: Math.max(0, Math.floor(item.pairs)),
    }))
    .sort((a, b) => b.weight - a.weight);
}

export function calculatePlateBreakdown(
  targetWeight: number,
  barWeight: number = DEFAULT_BAR_WEIGHT,
  inventory: PlateInventoryItem[] = DEFAULT_PLATE_INVENTORY
): PlateBreakdown {
  const normalizedInventory = normalizePlateInventory(inventory);
  const perSideTarget = Math.max(0, (targetWeight - barWeight) / 2);
  let remaining = perSideTarget;
  const plates: PlateBreakdownItem[] = [];

  for (const plate of normalizedInventory) {
    const countPerSide = Math.min(
      plate.pairs,
      Math.floor((remaining + 0.0001) / plate.weight)
    );

    if (countPerSide <= 0) {
      continue;
    }

    plates.push({ weight: plate.weight, countPerSide });
    remaining = Math.round((remaining - countPerSide * plate.weight) * 10) / 10;
  }

  const loadedPerSide = plates.reduce(
    (sum, plate) => sum + plate.weight * plate.countPerSide,
    0
  );
  const loadedWeight = Math.round((barWeight + loadedPerSide * 2) * 10) / 10;
  const remainder = Math.round((targetWeight - loadedWeight) * 10) / 10;

  return {
    targetWeight,
    barWeight,
    loadedWeight,
    perSideTarget: Math.round(perSideTarget * 10) / 10,
    remainder,
    isExact: Math.abs(remainder) < 0.01,
    plates,
  };
}
