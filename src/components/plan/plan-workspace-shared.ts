import { SECTION_COLORS } from "@/lib/constants";
import type { PlannedWorkoutStatus } from "@/types";

export interface TemplateDraftItem {
  itemType: "exercise" | "cardio" | "mobility";
  exerciseName: string;
  instruction: string;
  target: string;
  section: keyof typeof SECTION_COLORS;
  groupLabel: string;
  isRequired: boolean;
}

export const statusTone: Record<PlannedWorkoutStatus, string> = {
  pending: "bg-secondary text-muted-foreground border-border",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  partial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  skipped: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  carried_forward: "bg-sky-500/10 text-sky-600 border-sky-500/20",
};

export const templateSectionOptions = Object.keys(
  SECTION_COLORS
) as (keyof typeof SECTION_COLORS)[];

export function emptyDraftItem(): TemplateDraftItem {
  return {
    itemType: "exercise",
    exerciseName: "",
    instruction: "",
    target: "",
    section: "strength",
    groupLabel: "",
    isRequired: true,
  };
}
