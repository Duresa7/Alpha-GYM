export const workoutTypes = [
  "exercise_only",
  "cardio_only",
  "both",
  "weight_only",
  "rest_day",
] as const;

export const planCompletionModes = [
  "completed",
  "partial",
  "unplanned",
] as const;

export const exerciseTrackingModes = [
  "load",
  "bodyweight",
  "time",
  "distance",
] as const;

export const plannedWorkoutStatuses = [
  "pending",
  "completed",
  "partial",
  "skipped",
  "carried_forward",
] as const;

export const workoutSessionStatuses = [
  "completed",
  "partial",
  "unplanned",
] as const;

export const goalSettingKeys = {
  goalWeight: "goalWeight",
  waterGoalOz: "waterGoalOz",
  weeklyWorkoutTarget: "weeklyWorkoutTarget",
  weeklyCardioMinutesTarget: "weeklyCardioMinutesTarget",
  weeklyWeighInTarget: "weeklyWeighInTarget",
  dailyStepTarget: "dailyStepTarget",
} as const;

export const WORKOUT_TYPE_VALUES = workoutTypes;
export const PLAN_COMPLETION_MODE_VALUES = planCompletionModes;
export const EXERCISE_TRACKING_MODE_VALUES = exerciseTrackingModes;
export const PLANNED_WORKOUT_STATUS_VALUES = plannedWorkoutStatuses;
export const WORKOUT_SESSION_STATUS_VALUES = workoutSessionStatuses;
export const GOAL_SETTING_KEYS = goalSettingKeys;
export const SETTINGS_REVALIDATE_PATHS = ["/", "/settings"] as const;
export const WORKOUT_REVALIDATE_PATHS = ["/", "/history", "/log", "/plan"] as const;
export const DASHBOARD_REVALIDATE_PATHS = WORKOUT_REVALIDATE_PATHS;

export type WorkoutType = (typeof workoutTypes)[number];
export type PlanCompletionMode = (typeof planCompletionModes)[number];
export type ExerciseTrackingMode = (typeof exerciseTrackingModes)[number];
export type PlannedWorkoutStatus = (typeof plannedWorkoutStatuses)[number];
export type WorkoutSessionStatus = (typeof workoutSessionStatuses)[number];
export type GoalSettingKey = (typeof goalSettingKeys)[keyof typeof goalSettingKeys];
