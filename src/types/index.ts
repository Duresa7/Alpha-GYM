export interface WeightTrendPoint {
  date: string;
  weightLbs: number;
}

export interface VolumeTrendPoint {
  date: string;
  totalVolume: number;
}

export interface RecentActivityEntry {
  id: number;
  date: string;
  workoutType: string;
  notes: string | null;
}

export interface ExerciseLogEntry {
  id: number;
  date: string;
  exerciseName: string;
  sets: number;
  weightLbs: number;
  reps: number;
}

export interface CardioLogEntry {
  id: number;
  date: string;
  cardioType: string;
  durationMin: number;
}

export interface WeightLogEntry {
  id: number;
  date: string;
  weightLbs: number;
}

export interface ExerciseListItem {
  id: number;
  name: string;
  category: string;
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
  totalExercises: number;
  totalCardioSessions: number;
  totalCardioMinutes: number;
  currentWeight: number | null;
  startingWeight: number | null;
  weightChange: number | null;
}

export interface WeightProgressionPoint {
  date: string;
  exerciseName: string;
  weightLbs: number;
  weightChange: number | null;
  percentChange: number | null;
  runningAvgChange: number | null;
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
}
