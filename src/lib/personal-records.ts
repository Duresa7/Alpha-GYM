import type { NewPersonalRecord, PersonalRecord } from "@/types";

export interface LiftRecordEntry {
  date: string;
  exerciseName: string;
  sets: number;
  weightLbs: number;
  reps: number;
}

function roundOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

export function estimateOneRepMax(weightLbs: number, reps: number) {
  if (reps <= 1) {
    return roundOneDecimal(weightLbs);
  }

  return roundOneDecimal(weightLbs * (1 + reps / 30));
}

export function calculateSetVolume(entry: LiftRecordEntry) {
  return roundOneDecimal(entry.sets * entry.weightLbs * entry.reps);
}

export function buildPersonalRecords(
  entries: LiftRecordEntry[]
): PersonalRecord[] {
  const records = new Map<string, PersonalRecord>();

  for (const entry of entries) {
    const e1rm = estimateOneRepMax(entry.weightLbs, entry.reps);
    const volume = calculateSetVolume(entry);
    const current = records.get(entry.exerciseName);

    if (!current) {
      records.set(entry.exerciseName, {
        exerciseName: entry.exerciseName,
        bestWeight: entry.weightLbs,
        bestWeightDate: entry.date,
        bestEstimatedOneRepMax: e1rm,
        bestEstimatedOneRepMaxDate: entry.date,
        bestVolume: volume,
        bestVolumeDate: entry.date,
      });
      continue;
    }

    if (entry.weightLbs > current.bestWeight) {
      current.bestWeight = entry.weightLbs;
      current.bestWeightDate = entry.date;
    }

    if (e1rm > current.bestEstimatedOneRepMax) {
      current.bestEstimatedOneRepMax = e1rm;
      current.bestEstimatedOneRepMaxDate = entry.date;
    }

    if (volume > current.bestVolume) {
      current.bestVolume = volume;
      current.bestVolumeDate = entry.date;
    }
  }

  return [...records.values()].sort((a, b) =>
    a.exerciseName.localeCompare(b.exerciseName)
  );
}

export function findNewPersonalRecords(
  existingEntries: LiftRecordEntry[],
  candidateEntries: LiftRecordEntry[]
): NewPersonalRecord[] {
  const records = new Map(
    buildPersonalRecords(existingEntries).map((record) => [
      record.exerciseName,
      record,
    ])
  );
  const newRecords: NewPersonalRecord[] = [];

  for (const entry of candidateEntries) {
    const current = records.get(entry.exerciseName);
    const e1rm = estimateOneRepMax(entry.weightLbs, entry.reps);
    const volume = calculateSetVolume(entry);

    if (!current || entry.weightLbs > current.bestWeight) {
      newRecords.push({
        exerciseName: entry.exerciseName,
        recordType: "weight",
        previousBest: current?.bestWeight ?? null,
        newBest: roundOneDecimal(entry.weightLbs),
      });
    }

    if (!current || e1rm > current.bestEstimatedOneRepMax) {
      newRecords.push({
        exerciseName: entry.exerciseName,
        recordType: "estimated_1rm",
        previousBest: current?.bestEstimatedOneRepMax ?? null,
        newBest: e1rm,
      });
    }

    if (!current || volume > current.bestVolume) {
      newRecords.push({
        exerciseName: entry.exerciseName,
        recordType: "volume",
        previousBest: current?.bestVolume ?? null,
        newBest: volume,
      });
    }

    records.set(entry.exerciseName, {
      exerciseName: entry.exerciseName,
      bestWeight:
        current && current.bestWeight > entry.weightLbs
          ? current.bestWeight
          : roundOneDecimal(entry.weightLbs),
      bestWeightDate:
        current && current.bestWeight > entry.weightLbs
          ? current.bestWeightDate
          : entry.date,
      bestEstimatedOneRepMax:
        current && current.bestEstimatedOneRepMax > e1rm
          ? current.bestEstimatedOneRepMax
          : e1rm,
      bestEstimatedOneRepMaxDate:
        current && current.bestEstimatedOneRepMax > e1rm
          ? current.bestEstimatedOneRepMaxDate
          : entry.date,
      bestVolume:
        current && current.bestVolume > volume ? current.bestVolume : volume,
      bestVolumeDate:
        current && current.bestVolume > volume
          ? current.bestVolumeDate
          : entry.date,
    });
  }

  return newRecords;
}
