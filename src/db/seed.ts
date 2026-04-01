import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { count, eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import {
  exerciseList,
  weeklyPlan,
  workoutTemplates,
  workoutTemplateItems,
} from "./schema";

const dbFileName = process.env.DB_FILE_NAME?.trim() || "./data/alpha-gym.db";
const dbPath = path.isAbsolute(dbFileName)
  ? dbFileName
  : path.resolve(process.cwd(), dbFileName);
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
const db = drizzle({ client: sqlite });

const exerciseSeeds = [
  { name: "Pushups", category: "calisthenics", trackingMode: "bodyweight", targetMuscles: "Chest, Triceps, Shoulders" },
  { name: "Plank", category: "calisthenics", trackingMode: "time", targetMuscles: "Core" },
  { name: "Side Plank", category: "calisthenics", trackingMode: "time", targetMuscles: "Obliques, Core" },
  { name: "Bench Leg Raises", category: "calisthenics", trackingMode: "bodyweight", targetMuscles: "Lower Abs" },
  { name: "Bodyweight Squats", category: "calisthenics", trackingMode: "bodyweight", targetMuscles: "Quads, Glutes" },
  { name: "Mountain Climbers", category: "calisthenics", trackingMode: "time", targetMuscles: "Full Body, Cardio" },
  { name: "Stationary Bike", category: "cardio", trackingMode: "time", targetMuscles: "Low Impact" },
  { name: "Treadmill", category: "cardio", trackingMode: "distance", targetMuscles: "Running/Walking" },
  { name: "Elliptical", category: "cardio", trackingMode: "time", targetMuscles: "Full Body" },
  { name: "Rowing Machine", category: "cardio", trackingMode: "distance", targetMuscles: "Back, Arms, Legs" },
  { name: "Jump Rope", category: "cardio", trackingMode: "time", targetMuscles: "Full Body Cardio" },
  { name: "Dumbbell Bench Press", category: "upper_body", trackingMode: "load", targetMuscles: "Chest, Triceps" },
  { name: "Incline Dumbbell Bench Press", category: "upper_body", trackingMode: "load", targetMuscles: "Upper Chest, Shoulders" },
  { name: "Dumbbell Shoulder Press", category: "upper_body", trackingMode: "load", targetMuscles: "Shoulders, Triceps" },
  { name: "Arnold Press", category: "upper_body", trackingMode: "load", targetMuscles: "Shoulders (all heads)" },
  { name: "One-Arm Dumbbell Row", category: "upper_body", trackingMode: "load", targetMuscles: "Back, Biceps" },
  { name: "Dumbbell Chest Flyes", category: "upper_body", trackingMode: "load", targetMuscles: "Chest" },
  { name: "Lateral Raises", category: "upper_body", trackingMode: "load", targetMuscles: "Side Delts" },
  { name: "Hammer Curls", category: "upper_body", trackingMode: "load", targetMuscles: "Biceps, Forearms" },
  { name: "Overhead Triceps Extension", category: "upper_body", trackingMode: "load", targetMuscles: "Triceps" },
  { name: "Dumbbell Thrusters", category: "upper_body", trackingMode: "load", targetMuscles: "Full Body (Shoulders, Legs, Core)" },
  { name: "Goblet Squat", category: "lower_body", trackingMode: "load", targetMuscles: "Quads, Glutes" },
  { name: "Romanian Deadlift", category: "lower_body", trackingMode: "load", targetMuscles: "Hamstrings, Glutes" },
  { name: "Dumbbell Deadlift", category: "lower_body", trackingMode: "load", targetMuscles: "Back, Hamstrings, Glutes" },
  { name: "Bulgarian Split Squat", category: "lower_body", trackingMode: "load", targetMuscles: "Quads, Glutes, Balance" },
  { name: "Walking Lunges", category: "lower_body", trackingMode: "load", targetMuscles: "Quads, Glutes, Hamstrings" },
  { name: "Hip Thrust", category: "lower_body", trackingMode: "load", targetMuscles: "Glutes, Hamstrings" },
  { name: "Standing Calf Raises", category: "lower_body", trackingMode: "load", targetMuscles: "Calves" },
] as const;

const legacyPlanSeeds = [
  { dayOfWeek: "monday", exerciseName: "Dumbbell Bench Press", setsReps: "4x10-12", section: "strength", orderIndex: 1 },
  { dayOfWeek: "monday", exerciseName: "One-Arm Dumbbell Row", setsReps: "4x10/side", section: "strength", orderIndex: 2 },
  { dayOfWeek: "monday", exerciseName: "Dumbbell Shoulder Press", setsReps: "3x10-12", section: "strength", orderIndex: 3 },
  { dayOfWeek: "monday", exerciseName: "Incline Dumbbell Bench Press", setsReps: "3x10", section: "strength", orderIndex: 4 },
  { dayOfWeek: "monday", exerciseName: "Lateral Raises", setsReps: "3x15", section: "strength", orderIndex: 5 },
  { dayOfWeek: "monday", exerciseName: "Plank", setsReps: "3x45 sec", section: "strength", orderIndex: 6 },
  { dayOfWeek: "monday", exerciseName: "Bike Intervals", setsReps: "30 min", section: "cardio", orderIndex: 7 },
  { dayOfWeek: "tuesday", exerciseName: "Goblet Squat", setsReps: "4x10-12", section: "strength", orderIndex: 1 },
  { dayOfWeek: "tuesday", exerciseName: "Romanian Deadlift", setsReps: "4x10", section: "strength", orderIndex: 2 },
  { dayOfWeek: "tuesday", exerciseName: "Bulgarian Split Squat", setsReps: "3x10/leg", section: "strength", orderIndex: 3 },
  { dayOfWeek: "tuesday", exerciseName: "Hip Thrust", setsReps: "3x12", section: "strength", orderIndex: 4 },
  { dayOfWeek: "tuesday", exerciseName: "Standing Calf Raises", setsReps: "4x15", section: "strength", orderIndex: 5 },
  { dayOfWeek: "tuesday", exerciseName: "Stationary Bike", setsReps: "45-60 min steady", section: "cardio", orderIndex: 6 },
  { dayOfWeek: "wednesday", exerciseName: "Dumbbell Thrusters", setsReps: "x12", section: "circuit", orderIndex: 1 },
  { dayOfWeek: "wednesday", exerciseName: "Pushups", setsReps: "x15", section: "circuit", orderIndex: 2 },
  { dayOfWeek: "wednesday", exerciseName: "One-Arm Dumbbell Row", setsReps: "x12", section: "circuit", orderIndex: 3 },
  { dayOfWeek: "wednesday", exerciseName: "Mountain Climbers", setsReps: "x40 sec", section: "circuit", orderIndex: 4 },
  { dayOfWeek: "wednesday", exerciseName: "Bench Leg Raises", setsReps: "3x15", section: "core", orderIndex: 5 },
  { dayOfWeek: "wednesday", exerciseName: "Side Plank", setsReps: "3x30 sec/side", section: "core", orderIndex: 6 },
  { dayOfWeek: "wednesday", exerciseName: "Stationary Bike", setsReps: "30 min light (optional)", section: "cardio", orderIndex: 7 },
  { dayOfWeek: "thursday", exerciseName: "Incline Dumbbell Bench Press", setsReps: "4x10", section: "strength", orderIndex: 1 },
  { dayOfWeek: "thursday", exerciseName: "One-Arm Dumbbell Row", setsReps: "4x10", section: "strength", orderIndex: 2 },
  { dayOfWeek: "thursday", exerciseName: "Dumbbell Chest Flyes", setsReps: "3x12", section: "strength", orderIndex: 3 },
  { dayOfWeek: "thursday", exerciseName: "Arnold Press", setsReps: "3x10", section: "strength", orderIndex: 4 },
  { dayOfWeek: "thursday", exerciseName: "Hammer Curls", setsReps: "3x12", section: "strength", orderIndex: 5 },
  { dayOfWeek: "thursday", exerciseName: "Overhead Triceps Extension", setsReps: "3x12", section: "strength", orderIndex: 6 },
  { dayOfWeek: "thursday", exerciseName: "Stationary Bike", setsReps: "45 min steady", section: "cardio", orderIndex: 7 },
  { dayOfWeek: "friday", exerciseName: "Goblet Squat", setsReps: "5x8-10 (heavier)", section: "strength", orderIndex: 1 },
  { dayOfWeek: "friday", exerciseName: "Dumbbell Deadlift", setsReps: "4x8-10", section: "strength", orderIndex: 2 },
  { dayOfWeek: "friday", exerciseName: "Walking Lunges", setsReps: "3x12/leg", section: "strength", orderIndex: 3 },
  { dayOfWeek: "friday", exerciseName: "Hip Thrust", setsReps: "3x10", section: "strength", orderIndex: 4 },
  { dayOfWeek: "friday", exerciseName: "Plank", setsReps: "3 rounds (variation)", section: "core", orderIndex: 5 },
  { dayOfWeek: "friday", exerciseName: "Bike Intervals", setsReps: "30 min", section: "cardio", orderIndex: 6 },
  { dayOfWeek: "saturday", exerciseName: "Stationary Bike", setsReps: "60-75 min steady", section: "cardio", orderIndex: 1 },
  { dayOfWeek: "saturday", exerciseName: "Pushups", setsReps: "x20", section: "circuit", orderIndex: 2 },
  { dayOfWeek: "saturday", exerciseName: "Bodyweight Squats", setsReps: "x20", section: "circuit", orderIndex: 3 },
  { dayOfWeek: "saturday", exerciseName: "One-Arm Dumbbell Row", setsReps: "x15", section: "circuit", orderIndex: 4 },
  { dayOfWeek: "sunday", exerciseName: "Brisk Walk / Easy Bike", setsReps: "45 min", section: "cardio", orderIndex: 1 },
  { dayOfWeek: "sunday", exerciseName: "Mobility / Stretching", setsReps: "20 min", section: "mobility", orderIndex: 2 },
] as const;

const templateSeeds = [
  {
    name: "Upper A",
    description: "Push-pull upper body day with intervals.",
    goalFocus: "Strength + cardio",
    estimatedDurationMin: 90,
    items: [
      { itemType: "exercise", exerciseName: "Dumbbell Bench Press", target: "4x10-12", section: "strength", isRequired: true },
      { itemType: "exercise", exerciseName: "One-Arm Dumbbell Row", target: "4x10/side", section: "strength", isRequired: true },
      { itemType: "exercise", exerciseName: "Dumbbell Shoulder Press", target: "3x10-12", section: "strength", isRequired: true },
      { itemType: "cardio", exerciseName: "Stationary Bike", target: "30 min intervals", section: "cardio", isRequired: true },
    ],
  },
  {
    name: "Lower A",
    description: "Lower-body strength plus steady cardio.",
    goalFocus: "Lower body + endurance",
    estimatedDurationMin: 100,
    items: [
      { itemType: "exercise", exerciseName: "Goblet Squat", target: "4x10-12", section: "strength", isRequired: true },
      { itemType: "exercise", exerciseName: "Romanian Deadlift", target: "4x10", section: "strength", isRequired: true },
      { itemType: "exercise", exerciseName: "Bulgarian Split Squat", target: "3x10/leg", section: "strength", isRequired: true },
      { itemType: "cardio", exerciseName: "Stationary Bike", target: "45 min steady", section: "cardio", isRequired: true },
    ],
  },
  {
    name: "Conditioning",
    description: "Circuit-focused calorie burner.",
    goalFocus: "Conditioning",
    estimatedDurationMin: 60,
    items: [
      { itemType: "exercise", exerciseName: "Dumbbell Thrusters", target: "3x12", section: "circuit", isRequired: true },
      { itemType: "exercise", exerciseName: "Pushups", target: "3x15", section: "circuit", isRequired: true },
      { itemType: "exercise", exerciseName: "Mountain Climbers", target: "3x40 sec", section: "circuit", isRequired: true },
      { itemType: "cardio", exerciseName: "Stationary Bike", target: "20 min easy", section: "cardio", isRequired: false },
    ],
  },
  {
    name: "Quick 30",
    description: "Short-session option for busy days.",
    goalFocus: "Consistency",
    estimatedDurationMin: 30,
    items: [
      { itemType: "exercise", exerciseName: "Pushups", target: "3 sets", section: "circuit", isRequired: true },
      { itemType: "exercise", exerciseName: "Bodyweight Squats", target: "3 sets", section: "circuit", isRequired: true },
      { itemType: "cardio", exerciseName: "Stationary Bike", target: "15 min", section: "cardio", isRequired: true },
    ],
  },
  {
    name: "Recovery",
    description: "Active recovery and mobility day.",
    goalFocus: "Recovery",
    estimatedDurationMin: 45,
    items: [
      { itemType: "cardio", exerciseName: "Brisk Walk / Easy Bike", target: "30-45 min", section: "cardio", isRequired: true },
      { itemType: "mobility", exerciseName: "Mobility / Stretching", target: "15-20 min", section: "mobility", isRequired: true },
    ],
  },
] as const;

async function seed() {
  const [exerciseCount] = await db.select({ count: count() }).from(exerciseList);
  if (exerciseCount.count === 0) {
    console.log("Seeding exercise list...");
  } else {
    console.log("Backfilling exercise metadata...");
  }

  for (const exercise of exerciseSeeds) {
    const existing = await db
      .select({ id: exerciseList.id })
      .from(exerciseList)
      .where(eq(exerciseList.name, exercise.name))
      .limit(1);

    if (existing[0]) {
      await db
        .update(exerciseList)
        .set({
          category: exercise.category,
          trackingMode: exercise.trackingMode,
          targetMuscles: exercise.targetMuscles,
        })
        .where(eq(exerciseList.id, existing[0].id));
    } else {
      await db.insert(exerciseList).values(exercise);
    }
  }

  const [weeklyPlanCount] = await db.select({ count: count() }).from(weeklyPlan);
  if (weeklyPlanCount.count === 0) {
    console.log("Seeding legacy weekly plan...");
    await db.insert(weeklyPlan).values([...legacyPlanSeeds]);
  }

  const [templateCount] = await db.select({ count: count() }).from(workoutTemplates);
  if (templateCount.count === 0) {
    console.log("Seeding workout templates...");
    for (const templateSeed of templateSeeds) {
      const [template] = await db
        .insert(workoutTemplates)
        .values({
          name: templateSeed.name,
          description: templateSeed.description,
          goalFocus: templateSeed.goalFocus,
          estimatedDurationMin: templateSeed.estimatedDurationMin,
        })
        .returning({ id: workoutTemplates.id });

      await db.insert(workoutTemplateItems).values(
        templateSeed.items.map((item, index) => ({
          templateId: template.id,
          itemType: item.itemType,
          exerciseName: item.exerciseName,
          target: item.target,
          section: item.section,
          isRequired: item.isRequired,
          orderIndex: index + 1,
        }))
      );
    }
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
