import type {
  ExerciseTrackingMode,
  PlannedWorkoutStatus,
  WorkoutSessionStatus,
  WorkoutType,
} from "@/lib/domain";

export type {
  ExerciseTrackingMode,
  PlannedWorkoutStatus,
  WorkoutSessionStatus,
  WorkoutType,
} from "@/lib/domain";

export interface WeightTrendPoint {
  date: string;
  weightLbs: number;
  rollingAvgWeight?: number;
}

export interface VolumeTrendPoint {
  date: string;
  totalVolume: number;
}

export interface RecentActivityEntry {
  id: number;
  date: string;
  workoutType: WorkoutType;
  notes: string | null;
  title?: string | null;
  sessionStatus?: WorkoutSessionStatus;
  plannedWorkoutId?: number | null;
}

export interface ExerciseLogEntry {
  id: number;
  sessionId: number | null;
  date: string;
  exerciseName: string;
  sets: number;
  weightLbs: number;
  reps: number;
}

export interface CardioLogEntry {
  id: number;
  sessionId: number | null;
  date: string;
  cardioType: string;
  durationMin: number;
}

export interface WeightLogEntry {
  id: number;
  sessionId: number | null;
  date: string;
  weightLbs: number;
}

export interface ExerciseListItem {
  id: number;
  name: string;
  category: string;
  trackingMode: ExerciseTrackingMode;
  targetMuscles: string | null;
}

export interface WeeklyPlanItem {
  id: number;
  dayOfWeek: string;
  exerciseName: string;
  setsReps: string | null;
  section: string;
  orderIndex: number;
}

export interface DashboardStats {
  totalExerciseEntries: number;
  totalCardioEntries: number;
  totalCardioMinutes: number;
  totalSessions: number;
  currentWeight: number | null;
  startingWeight: number | null;
  weightChange: number | null;
  plannedThisWeek: number;
  completedThisWeek: number;
  completionRate: number;
  currentStreak: number;
  daysSinceLastWeighIn: number | null;
}

export interface StrengthProgressionPoint {
  date: string;
  exerciseName: string;
  weightLbs: number;
  weightChange: number | null;
  percentChange: number | null;
  runningAvgChange: number | null;
}

export interface WorkoutTemplateItem {
  id: number;
  templateId: number;
  itemType: "exercise" | "cardio" | "mobility";
  exerciseName: string;
  instruction: string | null;
  target: string | null;
  section: string;
  isRequired: boolean;
  orderIndex: number;
}

export interface WorkoutTemplate {
  id: number;
  name: string;
  description: string | null;
  goalFocus: string | null;
  estimatedDurationMin: number | null;
  isArchived: boolean;
  items: WorkoutTemplateItem[];
}

export interface PlannedWorkoutItem {
  id: number;
  plannedWorkoutId: number;
  templateItemId: number | null;
  itemType: "exercise" | "cardio" | "mobility";
  exerciseName: string;
  instruction: string | null;
  target: string | null;
  section: string;
  isRequired: boolean;
  completed: boolean;
  orderIndex: number;
}

export interface PlannedWorkout {
  id: number;
  date: string;
  templateId: number | null;
  title: string;
  notes: string | null;
  status: PlannedWorkoutStatus;
  missReason: string | null;
  carriedFromDate: string | null;
  estimatedDurationMin: number | null;
  items: PlannedWorkoutItem[];
}

export interface AdherenceSummary {
  plannedThisWeek: number;
  completedThisWeek: number;
  skippedThisWeek: number;
  carriedForwardThisWeek: number;
  completionRate: number;
  currentStreak: number;
}

export interface TodayFocusData {
  workout: PlannedWorkout | null;
  carriedForward: PlannedWorkout[];
  weeklySummary: AdherenceSummary;
}

export interface WeightLossLevel {
  level: number;
  title: string;
  currentXP: number;
  xpForNextLevel: number;
  totalXP: number;
  progressPercent: number;
}

export interface WeightGoalStatus {
  goalWeight: number | null;
  currentWeight: number | null;
  startWeight: number | null;
  lostSoFar: number;
  remaining: number;
  progressPercent: number;
  rollingAverage: number | null;
  weeklyLossRate: number | null;
  forecastDaysToGoal: number | null;
}

export interface WaterIntakeEntry {
  id: number;
  date: string;
  amountOz: number;
}

export interface WaterIntakeStatus {
  todayTotal: number;
  goalOz: number | null;
  progressPercent: number;
  weeklyData: { date: string; totalOz: number }[];
}

export interface WeeklyCheckIn {
  id: number;
  date: string;
  waistInches: number | null;
  energyLevel: number | null;
  stepCount: number | null;
  frontPhotoUrl: string | null;
  sidePhotoUrl: string | null;
  notes: string | null;
}

export interface WeeklyCheckInInsight {
  latest: WeeklyCheckIn | null;
  count: number;
}

export interface UserGoalSettings {
  goalWeight: number | null;
  waterGoalOz: number | null;
  weeklyWorkoutTarget: number | null;
  weeklyCardioMinutesTarget: number | null;
  weeklyWeighInTarget: number | null;
  dailyStepTarget: number | null;
}
