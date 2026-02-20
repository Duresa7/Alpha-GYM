import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { exerciseList, weeklyPlan } from "./schema";
import { count } from "drizzle-orm";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "data", "alpha-gym.db");
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite);

async function seed() {
  // Check if already seeded
  const [exerciseCount] = await db.select({ count: count() }).from(exerciseList);
  if (exerciseCount.count > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  console.log("Seeding exercise list...");

  // Calisthenics
  await db.insert(exerciseList).values([
    { name: "Pushups", category: "calisthenics", targetMuscles: "Chest, Triceps, Shoulders" },
    { name: "Plank", category: "calisthenics", targetMuscles: "Core" },
    { name: "Side Plank", category: "calisthenics", targetMuscles: "Obliques, Core" },
    { name: "Bench Leg Raises", category: "calisthenics", targetMuscles: "Lower Abs" },
    { name: "Bodyweight Squats", category: "calisthenics", targetMuscles: "Quads, Glutes" },
    { name: "Mountain Climbers", category: "calisthenics", targetMuscles: "Full Body, Cardio" },
  ]);

  // Cardio
  await db.insert(exerciseList).values([
    { name: "Stationary Bike", category: "cardio", targetMuscles: "Low Impact" },
    { name: "Treadmill", category: "cardio", targetMuscles: "Running/Walking" },
    { name: "Elliptical", category: "cardio", targetMuscles: "Full Body" },
    { name: "Rowing Machine", category: "cardio", targetMuscles: "Back, Arms, Legs" },
    { name: "Jump Rope", category: "cardio", targetMuscles: "Full Body Cardio" },
  ]);

  // Upper Body
  await db.insert(exerciseList).values([
    { name: "Dumbbell Bench Press", category: "upper_body", targetMuscles: "Chest, Triceps" },
    { name: "Incline Dumbbell Bench Press", category: "upper_body", targetMuscles: "Upper Chest, Shoulders" },
    { name: "Dumbbell Shoulder Press", category: "upper_body", targetMuscles: "Shoulders, Triceps" },
    { name: "Arnold Press", category: "upper_body", targetMuscles: "Shoulders (all heads)" },
    { name: "One-Arm Dumbbell Row", category: "upper_body", targetMuscles: "Back, Biceps" },
    { name: "Dumbbell Chest Flyes", category: "upper_body", targetMuscles: "Chest" },
    { name: "Lateral Raises", category: "upper_body", targetMuscles: "Side Delts" },
    { name: "Hammer Curls", category: "upper_body", targetMuscles: "Biceps, Forearms" },
    { name: "Overhead Triceps Extension", category: "upper_body", targetMuscles: "Triceps" },
    { name: "Dumbbell Thrusters", category: "upper_body", targetMuscles: "Full Body (Shoulders, Legs, Core)" },
  ]);

  // Lower Body
  await db.insert(exerciseList).values([
    { name: "Goblet Squat", category: "lower_body", targetMuscles: "Quads, Glutes" },
    { name: "Romanian Deadlift", category: "lower_body", targetMuscles: "Hamstrings, Glutes" },
    { name: "Dumbbell Deadlift", category: "lower_body", targetMuscles: "Back, Hamstrings, Glutes" },
    { name: "Bulgarian Split Squat", category: "lower_body", targetMuscles: "Quads, Glutes, Balance" },
    { name: "Walking Lunges", category: "lower_body", targetMuscles: "Quads, Glutes, Hamstrings" },
    { name: "Hip Thrust", category: "lower_body", targetMuscles: "Glutes, Hamstrings" },
    { name: "Standing Calf Raises", category: "lower_body", targetMuscles: "Calves" },
  ]);

  console.log("Seeding weekly plan...");

  // Monday - Upper A + Intervals
  await db.insert(weeklyPlan).values([
    { dayOfWeek: "monday", exerciseName: "Dumbbell Bench Press", setsReps: "4x10-12", section: "strength", orderIndex: 1 },
    { dayOfWeek: "monday", exerciseName: "One-Arm Dumbbell Row", setsReps: "4x10/side", section: "strength", orderIndex: 2 },
    { dayOfWeek: "monday", exerciseName: "Dumbbell Shoulder Press", setsReps: "3x10-12", section: "strength", orderIndex: 3 },
    { dayOfWeek: "monday", exerciseName: "Incline Dumbbell Bench Press", setsReps: "3x10", section: "strength", orderIndex: 4 },
    { dayOfWeek: "monday", exerciseName: "Lateral Raises", setsReps: "3x15", section: "strength", orderIndex: 5 },
    { dayOfWeek: "monday", exerciseName: "Plank", setsReps: "3x45 sec", section: "strength", orderIndex: 6 },
    { dayOfWeek: "monday", exerciseName: "Bike Intervals", setsReps: "30 min", section: "cardio", orderIndex: 7 },
  ]);

  // Tuesday - Lower A + Steady Cardio
  await db.insert(weeklyPlan).values([
    { dayOfWeek: "tuesday", exerciseName: "Goblet Squat", setsReps: "4x10-12", section: "strength", orderIndex: 1 },
    { dayOfWeek: "tuesday", exerciseName: "Romanian Deadlift", setsReps: "4x10", section: "strength", orderIndex: 2 },
    { dayOfWeek: "tuesday", exerciseName: "Bulgarian Split Squat", setsReps: "3x10/leg", section: "strength", orderIndex: 3 },
    { dayOfWeek: "tuesday", exerciseName: "Hip Thrust", setsReps: "3x12", section: "strength", orderIndex: 4 },
    { dayOfWeek: "tuesday", exerciseName: "Standing Calf Raises", setsReps: "4x15", section: "strength", orderIndex: 5 },
    { dayOfWeek: "tuesday", exerciseName: "Stationary Bike", setsReps: "45-60 min steady", section: "cardio", orderIndex: 6 },
  ]);

  // Wednesday - Conditioning + Core
  await db.insert(weeklyPlan).values([
    { dayOfWeek: "wednesday", exerciseName: "Dumbbell Thrusters", setsReps: "x12", section: "circuit", orderIndex: 1 },
    { dayOfWeek: "wednesday", exerciseName: "Pushups", setsReps: "x15", section: "circuit", orderIndex: 2 },
    { dayOfWeek: "wednesday", exerciseName: "One-Arm Dumbbell Row", setsReps: "x12", section: "circuit", orderIndex: 3 },
    { dayOfWeek: "wednesday", exerciseName: "Mountain Climbers", setsReps: "x40 sec", section: "circuit", orderIndex: 4 },
    { dayOfWeek: "wednesday", exerciseName: "Bench Leg Raises", setsReps: "3x15", section: "core", orderIndex: 5 },
    { dayOfWeek: "wednesday", exerciseName: "Side Plank", setsReps: "3x30 sec/side", section: "core", orderIndex: 6 },
    { dayOfWeek: "wednesday", exerciseName: "Stationary Bike", setsReps: "30 min light (optional)", section: "cardio", orderIndex: 7 },
  ]);

  // Thursday - Upper B + Steady Cardio
  await db.insert(weeklyPlan).values([
    { dayOfWeek: "thursday", exerciseName: "Incline Dumbbell Bench Press", setsReps: "4x10", section: "strength", orderIndex: 1 },
    { dayOfWeek: "thursday", exerciseName: "One-Arm Dumbbell Row", setsReps: "4x10", section: "strength", orderIndex: 2 },
    { dayOfWeek: "thursday", exerciseName: "Dumbbell Chest Flyes", setsReps: "3x12", section: "strength", orderIndex: 3 },
    { dayOfWeek: "thursday", exerciseName: "Arnold Press", setsReps: "3x10", section: "strength", orderIndex: 4 },
    { dayOfWeek: "thursday", exerciseName: "Hammer Curls", setsReps: "3x12", section: "strength", orderIndex: 5 },
    { dayOfWeek: "thursday", exerciseName: "Overhead Triceps Extension", setsReps: "3x12", section: "strength", orderIndex: 6 },
    { dayOfWeek: "thursday", exerciseName: "Stationary Bike", setsReps: "45 min steady", section: "cardio", orderIndex: 7 },
  ]);

  // Friday - Lower B + Intervals
  await db.insert(weeklyPlan).values([
    { dayOfWeek: "friday", exerciseName: "Goblet Squat", setsReps: "5x8-10 (heavier)", section: "strength", orderIndex: 1 },
    { dayOfWeek: "friday", exerciseName: "Dumbbell Deadlift", setsReps: "4x8-10", section: "strength", orderIndex: 2 },
    { dayOfWeek: "friday", exerciseName: "Walking Lunges", setsReps: "3x12/leg", section: "strength", orderIndex: 3 },
    { dayOfWeek: "friday", exerciseName: "Hip Thrust", setsReps: "3x10", section: "strength", orderIndex: 4 },
    { dayOfWeek: "friday", exerciseName: "Plank", setsReps: "3 rounds (variation)", section: "core", orderIndex: 5 },
    { dayOfWeek: "friday", exerciseName: "Bike Intervals", setsReps: "30 min", section: "cardio", orderIndex: 6 },
  ]);

  // Saturday - Long Burn
  await db.insert(weeklyPlan).values([
    { dayOfWeek: "saturday", exerciseName: "Stationary Bike", setsReps: "60-75 min steady", section: "cardio", orderIndex: 1 },
    { dayOfWeek: "saturday", exerciseName: "Pushups", setsReps: "x20", section: "circuit", orderIndex: 2 },
    { dayOfWeek: "saturday", exerciseName: "Bodyweight Squats", setsReps: "x20", section: "circuit", orderIndex: 3 },
    { dayOfWeek: "saturday", exerciseName: "One-Arm Dumbbell Row", setsReps: "x15", section: "circuit", orderIndex: 4 },
  ]);

  // Sunday - Active Recovery
  await db.insert(weeklyPlan).values([
    { dayOfWeek: "sunday", exerciseName: "Brisk Walk / Easy Bike", setsReps: "45 min", section: "cardio", orderIndex: 1 },
    { dayOfWeek: "sunday", exerciseName: "Mobility / Stretching", setsReps: "20 min", section: "mobility", orderIndex: 2 },
  ]);

  console.log("Seed complete!");
}

seed().catch(console.error);
