import {
  EXERCISE_TRACKING_MODE_VALUES,
  GOAL_SETTING_KEYS,
  PLAN_COMPLETION_MODE_VALUES,
  PLANNED_WORKOUT_STATUS_VALUES,
  WORKOUT_TYPE_VALUES,
} from "@/lib/domain";

export const WORKOUT_TYPES = [
  { value: "exercise_only", label: "Exercise Only" },
  { value: "cardio_only", label: "Cardio Only" },
  { value: "both", label: "Both" },
  { value: "weight_only", label: "Weigh-In Only" },
  { value: "rest_day", label: "Rest Day" },
] as const satisfies ReadonlyArray<{
  value: (typeof WORKOUT_TYPE_VALUES)[number];
  label: string;
}>;

export const PLAN_COMPLETION_MODES = [
  { value: "completed", label: "Complete as Planned" },
  { value: "partial", label: "Complete with Changes" },
  { value: "unplanned", label: "Free Workout" },
] as const satisfies ReadonlyArray<{
  value: (typeof PLAN_COMPLETION_MODE_VALUES)[number];
  label: string;
}>;

export const PLANNED_WORKOUT_STATUSES = PLANNED_WORKOUT_STATUS_VALUES;

export const EXERCISE_TRACKING_MODES = [
  { value: "load", label: "Load-Based" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "time", label: "Time-Based" },
  { value: "distance", label: "Distance-Based" },
] as const satisfies ReadonlyArray<{
  value: (typeof EXERCISE_TRACKING_MODE_VALUES)[number];
  label: string;
}>;

export const SKIP_REASONS = [
  "Schedule conflict",
  "Low energy",
  "Sore / recovery",
  "Travel",
  "Motivation dip",
] as const;

export const ENERGY_LEVELS = [
  { value: 1, label: "1 - Rough" },
  { value: 2, label: "2 - Low" },
  { value: 3, label: "3 - Average" },
  { value: 4, label: "4 - Good" },
  { value: 5, label: "5 - Great" },
] as const;

export const EXERCISE_CATEGORIES = [
  {
    value: "calisthenics",
    label: "Calisthenics",
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    value: "cardio",
    label: "Cardio",
    badgeClass: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    value: "upper_body",
    label: "Upper Body",
    badgeClass: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    value: "lower_body",
    label: "Lower Body",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
] as const;

export const EXERCISE_CATEGORY_LABELS = Object.fromEntries(
  EXERCISE_CATEGORIES.map(({ value, label }) => [value, label])
) as Record<string, string>;

export const EXERCISE_CATEGORY_BADGE_CLASSES = Object.fromEntries(
  EXERCISE_CATEGORIES.map(({ value, badgeClass }) => [value, badgeClass])
) as Record<string, string>;

export const DAY_LABELS: Record<string, { label: string; focus: string; duration: string }> = {
  monday: { label: "Monday", focus: "Upper A + Intervals", duration: "~90 min" },
  tuesday: { label: "Tuesday", focus: "Lower A + Steady Cardio", duration: "~105 min" },
  wednesday: { label: "Wednesday", focus: "Conditioning + Core", duration: "~60 min" },
  thursday: { label: "Thursday", focus: "Upper B + Steady Cardio", duration: "~105 min" },
  friday: { label: "Friday", focus: "Lower B + Intervals", duration: "~90 min" },
  saturday: { label: "Saturday", focus: "Long Burn", duration: "~90 min" },
  sunday: { label: "Sunday", focus: "Active Recovery", duration: "~65 min" },
};

export const SECTION_COLORS: Record<string, string> = {
  strength: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  cardio: "bg-green-500/20 text-green-400 border-green-500/30",
  core: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  circuit: "bg-red-500/20 text-red-400 border-red-500/30",
  mobility: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export const MAX_EXERCISES = 10;
export const MAX_CARDIO_ENTRIES = 5;
export const MAX_TEMPLATE_ITEMS = 12;

export const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DEFAULT_GOAL_KEYS = GOAL_SETTING_KEYS;
