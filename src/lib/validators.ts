import { z } from "zod";
import {
  EXERCISE_TRACKING_MODE_VALUES,
  PLAN_COMPLETION_MODE_VALUES,
  WORKOUT_TYPE_VALUES,
} from "@/lib/domain";

export const workoutTypeEnum = z.enum(WORKOUT_TYPE_VALUES);

export const planCompletionModeEnum = z.enum(PLAN_COMPLETION_MODE_VALUES);

export const trackingModeEnum = z.enum(EXERCISE_TRACKING_MODE_VALUES);

const optionalWeightSchema = z.number().min(0, "Weight must be positive").optional();

const optionalSetsSchema = z
  .number()
  .int("Sets must be a whole number")
  .min(1, "Sets must be at least 1")
  .optional();

const optionalRepsSchema = z
  .number()
  .int("Reps must be a whole number")
  .min(1, "Reps must be at least 1")
  .optional();

const optionalDurationSchema = z
  .number()
  .int("Duration must be a whole number")
  .min(1, "Duration must be at least 1 minute")
  .optional();

export const exerciseEntrySchema = z
  .object({
    exerciseName: z.string().trim().optional(),
    weightLbs: optionalWeightSchema,
    sets: optionalSetsSchema,
    reps: optionalRepsSchema,
  })
  .superRefine((entry, ctx) => {
    const hasAnyValue =
      Boolean(entry.exerciseName) ||
      entry.weightLbs !== undefined ||
      entry.sets !== undefined ||
      entry.reps !== undefined;

    if (!hasAnyValue) {
      return;
    }

    if (!entry.exerciseName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["exerciseName"],
        message: "Exercise is required",
      });
    }

    if (entry.weightLbs === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weightLbs"],
        message: "Weight is required",
      });
    }

    if (entry.sets === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sets"],
        message: "Sets are required",
      });
    }

    if (entry.reps === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reps"],
        message: "Reps are required",
      });
    }
  });

export const cardioEntrySchema = z
  .object({
    cardioType: z.string().trim().optional(),
    durationMin: optionalDurationSchema,
  })
  .superRefine((entry, ctx) => {
    const hasAnyValue =
      Boolean(entry.cardioType) || entry.durationMin !== undefined;

    if (!hasAnyValue) {
      return;
    }

    if (!entry.cardioType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardioType"],
        message: "Cardio type is required",
      });
    }

    if (entry.durationMin === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["durationMin"],
        message: "Duration is required",
      });
    }
  });

const optionalBodyWeightSchema = z
  .number()
  .min(0, "Body weight must be positive")
  .optional();

export const quickEntryFormSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    sessionTitle: z.string().trim().max(80).optional(),
    plannedWorkoutId: z.number().int().positive().optional(),
    planCompletionMode: planCompletionModeEnum,
    workoutType: workoutTypeEnum,
    bodyWeight: optionalBodyWeightSchema,
    exercises: z.array(exerciseEntrySchema),
    cardioEntries: z.array(cardioEntrySchema),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasExerciseEntry = data.exercises.some(
      (entry) =>
        Boolean(entry.exerciseName) &&
        entry.weightLbs !== undefined &&
        entry.reps !== undefined
    );
    const hasCardioEntry = data.cardioEntries.some(
      (entry) =>
        Boolean(entry.cardioType) && entry.durationMin !== undefined
    );

    if (
      (data.workoutType === "exercise_only" || data.workoutType === "both") &&
      !hasExerciseEntry
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["exercises"],
        message: "Add at least one complete exercise entry.",
      });
    }

    if (
      (data.workoutType === "cardio_only" || data.workoutType === "both") &&
      !hasCardioEntry
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardioEntries"],
        message: "Add at least one complete cardio entry.",
      });
    }

    if (data.workoutType === "weight_only" && data.bodyWeight === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bodyWeight"],
        message: "Body weight is required for weigh-in.",
      });
    }

    if (data.plannedWorkoutId && data.planCompletionMode === "unplanned") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["planCompletionMode"],
        message: "Choose how this planned workout should be completed.",
      });
    }
  });

export const weeklyCheckInSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  waistInches: z.number().min(0, "Waist must be positive").optional(),
  energyLevel: z.number().int().min(1).max(5).optional(),
  stepCount: z.number().int().min(0, "Steps must be positive").optional(),
  frontPhotoUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  sidePhotoUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  notes: z.string().trim().max(500).optional(),
});

const optionalGoalSchema = z.number().int().min(1).optional();

export const goalSettingsSchema = z.object({
  goalWeight: z.number().min(0).optional(),
  waterGoalOz: optionalGoalSchema,
  weeklyWorkoutTarget: optionalGoalSchema,
  weeklyCardioMinutesTarget: optionalGoalSchema,
  weeklyWeighInTarget: optionalGoalSchema,
  dailyStepTarget: optionalGoalSchema,
});

export const templateItemSchema = z.object({
  itemType: z.enum(["exercise", "cardio", "mobility"]),
  exerciseName: z.string().trim().min(1, "Name is required"),
  instruction: z.string().trim().optional(),
  target: z.string().trim().optional(),
  section: z.string().trim().min(1, "Section is required"),
  groupLabel: z.string().trim().max(32).optional(),
  isRequired: z.boolean(),
});

export const workoutTemplateSchema = z.object({
  name: z.string().trim().min(1, "Template name is required"),
  description: z.string().trim().optional(),
  goalFocus: z.string().trim().optional(),
  estimatedDurationMin: z.number().int().min(1).optional(),
  items: z.array(templateItemSchema).min(1, "Add at least one template item"),
});

export const plannedWorkoutSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  templateId: z.number().int().positive().optional(),
  title: z.string().trim().min(1, "Title is required"),
  notes: z.string().trim().optional(),
  estimatedDurationMin: z.number().int().min(1).optional(),
});

export type QuickEntryFormValues = z.infer<typeof quickEntryFormSchema>;
export type ExerciseEntry = z.infer<typeof exerciseEntrySchema>;
export type CardioEntry = z.infer<typeof cardioEntrySchema>;
export type WeeklyCheckInValues = z.infer<typeof weeklyCheckInSchema>;
export type GoalSettingsValues = z.infer<typeof goalSettingsSchema>;
export type WorkoutTemplateValues = z.infer<typeof workoutTemplateSchema>;
export type PlannedWorkoutValues = z.infer<typeof plannedWorkoutSchema>;
