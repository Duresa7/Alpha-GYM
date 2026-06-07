import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const workoutTemplates = sqliteTable("workout_templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  goalFocus: text("goal_focus"),
  estimatedDurationMin: integer("estimated_duration_min"),
  isArchived: integer("is_archived", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const workoutTemplateItems = sqliteTable("workout_template_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  templateId: integer("template_id")
    .notNull()
    .references(() => workoutTemplates.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull().default("exercise"),
  exerciseName: text("exercise_name").notNull(),
  instruction: text("instruction"),
  target: text("target"),
  section: text("section").notNull().default("strength"),
  groupLabel: text("group_label"),
  isRequired: integer("is_required", { mode: "boolean" }).notNull().default(true),
  orderIndex: integer("order_index").notNull(),
});

export const plannedWorkouts = sqliteTable("planned_workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  templateId: integer("template_id").references(() => workoutTemplates.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  missReason: text("miss_reason"),
  carriedFromDate: text("carried_from_date"),
  estimatedDurationMin: integer("estimated_duration_min"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const plannedWorkoutItems = sqliteTable("planned_workout_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  plannedWorkoutId: integer("planned_workout_id")
    .notNull()
    .references(() => plannedWorkouts.id, { onDelete: "cascade" }),
  templateItemId: integer("template_item_id").references(() => workoutTemplateItems.id, {
    onDelete: "set null",
  }),
  itemType: text("item_type").notNull().default("exercise"),
  exerciseName: text("exercise_name").notNull(),
  instruction: text("instruction"),
  target: text("target"),
  section: text("section").notNull().default("strength"),
  groupLabel: text("group_label"),
  isRequired: integer("is_required", { mode: "boolean" }).notNull().default(true),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  orderIndex: integer("order_index").notNull(),
});

export const workoutSessions = sqliteTable("workout_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  title: text("title"),
  workoutType: text("workout_type").notNull(),
  notes: text("notes"),
  plannedWorkoutId: integer("planned_workout_id").references(() => plannedWorkouts.id, {
    onDelete: "set null",
  }),
  sessionStatus: text("session_status").notNull().default("completed"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").references(() => workoutSessions.id, {
    onDelete: "set null",
  }),
  date: text("date").notNull(),
  exerciseName: text("exercise_name").notNull(),
  sets: integer("sets").notNull().default(1),
  weightLbs: real("weight_lbs").notNull(),
  reps: integer("reps").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const cardio = sqliteTable("cardio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").references(() => workoutSessions.id, {
    onDelete: "set null",
  }),
  date: text("date").notNull(),
  cardioType: text("cardio_type").notNull(),
  durationMin: integer("duration_min").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const weightLog = sqliteTable("weight_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").references(() => workoutSessions.id, {
    onDelete: "set null",
  }),
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
  trackingMode: text("tracking_mode").notNull().default("load"),
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

export const waterIntake = sqliteTable("water_intake", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  amountOz: real("amount_oz").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const weeklyCheckIns = sqliteTable("weekly_check_ins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  waistInches: real("waist_inches"),
  energyLevel: integer("energy_level"),
  stepCount: integer("step_count"),
  frontPhotoUrl: text("front_photo_url"),
  sidePhotoUrl: text("side_photo_url"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const userSettings = sqliteTable("user_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});
