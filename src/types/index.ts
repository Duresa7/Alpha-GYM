export interface WeightTrendPoint {
  date: string;
  weightLbs: number;
}

export interface VolumeTrendPoint {
  date: string;
  totalVolume: number;
}

export interface RecentActivityEntry {
  date: string;
  workoutType: string;
  notes: string | null;
}

export interface ExerciseLogEntry {
  id: number;
  date: string;
  exerciseName: string;
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
