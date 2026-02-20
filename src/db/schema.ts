import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  exerciseName: text("exercise_name").notNull(),
  weightLbs: real("weight_lbs").notNull(),
  reps: integer("reps").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const cardio = sqliteTable("cardio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  cardioType: text("cardio_type").notNull(),
  durationMin: integer("duration_min").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const weightLog = sqliteTable("weight_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  weightLbs: real("weight_lbs").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const workoutNotes = sqliteTable("workout_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  workoutType: text("workout_type").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const exerciseList = sqliteTable("exercise_list", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  targetMuscles: text("target_muscles"),
});

export const weeklyPlan = sqliteTable("weekly_plan", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dayOfWeek: text("day_of_week").notNull(),
  exerciseName: text("exercise_name").notNull(),
  setsReps: text("sets_reps"),
  section: text("section").notNull(),
  orderIndex: integer("order_index").notNull(),
});
